<template>
  <div id="wrap">
    <div id="message">
      <!-- {{ this.messages }} -->
      <div class="empty" v-if="messages.length == 0">
        <el-empty
          description="没有收到消息，空空如也~"
        ></el-empty>
      </div>
      <div id="main">
        <div class="items">
          <div class="item" v-for="(item, index) in messages" :key="index">
            <div class="avatar">
              <img :src="item._sender.avatar" alt="" srcset="" />
            </div>
            <div class="body">
              <div class="title">
                <span class="sender-name">{{ item._sender.username }}</span>
                回复了我的评论
              </div>
              <div class="content-container">
                <div class="content">
                  {{ item.content }}
                </div>
                <span
                  class="class-title"
                  @click="$router.push(`/detail/${item.class_id}`)"
                >
                  {{ item._class_title }}
                </span>
              </div>

              <div class="date">
                {{ item.date }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime } from "../../utils/index";
export default {
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      messages: [],
    };
  },
  methods: {
    async getMessages() {
      let res = await this.axios.get(`${this.baseUrl}/message/get`, {
        params: {
          user: this.$store.state.loginCredentials.email,
        },
      });
      if (res.data.status == "success") {
        this.messages = res.data.data.map((el) => {
          el.date = formatTime(el.date);
          return el;
        });
      }
    },
  },
  mounted() {
    this.getMessages();
  },
};
</script>

<style lang="less" scoped>
#wrap {
  background-color: rgba(0, 0, 0, 0.1);
  #message {
    background-color: #fff;
    width: 1000px;
    height: calc(100vh - 100px);
    margin: 0 auto;
    padding-top: 100px;
    overflow: scroll;
    #main {
      .items {
        .item {
          display: flex;
          height: 120px;
          .avatar {
            width: 100px;
            height: 100%;
            position: relative;
            img {
              width: 50px;
              height: 50px;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              border-radius: 50%;
            }
          }
          .body {
            width: calc(100% - 120px);
            height: calc(100% - 20px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            text-align: left;
            padding: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .title {
              .sender-name {
                font-weight: bold;
              }
            }
            .content-container {
              .content {
                font-size: 16px;
                margin-bottom: 5px;
              }
              .class-title {
                font-size: 12px;
                color: rgba(0, 0, 0, 0.5);
                border-left: 2px solid rgba(0, 0, 0, 0.1);
                padding-left: 5px;
                cursor: pointer;
                transition: 0.5s;
                &:hover {
                  color: #90bbeb;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>