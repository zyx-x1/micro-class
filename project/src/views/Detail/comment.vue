<template>
  <div id="root">
    <!-- 评论区 -->
    <div class="comments">
      <div class="comment-head">评论 {{ this.commentCount }}</div>
      <div class="comment-issue">发评论</div>
      <div class="comment-items">
        <div class="superior" v-for="(v, i) in comments" :key="i">
          <div class="avatar">
            <img :src="v._initiator.avatar" alt="" srcset="" />
          </div>
          <div class="comment-main">
            <div class="username">{{ v._initiator.username }}</div>
            <div class="content">{{ v.content }}</div>
            <div class="content-bottom">
              <span class="date">
                {{ v.date }}
              </span>
              <div class="like"></div>
              <div
                class="reply-btn"
                @click="
                  reply(v.comment_id, v._initiator.email, v._initiator.username)
                "
              >
                回复
              </div>
            </div>
            <div class="sub-comments">
              <div
                class="sub-comment"
                v-for="(sub, subIndex) in v._subComments"
                :key="subIndex"
              >
                <div class="sub-avatar">
                  <img :src="sub._initiator.avatar" alt="" srcset="" />
                </div>
                <div class="sub-main">
                  <div class="sub-username">
                    {{ sub._initiator.username }}
                    <span
                      v-show="!!sub._responder.username"
                      style="color: rgba(0, 0, 0, 0.5); font-size: 14px"
                    >
                      回复 {{ sub._responder.username }}
                    </span>
                  </div>
                  <div class="sub-content">{{ sub.content }}</div>
                  <div class="sub-bottom">
                    <div class="sub-date">
                      {{ sub.date }}
                    </div>
                    <div
                      class="reply-btn"
                      @click="
                        reply(
                          v.comment_id,
                          sub._initiator.email,
                          sub._initiator.username
                        )
                      "
                    >
                      回复
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="reply" v-show="isReply">
              <div class="avatar">
                <img
                  :src="$store.state.loginCredentials.avatar"
                  alt=""
                  srcset=""
                />
              </div>
              <div class="reply-inner">
                <el-input
                  :placeholder="'回复 ' + responder.responder_name"
                  v-model="reply_in"
                  clearable
                >
                </el-input>
              </div>
              <div class="reply-submit">
                <el-button
                  type="primary"
                  icon="el-icon-s-promotion"
                  circle
                  @click="submitComment()"
                ></el-button>
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
import Like from "../../components/icons/comment_like.vue";
import LikeActive from "../../components/icons/comment_like_active.vue";
export default {
  name: "comment",
  props: ["classId"],
  components: { Like, LikeActive },
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      comments: [],
      commentCount: 0,
      reply_in: "",
      isReply: false,
      responder: {
        superioi_id: -1,
        replied_email: "",
        responder_name: "",
      },
    };
  },
  methods: {
    async getComments() {
      let res = await this.axios.get(`${this.baseUrl}/comment/get`, {
        params: {
          classId: this.classId,
        },
      });
      if (res.data.status == "success") this.comments = res.data.data;
      this.comments = this.comments.map((el) => {
        el.date = formatTime(el.date);
        el._subComments.map((sub) => {
          sub.date = formatTime(sub.date);
        });
        return el;
      });
      this.commentCount = this.comments.length;
      this.comments.forEach((el) => {
        this.commentCount += el._subComments.length;
      });
    },
    reply(superioi_id, replied_email, responder_name) {
      this.isReply = !this.isReply;
      this.responder = {
        superioi_id,
        replied_email,
        responder_name,
      };
    },
    submitComment() {
      if (!this.reply_in) this.$message.error("未输入回复内容！");
    },
  },
  created() {
    this.getComments();
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
#root {
  margin-top: 10px !important;
  .comment-head {
    text-align: left;
    font-size: 18px;
  }
  .comment-items {
    .superior {
      display: flex;
      .avatar {
        width: 50px;
        height: 50px;
        margin-right: 20px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .comment-main {
        width: calc(100% - 70px);
        text-align: left;
        .username {
          margin: 5px 0 10px;
          font-weight: bold;
          // font-size: 14px;
        }
        .content {
          margin-bottom: 5px;
        }
        .content-bottom {
          display: flex;
          .date {
            color: rgba(0, 0, 0, 0.5);
            line-height: 20px;
            margin-right: 20px;
          }
          .like {
            cursor: pointer;
            svg {
              width: 20px;
              height: 20px;
            }
          }
        }
        .sub-comments {
          .sub-comment {
            margin-top: 5px;
            display: flex;
            .sub-avatar {
              width: 30px;
              height: 30px;
              margin-right: 10px;
              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
            .sub-main {
              width: calc(100% - 40px);
              .sub-content {
                margin: 5px 0;
              }
              .sub-bottom {
                display: flex;
                font-size: 14px;
                color: rgba(0, 0, 0, 0.5);
                .sub-date {
                  margin-right: 20px;
                }
              }
            }
          }
        }
        .reply-btn {
          cursor: pointer;
          color: rgba(0, 0, 0, 0.5);
          &:hover {
            color: #1296db;
          }
        }
        .reply {
          display: flex;
          margin-top: 10px;
          .avatar {
            width: 40px;
            height: 40px;
          }
          .reply-inner {
            width: calc(100% - 120px);
          }
          .reply-submit {
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
