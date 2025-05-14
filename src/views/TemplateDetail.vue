<template>
  <div class="work-detail-container">
    <a-row type="flex" justify="center" v-if="template">
      <a-col :span="8" class="cover-img">
        <img :src="template.coverImg" alt="" />
      </a-col>
      <a-col :span="8">
        <h2>{{ template.title }}</h2>
        <p>{{ template.title }}</p>
        <div class="author">
          <a-avatar>V</a-avatar>
          该模版由 <b>{{ template.author }}</b> 创作
        </div>
        <div class="bar-code-area">
          <span>扫一扫，手机预览</span>
          <div ref="container"></div>
        </div>
        <div class="use-button">
          <router-link to="/editor">
            <a-button type="primary" size="large" @click="onCopy(template.id)">
              使用模版
            </a-button>
          </router-link>
          <a-button size="large" @click="download"> 下载图片海报 </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { downloadImage } from "@/helper";
import { GlobalDataProps } from "@/store";
import { computed, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();

    const store = useStore<GlobalDataProps>();
    const currentId = route.params.id as string;
    const template = computed(() =>
      store.getters.getTemplateById(parseInt(currentId))
    );

    const download = () => {
      downloadImage(template.value.coverImg);
    };
    const onCopy = (id: number) => {
      if (store.state.user.isLogin) {
        store
          .dispatch("copyWork", { urlParams: { id: `${id}` } })
          .then(({ data }) => {
            router.push(`/editor/${data.id}`);
          });
      } else {
        router.push("/login");
      }
    };
    return { route, template, download, onCopy };
  },
});
</script>

<style scoped>
.work-detail-container {
  margin-top: 50px;
}
.cover-img {
  margin-right: 30px;
}
.cover-img img {
  width: 100%;
}
.use-button {
  margin: 30px 0;
}
.ant-avatar {
  margin-right: 10px;
}
.bar-code-area {
  margin: 20px 0;
}
</style>
