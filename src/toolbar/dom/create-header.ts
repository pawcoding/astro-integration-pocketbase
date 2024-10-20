import type { ToolbarServerHelpers } from "astro";
import type { DevToolbarButton } from "astro/runtime/client/dev-toolbar/ui-library/button.js";
import { default as packageJson } from "../../../package.json";

/**
 * Creates the header for the PocketBase toolbar.
 */
export function createHeader(
  server: ToolbarServerHelpers
): [HTMLElement, DevToolbarButton] {
  // Create the header
  const header = document.createElement("header");
  header.style.display = "grid";
  header.style.gap = "0.25rem";
  header.style.gridTemplateColumns = "auto auto 1fr";

  // Create the title
  const title = document.createElement("h3");
  title.style.marginTop = "0.25rem";
  title.textContent = "PocketBase";
  header.appendChild(title);

  // Create the version badge
  const version = document.createElement("astro-dev-toolbar-badge");
  version.textContent = packageJson.version;
  version.badgeStyle = "yellow";
  header.appendChild(version);

  // Create the refresh button
  const refresh = document.createElement("astro-dev-toolbar-button");
  refresh.size = "small";
  refresh.buttonStyle = "green";
  refresh.style.marginLeft = "auto";
  refresh.textContent = "Refresh content";
  // The refresh button is hidden by default
  refresh.style.display = "none";
  refresh.addEventListener("click", () => {
    server.send("astro-integration-pocketbase:refresh", true);
  });
  header.appendChild(refresh);

  return [header, refresh];
}
