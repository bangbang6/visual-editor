import { ActionContext, Module } from "vuex";
import { RespListData } from "./respTypes";
import { ActionPayload, GlobalDataProps } from "./index";
import axios, { AxiosRequestConfig } from "axios";
import { compile } from "path-to-regexp";
import { objToQueryString } from "@/helper";
import { PageData } from "./editor";
export const actionWrapper = (
  url: string,
  commitName: string,
  config: AxiosRequestConfig = { method: "get" }
) => {
  return async (
    context: ActionContext<any, any>,
    payload: ActionPayload = {}
  ) => {
    const { urlParams, searchParams, data } = payload;
    const newConfig = {
      ...config,
      data: { ...payload.data },
      opName: commitName,
    };
    let newURL = url;
    if (urlParams) {
      const toPath = compile(url, { encode: encodeURIComponent });
      newURL = toPath(urlParams);
    }
    if (searchParams) {
      newURL += "?" + objToQueryString(searchParams);
    }
    const resp = await axios(newURL, newConfig);
    context.commit(commitName, { payload, ...resp.data });
    return resp.data;
  };
};

export type TemplateProps = Required<
  Omit<PageData, "props" | "setting" | "shareImg">
>;

export interface TemplatesProps {
  data: TemplateProps[];
  totalTemplates: number;
  works: TemplateProps[];
  totalWorks: number;
}

const templates: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: [],
    totalTemplates: 0,
    works: [],
    totalWorks: 0,
  },
  mutations: {
    fetchTemplates(state, rawData: RespListData<TemplateProps>) {
      const { list, count } = rawData.data;
      state.data = [...state.data, ...list];
      state.totalTemplates = count;
    },
    fetchWorks(state, rawData: RespListData<TemplateProps>) {
      const { list, count } = rawData.data;
      state.works = [...state.data, ...list];
      state.totalWorks = count;
    },
  },
  actions: {
    fetchTemplates: actionWrapper("/templates", "fetchTemplates"),
    fetchWorks: actionWrapper("/works", "fetchWorks"),
  },
  getters: {
    getTemplateById: (state) => (id: number) => {
      return state.data.find((t) => t.id === id);
    },
  },
};

export default templates;
