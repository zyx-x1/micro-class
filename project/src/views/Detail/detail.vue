<template>
  <div id="detail">
    <div id="play">
      <div class="left" ref="left">
        <div id="play-title">
          <div class="title">{{ this.classData.title }}</div>
          <div class="title-info">
            <span class="play-count"
              ><i class="el-icon-video-play"></i>
              {{ classData.play_count }}
            </span>
            <span class="comment-count">
              <i class="el-icon-chat-line-square"></i>
              {{ this.commentCount }}
            </span>
            <span class="date">
              <i class="el-icon-time"></i>
              {{ this.classData.upload_time }}
            </span>
          </div>
        </div>
        <div class="video">
          <video
            id="play_container"
            :src="this.classData.video_src"
            controls
            controlslist="nodownload"
            @contextmenu="stopDefaultEvent($event)"
          ></video>
        </div>
        <div class="operation">
          <div
            class="like"
            @mousemove="isLikeActive = true"
            @mouseleave="isLikeActive = false"
            @click="likeClass()"
          >
            <LikeActive v-if="isLikeActive || isUserLike" />
            <Like v-else />
            <span class="like-count-active" v-if="isLikeActive || isUserLike">{{
              this.likeCount
            }}</span>
            <span class="like-count" v-else>{{ this.likeCount }}</span>
          </div>
          <div
            class="collection"
            @mousemove="isCollectionActive = true"
            @mouseleave="isCollectionActive = false"
            @click="collectionClass()"
          >
            <CollectionActive v-if="isCollectionActive || isUserCollection" />
            <Collection v-else />
            <span
              class="collection-count-active"
              v-if="isCollectionActive || isUserCollection"
              >{{ this.collectionCount }}</span
            >
            <span class="collection-count" v-else>{{
              this.collectionCount
            }}</span>
          </div>
        </div>
        <!-- 标签 -->
        <div
          class="file"
          style="text-align: left; margin-top: 20px; user-select: none"
        >
          <div class="file-name">
            附件 :{{
              !!this.classData._file ? this.classData._file.filename : "无"
            }}
          </div>
        </div>
        <div class="tags">
          <span
            class="tag"
            v-for="(item, index) in !!this.classData.knowledge_information
              ? this.classData.knowledge_information.split('|')
              : []"
            :key="index"
            @click="tagSearch(item)"
            >{{ item }}</span
          >
        </div>
        <!-- 评论 -->
        <Comment :classId="this.classId" ref="comment" />
      </div>
      <div class="right">
        <div class="title">推荐相关微课</div>
        <div class="items" ref="right">
          <div class="item" v-for="(v, i) in associatedClasses" :key="i">
            <div class="cover">
              <img
                :src="v.cover_image"
                alt=""
                srcset=""
                @click="toNewDetail(v.id)"
              />
            </div>
            <div class="info">
              <div class="top">
                <div class="class-title" @click="toNewDetail(v.id)">
                  {{ v.title }}
                </div>
                <div class="author">
                  {{ v.author_name }}
                </div>
              </div>
              <div class="bottom">
                {{ v.upload_time }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="foot"></div>
  </div>
</template>

<script>
import { formatTime } from "../../utils/index";

import Like from "../../components/icons/like";
import LikeActive from "../../components/icons/like_active";
import Collection from "../../components/icons/collection";
import CollectionActive from "../../components/icons/collection_active";

import Comment from "./comment.vue";
export default {
  name: "detail",
  components: { Like, LikeActive, Collection, CollectionActive, Comment },
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      classId: -1,
      classData: {},
      data: [],
      commentCount: 0,
      isLikeActive: false,
      isCollectionActive: false,
      isUserLike: false,
      isUserCollection: false,
      likeCount: 0,
      collectionCount: 0,
      associatedClasses: [],
    };
  },
  methods: {
    getClassId() {
      let res;
      res = location.hash.replace("#/detail/", "");
      res = parseInt(res);
      this.classId = res;
    },
    isNum(param) {
      return !!param ? parseInt(param) : 0;
    },
    stopDefaultEvent(e) {
      e.preventDefault();
    },
    async getMicroClass(id) {
      let res = await this.axios.get(`${this.baseUrl}/class/get`, {
        params: {
          id,
        },
      });
      this.classData = res.data.data[0];
      this.data = res.data.data;
      this.classData.upload_time = formatTime(this.classData.upload_time);
      this.classData.like = this.isNum(this.classData.like);
      this.classData.collection = this.isNum(this.classData.collection);
      this.increasePlayCount();
      this.getLCCount(id);
      this.getAssociatedClass();
      console.log(res);
    },
    async increasePlayCount() {
      // 进入页面时增加微课播放次数
      let nowPlayCount = this.classData.play_count;
      console.log("this.classData.play_count ->", nowPlayCount);
      let res = await this.axios.get(`${this.baseUrl}/class/play/count`, {
        params: {
          id: this.classId,
          count: nowPlayCount + 1,
        },
      });
      this.classData.play_count = res.data.count.play_count;
    },
    async getLCCount(id) {
      // 获取此微课的点赞数和收藏数
      let res = await this.axios.get(`${this.baseUrl}/class/like_collection`, {
        params: {
          id,
          email: this.$store.state.loginCredentials.email,
        },
      });
      this.isUserLike = res.data.data.is_user_like;
      this.isUserCollection = res.data.data.is_user_collection;
      this.likeCount = res.data.data.like_count;
      this.collectionCount = res.data.data.collection_count;
    },
    async likeClass() {
      let loginStatus = this.$store.state.loginCredentials.status;
      if (!loginStatus) {
        this.unlogin();
        return;
      }
      let res = await this.axios.get(`${this.baseUrl}/class/like`, {
        params: {
          id: this.classId,
          email: this.$store.state.loginCredentials.email,
          isUserLike: !this.isUserLike,
        },
      });
      if (res.data.status == "success") this.getLCCount(this.classId);
    },
    async collectionClass() {
      let loginStatus = this.$store.state.loginCredentials.status;
      if (!loginStatus) {
        this.unlogin();
        return;
      }
      let res = await this.axios.get(`${this.baseUrl}/class/collection`, {
        params: {
          id: this.classId,
          email: this.$store.state.loginCredentials.email,
          isUserCollection: !this.isUserCollection,
        },
      });
      if (res.data.status == "success") this.getLCCount(this.classId);
    },
    unlogin() {
      this.$confirm("当前处于未登录状态, 是否前往登录?", "提示", {
        confirmButtonText: "登录",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$router.push("/login");
          location.reload();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    open() {},
    tagSearch(tag) {
      this.$router.push(`/search?search_txt=${tag}`);
      location.reload();
    },
    // 获取相关视频
    async getAssociatedClass() {
      let res = await this.axios.get(`${this.baseUrl}/class/associated/get`, {
        params: {
          knowledge_information: this.classData.knowledge_information,
          classId: this.classId
        },
      });
      // console.log(`res ->`, res);
      if (res.data.status == "success") {
        this.associatedClasses = res.data.data.map((el) => {
          el.upload_time = formatTime(el.upload_time);
          return el;
        });
      }
    },
    setRightHeight() {
      let height = this.$refs.left.offsetHeight;
      let right = this.$refs.right;
      right.style.maxHeight = height + "px";
    },
    toNewDetail(id) {
      this.$router.push(`/detail/${id}`);
      location.reload();
    },
  },
  mounted() {
    this.getClassId();
    if (!!this.classId) {
      this.getMicroClass(this.classId);
    }
    this.setRightHeight();
    this.commentCount = this.$refs.comment.deliverCount();
  },
};
</script>

<style lang="less" scoped>
*::-webkit-scrollbar {
  width: 10px;
  height: 1px;
}

#detail {
  margin-top: 100px;

  #play {
    width: 80%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;

    .left {
      width: 60%;

      #play-title {
        width: 100%;
        font-size: 28px;
        // font-weight: bold;
        margin-bottom: 10px;
        text-align: left;
      }

      .video {
        height: 50vh;
      }

      #play_container {
        width: 100%;
        height: 50vh;
        float: left;
        box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
      }

      .title-info {
        user-select: none;

        .play-count,
        .comment-count,
        .date {
          font-size: 15px;
          margin-right: 20px;
          color: rgba(0, 0, 0, 0.5);
        }
      }

      .operation {
        width: 100%;
        height: 50px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.5);
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .like,
        .collection {
          cursor: pointer;
          line-height: 30px;
          margin-right: 30px;

          &:hover {
            color: #1296db;
          }
        }

        svg {
          width: 30px;
          height: 30px;
          margin-right: 5px;
        }

        span {
          font-size: 20px;
          line-height: 30px;
          position: relative;
          top: -5px;
        }
      }

      .tags {
        width: 100%;
        display: flex;
        margin: 10px 0;
        flex-wrap: wrap;
        .tag {
          background-color: #f1f2f3;
          margin: 5px;
          padding: 4px 8px;
          border-radius: 20px;
          user-select: none;
          cursor: pointer;
        }
      }
    }

    .right {
      width: 30%;
      margin-top: 75px;

      .title {
        background-color: rgba(18, 150, 219, 0.5);
        text-align: left;
        text-indent: 2em;
        padding: 10px;
        border-radius: 10px;
        height: 30px;
        line-height: 30px;
        color: #fff;
      }

      .items {
        overflow-y: auto;
        border-radius: 10px;
        margin-top: 10px;
        padding: 10px;
        box-shadow: 0 0 10px 1px inset rgba(18, 150, 219, 0.5);
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background-color: rgba(0, 0, 0, 0.5);
          background-image: -webkit-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.2) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.2) 75%,
            transparent 75%,
            transparent
          );
        }

        &::-webkit-scrollbar-track {
          box-shadow: inset 0 0 5px rgb(144, 187, 235);
          background: #ededed;
          border-radius: 10px;
        }

        .item {
          margin: 40px 0;
          display: flex;

          .cover {
            width: 50%;
            height: 150px;
            overflow: hidden;
            position: relative;
            cursor: pointer;

            &:hover img {
              transform: scale(1.2) translate(-40%, -40%);
            }

            img {
              width: 100%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              transition: 0.5s;
            }
          }

          .info {
            width: 50%;
            text-align: left;
            padding: 0 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .class-title {
              font-weight: bold;
              cursor: pointer;

              &:hover {
                color: #1296db;
              }
            }

            .author {
              margin-top: 20px;
            }
            .bottom {
              color: rgba(51, 51, 51, 0.5);
              cursor: default;
            }
          }
        }
      }
    }
  }

  #foot {
    height: 500px;
  }
}

.like-count-active {
  color: #1296db;
}

.collection-count-active {
  color: #1296db;
}
</style>
