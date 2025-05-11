<template>
  <div class="content-container">
    <a-row :gutter="16">
      <template-list :list="testData"></template-list>
    </a-row>
    <a-row type="flex" justify="center">
      <a-button
        type="primary"
        size="large"
        @click="loadMorePage"
        v-if="!isLastPage"
      >
        加载更多
      </a-button>
    </a-row>
  </div>
</template>

<script lang="ts">
import TemplateList from "@/components/TemplateList.vue";
import { GlobalDataProps } from "@/store";
import { computed, defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import axios from "axios";
import useLoadMore from "@/store/useLoadMore";
export default defineComponent({
  components: {
    TemplateList,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const testData = computed(() => store.state.templates.data);
    const total = computed(() => store.state.templates.totalTemplates);
    const { loadMorePage, isLastPage } = useLoadMore("fetchTemplates", total, {
      pageIndex: 0,
      pageSize: 8,
    });

    onMounted(() => {
      loadMorePage();
    });
    return {
      testData,
      loadMorePage,
      isLastPage,
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
