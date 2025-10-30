import type { BaseIntegrationHooks } from "astro";
import { TOOLBAR_EVENT } from "../toolbar/constants/toolbar-events";

/**
 * Listen for the refresh event of the toolbar.
 * When the event is triggered in the toolbar, refresh the content loaded by the PocketBase loader.
 */
export function handleRefreshCollections({
  toolbar,
  refreshContent,
  logger
}: Pick<
  Parameters<BaseIntegrationHooks["astro:server:setup"]>[0],
  "toolbar" | "refreshContent" | "logger"
>): void {
  if (!refreshContent) {
    return;
  }

  logger.info("Setting up refresh listener for PocketBase integration");

  // Listen for the refresh event of the toolbar
  toolbar.on(TOOLBAR_EVENT.REFRESH, async ({ force }: { force: boolean }) => {
    // Send a loading state to the toolbar
    toolbar.send(TOOLBAR_EVENT.REFRESH, {
      loading: true
    });

    // Refresh content loaded by the PocketBase loader
    logger.info(
      `Refreshing ${force ? "all " : ""}content loaded by PocketBase loader`
    );
    await refreshContent({
      loaders: ["pocketbase-loader"],
      context: {
        source: "astro-integration-pocketbase",
        force: force
      }
    });

    // Reset the loading state in the toolbar
    toolbar.send(TOOLBAR_EVENT.REFRESH, {
      loading: false
    });
  });
}
