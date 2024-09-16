<template>
  <component
    :is="tag"
    :style="styleProps"
    class="l-text-component"
    @click="handleClick"
    >{{ text }}</component
  >
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import {
  transformToComponentProps,
  textDefaultProps,
  textStylePropNames,
} from "../defaultProps";

const defaultProps = transformToComponentProps(textDefaultProps);
import useComponentCommon from "../hooks/useComponentCommon";

export default defineComponent({
  name: "l-text",
  props: {
    tag: {
      type: String,
      default: "div",
    },
    ...defaultProps,
  },
  setup(props) {
    /** 重用并且简化styleProps取的属性 */
    const { styleProps, handleClick } = useComponentCommon(
      props,
      textStylePropNames
    );
    return {
      styleProps,
      handleClick,
    };
  },
});
</script>
<style scoped></style>