<template>
  <div id="detail-comments">
    <!-- 评论区 -->

    <div class="comments">
      <div class="comment-head">评论 {{ this.commentCount }}</div>

      <div class="comment-issue">
        <div class="issue">
          <div class="avatar">
            <img :src="$store.state.loginCredentials.avatar" alt="" srcset="" />
          </div>

          <div class="issue-inner">
            <el-input
              placeholder="发一条友善的评论吧~"
              v-model="issue_content"
              clearable
            >
            </el-input>
          </div>

          <div class="issue-submit">
            <el-button
              type="primary"
              icon="el-icon-finished"
              circle
              @click="submitIssue()"
            ></el-button>
          </div>
        </div>
      </div>

      <div class="comment-items">
        <div class="superior" v-for="(v, i) in comments" :key="i">
          <div class="avatar">
            <img :src="v._initiator.avatar" alt="" srcset="" />
          </div>

          <div class="comment-main">
            <div class="username">
              {{ v._initiator.username }}

              <span
                v-show="
                  $store.state.loginCredentials.email == v.initiator_email
                "
                style="
                  font-weight: normal;

                  font-size: 12px;

                  color: rgba(0, 0, 0, 0.5);

                  cursor: pointer;
                "
                @click="deleteComment('评论', i, null)"
                >删除</span
              >
            </div>

            <div class="content">{{ v.content }}</div>

            <div class="content-bottom">
              <span class="date">
                {{ v.date }}
              </span>

              <div class="like"></div>

              <div
                class="reply-btn"
                @click="
                  reply(
                    i,

                    v.comment_id,

                    v._initiator.email,

                    v._initiator.username
                  )
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

                    <span
                      v-show="
                        $store.state.loginCredentials.email ==
                        sub.initiator_email
                      "
                      style="
                        font-weight: normal;

                        font-size: 12px;

                        color: rgba(0, 0, 0, 0.5);

                        cursor: pointer;
                      "
                      @click="deleteComment('回复', i, subIndex)"
                      >删除</span
                    >
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
                          i,

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

            <div class="reply" v-show="v._is_reply">
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
                  v-model="responder.content"
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
  // props: ["classId"],
  components: { Like, LikeActive },
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      comments: [],
      commentCount: 0,
      isReply: false,
      classId: -1,
      responder: {
        replied_email: "",
        responder_name: "",
        content: "",
        superioi_id: -1,
      },
      issue_content: "",
      ws: null,
    };
  },
  methods: {
    async getComments() {
      this.classId = parseInt(location.hash.replace("#/detail/", ""));
      this.comments = [];
      let res = await this.axios.get(`${this.baseUrl}/comment/get`, {
        params: {
          classId: this.classId,
        },
      });
      if (res.data.status == "success") this.comments = res.data.data;
      this.comments = this.comments.map((el) => {
        el.date = formatTime(el.date);
        el._is_reply = false;
        el._subComments.map((sub) => {
          sub.date = formatTime(sub.date);
        });
        return el;
      });
      this.commentCount = this.comments.length;
      this.comments.forEach((el) => {
        this.commentCount += el._subComments.length;
      });
      console.log("this.comments ->", this.comments);
    },
    reply(index, superioi_id, replied_email, responder_name) {
      if (!this.$store.state.loginCredentials.status) {
        this.$confirm("当前处于未登录状态, 是否前往登录?", "提示", {
          confirmButtonText: "登录",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$router.push("/login");
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
        return;
      }
      this.comments = this.comments.map((el, i) => {
        if (i == index) el._is_reply = !el._is_reply;
        return el;
      });
      this.responder = {
        replied_email,
        responder_name,
        content: this.responder.content,
        superioi_id,
      };
    },
    async submitIssue() {
      if (!this.issue_content) this.$message.error("未输入评论内容！");
      let res = await this.axios.get(`${this.baseUrl}/comment/set`, {
        params: {
          initiator_email: this.$store.state.loginCredentials.email,
          replied_email: null,
          content: this.issue_content,
          class_id: this.classId,
          superioi_id: null,
        },
      });
      this.issue_content = "";
      this.$message({
        type: "success",
        message: "评论成功！",
      });
    },
    async submitComment() {
      if (!this.responder.content) this.$message.error("未输入回复内容！");
      let res = await this.axios.get(`${this.baseUrl}/comment/set`, {
        params: {
          initiator_email: this.$store.state.loginCredentials.email,
          replied_email: this.responder.replied_email,
          content: this.responder.content,
          class_id: this.classId,
          superioi_id: this.responder.superioi_id,
        },
      });
      this.responder.content = "";
      this.$message({
        type: "success",
        message: "回复成功！",
      });
    },
    deleteComment(type, index, subIndex) {
      this.$confirm(`删除后将不可恢复，您确定要删除此${type}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let comment_id;
          switch (type) {
            case "评论":
              comment_id = this.comments[index].comment_id;
              break;
            case "回复":
              comment_id =
                this.comments[index]._subComments[subIndex].comment_id;
              break;
          }
          let res = await this.axios.get(`${this.baseUrl}/comment/delete`, {
            params: {
              comment_id,
            },
          });
          if (res.data.status == "success") {
            this.$message({
              type: "success",
              message: "删除成功！",
            });
            this.getComments();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    deliverCount(){
      return this.commentCount
    }
  },
  created() {
    this.getComments();
  },
  mounted() {
    let _this = this;
    const ws = new WebSocket("ws://localhost:8181");
    ws.onopen = function () {
      ws.onmessage = function (msg) {
        let data = JSON.parse(msg.data);
        // msg = JSON.parse(msg);
        console.log("ws message ->", msg);
        if (data.msg == "comment update") {
          _this.getComments();
        }
      };
    };
  },
};
</script>

<style lang="less">
#detail-comments {
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
          font-weight: bold; // font-size: 14px;
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
  .comment-issue {
    width: 100%;
    .issue {
      display: flex;
      width: 100%;
      margin: 20px 0;
      img {
        width: 60px;
        height: 60px;
        margin-right: 20px;
        border-radius: 50%;
      }
      .issue-inner {
        width: calc(100% - 120px);
        margin-top: 5px;
        .el-input__inner {
          height: 50px;
        }
      }
      .issue-submit {
        margin-left: 10px;
        margin-top: 5px;
        .el-button {
          width: 50px;
          height: 50px;
        }
      }
    }
  }
}
</style>
