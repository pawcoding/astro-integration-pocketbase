import type { AstroIntegrationLogger, BaseIntegrationHooks } from "astro";
import { EventSource } from "eventsource";
import type { PocketBaseIntegrationOptions } from "../types/pocketbase-integration-options.type";
import { getSuperuserToken } from "../utils/get-superuser-token";
import { mapCollectionsToWatch } from "../utils/map-collections-to-watch";

export function refreshCollectionsRealtime(
  options: PocketBaseIntegrationOptions,
  {
    logger,
    refreshContent,
    toolbar
  }: Parameters<BaseIntegrationHooks["astro:server:setup"]>[0]
): EventSource | undefined {
  // Check if collections should be watched
  const collectionsMap = mapCollectionsToWatch(options.collectionsToWatch);
  if (!collectionsMap) {
    return undefined;
  }
  const remoteCollections = [...collectionsMap.keys()];

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

  const eventSource = new EventSource(`${options.url}/api/realtime`);
  let wasConnectedOnce = false;
  let isConnected = false;

  // Log potential errors
  // oxlint-disable-next-line prefer-await-to-callbacks
  eventSource.addEventListener("error", (error) => {
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
  });

  // Add event listeners for all collections
  for (const collection of remoteCollections) {
    eventSource.addEventListener(
      `${collection}/*`,
      async (event: MessageEvent<string>) => {
        // Do not refresh if the refresh is disabled
        if (!refreshEnabled) {
          return;
        }

        // Refresh the content
        logger.info(`Received update for ${collection}. Refreshing content...`);
        await refreshContent({
          loaders: ["pocketbase-loader"],
          context: {
            source: "astro-integration-pocketbase",
            collection: collectionsMap.get(collection),
            // oxlint-disable-next-line @typescript-eslint/no-unsafe-assignment
            data: JSON.parse(event.data)
          }
        });
      }
    );
  }

  // Add event listener for the connection event
  eventSource.addEventListener(
    "PB_CONNECT",
    async (event: MessageEvent<void>) => {
      isConnected = await handleConnectEvent(
        event,
        remoteCollections,
        wasConnectedOnce,
        options,
        logger
      );
      if (isConnected) {
        wasConnectedOnce = true;
      }
    }
  );

  return eventSource;
}

async function handleConnectEvent(
  event: MessageEvent<void>,
  remoteCollections: Array<string>,
  wasConnectedOnce: boolean,
  options: PocketBaseIntegrationOptions,
  logger: AstroIntegrationLogger
): Promise<boolean> {
  // Extract the clientId
  const clientId = event.lastEventId;

  // Get the superuser token if credentials are available
  let superuserToken: string | undefined;
  if (options.superuserCredentials) {
    if ("impersonateToken" in options.superuserCredentials) {
      superuserToken = options.superuserCredentials.impersonateToken;
    } else {
      superuserToken = await getSuperuserToken(
        options.url,
        options.superuserCredentials,
        logger
      );
    }
  }

  // Subscribe to the PocketBase realtime API
  const result = await fetch(`${options.url}/api/realtime`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: superuserToken || ""
    },
    body: JSON.stringify({
      clientId: clientId,
      subscriptions: remoteCollections.map((collection) => `${collection}/*`)
    })
  });

  // Log the connection status
  if (!result.ok) {
    logger.error(
      `Error while subscribing to PocketBase realtime API: ${result.status}`
    );
    return false;
  }

  if (!wasConnectedOnce) {
    logger.info(
      `Subscribed to PocketBase realtime API. Waiting for updates on ${remoteCollections.join(
        ", "
      )}.`
    );
  }

  return true;
}
