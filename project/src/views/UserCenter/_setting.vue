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
          border-radius: 8px;
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
    <div class="userdata-item">
      <h3>
        {{ isCn ? "重置密码" : "Reset password" }}
      </h3>
      <router-link to="/forget" style="color: #000">{{
        isCn ? "点此重置密码" : "Click here to reset password"
      }}</router-link>
    </div>
    <div class="userdata-item">
      <h3>更换头像</h3>
      <div class="avatar">
        <div class="old">
          <img :src="$store.state.loginCredentials.avatar" alt="" srcset="" />
        </div>
        <el-divider direction="vertical"></el-divider>
        <div class="new">
          <input
            type="file"
            class="new-avatar"
            :style="{
              '--avatar': !!newAvatar ? 'url(' + newAvatar + ')' : 'url()',
            }"
            @change="uploadNewAvatar($event)"
            name=""
            id=""
            accept="*"
          />
        </div>
        <button
          class="submit-change"
          @click="saveAvatarChange()"
          style="
            padding: 5px 30px;
            height: 30px;
            margin-left: 50px;
            cursor: pointer;
            border-radius: 8px;
          "
        >
          保存
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import uploadIcon from "../../../static/images/upload.png";
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
      newAvatar: null,
      uploadIcon: uploadIcon,
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
    uploadNewAvatar(e) {
      let _this = this;
      let file = e.target.files[0];
      let fileSize = file.size;
      let fileType = file.type;
      if (fileType.split("/")[0] !== "image") {
        this.$message.error("格式异常！请上传正确格式的图片!");
        return;
      }
      if (fileSize > 1024 * 1024 * 10) {
        this.$message.error("图片过大！请勿上传10MB以上的图片!");
        return;
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        _this.newAvatar = reader.result;
      };
    },
    async saveAvatarChange() {
      if (!this.newAvatar) {
        this.$message.error("未选择新头像！");
        return;
      }
      let formData = new FormData();
      formData.append("avatar", this.newAvatar);
      formData.append("userid", this.$store.state.loginCredentials.id);
      let res = await this.axios.post(
        `${this.baseUrl}/user/avatar/update`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (res.data.status == "success") {
        this.$message({
          type: "success",
          message: "头像更换成功！",
        });
        this.newAvatar = null;
        let newAvatar = res.data.data;
        let loginCredentials = this.$store.state.loginCredentials;
        loginCredentials.avatar = newAvatar;
        this.$store.commit("setLoginCredentials", loginCredentials);
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
    border-bottom: 1px solid rgba(144, 187, 235, 0.5);

    // border-bottom: 1px solid #000;
    // box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.1);
    h3 {
      color: #000;
      height: 40px;
      width: 100px;
      line-height: 40px;
      padding: 0 50px;
      text-align: left;
    }

    .submit-change {
      background-color: #fff;
      border: 1px solid rgba(0, 0, 0, 0.1);
      color: rgba(0, 0, 0, 0.5);
      transition: 0.5s;
      border-radius: 5px;

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
.avatar {
  display: flex;
  align-items: center;
  width: 100%;
  .old {
    width: 110px;
    height: 110px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
  }
  .el-divider {
    height: 80px;
  }
  .new {
    overflow: hidden;
    width: 110px;
    height: 110px;
    display: flex;
    justify-content: center;
    align-items: center;
    .new-avatar {
      width: 85px;
      height: 80px;
      float: left;
      position: relative;
      padding: 5px 0;
      color: #fff;
      margin-left: 20px;

      &::before {
        content: "";
        width: 90px;
        height: 80px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #f6f7f8;
      }

      &::after {
        content: "+";
        color: rgba(18, 150, 219, 0.5);
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #fff;
        border: 1px dashed rgba(18, 150, 219, 0.3);
        border-radius: 50%;
        background: var(--avatar);
        object-fit: cover;
        background-size: cover;
        transition: 0.5s;
        cursor: pointer;
      }

      &:hover::after {
        content: "选择图片";
        font-size: 14px;
        color: #000;
        filter: opacity(0.5);
      }
    }
  }
}
</style>
