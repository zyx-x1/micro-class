<template>
  <div id="root">
    <canvas id="cvs" ref="cvs"></canvas>
    <el-dialog
      title="提示"
      :visible.sync="registerDialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <span style="font-size: 18px">请将注册表单填写完整！</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="registerDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <div class="register-container">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item prop="user1">
          <el-input
            type="text"
            placeholder="用户名"
            required="required"
            v-model="ruleForm.user1"
            clearable
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            class="phone-input"
            placeholder="邮箱"
            v-model="ruleForm.email"
            prefix-icon="el-icon-reading"
            clearable
          ></el-input>
        </el-form-item>
        <transition name="fade">
          <el-form-item prop="code" class="phone" v-show="codeshow">
            <el-input
              v-model="ruleForm.code"
              placeholder="验证码"
              :minlength="6"
              :maxlength="6"
              class="r-code"
              clearable
            ></el-input>
            <el-button
              type="primary"
              @click="getCode()"
              class="code-btn"
              :disabled="!show"
            >
              <span v-show="show">{{ sendcode_text }}</span>
              <span v-show="!show" class="count">{{ count }} s</span>
            </el-button>
          </el-form-item>
        </transition>

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
        <el-form-item prop="checkPass">
          <el-input
            type="password"
            placeholder="请再次输入密码"
            v-model="ruleForm.checkPass"
            show-password
            clearable
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn-form">
          <el-button
            type="primary"
            @click="submitForm(ruleForm)"
            class="r-submit"
            >注册</el-button
          >
          <transition name="fade">
            <div
              v-text="register_tips"
              :class="[
                isRegisterSuccess
                  ? 'register_tips_success'
                  : 'register_tips_err',
              ]"
            ></div>
          </transition>
          <span class="link" @click="toLogin()">已有账号？点击登录</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    const validateUser1 = async (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        const reg = /^[a-zA-Z0-9]{4,16}$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(
            new Error("请输入正确的用户名格式（4-16位大小写字母或数字）")
          );
        }
      }
    };
    const validateEmail = async (rule, value, callback) => {
      if (value === "") {
        callback(new Error("邮箱不能为空"));
      } else {
        const reg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
        if (reg.test(value)) {
          this.codeshow = true;
          callback();
        } else {
          this.codeshow = false;
          callback(new Error("请输入正确的邮箱 "));
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
          callback(new Error("请输入正确的密码格式（6-16位大小写字母或数字）"));
        }
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        if (this.ruleForm.code.length === 6) {
          callback();
        } else {
          callback(new Error("验证码格式错误"));
        }
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      baseUrl: this.$store.state.baseUrl,
      registerDialogVisible: false,
      activeIndex: "2",
      loginForm: {
        mobile: "",
        code: "",
        zheCode: "",
      },
      show: true,
      count: "",
      email_return: "",
      sendcode_text: "发送验证码",
      timer: null,
      codeshow: false,
      ruleForm: {
        user1: "",
        email: "",
        pass: "",
        checkPass: "",
        code: "",
      },
      rules: {
        code: [
          {
            required: true,
            validator: validateCode,
            trigger: "change",
          },
          {
            min: 6,
            max: 6,
            message: "长度为6",
            trigger: "change",
          },
        ],
        user1: [
          {
            required: true,
            validator: validateUser1,
            trigger: "change",
          },
        ],
        email: [
          {
            required: true,
            validator: validateEmail,
            trigger: "change",
          },
        ],
        // 密码
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
        // 校验密码
        checkPass: [
          {
            required: true,
            validator: validatePass2,
            trigger: "change",
          },
          {
            min: 6,
            message: "长度在不少于6个字符",
            trigger: "change",
          },
        ],
      },
      tomain_countdown: 0,
      register_tips: "",
      isRegisterSuccess: false,
    };
  },
  methods: {
    async getCode() {
      this.show = false;
      this.count = 60;
      let timer = setInterval(() => {
        if (this.count > 0) {
          this.count--;
        } else {
          this.sendcode_text = "重新发送";
          this.show = true;
        }
      }, 1000);
      let res = await this.axios.get(
        `${this.baseUrl}/register/mail/getcode?email=${this.ruleForm.email}`
      );
      res.data.status == "success"
        ? this.$message({
            type: "success",
            message: "验证码已发送至您的邮箱",
          })
        : this.$message.error(res.data.msg);
      if (res.data.status == "fail") {
        this.codeshow = false;
        this.sendcode_text = "发送验证码";
        this.show = true;
      }
      this.email_return = res;
    },
    async submitForm(obj) {
      if (/^[a-zA-Z0-9]{4,16}$/.test(obj.user1)) {
        if (/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(obj.email)) {
          console.log(this.email_return);
          if (this.email_return.data.code == obj.code) {
            if (/^[a-zA-Z0-9]{6,16}$/.test(obj.pass)) {
              if (obj.pass == obj.checkPass) {
                let res = await this.axios.get(`${this.baseUrl}/register`, {
                  params: {
                    username: obj.user1,
                    email: obj.email,
                    password: obj.pass,
                    signuptime: new Date(),
                    avatar: "",
                  },
                });
                if (res.data.status == "fail") {
                  this.isRegisterSuccess = false;
                  this.register_tips = res.data.msg;
                } else {
                  this.tomain_countdown = 3;
                  this.isRegisterSuccess = true;
                  this.register_tips = `注册成功，将在${this.tomain_countdown}秒后跳转到登录页`;
                  setInterval(() => {
                    this.tomain_countdown = this.tomain_countdown - 1;
                    this.register_tips = `注册成功，将在${this.tomain_countdown}秒后跳转到登录页`;
                    if (this.tomain_countdown === 0) {
                      this.$router.push("/login");
                    }
                  }, 1000);
                }
              } else {
                this.formLoseItem();
              }
            } else {
              this.formLoseItem();
            }
          } else {
            this.formLoseItem();
          }
        } else {
          this.formLoseItem();
        }
      } else {
        this.formLoseItem();
      }
    },
    toLogin() {
      this.$router.push("/login");
      //   location.reload();
    },
    formLoseItem() {
      this.registerDialogVisible = true;
    },
    handleClose(done) {
      done();
    },
  },
  mounted() {
    this.$store.commit("starAnimeBackground", this.$refs.cvs);
  },
};
</script>
<style lang="less" scoped>
#root {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  #cvs {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  .register-container {
    width: 50vw;
    height: 80vh;
    margin-top: 0px;
    border-radius: 5px;
    box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.5);
    background-color: #fff;
    .el-form {
      transform: translateY(20%);
      height: 60vh;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      .el-form-item {
        width: 80%;
      }
    }
    .r-code {
      width: 80%;
    }
    .r-code + button {
      width: 18%;
      margin-left: 10px;
    }
    .r-submit {
      width: 100%;
    }
    .link {
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .fade-enter-active {
      transition: all 1s ease;
    }
    .fade-leave-active {
      transition: all 1s cubic-bezier(1, 0.5, 0.8, 1);
    }
    .fade-enter,
    .fade-leave-to {
      opacity: 0;
    }
  }
}
.register_tips_err {
  color: red;
}
.register_tips_success {
  color: rgb(0, 180, 90);
}
</style>
