import type { EventSource } from "eventsource";

export async function waitUntilConnected(
  eventSource: EventSource
): Promise<void> {
  return new Promise((resolve) => {
    eventSource.addEventListener("PB_CONNECT", () => {
      resolve(undefined);
    });
  });
}
