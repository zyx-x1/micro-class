<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isUserSub: false,
    };
  },
  methods: {
    async checkToken() {
      if (localStorage.getItem("token")) {
        let res = await this.axios.get("/admin/token/check", {
          params: {
            token: localStorage.getItem("token"),
          },
        });
        if (res.data.status == "success" && res.data.user.length != 0) {
          this.$store.state.isLogin = true;
          this.$store.state.userInfo.head = res.data.user[0].head;
          this.$store.state.userInfo.user = res.data.user[0].username;
          this.$router.push("/admin");
        } else {
          this.$message.error(res.data.msg);
          this.$store.state.isLogin = false;
          localStorage.removeItem("token");
          setTimeout(() => {
            this.$router.push("/login");
          }, 1000);
        }
      } else if (this.$route.fullPath.indexOf("admin") > -1) {
        this.$message.error("请先登录！");
        this.$router.push("/login");
      }
    },
    adminExit() {
      localStorage.removeItem("token");
      this.$store.state.userInfo.head = "";
      this.$store.state.userInfo.user = "";
      this.$router.push("/login");
    },
  },
  mounted() {
    // this.checkToken();
  },
  watch: {
    "$route.fullPath": async function (to) {
      console.log(this.$route.fullPath.indexOf("admin") > -1);
      if (!localStorage.getItem("token")) {
        this.$message.error("请先登录！");
        this.$router.push("/login");
      } else {

          if (to == "/login" && this.$store.state.loginCredentials.status) {
            this.$message({ type: "warning", message: "已登录" });
            this.$router.push("/admin");
          } else {
            let res = await this.axios.get(
              `${this.$store.state.baseUrl}/admin/token/check`,
              {
                params: {
                  token: localStorage.getItem("token"),
                },
              }
            );
            console.log(res.data);
            if (res.data.status == "tokenFail") {
              this.$message.error(res.data.msg);
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              localStorage.removeItem("loginCredentials");
              setTimeout(() => {
                this.$router.push("/login");
              }, 1000);
            } else {
              res.data.user.status = true;
              this.$store.commit("setLoginCredentials", res.data.user);
              console.log(this.$store.state.loginCredentials);
              console.log(to == "/login");
              if (to == "/login") {
                this.$router.push("/admin");
              }
            }
          }
        
      }
    },
  },
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "黑体";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: rgb(240, 238, 238);
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
p,
span,
h1,
h2,
h3,
h4,
h5,
h6,
a {
  user-select: none;
}
header {
  width: 100%;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.8);
  // overflow: hidden;
  section {
    float: right;
    margin-right: 5%;
    display: flex;
    cursor: default;
    margin-top: 5px;
    padding: 0 10px;
    img {
      width: 30px;
      height: 30px;
    }
    div {
      line-height: 30px;
      margin-left: 10px;
      font-weight: bold;
    }
    .dropdown {
      // background-image: url("../static/icons/dropdown.png");
      background-size: cover;
      width: 10px;
      height: 10px;
      display: inline-block;
      line-height: 30px;
      transform: translate(70%, 120%);
      transition: 0.5s;
    }
    // &:hover {
    //   background-color: rgba(0, 0, 0, 0.1);
    // }
    // &:hover .dropdown {
    //   transform: translate(60%, 60%) rotateX(180deg);
    // }
  }
  .top-user-options {
    position: absolute;
    right: 5%;
    top: 40px;
    list-style: none;
    width: 200px;
    padding: 20px 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 100;
    li {
      height: 40px;
      line-height: 40px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.3);
        cursor: default;
      }
    }
  }
}
</style>