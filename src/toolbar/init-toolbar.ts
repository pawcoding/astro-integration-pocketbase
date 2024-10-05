import type {
  ToolbarAppEventTarget,
  ToolbarServerHelpers
} from "astro/runtime/client/dev-toolbar/helpers.js";
import type { DevToolbarCard } from "astro/runtime/client/dev-toolbar/ui-library/card.js";
import { default as packageJson } from "../../package.json";

export async function initToolbar(
  canvas: ShadowRoot,
  app: ToolbarAppEventTarget,
  server: ToolbarServerHelpers
): Promise<void> {
  const container = document.createElement("astro-dev-toolbar-window");
  canvas.appendChild(container);

  const header = createHeader(server);
  container.appendChild(header);

  const placeholder = createPlaceholder();
  container.appendChild(placeholder);

  app.onToolbarPlacementUpdated(({ placement }) => {
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
  });

  server.on(
    "astro-integration-pocketbase:entity",
    (entity: { url: string; content: string }) => {
      const cards = container.getElementsByTagName("astro-dev-toolbar-card");
      for (const card of cards) {
        card.remove();
      }

      if (!entity) {
        container.appendChild(createPlaceholder());
        app.toggleState({ state: false });
        app.toggleNotification({ state: false });
      } else {
        container.appendChild(createEntity(entity));
        app.toggleNotification({ state: true, level: "info" });
      }
    }
  );
}

function createHeader(server: ToolbarServerHelpers): HTMLElement {
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
  refresh.addEventListener("click", () => {
    server.send("astro-integration-pocketbase:refresh", true);
  });
  header.appendChild(refresh);

  return header;
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

function createEntity(data: { url: string; content: string }): DevToolbarCard {
  const main = document.createElement("astro-dev-toolbar-card");

  const content = document.createElement("div");
  main.style.position = "relative";
  main.appendChild(content);

  const viewInPocketbase = document.createElement("astro-dev-toolbar-button");
  viewInPocketbase.size = "small";
  viewInPocketbase.buttonStyle = "purple";
  viewInPocketbase.textContent = "View in PocketBase";
  viewInPocketbase.style.position = "absolute";
  viewInPocketbase.style.top = "16px";
  viewInPocketbase.style.right = "16px";
  viewInPocketbase.addEventListener("click", () => {
    window.open(data.url, "_blank");
  });
  content.appendChild(viewInPocketbase);

  const entity = document.createElement("pre");
  entity.style.margin = "0";
  entity.style.overflow = "auto";
  entity.style.height = "300px";
  entity.textContent = data.content;
  content.appendChild(entity);

  return main;
}
