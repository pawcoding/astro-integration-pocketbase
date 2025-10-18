import { defineMiddleware } from "astro/middleware";
import type { PocketBaseEntry } from "./is-pocketbase-entry";
import { isPocketbaseEntry } from "./is-pocketbase-entry";

export const onRequest = defineMiddleware(async (context, next) => {
  // Look for entities given as props to the page
  const props = Object.values(context.props);
  const entities = findEntitiesRecursive(props).map((entity) => entity.data);

  const response = await next();
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("text/html")) {
    // Pass through non-HTML responses unchanged
    return response;
  }

  const body = await response.text();

  // Append the entities to the <head>
  const entitiesJson = JSON.stringify(entities);
  const newBody = body.replace(
    "</head>",
    `<script>window.__astro_entities__ = ${entitiesJson}</script></head>`
  );

  return new Response(newBody, response);
});

/**
 * Find PocketBase entities in the given data.
 */
function findEntitiesRecursive(data: unknown): Array<PocketBaseEntry> {
  // Check if the data is an array and search for entities in each element
  if (Array.isArray(data)) {
    return data.flatMap((item) => findEntitiesRecursive(item));
  }

  if (typeof data === "object" && data !== null) {
    // Check if the data is an object and a PocketBase entry
    if (isPocketbaseEntry(data)) {
      return [data];
    }

    // Search for entities in all values
    return findEntitiesRecursive(Object.values(data));
  }

  // No entities found
  return [];
}
