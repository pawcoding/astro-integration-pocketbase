# astro-integration-pocketbase

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/pawcoding/astro-integration-pocketbase/release.yaml?style=flat-square)
[![NPM Version](https://img.shields.io/npm/v/astro-integration-pocketbase?style=flat-square)](https://www.npmjs.com/package/astro-integration-pocketbase)
[![NPM Downloads](https://img.shields.io/npm/dw/astro-integration-pocketbase?style=flat-square)](https://www.npmjs.com/package/astro-integration-pocketbase)
[![GitHub License](https://img.shields.io/github/license/pawcoding/astro-integration-pocketbase?style=flat-square)](https://github.com/pawcoding/astro-integration-pocketbase/blob/master/LICENSE)
[![Discord](https://img.shields.io/discord/484669557747875862?style=flat-square&label=Discord)](https://discord.gg/GzgTh4hxrx)

This package provides an Astro toolbar for users of [astro-loader-pocketbase](https://github.com/pawcoding/astro-loader-pocketbase) to view PocketBase data directly in the Astro dev server.

![PocketBase Toolbar](https://github.com/pawcoding/astro-integration-pocketbase/blob/master/assets/toolbar.png?raw=true)

## Compatibility

| Integration | Loader | Astro | PocketBase |
| ----------- | ------ | ----- | ---------- |
| 1.0.0       | 2.0.0  | 5.0.0 | >= 0.23.0  |
| 2.0.0       | 2.0.0  | 5.0.0 | >= 0.23.0  |

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

## Realtime updates

### Basic setup

PocketBase allows you to subscribe to collection changes via its [Realtime API](https://pocketbase.io/docs/api-realtime/).
This integration allows you to subscribe to these changes and reload the entries / collections.
Note that Node.js currently does not support the [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) API, so the integration uses the [eventsource](https://www.npmjs.com/package/eventsource) package to provide the same functionality.

If you want realtime updates for collections with a [restricted list / search rule](https://pocketbase.io/docs/api-rules-and-filters/), you need to provide superuser credentials to the integration.

```ts
pocketbaseIntegration({
  ...options,
  // List of PocketBase collections to watch for changes
  collectionsToWatch: ["posts", "comments"],
  // Superuser credentials for restricted collections (optional)
  superuserCredentials: {
    email: "<superuser-email>",
    password: "<superuser-password>"
  }
});
```

**Tip:** You can disable the realtime updates temporarily via the toolbar.

### Advanced setup

If you work with view collections, you need some more advanced options to get the realtime updates working as expected.
Since [view collections don't receive realtime events](https://pocketbase.io/docs/collections/#view-collection), you need to watch the source base collection instead, by providing one or more collections to watch.

```ts
pocketbaseIntegration({
  ...options,
  collectionsToWatch: {
    // Same effect as basic setup watching the same collection
    // Recommended for basic / auth collections
    users: true,
    // Watch the source collection(s) of a view collection
    // Recommended for view collections
    postings: ["posts", "comments"]
  }
});
```

When using `true`, the integration will subscribe and reload the entries of the same collection mentioned in the key.
When using an array of other collections, the integration will subscribe to changes of collections given in the array and reload the entries of the collection mentioned in the key.

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

| Option                 | Type                                                     | Required | Description                                                                                                                   |
| ---------------------- | -------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `url`                  | `string`                                                 | x        | The URL of your PocketBase instance.                                                                                          |
| `collectionsToWatch`   | `Array<string> \| Record<string, true \| Array<string>>` |          | Collections to watch for changes.                                                                                             |
| `superuserCredentials` | `{ email: string, password: string }`                    |          | The email and password of a superuser of the PocketBase instance. This is used for realtime updates of restricted collection. |
