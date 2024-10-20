import type { DevToolbarCard } from "astro/runtime/client/dev-toolbar/ui-library/card.js";

/**
 * Creates a placeholder card.
 */
export function createPlaceholder(): DevToolbarCard {
  // Create the main card
  const main = document.createElement("astro-dev-toolbar-card");

  // Create the main content container
  const content = document.createElement("div");
  content.style.display = "flex";
  content.style.alignItems = "center";
  content.style.justifyContent = "center";
  main.appendChild(content);

  // Add the placeholder text
  const placeholder = document.createElement("span");
  placeholder.textContent = "Here you will see the raw content of an entity";
  content.appendChild(placeholder);

  return main;
}
