<template>
  <div class="inline-edit" @click.stop="handleClick" ref="wrapper">
    <a-input
      v-model:value="innerValue"
      v-if="isEditing"
      :class="{ 'input-error': !validateCheck }"
      placeholder="文本不能为空"
      ref="inputRef"
    />
    <slot v-else></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, nextTick } from "vue";
import useKeyPress from "../hooks/useKeyPress";
import useClickOutside from "../hooks/useClickOutside";
export default defineComponent({
  name: "inline-edit",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  emits: ["change", "clicked"],
  setup(props, context) {
    const innerValue = ref(props.value);
    const error = ref(false);
    const wrapper = ref<null | HTMLElement>(null);
    const inputRef = ref<null | HTMLInputElement>(null);
    const isOutSide = useClickOutside(wrapper);
    const isEditing = ref(false);
    let cachedOldValue = "";

    watch(isOutSide, (newValue) => {
      if (newValue && isEditing.value) {
        isEditing.value = false;
        innerValue.value = cachedOldValue;
        context.emit("change", innerValue.value);
      }
      isOutSide.value = false;
    });
    useKeyPress("Enter", () => {
      if (isEditing.value) {
        isEditing.value = false;
        context.emit("change", innerValue.value);
      }
    });
    watch(isEditing, async (isEditing) => {
      if (isEditing) {
        cachedOldValue = innerValue.value;

        await nextTick();
        if (inputRef.value) {
          inputRef.value.focus();
        }
      }
    });
    useKeyPress("Escape", () => {
      if (isEditing.value) {
        isEditing.value = false;
        innerValue.value = cachedOldValue;
        context.emit("change", innerValue.value);
      }
    });
    watch(
      () => props.value,
      () => {
        innerValue.value = props.value;
      }
    );
    const handleClick = () => {
      setTimeout(() => {
        isEditing.value = true;
        context.emit("clicked");
      }, 100);
    };
    const validateCheck = computed(() => {
      return innerValue.value.trim() !== "";
    });

    return {
      handleClick,
      innerValue,
      isEditing,
      wrapper,
      validateCheck,
      inputRef,
    };
  },
});
</script>

<style>
.inline-edit {
  cursor: pointer;
}
.input-error {
  border: 1px solid #f5222d;
}
.input-error:focus {
  border-color: #f5222d;
}
.input-error::placeholder {
  color: #f5222d;
}
</style>
