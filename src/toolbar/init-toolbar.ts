import type {
  ToolbarAppEventTarget,
  ToolbarServerHelpers
} from "astro/runtime/client/dev-toolbar/helpers.js";
import { createEntity, createHeader, createPlaceholder } from "./dom/";
import { listenToNavigation } from "./page-navigation-listener";
import type { Entity } from "./types/entity";

declare global {
  interface Window {
    __astro_entities__?: Array<Entity>;
  }
}

/**
 * Initializes the PocketBase toolbar.
 */
export async function initToolbar(
  canvas: ShadowRoot,
  app: ToolbarAppEventTarget,
  server: ToolbarServerHelpers
): Promise<void> {
  // Base url of the PocketBase instance
  let pbUrl: string | undefined = undefined;

  const container = document.createElement("astro-dev-toolbar-window");

  const [header, refresh] = createHeader(server);
  container.appendChild(header);

  // Container for the main content
  const contentContainer = document.createElement("div");
  contentContainer.style.display = "flex";
  contentContainer.style.flexDirection = "column";
  contentContainer.style.gap = "8px";
  contentContainer.style.maxHeight = "400px";
  contentContainer.style.overflowY = "auto";
  container.appendChild(contentContainer);

  const placeholder = createPlaceholder();
  contentContainer.appendChild(placeholder);

  app.onToggled(({ state }) => {
    // Clear the container
    contentContainer.innerHTML = "";

    if (!state) {
      // Clear the dev-window
      canvas.innerHTML = "";
      return;
    }

    // Append the dev-window
    canvas.appendChild(container);

    // Check if entities are present
    const entities = window.__astro_entities__;
    if (!entities || entities.length === 0) {
      // No entities to display, show a placeholder
      contentContainer.appendChild(createPlaceholder());
      return;
    }

    // Display the information about the entities
    for (const entity of entities) {
      contentContainer.appendChild(createEntity(entity, pbUrl));
    }
  });

  // Update the toolbar placement based on the user's preference
  function updateToolbarPlacement(
    placement: "bottom-left" | "bottom-right" | "bottom-center"
  ) {
    if (placement === "bottom-left") {
      container.style.left = "16px";
      container.style.right = "unset";
      container.style.transform = "translateX(0)";
    } else if (placement === "bottom-right") {
      container.style.left = "unset";
      container.style.right = "16px";
      container.style.transform = "translateX(0)";
    } else {
      container.style.left = "50%";
      container.style.right = "unset";
      container.style.transform = "translateX(-50%)";
    }
  }

  // Read the initial toolbar placement from local storage
  // This is a workaround since the initial toolbar placement is not available via any API
  const settings = localStorage.getItem("astro:dev-toolbar:settings");
  if (settings) {
    const { placement } = JSON.parse(settings);
    updateToolbarPlacement(placement);
  }

  // Listen for toolbar placement updates
  app.onToolbarPlacementUpdated(({ placement }) => {
    updateToolbarPlacement(placement);
  });

  server.on(
    "astro-integration-pocketbase:settings",
    ({ enabled, baseUrl }: { enabled: boolean; baseUrl: string }) => {
      // Show the refresh button if a loader is available
      if (enabled) {
        refresh.style.display = "unset";
      }

      // Store the base URL for later use
      pbUrl = baseUrl;
    }
  );

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

  // Toggle the notification based on the presence of entities
  listenToNavigation(() => {
    // Check if entities are present
    const entities = window.__astro_entities__;
    if (!entities || entities.length === 0) {
      app.toggleNotification({ state: false });

      // Hide the toolbar if no entities are present
      app.toggleState({ state: false });
      return;
    }

    // Show the notification
    app.toggleNotification({ state: true, level: "info" });
  });
}
