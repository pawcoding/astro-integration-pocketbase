import type { Entity } from "../types/entity";

/**
 * Creates cards for the entities.
 */
export function createEntities(data: Array<Entity>, baseUrl: string): string {
  const groupedData = Object.groupBy(data, (data) => data.collectionName);
  const collections = Object.keys(groupedData);

  return /* HTML */ `
    <style>
      .collectionName {
        text-transform: capitalize;
      }

      .entity {
        position: relative;

        pre {
          margin: 0;
          overflow: auto;
        }

        astro-dev-toolbar-button {
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    </style>

    ${collections
      .map(
        (collection) => /* HTML */ `
          <b class=".collectionName">${collection}</b>
          ${groupedData[collection]
            ?.map((entity) => createEntity(entity, baseUrl))
            .join("")}
        `
      )
      .join("")}
  `;
}

/**
 * Creates a card for a single entity
 */
function createEntity(data: Entity, baseUrl: string): string {
  return /* HTML */ `
    <astro-dev-toolbar-card>
      <div class="entity">
        <pre>${JSON.stringify(data, undefined, 2).replaceAll("<", "&lt;")}</pre>

        ${baseUrl
          ? /* HTML */ `
              <astro-dev-toolbar-button
                size="small"
                button-style="purple"
                title="View in PocketBase"
                onclick="window.open('${baseUrl}/_/#/collections?collection=${data.collectionId}&recordId=${data.id}&record=${data.id}', '_blank')"
              >
                View in PocketBase
              </astro-dev-toolbar-button>
            `
          : ""}
      </div>
    </astro-dev-toolbar-card>
  `;
}
