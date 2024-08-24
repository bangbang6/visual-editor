<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";
export default defineComponent({
  name: "App",
  setup() {
    const route = useRoute();
    const withHeader = computed(() => route.meta.withHeader);
    return {
      withHeader,
    };
  },
});
</script>

<style>
</style>
