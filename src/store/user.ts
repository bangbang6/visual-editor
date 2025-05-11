import { ActionContext, Module } from "vuex";
import { ActionPayload, GlobalDataProps } from "./index";
import axios, { AxiosRequestConfig } from "axios";
import { RespData } from "./respTypes";
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

    const newConfig = { ...config, data: payload.data, opName: commitName };
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

export interface UserProps {
  isLogin: boolean;
  data?: UserDataProps;
  token?: string;
}
export interface UserDataProps {
  username?: string;
  id?: string;
  phoneNumber?: string;
  nickName?: string;
  description?: string;
  updatedAt?: string;
  createdAt?: string;
  iat?: number;
  exp?: number;
  picture?: string;
  gender?: string;
}

const user: Module<UserProps, GlobalDataProps> = {
  state: {
    isLogin: false,
    data: {},
    token: localStorage.getItem("token") || "",
  },
  mutations: {
    login(state, rawData: RespData<{ token: string }>) {
      const { token } = rawData.data;
      console.log("token", token);
      state.token = token;
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem("token", token);
    },
    logout(state) {
      state.isLogin = false;
      state.token = "";
      localStorage.removeItem("token");
      delete axios.defaults.headers.common.Authorization;
    },
    fetchCurrentUser(state, rawData: RespData<UserDataProps>) {
      state.isLogin = true;
      state.data = { ...rawData.data };
    },
  },
  actions: {
    login: actionWrapper("/users/loginByPhoneNumber", "login", {
      method: "post",
    }),
    fetchCurrentUser: actionWrapper("/users/getUserInfo", "fetchCurrentUser"),

    loginAndFetch({ dispatch }, loginData) {
      return dispatch("login", loginData).then(() => {
        return dispatch("fetchCurrentUser");
      });
    },
  },
};

export default user;
