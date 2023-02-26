<template>
  <div id="new">
    <div class="title">
      <div class="title-item">最新上传</div>
    </div>
    <div class="class-container">
      <div class="class-boxs">
        <div class="class-box" v-for="(item, i) in classes" :key="i" :title="'简介：' + item.content_description">
          <div class="c-titleimg">
            <img :src="item.cover_image" alt="" @click="$router.push('/detail/' + item.id)" />
          </div>
          <div class="c-titlecon">
            <h3 class="c-title" :title="item.title">
              {{ item.title.substr(0, 20)
              }}<span v-show="item.content_description.length > 20">...</span>
            </h3>
            <div class="c-tbottom">
              <div class="c-author">
                <img :src="item.author_avatar" alt="" style="width: 30px; border-radius: 50%" />
                <div>{{ item.author_name }}</div>
              </div>
              <div class="c-date">{{ item.upload_time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-pagination :page-size="pager.pageSize" :current-page="pager.currPage" :pager-count="11" background
      layout="prev, pager, next" :total="pager.total" @current-change="currentPageChange">
    </el-pagination>
  </div>
</template>

<script>
import { formatTime } from '../../utils'
export default {
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      classes: [],
      pager: {
        pageSize: 16,
        currPage: 1,
        total: 0
      }
    }
  },
  methods: {
    async getClass() {
      let res = await this.axios.get(`${this.baseUrl}/class/new/get`, {
        params: {
          page_size: this.pager.pageSize,
          curr_page: this.pager.currPage
        }
      })
      if (res.data.status == "success") {
        this.pager.total = res.data.total
        this.classes = res.data.data.map(el => {
          el.upload_time = formatTime(el.upload_time)
          return el
        })
      }
    },
    currentPageChange(value) {
      this.pager.currPage = value
      this.getClass()
    }
  },
  mounted() {
    this.getClass()
  }
}
</script>

<style lang="less" scoped>
#new {
  width: 100%;

  .title {
    width: 100%;
    border-bottom: 1px solid #90bbeb;
    text-align: left;
    margin-bottom: 10px;

    // overflow: hidden;
    .title-item {
      width: 100px;
      background-color: #90bbeb;
      padding: 10px 20px 10px 20px;
      text-align: center;
      color: #fff;
      border-top-left-radius: 20px;
    }
  }

  .class-container {
    .class-boxs {
      width: 100%;
      color: #000;

      display: flex;
      flex-wrap: wrap;
      // flex-direction: column;
      justify-content: space-between;

      .class-box {
        width: 22%;
        height: 250px;
        background-color: #fff;
        transition: all 0.5s;
        margin-bottom: 20px;
        border-radius: 15px;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;

        &:hover {
          box-shadow: 0px 0px 10px 3px rgba(56, 56, 56, 0.788);
        }

        .c-titleimg {
          width: 100%;
          height: 150px;
          cursor: pointer;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            transition: 0.5s;
            object-fit: cover;
            object-position: center;

            &:hover {
              transform: scale(1.2);
            }
          }
        }

        .c-titleimg .c-titlecon {
          width: 100%;
          height: 200px;
          display: flex;
          flex-direction: column;
          position: relative;
          padding: 10px;
        }

        .c-title {
          text-align: left;
          font-size: 15px;
          padding: 2px 0;
          cursor: pointer;
        }

        .c-tbottom {
          display: flex;
          //   position: absolute;
          flex-direction: column;
          align-items: flex-start;
          //   bottom: -20px;
          color: #333;
          width: 100%;
          height: 60px;
        }

        .c-author {
          margin-right: 50px;
          height: 30px;
          line-height: 30px;
          display: flex;

          div {
            height: 30px;
            line-height: 30px;
            margin-left: 5px;
            cursor: default;
          }
        }

        .c-date {
          margin-right: 50px;
          cursor: default;
        }
      }
    }
  }
}
</style>