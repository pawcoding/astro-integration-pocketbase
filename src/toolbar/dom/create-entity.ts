import type { DevToolbarCard } from "astro/runtime/client/dev-toolbar/ui-library/card.js";
import type { Entity } from "../types/entity";

/**
 * Creates a card for an entity.
 */
export function createEntity(data: Entity, baseUrl?: string): DevToolbarCard {
  // Create the main card
  const main = document.createElement("astro-dev-toolbar-card");

  // Create the main content container
  const content = document.createElement("div");
  content.style.position = "relative";
  main.appendChild(content);

  // Add the "View in PocketBase" button
  if (baseUrl) {
    const url = `${baseUrl}/_/#/collections?collectionId=${data.collectionId}&recordId=${data.id}`;

    const viewInPocketbase = document.createElement("astro-dev-toolbar-button");
    viewInPocketbase.size = "small";
    viewInPocketbase.buttonStyle = "purple";
    viewInPocketbase.textContent = "View in PocketBase";
    viewInPocketbase.style.position = "absolute";
    viewInPocketbase.style.top = "0";
    viewInPocketbase.style.right = "0";
    viewInPocketbase.addEventListener("click", () => {
      window.open(url, "_blank");
    });
    content.appendChild(viewInPocketbase);
  }

  // Add the entity data
  const entity = document.createElement("pre");
  entity.style.margin = "0";
  entity.style.overflow = "auto";
  entity.style.height = "300px";
  entity.textContent = JSON.stringify(data, null, 2);
  content.appendChild(entity);

  return main;
}
