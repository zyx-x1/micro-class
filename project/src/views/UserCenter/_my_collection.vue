<template>
  <div id="root">
    <el-empty
      v-if="data.length == 0"
      description="暂无数据，请先收藏后再来吧~"
      :image-size="200"
    ></el-empty>
    <div class="items" v-else>
      <el-card class="item" v-for="(v, i) in data" :key="i" shadow="hover">
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
              <div
                class="tag"
                v-for="(tag, index) in v.knowledge_information.split('|')"
                :key="index"
              >
                {{ tag }}
              </div>
            </div>
          </div>
        </div>
      </el-card>
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="data.length"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      data: [],
      currentPage: 0,
      pageSize: 10,
    };
  },
  methods: {
    async getCollections() {
      let res = await this.axios.get(`${this.baseUrl}/class/collection/get`, {
        params: {
          user_email: this.$store.state.loginCredentials.email,
        },
      });
      if (res.data.status == "success") {
        this.data = res.data.data;
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getCollections();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getCollections();
    },
    toDetail(id) {
      this.$router.push(`/detail/${id}`);
    },
  },
  mounted() {
    this.getCollections();
  },
};
</script>

<style lang="less" scoped>
.items {
  width: 100%;
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
.page {
  width: 100%;
  margin-bottom: 50px;
}
</style>
