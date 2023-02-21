<template>
  <div id="nav">
    <div class="nav">
      <ul class="nav-items">
        <el-input
          v-model="searchText"
          placeholder="请输入关键字"
          clearable
          size="small"
          prefix-icon="el-icon-search"
          style="width: 200px"
          @keyup.enter.native="search"
        ></el-input>
        <li class="item-common">
          <router-link to="/" @mouseover="showUserOptions = true">
            <i class="el-icon-house"></i>
            首页
          </router-link>
        </li>
        <!-- 消息 -->
        <li class="item-common">
          <router-link to="/message">
            <i
              class="el-icon-message"
              style="position: relative; top: 1.5px"
            ></i>
            消息
            <el-badge
              :value="messageCount"
              class="item"
              v-show="loginCredentials"
              :max="99"
              style="position: relative; left: -10px; top: -5px"
            ></el-badge>
          </router-link>
        </li>
        <!-- 收藏 -->
        <li class="item-common">
          <router-link to="/usercenter?view=my_collection">
            <i
              class="el-icon-collection-tag"
              style="position: relative; top: 1.5px"
            ></i>
            收藏
          </router-link>
        </li>
        <!-- 未登录时显示 登录/注册 按钮；登录后显示个人头像，鼠标移入展示部分个人简介，点击后进入个人中心 -->
        <li
          v-if="this.loginCredentials"
          class="avatar"
          @mouseover="showUserOptions = true"
          @mouseleave="showUserOptions = false"
        >
          <router-link
            to="/usercenter"
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              height: 50px;
            "
            ><img
              :src="this.avatar"
              alt=""
              width="40px"
              style="border-radius: 50%"
          /></router-link>
          <transition name="fade">
            <ul class="user-items" v-show="showUserOptions">
              <li @click="$router.push('/usercenter')">个人中心</li>
              <li @click="logOut()">退出登录</li>
            </ul>
          </transition>
        </li>
        <li v-else class="item-common">
          <router-link to="/login">登录/注册</router-link>
        </li>
        <!-- 投稿 -->
        <li class="item-common">
          <router-link to="/upload">
            <i class="el-icon-upload2"></i>
            投稿
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      loginCredentials: this.$store.state.loginCredentials.status,
      avatar: this.$store.state.loginCredentials.avatar,
      showUserOptions: false,
      searchText: "",
      messageCount: 0,
    };
  },
  methods: {
    checkStateLoginCredentials() {
      let timer = setInterval(() => {
        this.avatar = this.$store.state.loginCredentials.avatar;
        this.loginCredentials = this.$store.state.loginCredentials.status;
        if (!!this.avatar) clearInterval(timer);
      }, 50);
    },
    logOut() {
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      this.$store.commit("setLoginCredentials", {
        status: false,
        username: "",
        loginTime: null,
        email: "",
        usernameUpdateTime: null,
      });
      this.loginCredentials = false;
      this.$message({
        type: "warn",
        message: "注销成功！",
      });
      this.$router.push("/");
      location.reload();
    },
    search() {
      this.$router.push(`/search?search_txt=${this.searchText}`);
      // location.reload();
    },
    async getMessageCount() {
      if (this.$store.state.loginCredentials.status) {
        let res = await this.axios.get(`${this.baseUrl}/message/count`, {
          params: {
            user: this.$store.state.loginCredentials.email,
          },
        });
        if (res.data.status == "success") {
          this.messageCount = res.data.total;
        }
      }
    },
  },
  mounted() {
    this.checkStateLoginCredentials();
    setTimeout(() => {
      this.getMessageCount();
    }, 50);
    const _this = this;
    const ws = new WebSocket("ws://localhost:8181");
    ws.onopen = function () {
      ws.onmessage = function (msg) {
        // msg = JSON.parse(msg);
        let data = JSON.parse(msg.data);
        console.log("ws message ->", msg);
        if (data.msg == "message update") {
          _this.getMessageCount();
        }
      };
    };
  },
};
</script>

<style lang="less">
#nav {
  height: 50px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  .nav {
    width: 100vw;
    height: 50px;

    ul {
      list-style-type: none;
    }
    ul.nav-items {
      height: 80px;
      width: 70vw;
      float: right;
      // background-color: #c2c4c7;
      background-image: linear-gradient(rgb(144, 187, 235) 30%, transparent);
      display: flex;
      justify-content: space-around;
      border-bottom-left-radius: 50px;
      line-height: 60px;
      user-select: none;

      li.item-common {
        cursor: pointer;
        // margin: 0 20px;
        a {
          padding: 18px 30px;
          transition: 0.5s;
          &:hover {
            background-color: rgba(0, 0, 0, 0.1);
          }
        }
      }
      li.avatar a {
        padding: 0 20px;
        transition: 0.5s;
        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
    }
    ul.user-items {
      background-color: rgba(0, 0, 0, 0.3);
      width: 100px;
      padding: 0;
      border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;
      overflow: hidden;
      z-index: 100;
      li {
        color: #fff;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        cursor: pointer;
        transition: 0.5s;
        &:hover {
          background-color: rgba(0, 0, 0, 0.3);
        }
        a {
          width: 60px;
          padding: 0 20px;
          text-align: center;
        }
      }
    }
  }
  #nav {
    a {
      text-decoration: none;
    }
    a.router-link-exact-active {
      color: #2c3e50;
    }
  }
  .el-input__prefix {
    height: 40px !important;
    .el-input__icon el-icon-search {
      height: 40px !important;
    }
  }
}
</style>
