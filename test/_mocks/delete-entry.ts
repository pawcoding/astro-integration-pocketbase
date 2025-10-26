import { assert } from "vitest";
import { sendBatchRequest } from "./batch-requests";

export async function deleteEntries(
  entryIds: Array<string>,
  url: string,
  collectionName: string,
  superuserToken: string
): Promise<void> {
  const requests = entryIds.map((entryId) => ({
    method: "DELETE" as const,
    url: `/api/collections/${collectionName}/records/${entryId}`
  }));

  const batchResponse = await sendBatchRequest(requests, url, superuserToken);

  assert(
    batchResponse.length === entryIds.length,
    "Failed to delete all entries in batch request."
  );
}

export async function deleteEntry(
  entryId: string,
  url: string,
  collectionName: string,
  superuserToken: string
): Promise<void> {
  const deleteRequest = await fetch(
    new URL(`api/collections/${collectionName}/records/${entryId}`, url),
    {
      method: "DELETE",
      headers: {
        Authorization: superuserToken
      }
    }
  );

  assert(deleteRequest.status === 204, "Deleting entry failed.");
}
