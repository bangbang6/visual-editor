declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare module "lego-mw-components";
declare module "clipboard";
declare module "file-saver";
