<template>
  <div class="mywork-container">
    <h2>我的作品和模版</h2>
    <a-tabs @change="changeCategory">
      <a-tab-pane key="0" tab="我的作品"> </a-tab-pane>
      <a-tab-pane key="1" tab="我的模版"> </a-tab-pane>
    </a-tabs>

    <works-list
      :list="works"
      @on-delete="onDelete"
      @on-copy="onCopy"
      @on-send="sendGift"
      :transfer-status="transferDone"
    >
    </works-list>
    <a-row type="flex" justify="center">
      <a-pagination
        v-model:current="currentPage"
        :total="total"
        :pageSize="8"
        show-less-items
        @change="pageChange"
      />
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, nextTick } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
// import "echarts/lib/chart/line";
import { GlobalDataProps } from "../store/index";
import useCreateDesign from "../hooks/useCreateDesign";
import {
  toDateFormat,
  toDateFromDays,
  getDaysArray,
  objToArr,
} from "../helper";
import { message } from "ant-design-vue";
import WorksList from "@/components/WorksList.vue";
export default defineComponent({
  components: {
    WorksList,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const router = useRouter();
    const works = computed(() => store.state.templates.works);
    const total = computed(() => store.state.templates.totalWorks);
    // const loading = computed(() => store.state.status.loading);
    // const statics = computed(() => store.state.works.statics);
    const channels = computed(() => store.state.editor.channels);
    const currentPage = ref(1);
    const transferDone = ref(false);
    const dateRange = ref([
      toDateFormat(toDateFromDays(new Date(), -30)),
      toDateFormat(new Date()),
    ]);
    const dateArray = computed(() =>
      getDaysArray(new Date(dateRange.value[0]), new Date(dateRange.value[1]))
    );
    const dateArrayFormat = dateArray.value.map((date) => toDateFormat(date));
    // const staticOptions = computed(() => {
    //   const legend = statics.value.map((stat) => stat.name);
    //   const xAxis = {
    //     type: "category",
    //     data: dateArrayFormat,
    //   };
    //   const series = statics.value.map((stat) => {
    //     const statMap = {} as any;
    //     stat.list.forEach((i) => {
    //       const key = i.eventDate.split("T")[0];
    //       statMap[key] = i.eventData.pv;
    //     });
    //     const dateArrayFormatMap = {} as any;
    //     dateArrayFormat.forEach((date) => {
    //       if (statMap[date]) {
    //         dateArrayFormatMap[date] = statMap[date];
    //       } else {
    //         dateArrayFormatMap[date] = 0;
    //       }
    //     });
    //     return {
    //       type: "line",
    //       name: stat.name,
    //       data: objToArr(dateArrayFormatMap),
    //     };
    //   });
    //   return {
    //     legend: {
    //       data: legend,
    //     },
    //     xAxis,
    //     yAxis: {
    //       type: "value",
    //     },
    //     series,
    //   };
    // });
    const tableColumns = [
      {
        title: "渠道名称",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "PV",
        dataIndex: "pv",
        key: "pv",
      },
      {
        title: "占比",
        dataIndex: "percent",
        key: "percent",
      },
    ];
    // const totalPv = computed(() => {
    //   let total = 0;
    //   statics.value.forEach((stat) => {
    //     const pv = stat.list.reduce(
    //       (prev, current) => current.eventData.pv + prev,
    //       0
    //     );
    //     total += pv;
    //   });
    //   return total;
    // });
    // const tableData = computed(() => {
    //   return statics.value.map((stat) => {
    //     const pv = stat.list.reduce(
    //       (prev, current) => current.eventData.pv + prev,
    //       0
    //     );
    //     return {
    //       name: stat.name,
    //       key: stat.id,
    //       pv,
    //       percent: (pv / totalPv.value) * 100 + "%",
    //     };
    //   });
    // });
    const searchText = ref("");
    const showModal = ref(false);
    const currentStaticId = ref(0);
    const isTemplate = ref(0);
    // const currentSearchText = computed(() => store.state.works.searchText);
    const createDesign = useCreateDesign();
    let myChart: any;
    onMounted(() => {
      store.dispatch("fetchWorks", {
        searchParams: {
          pageIndex: currentPage.value - 1,
          pageSize: 8,
          isTemplate: isTemplate.value,
        },
      });
    });

    const onDelete = (id: number) => {
      store.dispatch("deleteWork", id);
    };
    const onCopy = (id: number) => {
      store
        .dispatch("copyWork", { urlParams: { id: `${id}` } })
        .then(({ data }) => {
          router.push(`/editor/${data.id}`);
        });
    };
    const sendGift = (data: { id: number; username: string }) => {
      store.dispatch("transferWork", data).then((data) => {
        console.log(data);
        if (data.errno !== 0) {
          message.error(data.message);
        } else {
          message.success("转赠作品成功");
          transferDone.value = true;
        }
      });
    };
    const changeCategory = (key: any) => {
      isTemplate.value = key;
      currentPage.value = 1;
      nextTick(() => {
        store.dispatch("fetchWorks", {
          searchParams: {
            pageIndex: currentPage.value - 1,
            pageSize: 8,
            isTemplate: isTemplate.value,
          },
        });
      });
    };
    const pageChange = () => {
      store.dispatch("fetchWorks", {
        searchParams: {
          pageIndex: currentPage.value - 1,
          pageSize: 8,
          isTemplate: isTemplate.value,
        },
      });
    };

    return {
      works,
      onDelete,
      onCopy,
      createDesign,
      searchText,
      showModal,
      dateRange,
      tableColumns,
      total,
      currentPage,
      pageChange,
      changeCategory,
      sendGift,
      transferDone,
    };
  },
});
</script>

<style>
.mywork-container .ant-input-search {
  width: 30%;
}
.mywork-container {
  padding: 40px 60px;
}
.searchResult {
  display: flex;
  align-items: center;
}
#main-chart {
  position: relative;
}
.chart-loading {
  position: absolute;
  left: 50%;
  top: 50%;
}
</style>
