import { useStore } from "vuex";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { GlobalDataProps } from "../store/index";

function useCreateDesign() {
  const store = useStore<GlobalDataProps>();
  const router = useRouter();
  const userInfo = computed(() => store.state.user);
  const createDesign = async () => {
    if (userInfo.value.isLogin) {
      const payload = {
        title: "未命名作品",
        desc: "未命名作品",
        coverImg:
          "http://static.imooc-lego.com/upload-files/528w-0ilmEQMomZ8-108048.png",
      };
      const work = await store.dispatch("createWork", { data: payload });
      console.log("work", work);
      router.push(`/editor/${work.data.id}`);
    } else {
      router.push("/login");
    }
  };
  return createDesign;
}

export default useCreateDesign;
