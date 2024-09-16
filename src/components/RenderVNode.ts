import { defineComponent } from "vue";

const RenderVNode = defineComponent({
  props: {
    vNode: {
      type: [Object, String],
      required: true,
    },
  },
  render() {
    return this.vNode;
  },
});
export default RenderVNode;
