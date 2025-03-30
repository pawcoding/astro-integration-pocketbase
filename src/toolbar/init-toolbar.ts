import {
  closeOnOutsideClick,
  createWindowElement,
  synchronizePlacementOnUpdate
} from "astro/runtime/client/dev-toolbar/apps/utils/window.js";
import type {
  ToolbarAppEventTarget,
  ToolbarServerHelpers
} from "astro/runtime/client/dev-toolbar/helpers.js";
import { createEntities, createHeader, createPlaceholder } from "./dom";
import type { Entity } from "./types/entity";
import type { ToolbarOptions } from "./types/options";

declare global {
  interface Window {
    __astro_entities__?: Array<Entity>;
  }
}

/**
 * Initializes the PocketBase toolbar.
 */
export function initToolbar(
  canvas: ShadowRoot,
  app: ToolbarAppEventTarget,
  server: ToolbarServerHelpers
): void {
  // Options for the toolbar
  let options: ToolbarOptions = {
    realtime: false,
    hasContentLoader: false,
    baseUrl: ""
  };

  // Update the options and refresh the toolbar
  server.on(
    "astro-integration-pocketbase:settings",
    (updatedOptions: ToolbarOptions) => {
      options = updatedOptions;
      createPocketBaseWindow();
    }
  );

  // Create the window (for every page navigation)
  createPocketBaseWindow();
  document.addEventListener("astro:after-swap", createPocketBaseWindow);

  // Setup the window
  closeOnOutsideClick(app);
  synchronizePlacementOnUpdate(app, canvas);

  function createPocketBaseWindow(): void {
    // Clear any existing content
    canvas.innerHTML = "";

    const entities = window.__astro_entities__ || [];

    // Create the main window element
    const windowElement = createWindowElement(/* HTML */ `
      <style>
        :host astro-dev-toolbar-window {
          max-height: 480px;
        }

        main {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          overflow-y: auto;
        }
      </style>

      <header></header>

      <hr />

      <main>
        ${entities.length > 0
          ? createEntities(entities, options.baseUrl)
          : createPlaceholder()}
      </main>
    `);

    // Create and insert the header
    createHeader(windowElement, server, options);

    // Add the window to the canvas
    canvas.append(windowElement);

    // Update the toolbar depending on the current state
    if (entities.length > 0) {
      app.toggleNotification({ state: true, level: "info" });
    } else {
      app.toggleNotification({ state: false });
      app.toggleState({ state: false });
    }
  }
}
