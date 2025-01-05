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
   * This is required to access all resources even if they are not public.
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
   */
  collectionsToWatch?: Array<string>;
}
