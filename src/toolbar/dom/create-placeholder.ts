/**
 * Creates a placeholder card.
 */
export function createPlaceholder(): string {
  return /* HTML */ `
    <style>
      #placeholder div {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    </style>

    <astro-dev-toolbar-card id="placeholder">
      <div>
        <span> Here you will see the raw content of an entity </span>
      </div>
    </astro-dev-toolbar-card>
  `;
}
