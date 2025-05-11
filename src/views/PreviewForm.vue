<template>
  <div class="publish-form-container" v-if="visible">
    <div class="final-preview">
      <div class="final-preview-inner">
        <div class="preview-title">
          {{ pageData.title }}
        </div>
        <div class="iframe-container">
          <iframe
            :src="previewURL"
            frameborder="0"
            width="375"
            :height="pageData.props && pageData.props.height"
            class="iframe-placeholder"
          ></iframe>
        </div>
      </div>
    </div>

    <a-drawer
      title="设置面板"
      placement="right"
      width="400"
      :closeable="true"
      :visible="visible"
    >
      <div>
        <a-row type="flex" align="middle" :style="{ marginBottom: '20px' }">
          <a-col :span="6"> 扫码预览： </a-col>
          <a-col :span="10">
            <canvas id="preview-barcode-container"></canvas>
          </a-col>
        </a-row>
        <a-row type="flex" align="middle" :style="{ marginBottom: '20px' }">
          <a-col :span="6"> 上传封面： </a-col>
          <a-col :span="10">
            <img
              width="100"
              :src="pageData.shareImg"
              v-if="pageData.shareImg"
            />
            <styled-uploader
              text="上传封面图"
              @success="updateAvatar"
              :uploaded="form.uploaded"
              v-else
            >
            </styled-uploader>
          </a-col>
        </a-row>
        <a-form
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
          :model="form"
          :rules="rules"
          ref="publishForm"
        >
          <a-form-item label="标题" required name="title">
            <a-input
              v-model:value="form.title"
              @change="updatePage('title', form.title)"
            />
          </a-form-item>
          <a-form-item label="副标题" required name="subTitle">
            <a-input
              v-model:value="form.subTitle"
              @change="updatePage('desc', form.subTitle)"
            />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 18, offset: 4 }">
            <a-button
              type="primary"
              @click="checkAndpublish"
              :loading="isPublishing"
            >
              发布
            </a-button>
            <a-button
              style="margin-left: 10px"
              @click="saveWork"
              :loading="isSaving"
            >
              保存
            </a-button>
            <a-button style="margin-left: 10px" @click="cancelEdit">
              取消
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  Ref,
  computed,
  watch,
  onMounted,
} from "vue";
import StyledUploader from "../components/StyledUploader.vue";
import { commonUploadCheck, UploadImgProps } from "../helper";
import QRCode from "qrcode";
import { useStore } from "vuex";
import { GlobalDataProps } from "../store";
import { baseH5URL } from "../main";
interface RuleFormInstance {
  validate: () => Promise<any>;
}
export default defineComponent({
  components: {
    StyledUploader,
  },
  props: {
    isSaving: Boolean,
    isPublishing: Boolean,
    visible: {
      type: Boolean,
      defaults: false,
    },
  },
  emits: ["panel-close", "trigger-publish", "trigger-save"],
  setup(props, context) {
    console.log("props", props.visible);
    const store = useStore<GlobalDataProps>();
    const pageData = computed(() => store.state.editor.page);
    console.log("pageData===", pageData);

    const { title, desc, shareImg } = pageData.value;
    const previewURL = `${baseH5URL}/p/preview/${pageData.value.id}-${pageData.value.uuid}`;
    const form = reactive({
      title: title || "",
      subTitle: desc || "",
      uploaded: {
        data: {
          url:
            shareImg ||
            "http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f79389d4737571e2e1dc7cb.png",
        },
      },
    });
    // in case title changed from outside
    watch(
      () => pageData.value.title,
      (newTitle) => {
        if (newTitle) {
          form.title = newTitle;
        }
      }
    );
    onMounted(() => {
      const ele = document.getElementById("preview-barcode-container");
      console.log("previewURL----", previewURL);
      setTimeout(() => {
        QRCode.toCanvas(ele, previewURL, {
          width: 100,
        }).then(() => {
          console.log("success");
        });
      }, 300);
    });
    const publishForm = ref() as Ref<RuleFormInstance>;
    const rules = {
      title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
      subTitle: [
        { required: true, message: "副标题不能为空", trigger: "blur" },
      ],
    };
    const updatePage = (key: string, value: string, settings = false) => {
      store.commit("updatePage", {
        key,
        value,
        level: settings ? "setting" : false,
      });
    };
    const updateAvatar = (rawData) => {
      const url = rawData.resp.url;
      form.uploaded = {
        data: { url },
      };
      updatePage("shareImg", url, true);
    };
    const validate = () => {
      return publishForm.value.validate();
    };
    const checkAndpublish = () => {
      validate().then(() => {
        context.emit("trigger-publish", true);
      });
    };
    const saveWork = () => {
      validate().then(() => {
        context.emit("trigger-save", true);
      });
    };
    const cancelEdit = () => {
      context.emit("panel-close", true);
    };
    return {
      form,
      rules,
      publishForm,
      checkAndpublish,
      saveWork,
      cancelEdit,
      commonUploadCheck,
      updatePage,
      updateAvatar,
      previewURL,
      pageData,
    };
  },
});
</script>

<style>
.publish-form-container .file-upload-container {
  height: 130px;
}
.publish-form-container .ant-form-item-label {
  text-align: left;
}
#preview-barcode-container {
  border: 2px dotted #efefef;
  padding: 10px;
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
  background: url("~@/assets/phone-back.png") no-repeat;
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
  overflow-x: hidden;
  overflow-y: auto;
}
.iframe-placeholder {
  background: url("~@/assets/loading.svg") 50% 50% no-repeat;
  background-size: 50px;
}
</style>
