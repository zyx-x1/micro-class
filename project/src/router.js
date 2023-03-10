import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

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
  ],
});
