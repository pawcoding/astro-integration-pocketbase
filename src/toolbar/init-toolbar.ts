import type {
  ToolbarAppEventTarget,
  ToolbarServerHelpers
} from "astro/runtime/client/dev-toolbar/helpers.js";
import type { DevToolbarButton } from "astro/runtime/client/dev-toolbar/ui-library/button.js";
import type { DevToolbarCard } from "astro/runtime/client/dev-toolbar/ui-library/card.js";
import { default as packageJson } from "../../package.json";

interface Entity {
  id: string;
  collectionId: string;
}

declare global {
  interface Window {
    __astro_entities__?: Array<Entity>;
  }
}

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
}

function createHeader(
  server: ToolbarServerHelpers
): [HTMLElement, DevToolbarButton] {
  const header = document.createElement("header");
  header.style.display = "grid";
  header.style.gap = "0.25rem";
  header.style.gridTemplateColumns = "auto auto 1fr";

  const title = document.createElement("h3");
  title.style.marginTop = "0.25rem";
  title.textContent = "PocketBase";
  header.appendChild(title);

  const version = document.createElement("astro-dev-toolbar-badge");
  version.textContent = packageJson.version;
  version.badgeStyle = "yellow";
  header.appendChild(version);

  const refresh = document.createElement("astro-dev-toolbar-button");
  refresh.size = "small";
  refresh.buttonStyle = "green";
  refresh.style.marginLeft = "auto";
  refresh.textContent = "Refresh content";
  refresh.style.display = "none";
  refresh.addEventListener("click", () => {
    server.send("astro-integration-pocketbase:refresh", true);
  });
  header.appendChild(refresh);

  return [header, refresh];
}

function createPlaceholder(): DevToolbarCard {
  const main = document.createElement("astro-dev-toolbar-card");

  const content = document.createElement("div");
  content.style.display = "flex";
  content.style.alignItems = "center";
  content.style.justifyContent = "center";
  main.appendChild(content);

  const placeholder = document.createElement("span");
  placeholder.textContent = "Here you will see the raw content of an entity";
  content.appendChild(placeholder);

  return main;
}

function createEntity(data: Entity, baseUrl?: string): DevToolbarCard {
  const main = document.createElement("astro-dev-toolbar-card");

  const content = document.createElement("div");
  content.style.position = "relative";
  main.appendChild(content);

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

  const entity = document.createElement("pre");
  entity.style.margin = "0";
  entity.style.overflow = "auto";
  entity.style.height = "300px";
  entity.textContent = JSON.stringify(data, null, 2);
  content.appendChild(entity);

  return main;
}
