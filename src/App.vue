<template>
  <div class="app-container">
    <!-- <a-spin v-if="showLoading" tip="加载中..." class="global-spinner" /> -->
    <router-view />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { GlobalDataProps } from "./store/index";
import { message } from "ant-design-vue";
export default defineComponent({
  name: "App",
  setup() {
    const route = useRoute();
    const withHeader = computed(() => route.meta.withHeader);
    const store = useStore<GlobalDataProps>();
    const isLoading = computed(() => store.getters.isLoading);
    const error = computed(() => store.state.global.error);
    const showLoading = computed(
      () => isLoading.value && !route.meta.isLoading
    );
    watch(
      () => error.value.status,
      (errorValue) => {
        if (errorValue) {
          message.error(error.value.message || "未知错误", 2);
        }
      }
    );
    return {
      withHeader,
      showLoading,
    };
  },
});
</script>

<style>
.app-container .global-spinner {
  position: fixed;
  top: 100px;
  right: 50%;
}
</style>
