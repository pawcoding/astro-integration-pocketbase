import { z } from "astro/zod";

const pocketbaseEntrySchema = z.object({
  id: z.string().length(15),
  data: z.object({
    id: z.string().length(15),
    collectionId: z.string().length(15),
    collectionName: z.string(),
    updated: z.optional(z.date()),
    created: z.optional(z.date())
  }),
  digest: z.string().length(16),
  collection: z.string()
});

export type PocketBaseEntry = z.infer<typeof pocketbaseEntrySchema>;

export function isPocketbaseEntry(data: unknown): data is PocketBaseEntry {
  try {
    pocketbaseEntrySchema.parse(data);
    return true;
  } catch {
    return false;
  }
}
