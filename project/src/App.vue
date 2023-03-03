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
      console.log(`APP res`, res);
      if (res.status == "fail") {
        this.$message.error(res.msg);
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.setItem("loginCredentials", 0);
        return;
      }
      this.$store.commit("setLoginCredentials", {
        status: true,
        id: res.data.user.id,
        username: res.data.user.username,
        avatar: res.data.user.avatar,
        email: res.data.user.email,
        usernameUpdateTime: res.data.user.username_updatetime,
        loginTime: new Date(),
        credits: res.data.user.credits,
      });
      console.log(
        `APP this.$store.state.loginCredentials`,
        this.$store.state.loginCredentials
      );
    },
    async sendVisitor() {
      let visitorId = localStorage.getItem("visitorId");
      if (!this.$store.state.loginCredentials.status) {
        if (!visitorId) {
          if (!this.$store.state.loginCredentials.status) {
            this.setVisitorId();
          }
        }
        let date = new Date();
        date.setTime(new Date(parseInt(visitorId.split("-")[1])));
        let is_same_day = this.isSameDay(new Date(), date);
        if (!is_same_day) {
          this.setVisitorId();
          await this.axios.post(
            `${this.baseUrl}/visitor/send`,
            {
              date: new Date(),
              visitor_type: "visitor",
              visitor_id: localStorage.getItem("visitorId"),
            },
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );
        }
      } else {
        await this.axios.post(
          `${this.baseUrl}/visitor/send`,
          {
            date: new Date(),
            visitor_type: "user",
            user_id: this.$store.state.loginCredentials.id,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
      }
    },
    isSameDay(dateObj1, dateObj2) {
      let year1 = dateObj1.getYear(),
        month1 = dateObj1.getMonth(),
        date1 = dateObj1.getDate();
      let year2 = dateObj2.getYear(),
        month2 = dateObj2.getMonth(),
        date2 = dateObj2.getDate();
      return year1 == year2 && month1 == month2 && date1 == date2;
    },
    setVisitorId() {
      let visitorId =
        (Math.random() * 10000).toString(16).split(".")[1] +
        "-" +
        new Date().getTime();
      localStorage.setItem("visitorId", visitorId);
    },
  },
  created() {
    this.checkLogin();
  },
  watch: {
    $route() {
      console.log(`route change`);
      this.sendVisitor();
    },
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
