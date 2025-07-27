import type { ToolbarServerHelpers } from "astro";
import type { DevToolbarButton } from "astro/runtime/client/dev-toolbar/ui-library/button.js";
import type { DevToolbarWindow } from "astro/runtime/client/dev-toolbar/ui-library/window.js";
import { default as packageJson } from "../../../package.json";
import type { ToolbarOptions } from "../types/options";

/**
 * Creates the header for the PocketBase toolbar.
 */
export function createHeader(
  windowElement: DevToolbarWindow,
  server: ToolbarServerHelpers,
  { hasContentLoader, realtime }: ToolbarOptions
): void {
  const header = windowElement.querySelector("header");
  if (!header) {
    throw new Error("The header element is missing");
  }

  header.innerHTML = /* HTML */ `
    <style>
      header {
        display: grid;
        grid-template-columns: auto auto 1fr;
        gap: 0.5rem;
      }

      h1 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        color: #fff;
        margin: 0;
        font-size: 22px;
      }

      .actions {
        display: flex;
        align-items: start;
        justify-content: flex-end;
        gap: 0.25rem;

        .toggle-container {
          display: flex;
          align-items: center;

          label {
            font-size: 0.8rem;
          }
        }
      }
    </style>

    <h1>PocketBase</h1>
    <astro-dev-toolbar-badge badge-style="yellow">
      ${packageJson.version}
    </astro-dev-toolbar-badge>

    <div class="actions">
      ${realtime
        ? /* HTML */ `
            <div class="toggle-container">
              <label
                for="real-time"
                title="Enable or disable real-time updates temporarily"
              >
                Real-time updates
              </label>
              <!-- real-time-toggle -->
            </div>
          `
        : ""}
      ${hasContentLoader
        ? /* HTML */ `
            <astro-dev-toolbar-button
              id="refresh-content"
              size="small"
              button-style="green"
              title="Right click to force refresh every collection"
            >
              Refresh content
            </astro-dev-toolbar-button>
          `
        : ""}
    </div>
  `;

  if (realtime) {
    // Create the toggle for real-time updates
    const realTimeToggle = document.createElement("astro-dev-toolbar-toggle");
    realTimeToggle.input.id = "real-time-toggle";
    realTimeToggle.input.title =
      "Enable or disable real-time updates temporarily";
    // Set the toggle state based on the local storage, default to true
    realTimeToggle.input.checked = !(
      localStorage.getItem("astro-integration-pocketbase:real-time") === "false"
    );
    realTimeToggle.input.addEventListener("change", () => {
      // Store the toggle state in the local storage
      localStorage.setItem(
        "astro-integration-pocketbase:real-time",
        realTimeToggle.input.checked.toString()
      );

      // Send the toggle state to the server
      server.send(
        "astro-integration-pocketbase:real-time",
        realTimeToggle.input.checked
      );
    });
    // Send the initial toggle state to the server
    server.send(
      "astro-integration-pocketbase:real-time",
      realTimeToggle.input.checked
    );
    windowElement.querySelector(".toggle-container")?.append(realTimeToggle);
  }

  if (hasContentLoader) {
    // Add click listeners to the refresh button
    const refresh = windowElement.querySelector(
      "#refresh-content"
    ) as DevToolbarButton | null;
    if (!refresh) {
      throw new Error("The refresh button is missing");
    }

    refresh.addEventListener("click", () => {
      server.send("astro-integration-pocketbase:refresh", { force: false });
    });
    refresh.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      server.send("astro-integration-pocketbase:refresh", { force: true });
    });

    server.on(
      "astro-integration-pocketbase:refresh",
      ({ loading }: { loading?: boolean }) => {
        // Show loading state while refreshing content
        if (loading) {
          refresh.textContent = "Refreshing content...";
          refresh.buttonStyle = "gray";
          refresh.style.pointerEvents = "none";
        } else {
          refresh.textContent = "Refresh content";
          refresh.buttonStyle = "green";
          refresh.style.pointerEvents = "unset";
        }
      }
    );
  }
}
