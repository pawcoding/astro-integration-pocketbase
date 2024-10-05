import type { AstroIntegration } from "astro";
import { fileURLToPath } from "node:url";

export function pocketbaseIntegration(): AstroIntegration {
  return {
    name: "pocketbase-integration",
    hooks: {
      "astro:config:setup": ({ addDevToolbarApp }) => {
        addDevToolbarApp({
          name: "PocketBase",
          id: `pocketbase-entry`,
          icon: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>PocketBase</title><path fill="currentColor" d="M5.684 12a.632.632 0 0 1-.631-.632V4.421c0-.349.282-.632.631-.632h2.37c.46 0 .889.047 1.287.139.407.084.758.23 1.053.44.303.202.541.475.715.82.173.335.26.75.26 1.246 0 .479-.092.894-.273 1.247a2.373 2.373 0 0 1-.715.869 3.11 3.11 0 0 1-1.053.503c-.398.11-.823.164-1.273.164h-.46a.632.632 0 0 0-.632.632v1.52a.632.632 0 0 1-.632.631Zm1.279-4.888c0 .349.283.632.632.632h.343c1.04 0 1.56-.437 1.56-1.31 0-.428-.135-.73-.404-.907-.26-.176-.645-.264-1.156-.264h-.343a.632.632 0 0 0-.632.631Zm6.3 13.098a.632.632 0 0 1-.631-.631v-6.947a.63.63 0 0 1 .631-.632h2.203c.44 0 .845.034 1.216.1.38.06.708.169.984.328.276.16.492.37.647.63.164.26.246.587.246.982 0 .185-.03.37-.09.554a1.537 1.537 0 0 1-.26.516 1.857 1.857 0 0 1-1.076.7.031.031 0 0 0-.023.03c0 .015.01.028.025.03.591.111 1.04.32 1.346.626.311.31.466.743.466 1.297 0 .42-.082.78-.246 1.083a2.153 2.153 0 0 1-.685.755 3.4 3.4 0 0 1-1.036.441 5.477 5.477 0 0 1-1.268.139zm1.271-5.542c0 .349.283.631.632.631h.21c.465 0 .802-.088 1.009-.264.207-.176.31-.424.31-.743 0-.302-.107-.516-.323-.642-.207-.135-.535-.202-.984-.202h-.222a.632.632 0 0 0-.632.632Zm0 3.463c0 .349.283.631.632.631h.39c1.019 0 1.528-.369 1.528-1.108 0-.36-.125-.621-.376-.78-.241-.16-.625-.24-1.152-.24h-.39a.632.632 0 0 0-.632.632zM1.389 0C.629 0 0 .629 0 1.389V15.03a1.4 1.4 0 0 0 1.389 1.39H8.21a.632.632 0 0 0 .63-.632.632.632 0 0 0-.63-.63H1.389c-.078 0-.125-.05-.125-.128V1.39c0-.078.047-.125.125-.125H15.03c.078 0 .127.047.127.125v6.82a.632.632 0 0 0 .631.63.632.632 0 0 0 .633-.63V1.389A1.4 1.4 0 0 0 15.032 0ZM15.79 7.578a.632.632 0 0 0-.632.633.632.632 0 0 0 .631.63h6.822c.078 0 .125.05.125.128V22.61c0 .078-.047.125-.125.125H8.97c-.077 0-.127-.047-.127-.125v-6.82a.632.632 0 0 0-.631-.63.632.632 0 0 0-.633.63v6.822A1.4 1.4 0 0 0 8.968 24h13.643c.76 0 1.389-.629 1.389-1.389V8.97a1.4 1.4 0 0 0-1.389-1.39Z"/></svg>`,
          entrypoint: fileURLToPath(new URL("./toolbar", import.meta.url))
        });
      },
      "astro:server:setup": ({ toolbar, logger }) => {
        toolbar.on("astro-integration-pocketbase:refresh", () => {
          logger.debug("refresh event received");

          // TODO: send refresh event to the PocketBase loader
        });

        toolbar.onAppInitialized("pocketbase-entry", () => {
          // TODO: send status if PocketBase loader is installed
          // This is needed to display or hide the refresh button

          logger.debug("initialized");

          // TODO: Send the current entity to the toolbar
          toolbar.send("astro-integration-pocketbase:entity", {
            url: "https://github.com/pawcoding/astro-integration-pocketbase",
            content: `Here will be the content of the entity`
          });
        });
      }
    }
  };
}
