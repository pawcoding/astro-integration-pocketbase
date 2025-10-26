import type { AstroIntegrationLogger } from "astro";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { handleRefreshCollections } from "../../src/core";
import { TOOLBAR_EVENT } from "../../src/toolbar/constants/toolbar-events";
import { createToolbarMock } from "../_mocks/create-toolbar-mock";
import { LoggerMock } from "../_mocks/logger.mock";

describe("handleRefreshColections", () => {
  let logger: AstroIntegrationLogger;
  let toolbarMock: ReturnType<typeof createToolbarMock>;
  let refreshContent: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    logger = new LoggerMock();
    toolbarMock = createToolbarMock();
    refreshContent = vi.fn().mockResolvedValue(undefined);
  });

  it("should do nothing if `refreshContent` is missing", () => {
    handleRefreshCollections({
      toolbar: toolbarMock.toolbar,
      refreshContent: undefined,
      logger
    });

    expect(logger.info).not.toHaveBeenCalled();
  });

  it("should refresh content on toolbar event", async () => {
    handleRefreshCollections({
      toolbar: toolbarMock.toolbar,
      refreshContent,
      logger
    });

    // Simulate toolbar event
    toolbarMock.send(TOOLBAR_EVENT.REFRESH, { force: true });

    // Wait for async operations to complete
    await Promise.resolve();

    expect(refreshContent).toHaveBeenCalledExactlyOnceWith({
      loaders: ["pocketbase-loader"],
      context: {
        source: "astro-integration-pocketbase",
        force: true
      }
    });
  });

  it("should send loading states to the toolbar", async () => {
    handleRefreshCollections({
      toolbar: toolbarMock.toolbar,
      refreshContent,
      logger
    });

    // Simulate toolbar event
    toolbarMock.send(TOOLBAR_EVENT.REFRESH, { force: false });

    // Wait for async operations to complete
    await Promise.resolve();

    expect(toolbarMock.receive).toHaveBeenCalledTimes(2);
    expect(toolbarMock.receive).toHaveBeenNthCalledWith(
      1,
      TOOLBAR_EVENT.REFRESH,
      {
        loading: true
      }
    );
    expect(toolbarMock.receive).toHaveBeenNthCalledWith(
      2,
      TOOLBAR_EVENT.REFRESH,
      {
        loading: false
      }
    );
  });
});
