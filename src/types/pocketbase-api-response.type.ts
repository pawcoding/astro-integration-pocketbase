import { z } from "astro/zod";

/**
 * The schema for a PocketBase error response.
 */
export const pocketBaseErrorResponse = z.object({
  /**
   * The error message returned by PocketBase.
   */
  message: z.string()
});

/**
 * The schema for a PocketBase login response.
 */
export const pocketBaseLoginResponse = z.object({
  /**
   * The authentication token returned by PocketBase.
   */
  token: z.string()
});
