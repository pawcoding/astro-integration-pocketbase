import { randomUUID } from "crypto";

export function createPocketbaseEntry(
  entry?: Record<string, unknown>
): Record<string, unknown> {
  return {
    id: Math.random().toString(36).slice(2, 17),
    collectionId: Math.random().toString(36).slice(2, 17),
    collectionName: "test",
    customId: randomUUID(),
    updated: new Date().toISOString().replace("T", " "),
    ...entry
  };
}
