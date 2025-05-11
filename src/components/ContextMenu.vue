<template>
  <div class="context-menu-component menu-container" ref="menuRef">
    <ul class="ant-menu-light ant-menu-root ant-menu ant-menu-vertical">
      <li
        v-for="(action, index) in actions"
        :key="index"
        @click="action.action(componentId)"
      >
        <span class="item-text">{{ action.text }}</span>
        <span class="item-shortcut">{{ action.shortcut }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, onUnmounted } from "vue";
import { map, pick } from "lodash";
import { clickInsideElement } from "../helper";
import { dataOperations, operationText } from "../plugins/hotKeys";
export default defineComponent({
  emits: ["on-select"],
  props: {
    actions: {
      type: Object,
    },
    triggerClass: {
      type: String,
      default: "edit-wrapper",
    },
  },
  setup(props, context) {
    const menuRef = ref<null | HTMLElement>(null);
    const componentId = ref("");
    // pick the opreration for the context menu
    // const operations = pick(dataOperations(componentId), [
    //   "copy",
    //   "paste",
    //   "delete",
    //   "cancel",
    // ]);
    // const actions = map(operations, (val, key) => {
    //   return {
    //     key,
    //     action: val,
    //   };
    // });
    const triggerContextMenu = (e: MouseEvent) => {
      const domElement = menuRef.value as HTMLElement;
      e.preventDefault();
      const wrapperElement = clickInsideElement(e, props.triggerClass);
      if (wrapperElement) {
        domElement.style.display = "block";
        domElement.style.top = e.pageY + "px";
        domElement.style.left = e.pageX + "px";
        const cid = wrapperElement.dataset.componentId;
        if (cid) {
          componentId.value = cid;
          context.emit("on-select", wrapperElement.dataset.componentId);
        }
      }
    };
    const handleClick = () => {
      const domElement = menuRef.value as HTMLElement;
      domElement.style.display = "none";
    };
    onMounted(() => {
      document.addEventListener("contextmenu", triggerContextMenu);
      document.addEventListener("click", handleClick);
    });
    onUnmounted(() => {
      document.removeEventListener("contextmenu", triggerContextMenu);
      document.removeEventListener("click", handleClick);
    });
    return {
      menuRef,
      operationText,
      componentId,
    };
  },
});
</script>

<style>
.menu-container {
  display: none;
  position: absolute;
  background: #fff;
  z-index: 2000;
}
.menu-container .ant-menu-item {
  display: flex;
  justify-content: space-between;
}
.menu-container .ant-menu-item:hover {
  background: #efefef;
}
.ant-menu-item .item-shortcut {
  color: #ccc;
}
</style>
