import { defineMiddleware } from "astro/middleware";
import { isPocketbaseEntry } from "./is-pocketbase-entry";

export const onRequest = defineMiddleware(async (context, next) => {
  // Look for entities given as props to the page
  const props = Object.values(context.props);
  const entities = props.filter(isPocketbaseEntry).map((prop) => prop.data);

  const response = await next();
  const body = await response.text();

  // Append the entities to the <head>
  const entitiesJson = JSON.stringify(entities);
  const newBody = body.replace(
    "</head>",
    `<script>window.__astro_entities__ = ${entitiesJson}</script></head>`
  );

  return new Response(newBody, response);
});
