import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "index",
    },
    {
      path: "/index",
      name: "index",
      component: () => import("./views/Index/index.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/Login/Login.vue"),
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("./views/Login/Signup.vue"),
    },
    {
      path: "/usercenter",
      name: "usercenter",
      component: () => import("./views/UserCenter/Usercenter.vue"),
    },
    {
      path: "/detail",
      name: "detail",
      component: () => import("./views/Detail/detail.vue"),
      children: [
        {
          path: "*",
          component: () => import("./views/Detail/detail.vue"),
        },
      ],
    },
    {
      path: "/search",
      name: "search",
      component: () => import("./views/Search/Search.vue")
    },
    {
      path: "/message",
      name: "message",
      component: () => import("./views/Message/message.vue")
    }
  ],
});
