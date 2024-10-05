import { defineToolbarApp } from "astro/toolbar";
import { initToolbar } from "./init-toolbar";

export default defineToolbarApp({
  init: initToolbar
});
