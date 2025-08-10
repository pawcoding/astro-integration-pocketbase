/**
 * Adds a value to an array in a map. If the key does not exist, it will be created.
 */
export function pushToMapArray<TKey, TArray>(
  map: Map<TKey, Array<TArray>>,
  key: TKey,
  value: TArray
): void {
  const array = map.get(key);
  if (array) {
    array.push(value);
    return;
  }

  map.set(key, [value]);
}
