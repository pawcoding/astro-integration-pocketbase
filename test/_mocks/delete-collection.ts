import { assert } from "vitest";

export async function deleteCollection(
  url: string,
  collectionName: string,
  superuserToken: string
): Promise<void> {
  const deleteRequest = await fetch(
    new URL(`api/collections/${collectionName}`, url),
    {
      method: "DELETE",
      headers: {
        Authorization: superuserToken,
        "Content-Type": "application/json"
      }
    }
  );

  assert(deleteRequest.status === 204, "Deleting collection failed.");
}
