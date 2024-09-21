import {
  VueWrapper,
  flushPromises,
  mount,
  shallowMount,
} from "@vue/test-utils";
import HelloWorld from "../../src/components/HelloWord.vue";
import Hello from "@/components/Hello.vue";
import axios from "axios";
jest.mock("axios");
const mockAxios = axios as jest.Mocked<typeof axios>;
const msg = "new message";
let wrapper: VueWrapper<any>;
/**一个describe实例从上的it到下的it */
describe("HelloWorld.vue", () => {
  /** 只运行一次 */
  beforeAll(() => {
    wrapper = mount(HelloWorld, {
      props: { msg },
    });
  });
  afterEach(() => {
    mockAxios.get.mockReset(); //重制 避免不同的it互相影响
  });
  it("renders props.msg when passed", () => {
    console.log("ele", wrapper.html());
    console.log("ele3", wrapper.get("h1").text()); //和find一样 但是没找到h1会中断
    console.log("ele3", wrapper.findComponent(Hello).props()); //和find一样 但是没找到h1会中断
  });
  it("should update the count when clicking the button", async () => {
    wrapper = shallowMount(HelloWorld, {
      props: { msg },
    });
    await wrapper.get("button").trigger("click"); // 触发click事件 注意异步 必须await 等界面更新
    expect(wrapper.get("button").text()).toBe("2");
  });
  it("should add todo when clicking the button", async () => {
    const content = "buy milk";
    wrapper = shallowMount(HelloWorld, {
      props: { msg },
    });
    await wrapper.get("input").setValue(content);
    expect(wrapper.get("input").element.value).toBe(content);
    await wrapper.get(".addTodo").trigger("click");
    expect(wrapper.findAll("li")).toHaveLength(1);
    expect(wrapper.get("li").text()).toBe(content);
    expect(wrapper.emitted()).toHaveProperty("send");
    const events = wrapper.emitted("send");
    if (events) {
      expect(events[0]).toEqual([content]); //数组对象用equal
    }
  });
  it.only("should add todo when clicking the button", async () => {
    wrapper = shallowMount(HelloWorld, {
      props: { msg },
    });
    mockAxios.get.mockResolvedValueOnce({ data: { username: "mengwan" } });
    await wrapper.get(".loadUser").trigger("click");
    expect(mockAxios.get).toHaveBeenCalled();
    expect(wrapper.find(".loading").exists()).toBeTruthy();
    await flushPromises(); //让所有的promise执行完毕 这时候请求结束 页面刷新完毕
    expect(wrapper.find(".loading").exists()).toBeFalsy();
    expect(wrapper.get(".userName").text()).toBe("mengwan");
  });
});
