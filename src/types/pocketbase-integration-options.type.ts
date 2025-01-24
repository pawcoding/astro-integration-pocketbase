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
   *
   * Example:
   * ```ts
   * collectionsToWatch: ["users", "posts"]
   * ```
   *
   * For advanced usage, you can specify a map where the key is the collection that is used to load the content.
   * The value can be:
   * - `true` to watch the collection itself for changes (base collection)
   * - an array of strings to watch multiple collections for changes (view collection)
   *
   * These advanced options are especially useful when you're working with view collections.
   * [View collections](https://pocketbase.io/docs/collections/#view-collection) don't emit events when their
   * entries change, since they are based on other collections.
   *
   * Example:
   * ```ts
   * collectionsToWatch: {
   *  "users": true,
   *  "postings": ["posts", "comments"]
   * }
   * ```
   */
  collectionsToWatch?: Array<string> | Record<string, true | Array<string>>;
}
