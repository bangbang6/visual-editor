import { ActionContext, Module } from "vuex";
import { RespListData } from "./respTypes";
import { ActionPayload, GlobalDataProps } from "./index";
import axios, { AxiosRequestConfig } from "axios";
import { compile } from "path-to-regexp";
export const actionWrapper = (
  url: string,
  commitName: string,
  config: AxiosRequestConfig = { method: "get" }
) => {
  return async (
    context: ActionContext<any, any>,
    payload: ActionPayload = {}
  ) => {
    const { urlParams, data } = payload;

    const newConfig = { ...config, data: payload, opName: commitName };
    let newURL = url;
    if (urlParams) {
      const toPath = compile(url, { encode: encodeURIComponent });
      newURL = toPath(urlParams);
      console.log("newURL", newURL);
    }
    const resp = await axios(newURL, newConfig);
    context.commit(commitName, resp.data);
    return data;
  };
};

export interface TemplateProps {
  id: number;
  title: string;
  coverImg: string;
  author: string;
  copiedCount: number;
}
export const testData: TemplateProps[] = [
  {
    id: 1,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-889755.png",
    title: "test title 1",
    author: "viking",
    copiedCount: 1,
  },
  {
    id: 2,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-677311.png",
    title: "前端架构师直播海报",
    author: "viking",
    copiedCount: 1,
  },
  {
    id: 3,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-682056.png",
    title: "前端架构师直播海报",
    author: "viking",
    copiedCount: 1,
  },
  {
    id: 4,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-677311.png",
    title: "前端架构师直播海报",
    author: "viking",
    copiedCount: 1,
  },
  {
    id: 5,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-889755.png",
    title: "前端架构师直播海报",
    author: "viking",
    copiedCount: 1,
  },
  {
    id: 6,
    coverImg:
      "https://static.imooc-lego.com/upload-files/screenshot-677311.png",
    title: "前端架构师直播海报",
    author: "viking",
    copiedCount: 1,
  },
];

export interface TemplatesProps {
  data: TemplateProps[];
}

const templates: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: [],
  },
  mutations: {
    fetchTemplates(state, rawData: RespListData<TemplateProps>) {
      state.data = rawData.data.list;
    },
  },
  actions: {
    fetchTemplates: actionWrapper("/templates", "fetchTemplates"),
  },
  getters: {
    getTemplateById: (state) => (id: number) => {
      return state.data.find((t) => t.id === id);
    },
  },
};

export default templates;
