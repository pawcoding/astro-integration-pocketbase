import { assert } from "vitest";
import { sendBatchRequest } from "./batch-requests";

export async function insertEntries(
  data: Array<Record<string, unknown>>,
  url: string,
  collectionName: string,
  superuserToken: string
): Promise<Array<Record<string, unknown>>> {
  const requests = data.map((entry) => ({
    method: "POST" as const,
    url: `/api/collections/${collectionName}/records`,
    body: entry
  }));

  const batchResponse = await sendBatchRequest(requests, url, superuserToken);

  assert(
    batchResponse.length === data.length,
    "Failed to insert all entries in batch request."
  );

  const dbEntries: Array<Record<string, unknown>> = [];
  for (const entry of batchResponse) {
    dbEntries.push(entry.body);
  }
  return dbEntries;
}

export async function insertEntry(
  data: Record<string, unknown>,
  url: string,
  collectionName: string,
  superuserToken: string
): Promise<Record<string, unknown>> {
  const insertRequest = await fetch(
    new URL(`api/collections/${collectionName}/records`, url),
    {
      method: "POST",
      headers: {
        Authorization: superuserToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
  );

  const entry = await insertRequest.json();
  assert(entry.id, "Entry ID is not available.");

  return entry;
}
