<template>
  <div
    class="edit-wrapper"
    @click="onItemClick(id)"
    :class="{ active: active }"
    :style="styles"
    ref="editWrapper"
    @mousedown="startMove"
    :data-component-id="id"
  >
    <slot></slot>
    <div class="resizers">
      <div
        class="resizer top-left"
        @mousedown.stop="startResize('top-left')"
      ></div>
      <div
        class="resizer top-right"
        @mousedown.stop="startResize('top-right')"
      ></div>
      <div
        class="resizer bottom-left"
        @mousedown.stop="startResize('bottom-left')"
      ></div>
      <div
        class="resizer bottom-right"
        @mousedown.stop="startResize('bottom-right')"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, nextTick } from "vue";
import { pick } from "lodash-es";
type ResizeDirection =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
interface OriginalPositions {
  left: number;
  right: number;
  top: number;
  bottom: number;
}
export default defineComponent({
  name: "editor-wrapper",
  props: {
    id: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    props: {
      type: Object,
    },
  },
  emits: ["set-active", "update-position"],
  setup(props, context) {
    const editWrapper = ref<null | HTMLElement>(null);
    const gap = {
      x: 0,
      y: 0,
    };
    const onItemClick = (id: string) => {
      context.emit("set-active", id);
    };
    const styles = computed(() =>
      pick(props.props, ["position", "top", "left", "width", "height"])
    );
    let isMoving = false;
    const caulateMovePosition = (e: MouseEvent) => {
      const container: any = document.getElementById("canvas-area");
      const left = e.clientX - gap.x - container.offsetLeft;
      const top = e.clientY - gap.y - container.offsetTop + container.scrollTop;
      return {
        left,
        top,
      };
    };
    const handleMove = (e: MouseEvent) => {
      const { left, top } = caulateMovePosition(e);
      const currentElement = editWrapper.value;
      isMoving = true;

      if (currentElement) {
        currentElement.style.top = `${top}px`;
        currentElement.style.left = `${left}px`;
      }
    };
    const handleMouseUp = (e: MouseEvent) => {
      document.removeEventListener("mousemove", handleMove);
      if (isMoving) {
        const { left, top } = caulateMovePosition(e);
        context.emit("update-position", { left, top, id: props.id });
        isMoving = false;
      }
      nextTick(() => {
        document.removeEventListener("mouseup", handleMouseUp);
      });
    };
    const startMove = (e: MouseEvent) => {
      const currentElement = editWrapper.value;
      if (currentElement) {
        const { left, top } = currentElement.getBoundingClientRect();
        gap.x = e.clientX - left;
        gap.y = e.clientY - top;
      }
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleMouseUp);
    };
    const caculateSize = (
      direction: ResizeDirection,
      e: MouseEvent,
      positions: OriginalPositions
    ) => {
      const { clientX, clientY } = e;
      const { left, top, right, bottom } = positions;
      const container: any = document.getElementById("canvas-area");
      const rightWidth = clientX - left;
      const leftWidth = right - clientX;
      const bottomHeight = clientY - top;
      const topHeight = bottom - clientY;
      const topOffset = clientY - container.offsetTop + container.scrollTop;
      const leftOffset = clientX - container.offsetLeft;
      switch (direction) {
        case "top-left":
          return {
            width: leftWidth,
            height: topHeight,
            top: topOffset,
            left: leftOffset,
          };
        case "top-right":
          return {
            width: rightWidth,
            height: topHeight,
            top: topOffset,
          };
        case "bottom-left":
          return {
            width: leftWidth,
            height: bottomHeight,
            left: leftOffset,
          };
        case "bottom-right":
          return {
            width: rightWidth,
            height: bottomHeight,
          };
        default:
          break;
      }
    };

    const startResize = (direction: ResizeDirection) => {
      const currentElement = editWrapper.value as HTMLElement;
      const { left, right, top, bottom } =
        currentElement.getBoundingClientRect();
      const handleMove = (e: MouseEvent) => {
        const size = caculateSize(direction, e, { left, right, top, bottom });
        const { style } = currentElement;
        if (size) {
          style.width = size.width + "px";
          style.height = size.height + "px";
          if (style.left) {
            style.left = size.left + "px";
          }
          if (style.top) {
            style.top = size.top + "px";
          }
        }
      };
      const handleMouseUp = (e: MouseEvent) => {
        document.removeEventListener("mousemove", handleMove);
        const size = caculateSize(direction, e, { left, right, top, bottom });
        context.emit("update-position", { ...size, id: props.id });
        nextTick(() => {
          document.removeEventListener("mouseup", handleMouseUp);
        });
      };
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    return {
      onItemClick,
      styles,
      editWrapper,
      startMove,
      handleMove,
      startResize,
    };
  },
});
</script>
<style scoped>
.edit-wrapper {
  padding: 0px;
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;
}
.edit-wrapper:hover {
  border: 1px dashed #ccc;
}
.edit-wrapper.active {
  border: 1px solid #1890ff;
  user-select: none;
  z-index: 1500;
}
.edit-wrapper > * {
  position: static !important;
  width: 100% !important;
  height: 100% !important;
}
.edit-wrapper.active .resizers .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%; /*magic to turn square into circle*/
  background: white;
  border: 3px solid #1890ff;
  position: absolute;
  display: block;
  z-index: 99;
}
.edit-wrapper .resizers .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize; /*resizer cursor*/
}
.edit-wrapper .resizers .resizer.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
</style>
