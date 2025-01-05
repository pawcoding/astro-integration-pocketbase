import type { ToolbarServerHelpers } from "astro";
import type { DevToolbarButton } from "astro/runtime/client/dev-toolbar/ui-library/button.js";
import { default as packageJson } from "../../../package.json";

export interface HeaderElements {
  header: HTMLElement;
  refresh: DevToolbarButton;
  toggleContainer: HTMLDivElement;
}

/**
 * Creates the header for the PocketBase toolbar.
 */
export function createHeader(server: ToolbarServerHelpers): HeaderElements {
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

  // Create the actions container
  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.alignItems = "start";
  actions.style.justifyContent = "flex-end";
  actions.style.gap = "0.25rem";
  header.appendChild(actions);

  // Create the real-time toggle
  const toggleContainer = document.createElement("div");
  toggleContainer.style.alignItems = "center";
  // The toggle container is hidden by default
  toggleContainer.style.display = "none";
  actions.appendChild(toggleContainer);

  const toggleLabel = document.createElement("label");
  toggleLabel.textContent = "Real-time updates";
  toggleLabel.htmlFor = "real-time-toggle";
  toggleLabel.style.fontSize = "0.8rem";
  toggleContainer.appendChild(toggleLabel);

  const toggle = document.createElement("astro-dev-toolbar-toggle");
  toggle.input.id = "real-time-toggle";
  // Set the toggle state based on the local storage, default to true
  toggle.input.checked = !(
    localStorage.getItem("astro-integration-pocketbase:real-time") === "false"
  );
  toggle.input.addEventListener("change", () => {
    // Store the toggle state in the local storage
    localStorage.setItem(
      "astro-integration-pocketbase:real-time",
      toggle.input.checked.toString()
    );

    // Send the toggle state to the server
    server.send("astro-integration-pocketbase:real-time", toggle.input.checked);
  });
  // Send the initial toggle state to the server
  server.send("astro-integration-pocketbase:real-time", toggle.input.checked);
  toggleContainer.appendChild(toggle);

  // Create the refresh button
  const refresh = document.createElement("astro-dev-toolbar-button");
  refresh.size = "small";
  refresh.buttonStyle = "green";
  refresh.textContent = "Refresh content";
  // The refresh button is hidden by default
  refresh.style.display = "none";
  refresh.addEventListener("click", () => {
    server.send("astro-integration-pocketbase:refresh", true);
  });
  actions.appendChild(refresh);

  return {
    header,
    refresh,
    toggleContainer
  };
}
