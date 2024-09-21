import ColorPicker from "@/components/ColorPicker.vue";
const defaultColors = [
  "#ffffff",
  "#f5222d",
  "#fa541c",
  "#fadb14",
  "#52c41a",
  "#1890ff",
  "#722ed1",
  "#8c8c8c",
  "#000000",
  "",
];
import rgbHex from "rgb-hex";
import { VueWrapper, mount } from "@vue/test-utils";
let wrapper: VueWrapper<any>;
describe("ColorPicker cmp", () => {
  beforeAll(() => {
    wrapper = mount(ColorPicker, {
      props: {
        value: "#000000",
      },
    });
  });
  it("should  render correct interface", () => {
    expect(wrapper.find("input").exists()).toBeTruthy();
    const input = wrapper.get("input").element;
    expect(input.type).toBe("color");
    expect(input.value).toBe("#000000");

    expect(wrapper.findAll(".picked-color-list li").length).toBe(
      defaultColors.length
    );
    const firstItem = wrapper.get(".picked-color-list li:first-child div")
      .element as HTMLElement;
    expect("#" + rgbHex(firstItem.style.backgroundColor)).toBe(
      defaultColors[0]
    );

    const lastItem = wrapper.get(".picked-color-list li:last-child div")
      .element as HTMLElement;
    expect(lastItem.classList.contains("transparent-back")).toBeTruthy();
  });
  it("should send the event", () => {
    const blackHex = "#000000";
    const input = wrapper.get("input");
    input.setValue(blackHex);
    expect(wrapper.emitted()).toHaveProperty("change");
    const events = wrapper.emitted("change");
    expect(events?.[0]).toEqual([blackHex]);
  });
  it("send correct when clk", () => {
    const firstItem = wrapper.get(".picked-color-list li:first-child div");
    firstItem.trigger("click");
    const events = wrapper.emitted("change");
    console.log("events", events);
    expect(events?.[1]).toEqual([defaultColors[0]]);
  });
});
