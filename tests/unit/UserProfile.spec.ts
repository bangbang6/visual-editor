import { VueWrapper, mount } from "@vue/test-utils";
import UserProfile from "../../src/components/UserProfile.vue";
import { message } from "ant-design-vue";
import store from "@/store";
/** 模拟ant-design-vue */
jest.mock("ant-design-vue", () => ({
  message: {
    success: jest.fn(),
  },
}));
const mockRoutes: string[] = [];
jest.mock("vue-router", () => ({
  useRouter: () => ({
    push: (url: string) => mockRoutes.push(url), // 半真半假
  }),
}));
const mockComponent = {
  template: "<div><slot></slot></div>",
};
const mockComponent2 = {
  template: "<div><slot></slot><slot name='overlay'></slot></div>",
};
const globalComponents = {
  "a-button": mockComponent,
  "a-dropdown-button": mockComponent2,
  "router-link": mockComponent,
  "a-menu": mockComponent,
  "a-menu-item": mockComponent,
};
describe("UserProfile cmp", () => {
  let wrapper: VueWrapper<any>;
  beforeAll(() => {
    jest.useFakeTimers();

    wrapper = mount(UserProfile, {
      props: {
        user: {
          isLogin: false,
        },
      },
      global: {
        components: globalComponents,
        provide: {
          store, // 挂在store到wrapper的vue节点上
        },
      },
    });
  });
  it("should render", async () => {
    expect(wrapper.get("div").text()).toBe("登录");
    await wrapper.get("div").trigger("click");
    expect(message.success).toHaveBeenCalled();
    expect(store.state.user.userName).toBe("viking");
  });
  it("should render login is true", async () => {
    await wrapper.setProps({
      user: { isLogin: true, userName: "mengwan" },
    });
    console.log("aa", wrapper.html());
    expect(wrapper.get(".user-profile-component").html()).toContain("mengwan");
    expect(wrapper.find(".user-profile-dropdown").exists()).toBeTruthy();
  });
  it("should logout and router change", async () => {
    await wrapper.get(".user-profile-dropdown div").trigger("click");
    expect(store.state.user.isLogin).toBeFalsy();
    expect(message.success).toHaveBeenCalledTimes(1);
    jest.runAllTimers();
    expect(mockRoutes).toEqual(["/"]);
  });
  afterEach(() => {
    (message as jest.Mocked<typeof message>).success.mockReset();
  });
});
