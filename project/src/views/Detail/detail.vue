<template>
  <div id="root">
    <div id="play">
      <div class="left">
        <div id="play-title">
          <div class="title">{{ this.classData.title }}</div>
          <div class="title-info">
            <span class="play-count"
              ><i class="el-icon-video-play"></i>
              {{ this.classData.play_count }}
            </span>
            <span class="comment-count">
              <i class="el-icon-chat-line-square"></i>
              {{ this.data.length }}
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
            controls="controls"
            width="60%"
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
        <div class="tags">
          <span
            class="tag"
            v-for="(item, index) in this.classData.knowledge_information.split(
              '|'
            )"
            :key="index"
            >{{ item }}</span
          >
        </div>
        <!-- 评论 -->
        <Comment :classId="this.classId" />
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
      isLikeActive: false,
      isCollectionActive: false,
      isUserLike: false,
      isUserCollection: false,
      likeCount: 0,
      collectionCount: 0,
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
    async getMicroClass(id) {
      let res = await this.axios.get(`${this.baseUrl}/class/get`, {
        params: {
          id,
        },
      });
      this.classData = res.data.data[0];
      this.data = res.data.data;
      this.classData.upload_time = formatTime(this.classData.upload_time);
      this.classData.play_count = this.isNum(this.classData.play_count);
      this.classData.like = this.isNum(this.classData.like);
      this.classData.collection = this.isNum(this.classData.collection);
      this.increasePlayCount();
      this.getLCCount(id);
    },
    async increasePlayCount() {
      // 进入页面时增加微课播放次数
      let nowPlayCount = this.classData.play_count;
      console.log("this.classData.play_count1 ->", nowPlayCount);
      let res = await this.axios.get(`${this.baseUrl}/class/play/count`, {
        params: {
          id: this.id,
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    open() {},
  },
  mounted() {
    this.getClassId();
    if (!!this.classId) {
      this.getMicroClass(this.classId);
    }
  },
};
</script>

<style lang="less" scoped>
#root {
  margin-top: 100px;
  #play {
    width: 70%;
    margin: 0 auto;
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
        height: 500px;
      }
      #play_container {
        width: 100%;
        height: 500px;
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
