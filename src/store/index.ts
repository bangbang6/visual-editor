import { ActionContext, createStore } from "vuex";
import templates, { TemplatesProps } from "./templates";
import user, { UserProps } from "./user";
import editor, { EditorProps } from "./editor";
import global, { GlobalStatus } from "./global";
import axios, { AxiosRequestConfig } from "axios";

export interface GlobalDataProps {
  user: UserProps;
  templates: TemplatesProps;
  editor: EditorProps;
  global: GlobalStatus;
}
export interface ActionPayload {
  urlParams?: { [key: string]: any };
  data?: any;
  searchParams?: { [key: string]: any };
}
const store = createStore({
  modules: {
    user,
    templates,
    editor,
    global,
  },
});

export default store;
