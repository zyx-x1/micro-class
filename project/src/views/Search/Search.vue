<template>
  <div id="search-result">
    <div class="items">
      <el-card class="item" v-for="(v, i) in result" :key="i" shadow="hover">
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
    </div>
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="result.length"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      search_txt: "",
      result: [],
      currentPage: 0,
      pageSize: 10,
    };
  },
  methods: {
    getQuery() {
      let search = location.hash.split("?")[1];
      let searchParams = search.split("&");
      let obj = {};
      searchParams.forEach((el) => {
        obj[el.split("=")[0]] = el.split("=")[1];
      });
      this.search_txt = obj.search_txt;
    },
    async getSearchResults() {
      this.getQuery();
      let res = await this.axios.get(`${this.baseUrl}/class/search`, {
        params: {
          key: this.search_txt,
          page_size: this.pageSize,
          curr_page: this.currentPage,
        },
        header: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
      if (res.data.status == "success") {
        this.result = res.data.data;
      } else {
        this.$message.error(res.data.message);
      }
    },
    toDetail(id) {
      this.$router.push(`/detail/${id}`);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getSearchResults();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.getSearchResults();
    },
  },
  mounted() {
    this.getSearchResults();
  },
};
</script>

<style lang="less" scoped>
#search-result {
  margin-top: 150px;
  .items {
    width: 80%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
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
    margin-bottom: 50px;
  }
}
</style>