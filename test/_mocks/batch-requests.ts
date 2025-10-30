import { assert } from "vitest";

export async function sendBatchRequest(
  requests: Array<{
    method: "POST" | "DELETE";
    url: string;
    body?: Record<string, unknown>;
  }>,
  url: string,
  superuserToken: string
): Promise<any> {
  const batchRequest = await fetch(new URL(`api/batch`, url), {
    method: "POST",
    headers: {
      Authorization: superuserToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ requests })
  });

  assert(batchRequest.status === 200, "Failed to send batch request.");

  return batchRequest.json();
}

export async function enableBatchApi(
  url: string,
  superuserToken: string
): Promise<void> {
  const updateSettingsRequest = await fetch(new URL(`api/settings`, url), {
    method: "PATCH",
    headers: {
      Authorization: superuserToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      batch: {
        enabled: true,
        maxBodySize: 0,
        maxRequests: 300,
        timeout: 3
      }
    })
  });

  assert(
    updateSettingsRequest.status === 200,
    "Failed to update settings for batch processing."
  );
}
