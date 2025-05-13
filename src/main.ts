import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import router from "./router/index";
import store from "./store/index";
import "cropperjs/dist/cropper.css";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { RespData } from "./store/respTypes";
import { ActionContext } from "vuex";
export type ICustomAxiosConfig = AxiosRequestConfig & {
  opName?: string;
};

axios.defaults.baseURL = "http://localhost:3000/api";
axios.interceptors.request.use((config: ICustomAxiosConfig) => {
  store.commit("startLoading", { opName: config.opName });
  store.commit("setError", { status: false, message: "" });

  return config;
});
axios.interceptors.response.use(
  (resp: AxiosResponse<RespData>) => {
    const { config, data } = resp;
    const newConfig = config as ICustomAxiosConfig;
    store.commit("finishLoading", { opName: newConfig.opName });
    const { errno, message } = data;
    if (errno !== 0) {
      store.commit("setError", { status: true, message });
      return Promise.reject(data);
    }
    return resp;
  },
  (e: AxiosError) => {
    const newConfig = e.config as ICustomAxiosConfig;
    store.commit("setError", { status: true, message: "服务器错误" });
    store.commit("finishLoading", { opName: newConfig.opName });
    return Promise.reject(e);
  }
);

export const baseH5URL = "http://182.92.168.192:8082";

createApp(App).use(Antd).use(router).use(store).mount("#app");
