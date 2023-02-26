<template>
  <div id="forget">
    <canvas id="cvs" ref="cvs"></canvas>
    <div id="forget-container">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
        v-if="!isCodeTrue"
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
        <el-form-item>
          <el-button type="primary" @click="submitCode(ruleForm)"
            >确定</el-button
          >
          <section class="forget-else" v-show="!$store.state.loginCredentials.status">
            <span class="forget-forget link" @click="toLogin()">登录</span>
            <span class="link" @click="toRegister()">注册</span>
          </section>
        </el-form-item>
      </el-form>
      <el-form
        :model="passRuleForm"
        :rules="passRules"
        class="demo-ruleForm"
        v-else
      >
        <el-form-item prop="pass">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="passRuleForm.pass"
            show-password
            clearable
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input
            type="password"
            placeholder="请再次输入密码"
            v-model="passRuleForm.checkPass"
            show-password
            clearable
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item
          ><el-button type="primary" @click="submitReset(passRuleForm)"
            >确定</el-button
          >
          <section class="forget-else" v-show="!$store.state.loginCredentials.status">
            <span class="forget-forget link" @click="toLogin()">登录</span>
            <span class="link" @click="toRegister()">注册</span>
          </section></el-form-item
        >
      </el-form>
    </div>
  </div>
</template>
  
  <script>
export default {
  data() {
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
          callback(new Error("请输入正确的密码格式（6-16位大小写字母或数字）"));
        }
      }
    };
    const validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        if (this.ruleForm.code.length === 4) {
          callback();
        } else {
          callback(new Error("验证码格式错误"));
        }
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passRuleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      baseUrl: this.$store.state.baseUrl,
      ruleForm: {
        email: "",
      },
      passRuleForm: {
        pass: "",
        checkPass: "",
      },
      email_return: "",
      sendcode_text: "发送验证码",
      timer: null,
      count: 0,
      show: true,
      codeshow: false,
      isCodeTrue: false,
      rules: {
        email: [
          {
            required: true,
            validator: validateEmail,
            trigger: "change",
          },
        ],
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
      },
      passRules: {
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
        `${this.baseUrl}/reset/email?email=${this.ruleForm.email}`
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
      this.email_return = res.data.code;
    },
    submitCode(obj) {
      if (/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(obj.email)) {
        if (obj.code == this.email_return) {
          this.isCodeTrue = true;
        } else {
          this.$message.error("验证码错误！");
        }
      } else {
        this.$message.error("邮箱格式错误！");
      }
    },
    async submitReset(obj) {
      if (!obj.pass) {
        this.$message.error("请输入新密码！");
        return;
      }
      if (!obj.checkPass) {
        this.$message.error("请输入确认密码！");
        return;
      }
      if (obj.pass !== obj.checkPass) {
        this.$message.error("新密码与确认密码不一致！");
        return;
      }
      let result = await this.axios.get(`${this.baseUrl}/forget/submit`, {
        params: {
          email: this.ruleForm.email,
          password: obj.pass,
        },
      });
      if (result.data.status == "fail") {
        this.$message.error(result.data.msg);
        return;
      }
      this.$message({
        type: "success",
        message: "密码重置成功，即将跳转到登录页面...",
      });
      let _this = this;
      let timer = setTimeout(() => {
        _this.$router.push("/login");
      }, 1000);
    },
    toRegister() {
      this.$router.push("/signup");
      setTimeout(() => {
        location.reload();
      }, 10);
    },
    toLogin() {
      this.$router.push("/login");
    },
  },
  mounted() {
    this.$store.commit("starAnimeBackground", this.$refs.cvs);
  },
};
</script>
  
  <style lang="less">
#forget {
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

  #forget-container {
    width: 50vw;
    height: 35vh;
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

  .forget-else {
    margin: 10px auto 0;
    width: 100%;
    height: 30px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
  