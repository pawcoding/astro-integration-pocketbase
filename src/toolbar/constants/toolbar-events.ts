/**
 * Events sent to / from the toolbar
 */
export const TOOLBAR_EVENT = {
  /**
   * Toolbar -> Integration: Trigger a refresh of the collections
   *
   * Integration -> Toolbar: Notify about the refresh status
   */
  REFRESH: "astro-integration-pocketbase:refresh",
  /**
   * Integration -> Toolbar: Send settings on initialization
   */
  SETTINGS: "astro-integration-pocketbase:settings",
  /**
   * Toolbar -> Integration: Enable / disable real-time updates
   */
  REAL_TIME: "astro-integration-pocketbase:real-time"
};
