<template>
  <div class="content-container">
    <template-list :list="testData"></template-list>
  </div>
</template>

<script lang="ts">
import TemplateList from "@/components/TemplateList.vue";
import { GlobalDataProps } from "@/store";
import { computed, defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import axios from "axios";
export default defineComponent({
  components: {
    TemplateList,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const testData = computed(() => store.state.templates.data);
    const currentUser = computed(() => store.state.user);
    onMounted(() => {
      store.dispatch("fetchTemplates");
    });
    return {
      testData,
    };
  },
});
</script>

<style>
.page-title {
  color: #fff;
}
.content-container {
  background: #fff;
  padding: 0 24px 24px 30px;
  min-height: 85vh;
  max-width: 1200px;
  margin: 50px auto;
  width: 100%;
}
</style>
