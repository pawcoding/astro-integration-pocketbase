import type { BaseIntegrationHooks } from "astro";
import { EventSource } from "eventsource";
import { randomUUID } from "node:crypto";
import {
  afterEach,
  assert,
  beforeEach,
  describe,
  expect,
  inject,
  it,
  vi
} from "vitest";
import { refreshCollectionsRealtime } from "../../src/core";
import { createIntegrationOptions } from "../_mocks/create-integration-options";
import { createToolbarMock } from "../_mocks/create-toolbar-mock";
import { deleteCollection } from "../_mocks/delete-collection";
import { insertCollection } from "../_mocks/insert-collection";
import { insertEntry } from "../_mocks/insert-entry";
import { LoggerMock } from "../_mocks/logger.mock";
import { waitUntilConnected } from "../_mocks/wait-until-connected";

vi.mock("../../src/utils/map-collections-to-watch");
vi.mock("../../src/utils/get-superuser-token");

describe("refreshCollectionsRealtime", async () => {
  const mctw = await import("../../src/utils/map-collections-to-watch");
  const gst = await import("../../src/utils/get-superuser-token");

  const superuserToken = inject("superuserToken");

  let toolbarMock: ReturnType<typeof createToolbarMock>;
  let context: Pick<
    Parameters<BaseIntegrationHooks["astro:server:setup"]>[0],
    "logger" | "refreshContent" | "toolbar"
  >;

  beforeEach(() => {
    toolbarMock = createToolbarMock();

    context = {
      logger: new LoggerMock(),
      toolbar: toolbarMock.toolbar,
      refreshContent: vi.fn().mockResolvedValue(undefined)
    };
  });

  describe("SSE connection", () => {
    beforeEach(() => {
      gst.getSuperuserToken = vi.fn().mockResolvedValue(superuserToken);
    });

    it("should not establish connection when no collections are to be watched", () => {
      mctw.mapCollectionsToWatch = vi.fn().mockReturnValueOnce(undefined);

      const options = createIntegrationOptions();
      const result = refreshCollectionsRealtime(options, context);

      expect(result).toBeUndefined();
    });

    it("should not establish connection when `refreshContent` is not defined", () => {
      mctw.mapCollectionsToWatch = vi.fn().mockReturnValueOnce(new Map());

      const options = createIntegrationOptions();
      const result = refreshCollectionsRealtime(options, {
        ...context,
        refreshContent: undefined
      });

      expect(result).toBeUndefined();
    });

    it("should establish connection", async () => {
      mctw.mapCollectionsToWatch = vi.fn().mockReturnValueOnce(new Map());

      const options = createIntegrationOptions();
      const result = refreshCollectionsRealtime(options, context);

      assert(!!result, "EventSource was not created");
      expect(result).toBeInstanceOf(EventSource);
      expect(result.readyState).toBe(EventSource.CONNECTING);

      await waitUntilConnected(result);

      expect(result.readyState).toBe(EventSource.OPEN);
    });
  });

  describe("real-time updates", () => {
    let collectionName: string;
    let options: ReturnType<typeof createIntegrationOptions>;

    beforeEach(async () => {
      collectionName = randomUUID().replaceAll("-", "");

      options = createIntegrationOptions({
        collectionsToWatch: [collectionName]
      });

      await insertCollection([], options.url, collectionName, superuserToken);
    });

    afterEach(async () => {
      await deleteCollection(options.url, collectionName, superuserToken);
    });

    it("should refresh collection on realtime update", async () => {
      mctw.mapCollectionsToWatch = vi
        .fn()
        .mockReturnValueOnce(new Map([[collectionName, ["test"]]]));

      // Create the SSE connection
      const result = refreshCollectionsRealtime(options, context);
      assert(!!result, "EventSource was not created");

      // Wait until connected
      await waitUntilConnected(result);
      expect(context.refreshContent).not.toHaveBeenCalled();

      // Insert an entry to trigger the update
      await insertEntry({}, options.url, collectionName, superuserToken);

      // Wait until the refreshContent method was called
      await new Promise((resolve) => setTimeout(resolve, 100));
      vi.waitFor(() => {
        expect(context.refreshContent).toHaveBeenCalled();
      });

      expect(context.refreshContent).toHaveBeenCalledExactlyOnceWith({
        loaders: ["pocketbase-loader"],
        context: {
          source: "astro-integration-pocketbase",
          collection: ["test"],
          data: expect.anything()
        }
      });
    });
  });
});
