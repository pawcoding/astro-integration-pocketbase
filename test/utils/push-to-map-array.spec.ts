import { describe, expect, it } from "vitest";
import { pushToMapArray } from "../../src/utils/push-to-map-array";

describe("pushToMapArray", () => {
  it("should add value to existing array in map", () => {
    const map = new Map<string, Array<number>>();
    map.set("a", [1, 2]);

    pushToMapArray(map, "a", 3);

    const result = map.get("a");
    expect(result).toEqual([1, 2, 3]);
  });

  it("should create new array if key does not exist", () => {
    const map = new Map<string, Array<number>>();

    pushToMapArray(map, "b", 4);

    const result = map.get("b");
    expect(result).toEqual([4]);
  });
});
