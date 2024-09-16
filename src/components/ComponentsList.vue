<template>
  <div class="create-component-list">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="component-item"
      @click="onItemClick(item)"
    >
      <l-text v-bind="item"></l-text>
    </div>
  </div>
</template>
<script lang="ts">
import { TextComponentProps } from "@/defaultProps";
import { defineComponent } from "vue";
import LText from "./LText.vue";
export default defineComponent({
  name: "components-list",
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  components: {
    LText,
  },
  emits: ["on-item-click"],
  setup(props, context) {
    const onItemClick = (data: Partial<TextComponentProps>) => {
      context.emit("on-item-click", data);
    };
    return {
      onItemClick,
    };
  },
});
</script>
<style scoped>
</style>