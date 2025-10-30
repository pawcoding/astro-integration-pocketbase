import { assert } from "console";

export async function insertCollection(
  fields: Array<{ name: string; type: string }>,
  url: string,
  collectionName: string,
  superuserToken: string
): Promise<void> {
  const insertRequest = await fetch(new URL(`api/collections`, url), {
    method: "POST",
    headers: {
      Authorization: superuserToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: collectionName,
      fields: [...fields]
    })
  });

  assert(insertRequest.status === 200, "Collection is not available.");
}
