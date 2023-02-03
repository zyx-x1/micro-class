<template>
  <div id="root">
    <div id="inside_banner">
      <div id="user_info">
        <div class="avatar">
          <img
            :src="$store.state.loginCredentials.avatar"
            alt=""
            @mouseenter="hoverAvatar = true"
          />
          <transition name="fade">
            <div v-show="hoverAvatar" @mouseleave="hoverAvatar = false">
              更换头像
            </div></transition
          >
        </div>
        <div class="username">
          <span>{{ $store.state.loginCredentials.username }}</span>
        </div>
      </div>
    </div>
    <div id="tools">
      <Toolbar />
    </div>
  </div>
</template>

<script>
import Toolbar from "./Usercenter_toolbar.vue";
export default {
  data() {
    return {
      hoverAvatar: false,
    };
  },
  components: {
    Toolbar,
  },
};
</script>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
#root {
  min-height: 100vh;
  overflow: hidden;
  background-color: #f6f7f8;
  #inside_banner {
    height: 200px;
    width: 100vw;
    background-size: cover;
    background-position: center;
    background-image: url(../../../static/images/sky.png);
    overflow: hidden;
    position: relative;
    #user_info {
      position: absolute;
      left: 100px;
      bottom: 30px;
      display: flex;
      align-items: center;
      .avatar {
        position: relative;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 60px;
          cursor: pointer;
        }
        div {
          position: absolute;
          left: 0;
          top: 0;
          cursor: pointer;
          background-color: rgba(0, 0, 0, 0.3);
          width: 100%;
          height: 100%;
          text-align: center;
          font-size: 12px;
          line-height: 60px;
          color: #fff;
        }
      }
      .username {
        margin-left: 15px;
        span {
          font-size: 30px;
          font-weight: bold;
          letter-spacing: 2px;
        }
      }
    }
  }
}
</style>
