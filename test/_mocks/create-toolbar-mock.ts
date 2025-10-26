import type { BaseIntegrationHooks } from "astro";
import { vi } from "vitest";

export function createToolbarMock(): {
  toolbar: Parameters<BaseIntegrationHooks["astro:server:setup"]>[0]["toolbar"];
  send: (event: string, data: any) => void;
  receive: ReturnType<typeof vi.fn>;
} {
  const receive = vi.fn();

  let listeners: {
    [event: string]: Array<(data: any) => void>;
  } = {};

  return {
    toolbar: {
      send: (event: string, data: any) => {
        receive(event, data);
      },
      on: (event: string, callback: (data: any) => void) => {
        if (!listeners[event]) {
          listeners[event] = [];
        }
        listeners[event].push(callback);
      },
      onAppInitialized: () => {
        throw new Error("Method not implemented.");
      },
      onAppToggled: () => {
        throw new Error("Method not implemented.");
      }
    },
    send: (event: string, data: any) => {
      if (listeners[event]) {
        for (const callback of listeners[event]) {
          callback(data);
        }
      }
    },
    receive
  };
}
