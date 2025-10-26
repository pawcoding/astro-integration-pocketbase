import type { AstroIntegrationLogger } from "astro";
import { assert, beforeEach, describe, expect, it, vi } from "vitest";
import { getSuperuserToken } from "../../src/utils/get-superuser-token";
import { createIntegrationOptions } from "../_mocks/create-integration-options";
import { LoggerMock } from "../_mocks/logger.mock";

describe("getSuperuserToken", () => {
  const options = createIntegrationOptions();
  let logger: AstroIntegrationLogger;

  beforeEach(() => {
    logger = new LoggerMock();
  });

  it("should return undefined if superuser credentials are invalid", async () => {
    const result = await getSuperuserToken(
      options.url,
      {
        email: "invalid",
        password: "invalid"
      },
      logger
    );

    expect(result).toBeUndefined();
    expect(logger.error).toHaveBeenCalled();
  });

  it("should return token if fetch request is successful", async () => {
    assert(options.superuserCredentials, "Superuser credentials are not set.");
    assert(
      !("impersonateToken" in options.superuserCredentials),
      "Impersonate token should not be used in tests."
    );

    const result = await getSuperuserToken(
      options.url,
      options.superuserCredentials,
      logger
    );

    expect(result).toBeDefined();
  });

  it("should retry on rate limit error", async () => {
    assert(options.superuserCredentials, "Superuser credentials are not set.");
    assert(
      !("impersonateToken" in options.superuserCredentials),
      "Impersonate token should not be used in tests."
    );

    vi.useFakeTimers({
      toFake: ["setTimeout"]
    });
    vi.spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(undefined, { status: 429 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ token: "test-token" }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        })
      );

    const promise = getSuperuserToken(
      options.url,
      options.superuserCredentials,
      logger
    );

    // Fast-forward time to speed up retries
    await vi.runAllTimersAsync();

    const result = await promise;

    expect(result).toBeDefined();
    expect(global.fetch).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });
});
