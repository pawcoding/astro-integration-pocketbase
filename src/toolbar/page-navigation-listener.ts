/**
 * Execute a callback whenever the user navigates to a new page.
 */
export function listenToNavigation(callback: () => void): void {
  // We trigger the callback immediately to ensure the toolbar is in sync with the current page.
  // If no client-side navigation is done, this is the only time the callback will be triggered.
  // Fortunately, this scrip will be re-executed on every page load.
  callback();

  // If client-side navigation is done (ViewTransitions / ClientRouter), we listen for page-load events.
  document.addEventListener("astro:page-load", () => {
    callback();
  });
}
