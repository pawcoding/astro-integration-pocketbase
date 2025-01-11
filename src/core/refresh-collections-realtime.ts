import type { BaseIntegrationHooks } from "astro";
import { EventSource } from "eventsource";
import type { PocketBaseIntegrationOptions } from "../types/pocketbase-integration-options.type";
import { getSuperuserToken } from "../utils/get-superuser-token";

export function refreshCollectionsRealtime(
  {
    url,
    superuserCredentials,
    collectionsToWatch
  }: PocketBaseIntegrationOptions,
  {
    logger,
    refreshContent,
    toolbar
  }: Parameters<BaseIntegrationHooks["astro:server:setup"]>[0]
): EventSource | undefined {
  // Check if collections should be watched
  if (!collectionsToWatch || collectionsToWatch.length === 0) {
    return undefined;
  }

  // Check if content loader is used
  if (!refreshContent) {
    logger.warn(
      "No content loader available, skipping subscription to PocketBase realtime API."
    );
    return undefined;
  }

  // Check if EventSource is available
  if (!EventSource) {
    logger.warn(
      "EventSource is not available, skipping subscription to PocketBase realtime API.\n" +
        "Please install the 'eventsource' package."
    );
    return undefined;
  }

  let refreshEnabled = true;
  // Enable or disable real-time updates via the toolbar
  toolbar.on("astro-integration-pocketbase:real-time", (enabled: boolean) => {
    refreshEnabled = enabled;
  });

  const eventSource = new EventSource(`${url}/api/realtime`);
  let wasConnectedOnce = false;
  let isConnected = false;

  // Log potential errors
  eventSource.onerror = (error) => {
    isConnected = false;

    // Wait for 5 seconds in case of a connection error
    setTimeout(() => {
      if (isConnected) {
        // Connection was automatically re-established, no need to log the error
        return;
      }

      logger.error(
        `Error while connecting to PocketBase realtime API: ${error.type}`
      );
    }, 5000);
  };

  // Add event listeners for all collections
  for (const collection of collectionsToWatch) {
    eventSource.addEventListener(`${collection}/*`, async () => {
      // Do not refresh if the refresh is disabled
      if (!refreshEnabled) {
        return;
      }

      // Refresh the content
      logger.info(`Received update for ${collection}. Refreshing content...`);
      await refreshContent({
        loaders: ["pocketbase-loader"],
        // TODO: add context to refresh one or all collections
        context: {}
      });
    });
  }

  // Add event listener for the connection event
  eventSource.addEventListener("PB_CONNECT", async (event) => {
    // Extract the clientId
    const clientId = event.lastEventId;

    // Get the superuser token if credentials are available
    let superuserToken: string | undefined;
    if (superuserCredentials) {
      superuserToken = await getSuperuserToken(
        url,
        superuserCredentials,
        logger
      );
    }

    // Subscribe to the PocketBase realtime API
    const result = await fetch(`${url}/api/realtime`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: superuserToken || ""
      },
      body: JSON.stringify({
        clientId: clientId,
        subscriptions: collectionsToWatch.map((collection) => `${collection}/*`)
      })
    });

    // Log the connection status
    if (!result.ok) {
      logger.error(
        `Error while subscribing to PocketBase realtime API: ${result.status}`
      );
      return;
    }

    if (!wasConnectedOnce) {
      wasConnectedOnce = true;
      logger.info(
        `Subscribed to PocketBase realtime API. Waiting for updates on ${collectionsToWatch.join(
          ", "
        )}.`
      );
    }

    isConnected = true;
  });

  return eventSource;
}
