# astro-integration-pocketbase

<!-- ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/pawcoding/astro-integration-pocketbase/release.yaml?style=flat-square) -->

[![NPM Version](https://img.shields.io/npm/v/astro-integration-pocketbase?style=flat-square)](https://www.npmjs.com/package/astro-integration-pocketbase)
[![NPM Downloads](https://img.shields.io/npm/dw/astro-integration-pocketbase?style=flat-square)](https://www.npmjs.com/package/astro-integration-pocketbase)
[![GitHub License](https://img.shields.io/github/license/pawcoding/astro-integration-pocketbase?style=flat-square)](https://github.com/pawcoding/astro-integration-pocketbase/blob/master/LICENSE)
[![Discord](https://img.shields.io/discord/484669557747875862?style=flat-square&label=Discord)](https://discord.gg/GzgTh4hxrx)

This package provides an Astro toolbar for users of [astro-loader-pocketbase](https://github.com/pawcoding/astro-loader-pocketbase) to view PocketBase data directly in the Astro dev server.

![PocketBase Toolbar](/assets/toolbar.png)

> [!WARNING]
> This package is still under development.
> Until the first stable 1.0 release **breaking changes can occur at any time**.

## Basic usage

_For the toolbar to work, you need to have the [`astro-loader-pocketbase`](https://www.npmjs.com/package/astro-loader-pocketbase) package installed and configured in your project._

To use the toolbar, you need to import the `pocketbaseIntegration` function and add it to the `integrations` array in your Astro config file.

```ts
import { pocketbaseIntegration } from "astro-integration-pocketbase";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [
    pocketbaseIntegration({
      // Make sure to use the same URL as in your pocketbaseLoader configuration
      url: "https://<your-pocketbase-url>"
    })
  ]
});
```

After adding the integration to your Astro config, you can start the dev server and see the PocketBase icon in the toolbar.
If you click on the icon, you can see the PocketBase entity viewer.

If a loader is found, the viewer will show a refresh button to reload all entries from the loaders.

## Entity viewer

To view the PocketBase entries inside the entity viewer, you need to use `Astro.props` to pass the entries to your page (and thus to the toolbar).

<details>
  <summary>
    Example page with PocketBase entries from a collection
  </summary>

```astro
---
import { render, getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

interface Props {
  entry: CollectionEntry<"<your-collection">
}

export async function getStaticPaths() {
  const entries = await getCollection("<your-collection>");
  return entries.map((entry) => ({
    params: { id: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<article>
  <h1>{entry.data.title}</h1>
  <Content />
</article>
```

</details>

The integration will automatically detect PocketBase entries in the props and display them in the entity viewer.

## All options

| Option | Type     | Required | Description                          |
| ------ | -------- | -------- | ------------------------------------ |
| `url`  | `string` | x        | The URL of your PocketBase instance. |
