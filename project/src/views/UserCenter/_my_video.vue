<template>
  <!-- 我的视频 -->
  <div id="root">
    <el-empty description="暂无数据，请先投稿后再来吧~" :image-size="200" v-show="classes.length == 0"></el-empty>
    <div class="main">
      <el-card class="item" v-for="(v, i) in classes" :key="i" shadow="hover">
        <div class="content" @click="toDetail(v.id)">
          <div class="left">
            <img :src="v.cover_image" alt="" srcset="" />
          </div>
          <div class="right">
            <div class="title">
              {{ v.title }}
            </div>
            <div class="author">
              <div class="avatar">
                <img :src="v.author_avatar" alt="" srcset="" />
              </div>
              <div class="author-name">
                {{ v.author_name }}
              </div>
            </div>
            <span class="level">
              {{ v.level }}
            </span>
            <p class="description" :title="v.content_description">
              简介：{{ v.content_description.substr(0, 100) }}
              <span v-show="v.content_description.length > 100">...</span>
            </p>
            <div class="tags">
              <div class="tag" v-for="(tag, index) in v.knowledge_information.split('|')" :key="index">
                {{ tag }}
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <el-pagination :page-size="pager.pageSize" :current-page="pager.currPage" :pager-count="11" background
      layout="prev, pager, next" :total="pager.total" @current-change="currentPageChange">
    </el-pagination>

  </div>
</template>

<script>
import { formatTime } from '../../utils';

export default {
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      classes: [],
      pager: {
        pageSize: 8,
        currPage: 1,
        total: 0
      }
    }
  },
  methods: {
    async getMyVideo() {
      let res = await this.axios.get(`${this.baseUrl}/class/creator/get`, {
        params: {
          id: this.$store.state.loginCredentials.id,
          page_size: this.pager.pageSize,
          curr_page: this.pager.currPage
        }
      })
      console.log(res);
      if (res.data.status == "success") {
        this.classes = res.data.data.map(el => {
          el.upload_time = formatTime(el.upload_time)
          return el
        })
        this.pager.total = res.data.total
      }
    },
    currentPageChange(value) {
      this.pager.currPage = value
      this.getMyVideo()
    }
  },
  mounted() {
    this.getMyVideo()
  },
};
</script>

<style lang="less" scoped>
#root {
  width: 100%;

  .main {
    width: 80%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;

    .item {
      width: 45%;
      margin: 20px 0;

      .content {
        width: 100%;
        display: flex !important;
        flex-wrap: nowrap;

        .left {
          width: 40%;

          img {
            width: 100%;
          }
        }

        .right {
          width: 50%;
          text-align: left;
          padding: 0 30px;

          .title {
            font-weight: bold;
            font-size: 18px;
          }

          .author {
            width: 100%;
            display: flex;
            align-items: center;
            margin: 10px 0;

            .avatar {
              width: 10%;
              border-radius: 50%;
              overflow: hidden;

              img {
                width: 100%;
              }
            }

            .author-name {
              margin-left: 20px;
            }
          }

          .level {
            background-color: rgba(159, 248, 203, 0.1);
            padding: 5px 10px;
            border-radius: 15px;
            cursor: default;
          }

          .description {
            margin: 10px 0;
            text-indent: 1em;
            cursor: default;
            color: rgba(0, 0, 0, 0.5);
          }

          .tags {
            display: flex;
            flex-wrap: wrap;

            .tag {
              background-color: rgba(64, 158, 255, 0.1);
              padding: 5px 10px;
              border-radius: 15px;
              cursor: default;
              margin: 5px;
            }
          }
        }
      }
    }

  }
}
</style>
