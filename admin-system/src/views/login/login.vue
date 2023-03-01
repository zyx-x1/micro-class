<template>
  <div id="login">
    <canvas id="cvs" ref="cvs"></canvas>
    <div id="login-container">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="email">
          <el-input
            class="phone-input"
            placeholder="邮箱"
            v-model="ruleForm.email"
            prefix-icon="el-icon-reading"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="ruleForm.pass"
            show-password
            clearable
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitLogin(ruleForm)"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "admin-login",
  data() {
    const validateEmail = async (rule, value, callback) => {
      if (value === "") {
        callback(new Error("邮箱不能为空"));
      } else {
        const reg = /^([a-z0-9_-]+)@([\da-z-]+)\.([a-z]{2,6})$/;
        if (reg.test(value)) {
          this.codeshow = true;
          callback();
        } else {
          this.codeshow = false;
          callback(new Error("请输入正确的邮箱"));
        }
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        const reg = /^[a-zA-Z0-9]{6,16}$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的密码格式"));
        }
      }
    };
    return {
      baseUrl: this.$store.state.baseUrl,
      ruleForm: {
        email: "",
        pass: "",
      },
      rules: {
        email: [
          {
            required: true,
            validator: validateEmail,
            trigger: "change",
          },
        ],
        pass: [
          {
            required: true,
            validator: validatePass,
            trigger: "change",
          },
          {
            min: 6,
            message: "长度在不少于6个字符",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    async submitLogin(obj) {
      if (/^([a-z0-9_-]+)@([\da-z-]+)\.([a-z]{2,6})$/.test(obj.email)) {
        if (/^[a-zA-Z0-9]{6,16}$/.test(obj.pass)) {
          let result = await this.axios.get(`${this.baseUrl}/admin/login`, {
            params: {
              email: obj.email,
              password: obj.pass,
              logintime: new Date(),
            },
          });
          if (result.data.status === "fail") {
            this.$message.error(result.data.msg);
          } else {
            localStorage.setItem("token", result.data.token);
            localStorage.setItem("username", result.data.resData.username);
            localStorage.setItem("loginCredentials", 1);
            this.$store.commit("setLoginCredentials", {
              status: true,
              id: result.data.resData.id,
              username: result.data.resData.username,
              avatar: result.data.resData.avatar,
              email: result.data.resData.email,
              usernameUpdateTime: result.data.resData.username_updatetime,
              loginTime: new Date(),
            });
            this.$message({
              message: "登录成功！",
              type: "success",
            });

            setTimeout(() => {
              this.$router.push("/admin");
              location.reload();
            }, 1500);
          }
        }
      }
    },
    logout(){
      
    }
  },
  mounted() {
    this.$store.commit("starAnimeBackground", this.$refs.cvs);
  },
};
</script>

<style lang="less">
#login {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .el-form {
    width: 80%;
  }

  #cvs {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  #login-container {
    width: 50vw;
    height: 60vh;
    margin-top: -50px;
    border-radius: 5px;
    box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.5);
    background-color: #fff;

    form {
      height: 100%;
      width: 80%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      .el-form-item {
        width: 100%;
      }
    }
    .el-input {
      width: 100%;
      margin-top: 50px;
    }

    .el-button {
      margin-top: 50px;
      padding: 12px 40px;
      width: 100%;

      span {
        letter-spacing: 5px;
        text-align: center;
        font-size: 16px;
        display: inline-block;
      }
    }

    .link {
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }

  .login-else {
    margin: 10px auto 0;
    width: 100%;
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
