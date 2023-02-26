<template>
  <div id="wrap">
    <div id="message">
      <!-- {{ this.messages }} -->
      <div class="empty" v-if="messages.length == 0">
        <el-empty description="没有收到消息，空空如也~"></el-empty>
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
                <span class="class-title" @click="$router.push(`/detail/${item.class_id}`)">
                  {{ item._class_title }}
                </span>
              </div>

              <div class="date">
                {{ item.date }}
              </div>
            </div>
            <div class="read">
              <el-button v-if="item.is_read != 1" size="small" @click="readMessage(item.id)">设为已读</el-button>
              <div class="readed" v-else aria-disabled="true"> <i class="el-icon-check"></i> 已读</div>
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
    async readMessage(id) {
      let res = await this.axios.get(`${this.baseUrl}/message/read`, {
        params: {
          id
        },
      });
      if (res.data.status == "success") {
        this.getMessages()
      }
    },checkLogin() {
      let status = this.$store.state.loginCredentials.status;
      if (!status) this.$router.push("/login");
    },
  },
  mounted() {
    this.getMessages();
    this.checkLogin()
  },
};
</script>

<style lang="less" scoped>
#wrap {
  background-color: rgba(0, 0, 0, 0.1);
  padding-bottom: 50px;

  #message {
    background-color: #fff;
    width: 1000px;
    height: calc(100vh - 170px);
    margin: 0 auto;
    padding: 20px;
    padding-top: 100px;
    overflow-y: auto;
    box-shadow: 0 0 15px 1px #90bbeb;
    border-radius: 10px;

    #main {
      .items {
        .item {
          display: flex;
          height: 120px;
          display: flex;

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

          .read {
            width: 100px;
            display: flex;
            align-content: center;
            align-items: center;

            .el-button {
              border-radius: 15px;

            }

            .readed {
              cursor: default;
              background-color: rgba(0, 0, 0, .1);
              padding: 8px 15px;
              border-radius: 20px;
              color: #90bbeb;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>