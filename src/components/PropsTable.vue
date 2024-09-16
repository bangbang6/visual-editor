<template>
  <div>
    <div v-for="(value, key) in finalProps" :key="key" class="prop-item">
      <div class="label" v-if="value?.text">{{ value.text }}</div>
      <component
        :is="value.component"
        v-if="value"
        :[value.valueProp]="value[value.valueProp]"
        v-bind="value.extraProps"
        class="prop-component"
        v-on="value.events"
      >
        <template v-if="value.options">
          <component
            :is="value.subComponent"
            v-for="(option, k) in value.options"
            :key="k"
            :value="option.value"
            ><render-vnode :vNode="option.text"></render-vnode
          ></component>
        </template>
      </component>
    </div>
  </div>
</template>
<script lang="ts">
import { TextComponentProps } from "@/defaultProps";
import { reduce } from "lodash-es";
import { computed, defineComponent, PropType, VNode } from "vue";
import { mapPropsToForms } from "../propsMap";
import RenderVnode from "./RenderVNode";
interface FormProps {
  component?: string;
  subComponent?: string;
  value: string;
  extraProps?: { [key: string]: any };
  text?: string;
  options?: { text: string | VNode; value: any }[];
  valueProp: string;
  eventName: string;
  events: { [key: string]: (e: any) => void };
}
export default defineComponent({
  name: "props-table",
  props: {
    props: {
      type: Object as PropType<TextComponentProps>,
    },
  },
  components: { RenderVnode },
  emits: ["change"],
  setup(props, context) {
    const finalProps = computed(() => {
      return reduce(
        props.props,
        (result, value, key) => {
          const newKey = key as keyof TextComponentProps;
          const item = mapPropsToForms[newKey];
          if (item) {
            const {
              valueProp = "value",
              eventName = "change",
              initalTransform,
              afterTransform,
            } = item;
            const newItem: FormProps = {
              ...item,
              value: initalTransform ? initalTransform(value) : value,
              valueProp,
              eventName,
              events: {
                [eventName]: (e: any) => {
                  context.emit("change", {
                    key,
                    value: afterTransform ? afterTransform(e) : e,
                  });
                },
              },
            };

            result[newKey] = newItem;
          }
          return result;
        }, //将?的ts属性转成必选的 解决value.text报错value可能不存在的下划线问题
        {} as { [key: string]: FormProps }
      );
    });
    return {
      finalProps,
    };
  },
});
</script>
<style scoped>
.prop-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}
.label {
  width: 28%;
}
.prop-component {
  width: 70%;
}
</style>