import { describe, expect, it } from "vitest";
import { mapCollectionsToWatch } from "../../src/utils/map-collections-to-watch";

describe("mapCollectionsToWatch", () => {
  it("should do nothing if not collectionsToWatch are provided", () => {
    const undefinedResult = mapCollectionsToWatch(undefined);
    expect(undefinedResult).toBeUndefined();

    const emptyArrayResult = mapCollectionsToWatch([]);
    expect(emptyArrayResult).toBeUndefined();

    const emptyObjectResult = mapCollectionsToWatch({});
    expect(emptyObjectResult).toBeUndefined();
  });

  it("should map array of collections", () => {
    const result = mapCollectionsToWatch(["posts", "comments"]);

    expect(result).toEqual(
      new Map([
        ["posts", ["posts"]],
        ["comments", ["comments"]]
      ])
    );
  });

  describe("object of collections", () => {
    it("should map simple object of collections", () => {
      const result = mapCollectionsToWatch({
        posts: true,
        comments: true
      });

      expect(result).toEqual(
        new Map([
          ["posts", ["posts"]],
          ["comments", ["comments"]]
        ])
      );
    });

    it("should map complex object of collections", () => {
      const result = mapCollectionsToWatch({
        posts: ["posts", "profiles"],
        comments: true,
        users: ["profiles"]
      });

      expect(result).toEqual(
        new Map([
          ["posts", ["posts"]],
          ["comments", ["comments"]],
          ["profiles", ["posts", "users"]]
        ])
      );
    });
  });
});
