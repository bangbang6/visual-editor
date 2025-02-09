<template>
  <div class="create-component-list">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="component-item"
      @click="onItemClick(item)"
    >
      <!-- <l-text v-bind="item"></l-text> -->
      <l-text2 tag="h2" text="122112"></l-text2>
    </div>
  </div>
  <StyledUploader @success="onImageUploaded" />
</template>
<script lang="ts">
import { TextComponentProps, imageDefaultProps } from "@/defaultProps";
import { defineComponent } from "vue";
import LText from "./LText.vue";
import StyledUploader from "./StyledUploader.vue";
import { ComponentData } from "@/store/editor";
import { v4 as uuidv4 } from "uuid";
import { UploadResp } from "@/extraType";
import { message } from "ant-design-vue";
import { getImageDimensions } from "@/helper";
export default defineComponent({
  name: "components-list",
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  components: {
    // LText,
    StyledUploader,
  },
  emits: ["on-item-click"],
  setup(props, context) {
    const onItemClick = (props: Partial<TextComponentProps>) => {
      const data: ComponentData = {
        name: "l-text",
        id: uuidv4(),
        props,
      };
      context.emit("on-item-click", data);
    };
    const onImageUploaded = (resp: UploadResp) => {
      const data: ComponentData = {
        name: "l-image",
        id: uuidv4(),
        props: {
          ...imageDefaultProps,
        },
      };
      message.success("上传成功");
      data.props.src = resp.resp.url;
      getImageDimensions(resp.resp.url).then((dimensions) => {
        const { width } = dimensions;
        const maxWidth = 373;

        data.props.width = (width > maxWidth ? maxWidth : width) + "px";
        context.emit("on-item-click", data);
      });
    };
    return {
      onItemClick,
      onImageUploaded,
    };
  },
});
</script>
