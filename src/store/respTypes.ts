import { ComponentData, PageData } from "./editor";

export interface RespData<T = {}> {
  errno: number;
  data: T;
  message?: string;
}
export interface ListData<T> {
  list: T[];
  count: number;
}
export interface WorkData extends Omit<PageData, "props"> {
  content: {
    components: ComponentData[];
    props?: { [key: string]: any };
  };
}
export type RespListData<T> = RespData<ListData<T>>;
export type RespWorkdData = RespData<WorkData>;
