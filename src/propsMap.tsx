import { VNode, h } from "vue";
import { TextComponentProps } from "./defaultProps";

export interface PropToForm {
  component?: string;
  value?: string;
  /** radio.group这种需要有radio-button这种子组件包裹 */
  subComponent?: string;
  /** 属性说明 */
  text?: string;
  /** 给组件传递的属性 */
  extraProps?: { [key: string]: any };
  /** 给子组件传递的属性 */
  options?: { text: string | VNode; value: any }[];
  /** 对传入组件的参数进行转换 */
  initalTransform?: (v: any) => any;
  afterTransform?: (v: any) => any;
  valueProp?: string;
  eventName?: string;
}
export type PropsToForms = {
  [p in keyof TextComponentProps]?: PropToForm;
};
const fontFamilyArr = [
  { text: "宋体", value: '"SimSun","STSong"' },
  { text: "黑体", value: '"SimHei","STHeiti"' },
  { text: "楷体", value: '"KaiTi","STKaiti"' },
  { text: "仿宋", value: '"FangSong","STFangsong"' },
];
const defaultMap = {
  component: "a-input",
  eventName: "change",
  valueProp: "value",
  initalTransform: (v: any) => v,
  afterTransform: (e: any) => e,
};
const fontFamilyOptions = fontFamilyArr.map((font) => {
  return {
    value: font.value,
    text: (
      // @ts-ignore
      <span style={{ fontFamily: font.value }}>{font.text}</span>
    ) as VNode,
  };
});
interface PropDetailType {
  component: string;
  eventName: string;
  initalTransform?: (v: any) => any;
  afterTransform: (v: any) => any;
  text?: string;
  valueProp: string;
  subComponent?: string;
  options?: { text: string | VNode; value: any }[];
  extraProps?: { [key: string]: any };
  // 该属性有可能和其他联动，由改父属性控制它的行为
  parent?: string;
  // 可能还要向外传递更多事件
  extraEvent?: string;
}
const numberToPxHandle = {
  ...defaultMap,
  component: "a-input-number",
  initalTransform: (v: string) => (v ? parseInt(v) : 0),
  afterTransform: (e: number) => (e ? `${e}px` : "0"),
};
interface MapTypes {
  [key: string]: PropDetailType;
}
export const mapPropsToForms: MapTypes = {
  text: {
    ...defaultMap,
    component: "textarea-fix",
    afterTransform: (e: any) => e.target.value,
    text: "文本",
    extraProps: { rows: 3 },
  },
  href: {
    ...defaultMap,
    afterTransform: (e: any) => e.target.value,
    text: "链接",
  },
  fontSize: {
    ...numberToPxHandle,
    text: "字号",
  },
  fontFamily: {
    ...defaultMap,
    component: "a-select",
    subComponent: "a-select-option",
    text: "字体",
    options: [{ value: "", text: "无" }, ...fontFamilyOptions],
  },
  fontWeight: {
    ...defaultMap,
    component: "icon-switch",
    initalTransform: (v: string) => v === "bold",
    afterTransform: (e: boolean) => (e ? "bold" : "normal"),
    valueProp: "checked",
    extraProps: { iconName: "BoldOutlined", tip: "加粗" },
  },
  fontStyle: {
    ...defaultMap,
    component: "icon-switch",
    initalTransform: (v: string) => v === "italic",
    afterTransform: (e: boolean) => (e ? "italic" : "normal"),
    valueProp: "checked",
    extraProps: { iconName: "ItalicOutlined", tip: "斜体" },
  },
  textDecoration: {
    ...defaultMap,
    component: "icon-switch",
    initalTransform: (v: string) => v === "underline",
    afterTransform: (e: boolean) => (e ? "underline" : "none"),
    valueProp: "checked",
    extraProps: { iconName: "UnderlineOutlined", tip: "下划线" },
  },
  lineHeight: {
    ...defaultMap,
    component: "a-slider",
    text: "行高",
    initalTransform: (v: string) => (v ? parseFloat(v) : 0),
    afterTransform: (e: number) => e.toString(),
    extraProps: { min: 0, max: 3, step: 0.1 },
  },
  textAlign: {
    ...defaultMap,
    component: "a-radio-group",
    subComponent: "a-radio-button",
    afterTransform: (e: any) => e.target.value,
    text: "对齐",
    options: [
      { value: "left", text: "左" },
      { value: "center", text: "中" },
      { value: "right", text: "右" },
    ],
  },
  color: {
    ...defaultMap,
    component: "color-picker",
    text: "文字颜色",
  },
  backgroundColor: {
    ...defaultMap,
    component: "color-picker",
    text: "背景颜色",
  },
  // actions
  actionType: {
    ...defaultMap,
    component: "a-select",
    subComponent: "a-select-option",
    text: "点击",
    options: [
      { value: "", text: "无" },
      { value: "to", text: "跳转到 URL" },
    ],
  },
  url: {
    ...defaultMap,
    afterTransform: (e: any) => e.target.value,
    text: "链接",
    parent: "actionType",
  },
  // sizes
  height: {
    ...defaultMap,
    component: "a-input-number",
    initalTransform: (v: string) => (v ? parseInt(v) : ""),
    afterTransform: (e: number) => (e ? `${e}px` : ""),
    text: "高度",
  },
  width: {
    ...defaultMap,
    component: "a-input-number",
    initalTransform: (v: string) => (v ? parseInt(v) : ""),
    afterTransform: (e: number) => (e ? `${e}px` : ""),
    text: "宽度",
  },
  paddingLeft: {
    ...numberToPxHandle,
    text: "左边距",
  },
  paddingRight: {
    ...numberToPxHandle,
    text: "右边距",
  },
  paddingTop: {
    ...numberToPxHandle,
    text: "上边距",
  },
  paddingBottom: {
    ...numberToPxHandle,
    text: "下边距",
  },
  // border types
  borderStyle: {
    ...defaultMap,
    component: "a-select",
    subComponent: "a-select-option",
    text: "边框类型",
    options: [
      { value: "none", text: "无" },
      { value: "solid", text: "实线" },
      { value: "dashed", text: "破折线" },
      { value: "dotted", text: "点状线" },
    ],
  },
  borderColor: {
    ...defaultMap,
    component: "color-picker",
    text: "边框颜色",
  },
  borderWidth: {
    ...defaultMap,
    component: "a-slider",
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => e + "px",
    text: "边框宽度",
    extraProps: { min: 0, max: 20 },
  },
  borderRadius: {
    ...defaultMap,
    component: "a-slider",
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => e + "px",
    text: "边框圆角",
    extraProps: { min: 0, max: 200 },
  },
  // shadow and opactiy
  opacity: {
    ...defaultMap,
    component: "a-slider",
    text: "透明度",
    initalTransform: (v: number) => (v ? v * 100 : 100),
    afterTransform: (e: number) => e / 100,
    extraProps: { min: 0, max: 100, reverse: true },
  },
  boxShadow: {
    ...defaultMap,
    component: "shadow-picker",
  },
  position: {
    ...defaultMap,
    component: "a-select",
    subComponent: "a-select-option",
    text: "定位",
    options: [
      { value: "", text: "默认" },
      { value: "absolute", text: "绝对定位" },
    ],
  },
  left: {
    ...numberToPxHandle,
    text: "X轴坐标",
  },
  top: {
    ...numberToPxHandle,
    text: "Y轴坐标",
  },
  imageSrc: {
    ...defaultMap,
    component: "image-processer",
  },
  backgroundImage: {
    ...defaultMap,
    text: "背景图片",
    component: "background-processer",
    initalTransform: (v: string) => {
      console.log("v", v);
      if (v) {
        const reg = /\(["'](.+)["']\)/g;
        const matches = reg.exec(v);
        console.log("matches", matches);
        if (matches && matches.length > 1) {
          console.log("matches", matches);
          return matches[1].replace(/('|")/g, "");
        } else {
          return "";
        }
      } else {
        return "";
      }
    },
    afterTransform: (e: string) => (e ? `url('${e}')` : ""),
    extraProps: { ratio: 8 / 15, showDelete: true },
    extraEvent: "uploaded",
  },
  backgroundSize: {
    ...defaultMap,
    component: "a-select",
    subComponent: "a-select-option",
    text: "背景大小",
    options: [
      { value: "contain", text: "自动缩放" },
      { value: "cover", text: "自动填充" },
      { value: "", text: "默认" },
    ],
  },
  backgroundRepeat: {
    ...defaultMap,
    component: "a-select",
    subComponent: "a-select-option",
    text: "背景重复",
    options: [
      { value: "no-repeat", text: "无重复" },
      { value: "repeat-x", text: "X轴重复" },
      { value: "repeat-y", text: "Y轴重复" },
      { value: "repeat", text: "全部重复" },
    ],
  },
};
export default mapPropsToForms;
