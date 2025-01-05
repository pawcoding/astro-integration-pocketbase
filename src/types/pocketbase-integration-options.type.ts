/**
 * Options for the PocketBase integration.
 */
export interface PocketBaseIntegrationOptions {
  /**
   * URL of the PocketBase instance.
   */
  url: string;
  /**
   * Credentials of a superuser to get full access to the PocketBase instance.
   * This is required to automatically reload collections when entries change in realtime.
   */
  superuserCredentials?: {
    /**
     * Email of the superuser.
     */
    email: string;
    /**
     * Password of the superuser.
     */
    password: string;
  };
  /**
   * List of PocketBase collections to watch for changes.
   * When an entry in one of these collections changes, the content will be reloaded.
   *
   * This is only available when the superuser credentials are provided.
   */
  collectionsToWatch?: Array<string>;
}
