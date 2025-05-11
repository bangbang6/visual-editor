import axios, { AxiosRequestConfig } from "axios";
import { ActionContext } from "vuex";

export const actionWrapper = (
  url: string,
  commitName: string,
  config: AxiosRequestConfig = { method: "get" }
) => {
  return async (context: ActionContext<any, any>, payload?: any) => {
    const newConfig = { ...config, data: payload, opName: commitName };
    const { data } = await axios(url, newConfig);
    context.commit(commitName, data);
    return data;
  };
};
