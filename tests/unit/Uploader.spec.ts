import Uploader from "@/components/Upload.vue";
import flushPromises from "flush-promises";
import axios from "axios";
import { VueWrapper, mount } from "@vue/test-utils";
let wrapper: VueWrapper<any>;
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const testFile = new File(["xyz"], "test.png", { type: "image/png" });
describe("Uploader Component", () => {
  beforeAll(() => {
    wrapper = mount(Uploader, {
      props: { action: "test.url" },
    });
  });
  it("basic layout before upload", () => {
    expect(wrapper.find("button").exists()).toBeTruthy();
    expect(wrapper.get("input").isVisible()).toBeFalsy();
  });
  it.only("upload proecss works file", async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: "success" });
    const fileInput = wrapper.get("input").element as HTMLElement;
    const files = [testFile] as any;
    Object.defineProperty(fileInput, "files", {
      value: files,
      writable: false,
    });
    await wrapper.get("input").trigger("change");
    // expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    expect(wrapper.get("button").attributes()).toHaveProperty("disabled");
    expect(wrapper.findAll("li").length).toBe(1);
    const firstItem = wrapper.get("li:first-child");
    await flushPromises();
    console.log("firstItem.classes()", firstItem.classes());
    expect(firstItem.classes()).toContain("upload-success");
    expect(firstItem.get(".filename").text()).toBe(testFile.name);
  });
  it("upload proecss works error", async () => {
    // mockedAxios.get.mockRejectedValueOnce({ status: "error" });
    await wrapper.get("input").trigger("change");
    // expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    await flushPromises();

    expect(wrapper.findAll("li").length).toBe(2);
    const lastItem = wrapper.get("li:last-child");
    expect(lastItem.classes()).toContain("upload-error");
    await lastItem.get(".delete-icon").trigger("click");
    expect(wrapper.findAll("li").length).toBe(1);
  });
});
