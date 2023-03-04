<template>
  <div id="container">
    <div class="menu" style="width: 300px; height: 99vh" v-show="isSidebarShow">
      <el-menu
        style="height: 100vh"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        @select="selectMenu"
      >
        <h3>后台管理</h3>
        <el-menu-item
          v-for="(item, index) in menuConfig"
          :key="index"
          :index="item.index.toString()"
          @click="$router.push('/' + item.router)"
        >
          <i :class="item.icon"></i>
          <span slot="title">{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div
      class="main"
      :style="{ width: isSidebarShow ? 'calc(100% - 300px)' : '100%' }"
    >
      <header>
        <div class="header-left">
          <i
            class="el-icon-s-fold"
            v-show="isSidebarShow"
            @click="isSidebarShow = !isSidebarShow"
            title="关闭侧边栏"
          ></i>
          <i
            class="el-icon-s-unfold"
            v-show="!isSidebarShow"
            @click="isSidebarShow = !isSidebarShow"
            title="打开侧边栏"
          ></i>
          <el-page-header
            @back="goBack"
            :content="menuConfig[menuActiveIndex].label"
          >
          </el-page-header>
        </div>
        <div class="header-right">
          <section
            class="user-info"
            @mouseover="showUserOptions = true"
            @mouseleave="showUserOptions = false"
          >
            <div class="avatar">
              <img
                :src="$store.state.loginCredentials.avatar"
                alt=""
                srcset=""
              />
            </div>
            <div style="line-height: 40px">
              {{ $store.state.loginCredentials.username }}
            </div>
            <transition name="fade">
              <ul class="user-items" v-show="showUserOptions">
                <li @click="logOut()">退出登录</li>
              </ul>
            </transition>
          </section>
        </div>
      </header>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isUserSub: false,
      isSidebarShow: true,
      showUserOptions: false,
      menuConfig: [
        {
          index: 0,
          label: "首页",
          icon: "",
          router: "admin",
        },
        {
          index: 1,
          label: "用户信息",
          icon: "",
          router: "user",
        },
        {
          index: 2,
          label: "视频审核",
          icon: "",
          router: "audit",
        },
        {
          index: 3,
          label: "附件下载管理",
          icon: "",
          router: "downloadrecord",
        },
        {
          index: 4,
          label: "网站资源配置",
          icon: "",
          router: "config",
        },
      ],
      menuActiveIndex: 1,
    };
  },
  methods: {
    goBack() {
      window.history.back();
    },
    selectMenu(val) {
      this.menuActiveIndex = val;
    },
    logOut() {
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      this.$store.commit("setLoginCredentials", {
        status: false,
        username: "",
        loginTime: null,
        email: "",
      });
      this.$message({
        type: "warn",
        message: "注销成功！",
      });
      this.$router.push("/login");
    },
  },
  mounted() {},
};
</script>

<style lang="less">
#container {
  display: flex;
  width: 100%;
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
.fade-leave-to
/* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .menu {
    h3 {
      padding: 20px 0;
      color: #fff;
    }
  }
  .main {
    width: calc(100% - 300px);
    header {
      background-color: #fff;
      height: 50px;
      display: flex;
      justify-content: space-between;
      .header-left {
        display: flex;
        align-items: center;
        margin-left: 20px;
        i {
          font-size: 30px;
          margin-right: 30px;
        }
      }
      .header-right {
        margin-right: 50px;

        .user-info {
          padding: 0 20px;
          transition: 0.5s;
          position: relative;
          .avatar {
            height: 40px;
            width: 40px;
            border-radius: 50%;
            overflow: hidden;
            img {
              transition: 0.5s;
              height: 40px;
              width: 40px;
              border-radius: 50%;
            }
          }

          &:hover {
            // background-color: rgba(0, 0, 0, 0.1);
            img {
              transform: scale(1.5);
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
          position: absolute;
          top: 40px;
          right: 0;

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
    }
    .container {
      border-radius: 15px;
      box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.3);
      margin: 20px;
      background-color: #fff;
      height: calc(100vh - 130px);
      padding: 20px;
      .el-table {
        max-height: calc(100vh - 220px) !important;
        overflow-y: auto;
        border: none !important;
      }
      .el-table::before {
        height: 0px;
      }
      .customer-table .el-table__fixed-right::before,
      .el-table__fixed::before {
        width: 0;
      }
    }
  }
}
</style>
