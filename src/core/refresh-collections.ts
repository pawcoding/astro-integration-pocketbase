import type { BaseIntegrationHooks } from "astro";

/**
 * Listen for the refresh event of the toolbar.
 * When the event is triggered in the toolbar, refresh the content loaded by the PocketBase loader.
 */
export function handleRefreshCollections({
  toolbar,
  refreshContent,
  logger
}: Parameters<BaseIntegrationHooks["astro:server:setup"]>[0]): void {
  if (!refreshContent) {
    return;
  }

  logger.info("Setting up refresh listener for PocketBase integration");

  // Listen for the refresh event of the toolbar
  toolbar.on("astro-integration-pocketbase:refresh", async () => {
    // Send a loading state to the toolbar
    toolbar.send("astro-integration-pocketbase:refresh", {
      loading: true
    });

    // Refresh content loaded by the PocketBase loader
    logger.info("Refreshing content loaded by PocketBase loader");
    await refreshContent({
      loaders: ["pocketbase-loader"],
      context: {
        source: "astro-integration-pocketbase"
      }
    });

    // Reset the loading state in the toolbar
    toolbar.send("astro-integration-pocketbase:refresh", {
      loading: false
    });
  });
}
