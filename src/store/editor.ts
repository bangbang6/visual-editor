import { ActionContext, Module, Mutation } from "vuex";
import store, { GlobalDataProps } from "./index";
import { v4 as uuidv4 } from "uuid";
import {
  ImageComponentProps,
  TextComponentProps,
  imageDefaultProps,
  textDefaultProps,
} from "@/defaultProps";
import { message } from "ant-design-vue";
import { cloneDeep, keys } from "lodash-es";
import { insertAt, objToQueryString } from "@/helper";
import axios, { AxiosRequestConfig } from "axios";
import { ActionPayload } from "./index";
import { compile } from "path-to-regexp";
import { RespData, RespListData, RespWorkdData } from "./respTypes";
export type MoveDirection = "Up" | "Down" | "Left" | "Right";
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
const debounceChange = (callback: (...args: any) => void, timeout = 60) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
};
const pushHistory = (state: EditorProps, historyRecord: HistoryProps) => {
  if (state.historyIndex !== -1) {
    state.histories = state.histories.slice(0, state.historyIndex);
    state.historyIndex = -1;
  }
  if (state.histories.length < state.maxHistoryNumber) {
    state.histories.push(historyRecord);
  } else {
    state.histories.shift();
    state.histories.push(historyRecord);
  }
};
const pushModifyHistory = (
  state: EditorProps,
  { key, value, id }: UpdateComponentData
) => {
  pushHistory(state, {
    id: uuidv4(),
    componentId: id || state.currentElement,
    data: {
      oldValue: state.cachedOldValue,
      value,
      key,
    },
    type: "modify",
  });
  state.cachedOldValue = null;
};
const pushModifyHistoryDebounce = debounceChange(pushModifyHistory);

export interface PageData {
  props: { [key: string]: any };
  setting?: { [key: string]: any };
  id?: number;
  title?: string;
  desc?: string;
  coverImg?: string;
  uuid?: string;
  latestPublishAt?: string;
  updatedAt?: string;
  isTemplate?: boolean;
  isHot?: boolean;
  isNew?: boolean;
  author?: string;
  copiedCount?: number;
  status?: string;
  user?: {
    gender: string;
    nickName: string;
    picture: string;
    userName: string;
  };
  shareImg?: string;
}
export interface HistoryProps {
  id: string;
  componentId?: string;
  type: "add" | "delete" | "modify";
  data: any;
  index?: number;
}
export interface ChannelProps {
  id: number;
  name: string;
  workId: number;
  status: number;
}
export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[];
  // 当前编辑的是哪个元素，uuid
  currentElement: string;
  // 当然最后保存的时候还有有一些项目信息，这里并没有写出，等做到的时候再补充
  page: PageData;
  // 当前被复制的组件
  copiedComponent: ComponentData | null;
  histories: HistoryProps[];
  historyIndex: number;
  cachedOldValue: any;
  maxHistoryNumber: number;
  isDirty: boolean;
  channels: ChannelProps[];
}
export interface ComponentData {
  // 这个元素的 属性，属性请详见下面 Partial全部变成问号
  props: Partial<TextComponentProps & ImageComponentProps>;
  // id，uuid v4 生成
  id: string;
  // 业务组件库名称 l-text，l-image 等等
  name: "l-text" | "l-image" | "l-text2" | "l-image2";
  /** 是否锁定 */
  isHidden?: boolean;

  /** 是否隐藏 */
  isLocked?: boolean;
  /** 对应的图层的名称 */
  layerName?: string;
}
const setDirtyWrapper = (callback: Mutation<EditorProps>) => {
  return (state: EditorProps, payload?: any) => {
    state.isDirty = true;
    callback(state, payload);
  };
};
export interface UpdateComponentData {
  key: string[] | string;
  value: string | string[];
  id: string;
  isRoot?: boolean;
}
const modifyHistory = (
  state: EditorProps,
  history: HistoryProps,
  type: "undo" | "redo"
) => {
  console.log("history", history);
  const { componentId, data } = history;
  const { key, oldValue, value } = data;
  // modify the page setting
  if (!componentId) {
    state.page.props[key] = type === "undo" ? oldValue : value;
  } else {
    const updatedComponent = state.components.find(
      (component) => component.id === componentId
    ) as any;
    if (Array.isArray(key)) {
      key.forEach((keyName: string, index) => {
        updatedComponent.props[keyName] =
          type === "undo" ? oldValue[index] : value[index];
      });
    } else {
      updatedComponent.props[key] = type === "undo" ? oldValue : value;
    }
  }
};
export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: "l-text",
    props: {
      ...textDefaultProps,
      text: "hello",
      fontSize: "20px",
      color: "#000000",
      lineHeight: "1",
      textAlign: "left",
      fontFamily: "",
      width: "100px",
      height: "100px",
      left: "10px",
      top: "10px",
      backgroundColor: "red",
      position: "absolute",
    },
    isHidden: false,
    isLocked: false,
    layerName: "图层1",
  },
  // {
  //   id: uuidv4(),
  //   name: "l-text",
  //   props: {
  //     ...textDefaultProps,
  //     text: "hello2",
  //     fontSize: "10px",
  //     fontWeight: "bold",
  //     lineHeight: "2",
  //     textAlign: "left",
  //     fontFamily: "",
  //     color: "#000000",
  //   },
  //   isHidden: false,
  //   isLocked: false,
  //   layerName: "图层2",
  // },
  // {
  //   id: uuidv4(),
  //   name: "l-text",
  //   props: {
  //     ...textDefaultProps,
  //     text: "hello3",
  //     fontSize: "15px",
  //     actionType: "url",
  //     url: "https://www.baidu.com",
  //     lineHeight: "3",
  //     textAlign: "left",
  //     fontFamily: "",
  //   },
  //   isHidden: false,
  //   isLocked: false,
  //   layerName: "图层3",
  // },
  // {
  //   id: uuidv4(),
  //   name: "l-image",
  //   props: {
  //     ...imageDefaultProps,
  //     imageSrc:
  //       "https://mw-editor-server.oss-cn-hangzhou.aliyuncs.com/201704%E4%B9%99%E7%AD%89.jpg",
  //     width: "225px",
  //     left: "0",
  //     top: "0",
  //     right: "0",
  //   },
  //   isHidden: false,
  //   isLocked: false,
  //   layerName: "图层4",
  // },
];
const pageDefaultProps = {
  backgroundColor: "#ffffff",
  backgroundImage: "",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "560px",
};

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: "",
    page: {
      props: pageDefaultProps,
      title: "test title",
    },
    copiedComponent: null,
    histories: [],
    historyIndex: -1,
    cachedOldValue: null,
    maxHistoryNumber: 5,
    isDirty: false,
    channels: [],
  },
  mutations: {
    addComponent: setDirtyWrapper((state, component: ComponentData) => {
      component.layerName = "图层" + (state.components.length + 1);
      state.components.push(component);
      pushHistory(state, {
        id: uuidv4(),
        componentId: component.id,
        data: cloneDeep(component),
        type: "add",
      });
    }),
    setActive(state, id) {
      state.currentElement = id;
    },
    updateComponent: setDirtyWrapper(
      (state, { key, value, id, isRoot }: UpdateComponentData) => {
        const curEle = state.components.find(
          (cmp) => cmp.id === (id || state.currentElement)
        );
        if (curEle) {
          if (isRoot) {
            curEle[key as string] = value;
          } else {
            const oldValue = Array.isArray(key)
              ? key.map((keyName) => curEle.props[keyName])
              : curEle.props[key];
            if (!state.cachedOldValue) {
              state.cachedOldValue = oldValue;
            }
            pushModifyHistoryDebounce(state, { key, value, id });

            if (Array.isArray(key) && Array.isArray(value)) {
              key.forEach((keyName, index) => {
                curEle.props[keyName] = value[index];
              });
            } else if (typeof key === "string" && typeof value === "string") {
              curEle.props[key] = value;
            }
          }
        }
      }
    ),
    updatePage: setDirtyWrapper((state, { key, value, isRoot, level }) => {
      console.log("level", level);
      if (isRoot) {
        console.log("key", key, value);
        state.page[key] = value;
      } else if (level === "setting") {
        console.log("value", value);
        state.page.shareImg = value;
      } else {
        state.page.props[key] = value;
      }
    }),
    copyComponent(state, id) {
      const currentComponent = store.getters.getElement(id);
      if (currentComponent) {
        state.copiedComponent = currentComponent;
        message.success("已拷贝当前图层", 1);
      }
    },
    pasteCopiedComponent: setDirtyWrapper((state) => {
      if (state.copiedComponent) {
        const clone = cloneDeep(state.copiedComponent);
        clone.id = uuidv4();
        clone.layerName = clone.layerName + "副本";
        state.components.push(clone);
        message.success("已粘贴当前图层", 1);
        pushHistory(state, {
          id: uuidv4(),
          componentId: clone.id,
          data: cloneDeep(clone),
          type: "add",
        });
      }
    }),
    deleteComponent: setDirtyWrapper((state, id) => {
      const currentComponent = store.getters.getElement(id);
      if (currentComponent) {
        const currentIndex = state.components.findIndex((cmp) => cmp.id === id);
        state.components = state.components.filter((cmp) => cmp.id !== id);
        message.success("已删除当前图层", 1);
        pushHistory(state, {
          id: uuidv4(),
          componentId: currentComponent.id,
          data: currentComponent,
          type: "delete",
          index: currentIndex,
        });
      }
    }),
    moveComponent(
      state,
      data: { direction: MoveDirection; amount: number; id: string }
    ) {
      const currentComponent = store.getters.getElement(data.id);
      if (currentComponent) {
        const oldTop = parseInt(currentComponent.props.top || 0);
        const oldLeft = parseInt(currentComponent.props.left || 0);
        const { direction, amount } = data;
        switch (direction) {
          case "Up": {
            const newValue = oldTop - amount + "px";
            store.commit("updateComponent", {
              key: "top",
              value: newValue,
              id: data.id,
            });
            break;
          }
          case "Down": {
            const newValue = oldTop + amount + "px";
            store.commit("updateComponent", {
              key: "top",
              value: newValue,
              isProps: true,
            });
            break;
          }
          case "Left": {
            const newValue = oldLeft - amount + "px";
            store.commit("updateComponent", {
              key: "left",
              value: newValue,
              isProps: true,
            });
            break;
          }
          case "Right": {
            const newValue = oldLeft + amount + "px";
            store.commit("updateComponent", {
              key: "left",
              value: newValue,
              isProps: true,
            });
            break;
          }
          default:
            break;
        }
      }
    },
    redo: setDirtyWrapper((state) => {
      // can't redo when historyIndex is the last item or historyIndex is never moved
      if (state.historyIndex === -1) {
        return;
      }
      // get the record
      const history = state.histories[state.historyIndex];
      // process the history data
      switch (history.type) {
        case "add":
          state.components.push(history.data);
          // state.components = insertAt(state.components, history.index as number, history.data)
          break;
        case "delete":
          state.components = state.components.filter(
            (component) => component.id !== history.componentId
          );
          break;
        case "modify": {
          modifyHistory(state, history, "redo");
          break;
        }
        default:
          break;
      }
      state.historyIndex++;
    }),
    undo: setDirtyWrapper((state) => {
      // 没有点击过undo
      if (state.historyIndex === -1) {
        state.historyIndex = state.histories.length - 1;
      } else {
        state.historyIndex--;
      }
      const history = state.histories[state.historyIndex];
      switch (history.type) {
        case "add": {
          state.components = state.components.filter(
            (cmp) => cmp.id !== history.componentId
          );
          break;
        }
        case "modify": {
          modifyHistory(state, history, "undo");

          break;
        }
        case "delete": {
          state.components = insertAt(
            state.components,
            history.index as number,
            history.data
          );
          break;
        }
        default:
          break;
      }
    }),
    fetchWork(state, { data }: RespWorkdData) {
      const { content, ...rest } = data;
      state.page = { ...state.page, ...rest };
      if (content.props) {
        state.page.props = content.props;
      }
      state.components = content.components;
    },
    saveWork(state) {
      state.isDirty = false;
    },
    fetchChannels(state, { data }: RespListData<ChannelProps>) {
      state.channels = data.list;
    },
    createChannel(state, { data }: RespData<ChannelProps>) {
      state.channels = [...state.channels, data];
    },
    deleteChannel(state, { payload }: RespData<any>) {
      console.log("state.channels", state.channels, payload);
      if (payload && payload.urlParams) {
        const { urlParams } = payload;
        state.channels = state.channels.filter(
          (channel) => channel.id !== parseInt(urlParams.id)
        );
      }
    },
    publishTemplate(state) {
      state.page.isTemplate = true;
    },
  },
  actions: {
    fetchWork: actionWrapper("/works/:id", "fetchWork"),
    saveWork: actionWrapper("/works/:id", "saveWork", { method: "patch" }),
    createWork: actionWrapper("/works", "createWork", {
      method: "post",
    }),
    publishWork: actionWrapper("/works/publish/:id", "publishWOrk", {
      method: "post",
    }),
    fetchChannels: actionWrapper(
      "/channel/getWorkChannels/:id",
      "fetchChannels"
    ),
    createChannel: actionWrapper("/channel/", "createChannel", {
      method: "post",
    }),
    deleteChannel: actionWrapper("/channel/:id", "deleteChannel", {
      method: "delete",
    }),
    publishTemplate: actionWrapper(
      `/works/publish-template/:id`,
      "publishTemplate",
      {
        method: "post",
      }
    ),
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find((cmp) => cmp.id === state.currentElement);
    },
    getElement: (state) => (id) => {
      return state.components.find(
        (cmp) => cmp.id === (id || state.currentElement)
      );
    },
    checkUndoDisable: (state) => {
      return state.historyIndex === 0 || state.histories.length === 0;
    },
    checkRedoDisable: (state) => {
      return (
        state.historyIndex === state.histories.length ||
        state.histories.length === 0 ||
        state.historyIndex === -1
      );
    },
  },
};
export default editor;
