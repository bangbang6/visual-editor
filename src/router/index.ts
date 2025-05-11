import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Editor from "../views/Editor.vue";
import TemplateDetail from "../views/TemplateDetail.vue";
import Index from "../views/Index.vue";
import Login from "../views/Login.vue";
import store from "@/store";
import axios from "axios";
import { message } from "ant-design-vue";
import Mywork from "@/views/Mywork.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "index",
      component: Index,
      children: [
        {
          path: "",
          name: "home",
          component: Home,
          meta: { title: "欢迎来到木刻乐高" },
        },
        {
          path: "template/:id",
          name: "template",
          component: TemplateDetail,
          meta: { title: "模板信息" },
        },
        {
          path: "mywork",
          name: "MyWork",
          component: Mywork,
          meta: { requiredLogin: true, title: "我的设计列表" },
        },
      ],
    },
    {
      path: "/editor/:id",
      name: "editor",
      component: Editor,
      meta: {
        requiredLogin: true,
        title: "编辑我的设计",
      },
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: {
        redirectAlreadyLogin: true,
        title: "登录到慕课乐高",
        disableLoading: true,
        meta: {
          redirectAlreadyLogin: true,
          title: "登陆到木刻乐高",
        },
      },
    },
  ],
});
router.beforeEach(async (to, from) => {
  const { user } = store.state;
  const { isLogin, token } = user;
  const { redirectAlreadyLogin, requiredLogin, title } = to.meta;
  if (title) {
    document.title = title as any;
  }
  if (!isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      try {
        await store.dispatch("fetchCurrentUser");
        if (redirectAlreadyLogin) {
          return "/";
        }
      } catch (err) {
        message.error("登陆状态过期", 2);
        store.commit("logout");
        return "/login";
      }
    } else {
      if (requiredLogin) {
        return "/login";
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      return "/";
    }
  }
});
export default router;
