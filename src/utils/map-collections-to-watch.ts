import type { PocketBaseIntegrationOptions } from "../types/pocketbase-integration-options.type";
import { pushToMapArray } from "./push-to-map-array";

/**
 * Create a map of remote collections to watch.
 * Each key in the map represents a remote collection to subscribe to.
 * The value is an array of local collections that should be refreshed when an entry in the remote collection changes.
 */
export function mapCollectionsToWatch(
  collectionsToWatch: PocketBaseIntegrationOptions["collectionsToWatch"]
): Map<string, Array<string>> | undefined {
  // Check if collections should be watched
  if (!collectionsToWatch) {
    return;
  }

  // Check if collectionsToWatch is an array
  if (Array.isArray(collectionsToWatch)) {
    // Check if the array is empty
    if (collectionsToWatch.length === 0) {
      return;
    }

    // Create a map where each collection is watched by itself
    return new Map(
      collectionsToWatch.map((collection) => [collection, [collection]])
    );
  }

  // Check if collectionsToWatch is an empty object
  if (Object.keys(collectionsToWatch).length === 0) {
    return;
  }

  // Map collections to watch
  const collectionsMap = new Map<string, Array<string>>();
  for (const localCollection in collectionsToWatch) {
    const watch = collectionsToWatch[localCollection];

    // Check if collection should be watched by itself
    if (watch === true) {
      pushToMapArray(collectionsMap, localCollection, localCollection);
      continue;
    }

    // Collection should be watched by multiple collections
    for (const remoteCollection of watch) {
      pushToMapArray(collectionsMap, remoteCollection, localCollection);
    }
  }

  return collectionsMap;
}
