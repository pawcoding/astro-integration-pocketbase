import { z } from "astro/zod";

/**
 * Schema for a PocketBase entry created with [astro-loader-pocketbase](https://github.com/pawcoding/astro-loader-pocketbase)
 */
const pocketbaseEntrySchema = z.object({
  id: z.string(),
  data: z.object({
    id: z.string(),
    collectionId: z.string(),
    collectionName: z.string()
  }),
  digest: z.string().length(16),
  collection: z.string()
});

/**
 * Type for a PocketBase entry created with [astro-loader-pocketbase](https://github.com/pawcoding/astro-loader-pocketbase)
 */
export type PocketBaseEntry = z.infer<typeof pocketbaseEntrySchema>;

/**
 * Checks if the given data is a PocketBase entry.
 */
export function isPocketbaseEntry(data: unknown): data is PocketBaseEntry {
  try {
    // Try to parse the data with the PocketBase entry schema
    pocketbaseEntrySchema.parse(data);
    return true;
  } catch {
    return false;
  }
}
