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

const fontFamilyOptions = fontFamilyArr.map((font) => {
  return {
    value: font.value,
    text: (
      // @ts-ignore
      <span style={{ fontFamily: font.value }}>{font.text}</span>
    ) as VNode,
  };
});
export const mapPropsToForms: PropsToForms = {
  text: {
    text: "文本",
    component: "a-textarea",
    extraProps: { rows: 3 }, // <a-textarea row=3 />
    afterTransform: (e: any) => e.target.value,
  },
  fontSize: {
    component: "a-input-number",
    text: "字号",
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => (e ? `${e}px` : ""),
  },

  lineHeight: {
    text: "行高",
    component: "a-slider",
    extraProps: { min: 0, max: 3, step: 0.1 }, // 放到a-slider的属性
    initalTransform: (v: string) => parseFloat(v),
    afterTransform: (e: number) => e.toString(),
  },
  textAlign: {
    component: "a-radio-group",
    subComponent: "a-radio-button",
    text: "对齐",
    options: [
      { value: "left", text: "左" },
      { value: "center", text: "中" },
      { value: "right", text: "右" },
    ],
    afterTransform: (e: any) => e.target.value,
  },
  fontFamily: {
    component: "a-select",
    subComponent: "a-select-option",
    text: "字体",
    options: [{ value: "", text: "空空" }, ...fontFamilyOptions],
  },

  color: {
    component: "color-picker",
    text: "字体颜色",
  },
};
