<template>
  <div class="editor-container">
    <div class="wrapper" v-if="showpreview">
      <preview-form :visible="showpreview"></preview-form>
    </div>
    <a-modal
      title="发布成功"
      v-model:visible="showPublishForm"
      width="700px"
      :footer="null"
    >
      <publish-form></publish-form
    ></a-modal>
    <a-layout>
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">
            <img
              alt="Vue logo"
              src="../assets/logo-simple.png"
              class="logo-img"
            />
          </router-link>
          <input-edit :value="page.title" @change="titleChange">
            <h4>{{ page.title }}</h4>
          </input-edit>
        </div>
        <a-menu
          :selectable="false"
          theme="dark"
          mode="horizontal"
          :style="{ lineHeight: '64px' }"
        >
          <a-menu-item key="1">
            <a-button type="primary" @click="preview">预览和设置</a-button>
          </a-menu-item>
          <a-menu-item key="2">
            <a-button type="primary" @click="saveWork" :loading="saveIsLoading"
              >保存</a-button
            >
          </a-menu-item>
          <a-menu-item key="3">
            <a-button type="primary" @click="publish" :loading="isPublishing"
              >发布</a-button
            >
          </a-menu-item>
          <a-menu-item key="4">
            <user-profile :user="userInfo"></user-profile>
          </a-menu-item>
        </a-menu>
      </a-layout-header>
    </a-layout>
    <a-layout>
      <a-layout-sider width="300" style="background: #fff">
        <div class="sidebar-container">
          组件列表
          <components-list
            :list="defaultTextTemplates"
            @onItemClick="addItem"
          />
          <img src="" id="test-img" :style="{ width: '300px' }" />
        </div>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <history-area></history-area>

          <div
            class="preview-list"
            id="canvas-area"
            :class="{ 'canvas-fix': canvasFix }"
          >
            <div class="body-container" :style="page.props">
              <div v-for="component in components" :key="component.id">
                <edit-wrapper
                  @setActive="setActive"
                  v-if="!component.isHidden"
                  :id="component.id"
                  :props="component.props"
                  :active="
                    component.id === (currentElement && currentElement.id)
                  "
                  @update-position="updatePosition"
                >
                  <component :is="component.name" v-bind="component.props" />
                </edit-wrapper>
              </div>
            </div>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-sider
        width="300"
        style="background: #fff"
        class="settings-panel"
      >
        <a-tabs types="card" v-model:activeKey="activePanel">
          <a-tab-pane key="components" tab="属性设置" class="no-top-radius">
            <div v-if="currentElement">
              <edit-group
                v-if="!currentElement.isLocked"
                :props="currentElement.props"
                @change="handleChange"
              ></edit-group>
              <div v-else>
                <a-empty
                  ><template #description
                    ><p>该元素被锁定,无法编辑</p></template
                  ></a-empty
                >
              </div>
            </div>

            <!-- <pre>
        {{ currentElement && currentElement.props }}
      </pre
            > -->
          </a-tab-pane>
          <a-tab-pane key="layer" tab="图层设置">
            <layer-list
              :list="components"
              :selectedId="currentElement && currentElement.id"
              @change="handleChange"
              @select="setActive"
            ></layer-list>
          </a-tab-pane>
          <a-tab-pane key="page" tab="页面设置">
            <props-table :props="page.props" @change="pageChange">
            </props-table>
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { GlobalDataProps } from "@/store";
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
} from "vue";
import { useStore } from "vuex";
import LText from "../components/LText.vue";
import LImage from "../components/LImage.vue";
import EditWrapper from "../components/EditorWrapper.vue";
import ComponentsList from "../components/ComponentsList.vue";
// import PropsTable from "../components/PropsTable.vue";
import defaultTextTemplates from "../defaultTemplates";
import { ComponentData } from "@/store/editor";
import ImageProcesser from "@/components/ImageProcesser.vue";
import LayerList from "@/components/LayerList.vue";
import EditGroup from "@/components/EditGroup.vue";
import PropsTable from "@/components/PropsTable.vue";
import { forEach, pickBy } from "lodash-es";
import initHotKeys from "@/plugins/hotKeys";
import HistoryArea from "@/components/HistoryArea.vue";
import initContextMenu from "@/plugins/contextMenu";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import InputEdit from "@/components/InputEdit.vue";
import UserProfile from "@/components/UserProfile.vue";
import { Modal } from "ant-design-vue";
import html2canvas from "html2canvas";
import { takeScreenShotAndUpload } from "@/helper";
import PublishForm from "./PublishForm.vue";
import PreviewForm from "./PreviewForm.vue";
export default defineComponent({
  components: {
    LText,
    LImage,
    ImageProcesser,
    ComponentsList,
    EditWrapper,
    // PropsTable,
    LayerList,
    EditGroup,
    PropsTable,
    HistoryArea,
    InputEdit,
    UserProfile,
    PublishForm,
    PreviewForm,
  },
  setup() {
    /** 两个插件 */
    initHotKeys();
    initContextMenu();
    const route = useRoute();
    const currentWorkId = route.params.id;

    const store = useStore<GlobalDataProps>();
    const components = computed(() => store.state.editor.components);
    const page = computed(() => store.state.editor.page);
    const userInfo = computed(() => store.state.user);
    const isDirty = computed(() => store.state.editor.isDirty);
    const channels = computed(() => store.state.editor.channels);
    const canvasFix = ref(false);
    const isPublishing = ref(false);
    const showpreview = ref(false);
    console.log("components", components);
    const showPublishForm = ref(false);
    const currentElement = computed<ComponentData | null>(
      () => store.getters.getCurrentElement
    );
    const saveIsLoading = computed(() => store.getters.isOpLoading("saveWork"));
    const pageChange = (e: any) => {
      store.commit("updatePage", e);
    };
    const activePanel = ref("components");
    const addItem = (data: any) => {
      console.log("data", data);
      store.commit("addComponent", data);
    };
    const setActive = (id: string) => {
      store.commit("setActive", id);
    };
    const handleChange = (e: any) => {
      store.commit("updateComponent", e);
    };
    const saveWork = () => {
      const { title, props, coverImg } = page.value;
      const payload = {
        title,
        coverImg,
        content: {
          components: components.value,
          props,
        },
      };
      store.dispatch("saveWork", {
        data: payload,
        urlParams: { id: currentWorkId },
      });
    };
    const updatePosition = (data: {
      left: number;
      top: number;
      id: string;
    }) => {
      const { id } = data;
      const updateData = pickBy(data, (v, k) => k !== "id");
      const keysArr = Object.keys(updateData);
      const valuesArr = Object.values(updateData).map((v) => v + "px");
      store.commit("updateComponent", { key: keysArr, value: valuesArr, id });
    };
    let timer;
    onMounted(() => {
      if (currentWorkId) {
        store.dispatch("fetchWork", { urlParams: { id: currentWorkId } });
      }
      timer = setInterval(() => {
        if (isDirty.value) {
          saveWork();
        }
      }, 5000);
    });
    onUnmounted(() => {
      clearInterval(timer);
    });
    const titleChange = (title: string) => {
      store.commit("updatePage", { key: "title", value: title, isRoot: true });
    };
    onBeforeRouteLeave((to, from, next) => {
      if (isDirty.value) {
        Modal.confirm({
          title: "作品还未保存,是否保存",
          okText: "保存",
          cancelText: "取消",
          okType: "primary",
          onOk: async () => {
            await saveWork();
            next();
          },
          onCancel: () => {
            next();
          },
        });
      } else {
        next();
      }
    });
    const publish = async () => {
      store.commit("setActive", "");
      canvasFix.value = true;
      isPublishing.value = true;
      await nextTick();
      const el = document.getElementById("canvas-area") as HTMLElement;
      try {
        const resp = await takeScreenShotAndUpload(el);

        if (resp) {
          store.commit("updatePage", {
            key: "coverImg",
            value: resp.data.data.urls[0],
            isRoot: true,
          });
          await saveWork();
          await store.dispatch("publishWork", {
            urlParams: { id: currentWorkId },
          });
          await store.dispatch("fetchChannels", {
            urlParams: { id: currentWorkId },
          });
          if (channels.value.length === 0) {
            await store.dispatch("createChannel", {
              data: { workId: parseInt(currentWorkId as string), name: "默认" },
            });
          }
          showPublishForm.value = true;
        }
      } catch (err) {
        console.log("err", err);
      } finally {
        canvasFix.value = false;
        isPublishing.value = false;
      }
    };
    const preview = async () => {
      await saveWork();
      showpreview.value = true;
    };

    return {
      components,
      defaultTextTemplates,
      currentElement,
      handleChange,
      addItem,
      setActive,
      activePanel,
      page,
      pageChange,
      updatePosition,
      titleChange,
      userInfo,
      saveWork,
      saveIsLoading,
      publish,
      canvasFix,
      isPublishing,
      showPublishForm,
      showpreview,
      preview,
    };
  },
});
</script>

<style scoped>
.editor-container .preview-container {
  padding: 24px;
  margin: 0;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.editor-container .preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 200px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  margin-top: 50px;
  max-height: 80vh;
}
.zdy-component:after {
  content: "";
  display: block;
  clear: both;
}
header {
  display: flex;
  justify-content: space-between;
}
.header .logo-img {
  margin-right: 20px;
  height: 40px;
}
.page-title {
  display: flex;
}
.header h4 {
  color: #ffffff;
}
.editor-spinner {
  position: fixed;
  right: 50%;
  top: 10px;
}
.preview-container {
  padding: 24px;
  margin: 0;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 200px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  margin-top: 50px;
  max-height: 80vh;
}
.preview-list.active {
  border: 1px solid #1890ff;
}

.preview-list.canvas-fix {
  /* position: absolute; */
  /* max-height: none; */
}
.sidebar-container {
  padding: 20px;
}
.body-container {
  width: 100%;
  height: 100%;
  background-size: cover;
}
.page-settings {
  padding: 16px;
}
.settings-panel .ant-tabs-top-content {
  max-height: calc(100vh - 68px - 56px);
  overflow-y: auto;
}
.ant-layout-sider {
  padding: 16px;
  padding-top: 0;
}
.final-preview {
  position: absolute;
  width: calc(100% - 400px);
  height: 100%;
  background: transparent;
  top: 0;
  left: 0;
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
}
.final-preview-inner {
  width: 430px;
  height: 870px;
  padding: 60px 28px;
  position: relative;
  /* background: url("~@/assets/phone-back.png") no-repeat; */
  background-size: cover;
}
.final-preview-inner .preview-title {
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-weight: bold;
}
.iframe-container {
  width: 100%;
  height: 706px;
  overflow-y: auto;
  overflow-x: hidden;
}
.iframe-placeholder {
  /* background: url("~@/assets/loading.svg") 50% 50% no-repeat; */
  background-size: 50px;
}
.settings-panel .ant-list-bordered {
  border-radius: 0;
}
.settings-panel .ant-collapse {
  border-radius: 0;
}
.ant-collapse-header,
.ant-collapse-item {
  border-radius: 0 !important;
}
.settings-panel .ant-tabs-tab {
  border-radius: 0 !important;
}
.preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 200px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  margin-top: 50px;
  max-height: 80vh;
}
.preview-list.canvas-fix .edit-wrapper > * {
  box-shadow: none !important;
}
.preview-list.canvas-fix > * {
  /* position: absolute; */
  /* max-height: none; */
}
</style>
