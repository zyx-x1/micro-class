<template>
  <div id="app">
    <div id="nav">
      <Nav />
    </div>
    <router-view />
  </div>
</template>
<script>
import Nav from "./components/nav/nav.vue";
export default {
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
    };
  },
  components: {
    Nav,
  },
  methods: {
    //校验登录状态
    async checkLogin() {
      const token = localStorage.getItem("token");
      if (!token) return;
      let res = await this.axios.get(`${this.baseUrl}/login/token/check`, {
        params: {
          token,
        },
      });
      if (res.status == "fail") {
        this.$message.error(res.msg);
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.setItem("loginCredentials", 0);
        return;
      }
      console.log("res.data ->", res.data);
      this.$store.commit("setLoginCredentials", {
        status: true,
        username: res.data.user.username,
        avatar: res.data.user.avatar,
        email: res.data.user.email,
        usernameUpdateTime: res.data.user.username_updatetime,
        loginTime: new Date(),
      });
    },
  },
  created() {
    console.log("执行checkToken");
    this.checkLogin();
  },
};
</script>
<style lang="less">
* {
  margin: 0;
}

#app {
  font-family: "黑体", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  .el-input__suffix {
    height: 60px !important;
  }
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
