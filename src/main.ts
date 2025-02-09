import { createApp } from "vue";
import App from "./App.vue";
import LegoComponents from "lego-mw-components";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import router from "./router/index";
import store from "./store/index";
import "lego-mw-components/dist/bundle.css";
console.log("LegoComponents", LegoComponents.install);
createApp(App)
  .use(LegoComponents)
  .use(Antd)
  .use(router)
  .use(store)
  .mount("#app");
