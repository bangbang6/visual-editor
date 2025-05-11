import { ComputedRef, computed, ref } from "vue";
import { useStore } from "vuex";
interface LoadParams {
  pageIndex: number;
  pageSize: number;
  [key: string]: any;
}
const useLoadMore = (
  actionName: string,
  total: ComputedRef<number>,
  params: LoadParams = { pageIndex: 0, pageSize: 8 }
) => {
  const store = useStore();
  const pageIndex = ref(params.pageIndex);
  const requestParams = computed(() => {
    return {
      ...params,
      pageIndex: pageIndex.value,
    };
  });
  const loadMorePage = () => {
    store
      .dispatch(actionName, { searchParams: requestParams.value })
      .then((res) => {
        pageIndex.value++;
      });
  };
  const isLastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) === pageIndex.value;
  });
  return {
    loadMorePage,
    isLastPage,
    pageIndex,
  };
};
export default useLoadMore;
