<template>
  <div id="userdata">
    <div class="userdata-item">
      <h3>用户名</h3>
      <el-input v-model="newName" clearable></el-input>
      <span
        style="
          color: rgba(0, 0, 0, 0.5);
          font-size: 12px;
          margin-left: 5px;
          cursor: default;
          user-select: none;
        "
        >（注：七天内仅限修改一次）</span
      >
      <button
        class="submit-change"
        @click="submitUsernameChange()"
        style="
          padding: 5px 30px;
          margin-left: 50px;
          cursor: pointer;
          border-radius: 13px;
        "
      >
        保存
      </button>
    </div>
    <div class="userdata-item">
      <h3>{{ isCn ? "邮箱" : "Email address" }}</h3>
      <span
        style="
          color: rgba(0, 0, 0, 1);
          font-size: 16px;
          margin-left: 18px;
          cursor: default;
          user-select: none;
        "
        >{{ email }}</span
      >
    </div>
    <!-- <div class="userdata-item">
      <h3>
        {{ isCn ? "重置密码" : "Reset password" }}
      </h3>
      <router-link to="/login/forget" style="color: #000">{{
        isCn ? "点此重置密码" : "Click here to reset password"
      }}</router-link>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    let username = this.$store.state.loginCredentials.username;
    return {
      baseUrl: this.$store.state.baseUrl,
      isCn: true,
      username,
      avatar: this.$store.state.loginCredentials.avatar,
      email: this.$store.state.loginCredentials.email,
      newName: username,
    };
  },
  methods: {
    async submitUsernameChange() {
      let _this = this;
      if (this.username !== this.newName) {
        let changeFlag;
        if (
          Date.parse(new Date()) -
            Date.parse(this.$store.state.loginCredentials.usernameUpdateTime) >
          604800000
        ) {
          changeFlag = true;
        } else {
          changeFlag = false;
        }
        if (changeFlag) {
          let name = this.newName;
          console.log("this.newName ->", this.newName);
          console.log(/^[a-zA-Z0-9]{4,16}$/.test(name));
          console.log("name ->", name);
          //   if (/^[a-zA-Z0-9]{4,16}$/.test(name)) {
          if (/^[a-zA-Z0-9]{4,16}$/.test("Wzq4")) {
            this.$confirm("此操作将修改用户名, 是否继续?", "提示", {
              confirmButtonText: "确认修改",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(async () => {
                let result = await this.axios.get(
                  `${this.baseUrl}/user/username/update`,
                  {
                    params: {
                      email: this.email,
                      newName: this.newName,
                      username_updatetime: new Date(),
                    },
                  }
                );
                if (result.data.status === "success") {
                  //修改成功
                  this.$message({
                    type: "success",
                    message: "修改成功",
                  });
                  localStorage.setItem("username", this.newName);
                  _this.$store.state.loginCredentials.username = this.newName;
                  _this.$store.state.loginCredentials.usernameUpdateTime =
                    new Date();
                }
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消修改",
                });
              });
          } else {
            this.$message({
              message: "请检查用户名格式，仅限4-16位字母或数字",
              type: "error",
            });
          }
        } else {
          this.$message({
            message: "修改失败，距上次修改不足七天！",
            type: "error",
          });
          this.newName = this.username;
        }
      } else {
        this.$message({
          message: "未进行任何修改",
          type: "error",
        });
      }
    },
  },
  mounted() {
    console.log(this.$store.state.loginCredentials);
  },
};
</script>

<style lang="less" scoped>
#userdata {
  width: 100%;
  .userdata-item {
    // margin-top: 10px;
    width: 100%;
    min-height: 100px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);
    // border-bottom: 1px solid #000;
    // box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.1);
    h3 {
      color: #000;
      height: 40px;
      line-height: 40px;
      padding: 0 50px;
    }
    .submit-change {
      background-color: #fff;
      border: none;
      color: rgba(0, 0, 0, 0.5);
      border: 1px solid #fff;
      transition: 0.5s;
      &:hover {
        color: #1296db;
        border-color: #1296db;
      }
    }
  }
}

.el-input {
  width: 300px;
}
</style>
