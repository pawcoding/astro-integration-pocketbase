import { defineMiddleware } from "astro/middleware";
import { isPocketbaseEntry } from "./is-pocketbase-entry";

export const onRequest = defineMiddleware(async (context, next) => {
  const props = Object.values(context.props);
  const _entities = props.filter(isPocketbaseEntry).map((prop) => prop.data);
  //    ^-- These are the entities that we want to send to the toolbar
  // Not sure though, how to get them to "astro:server:setup" where we can actually send them

  const response = await next();
  //    ^-- I tried to add the entities to the response headers, but this is done *after* the server middleware is executed

  return response;
});
