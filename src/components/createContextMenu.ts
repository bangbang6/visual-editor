import { createVNode, render } from "vue";
import ContextMenu from "./ContextMenu.vue";
interface ActionItem {
  action: () => void;
  text: string;
  shortcut: string;
}

export const createContextMenu = (actions, triggerClass = "edit-wrapper") => {
  const container = document.createElement("div");
  const options = {
    actions,
    triggerClass,
  };
  const vm = createVNode(ContextMenu, options);
  render(vm, container);
  document.body.appendChild(container);
  return () => {
    render(null, container);
    document.body.removeChild(container);
  };
};
