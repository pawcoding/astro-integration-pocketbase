import type { PocketBaseIntegrationOptions } from "../../src/types/pocketbase-integration-options.type";

export function createIntegrationOptions(
  options?: Partial<PocketBaseIntegrationOptions>
): PocketBaseIntegrationOptions {
  return {
    url: "http://127.0.0.1:8090",
    superuserCredentials: {
      email: "test@pawcode.de",
      password: "test1234"
    },
    ...options
  };
}
