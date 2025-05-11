import { createContextMenu } from "@/components/createContextMenu";
import store from "@/store";
import { message } from "ant-design-vue";
import { computed, onMounted, onUnmounted } from "vue";
export const operationText: {
  [key: string]: {
    text: string;
    shortcut: string;
    action: (cid?: string) => void;
  };
} = {
  copy: {
    text: "拷贝图层",
    shortcut: "⌘C / Ctrl+C",
    action: (componentId?: string) => {
      store.commit("copyComponent", componentId);
      message.success("已拷贝当前图层", 1);
    },
  },
  paste: {
    text: "粘贴图层",
    shortcut: "⌘V / Ctrl+V",
    action: () => {
      store.commit("pasteCopiedComponent");
      message.success("已黏贴当前图层", 1);
    },
  },
  delete: {
    text: "删除图层",
    shortcut: "Backspace / Delete",
    action: (componentId?: string) => {
      store.commit("deleteComponent", componentId);
      message.success("删除当前图层成功", 1);
    },
  },
  cancel: {
    text: "取消选中",
    shortcut: "ESC",
    action: () => {
      store.commit("setActive", "");
    },
  },
  undo: {
    text: "撤销",
    shortcut: "⌘Z / Ctrl+Z",
    action: () => {
      const undoIsDisabled = computed<boolean>(
        () => store.getters.checkUndoDisable
      );
      if (!undoIsDisabled.value) {
        store.commit("undo");
      }
    },
  },
  redo: {
    text: "重做",
    shortcut: "⌘⇧Z / Ctrl+Shift+Z",
    action: () => {
      const redoIsDisabled = computed<boolean>(
        () => store.getters.checkRedoDisable
      );
      if (!redoIsDisabled.value) {
        store.commit("redo");
      }
    },
  },
};
const initContextMenu = () => {
  let destory;
  onMounted(() => {
    destory = createContextMenu(operationText);
  });
  onUnmounted(() => {
    destory();
  });
};
export default initContextMenu;
