/**
 * Options for the toolbar.
 */
export interface ToolbarOptions {
  /**
   * Whether a content loader is active.
   */
  hasContentLoader: boolean;
  /**
   * Whether a realtime connection to PocketBase is active.
   */
  realtime: boolean;
  /**
   * Base URL of the PocketBase instance.
   */
  baseUrl: string;
}
