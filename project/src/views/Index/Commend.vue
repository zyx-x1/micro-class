<template>
  <div id="commend">
    <!-- 推荐 -->
    <div class="title">
      <div class="title-item">热门微课</div>
    </div>
    <div class="container">
      <div class="carousel">
        <el-carousel width="100%" height="550px">
          <div v-for="(item, index) in data.slice(0, 4)" :key="index" @click="$router.push('/detail/' + item.id)">
            <el-carousel-item>
              <h3 class="class-title">{{ item.title }}</h3>
              <img :src="item.cover_image" alt="" srcset="" />
            </el-carousel-item>
          </div>
        </el-carousel>
      </div>
      <div class="right">
        <div class="item" v-for="(item, index) in data.slice(4, 10)" :key="index">
          <div class="cover" @click="$router.push('/detail/' + item.id)">
            <img :src="item.cover_image" alt="" srcset="" />
          </div>
          <div class="class-title" @click="$router.push('/detail/' + item.id)">
            {{ item.title }}
          </div>
          <div class="class-author">{{ item.author_name }}</div>
        </div>
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
    };
  },
  methods: {
    async getCommends() {
      let res = await this.axios.get(`${this.baseUrl}/class/commend`, {
        params: {},
      });
      if (res.data.status == "success") {
        this.data = res.data.data;
      }
    },
  },
  mounted() {
    this.getCommends();
  },
};
</script>

<style lang="less" scoped>
#commend {
  width: 100%;
  margin: 20px 0;

  .title {
    width: 100%;
    border-bottom: 1px solid #90bbeb;
    text-align: left;
    margin-bottom: 5px;

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

  .container {
    width: 100%;
    display: flex;

    .carousel {
      width: 40%;
      position: relative;

      img {
        width: 100%;
        transition: 0.5s;
        object-fit: cover;
        object-position: center;
        cursor: pointer;
        // &:hover {
        //   transform: scale(1.2);
        // }
      }

      .class-title {
        width: 100%;
        text-align: left;
        text-indent: 2em;
        color: #fff;
        transition: 0.5s;
        position: absolute;
        bottom: 0;
        padding: 20px 0;
        // background-color: rgba(0, 0, 0, 0.3);
        background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.8) 70%);
        cursor: pointer;
      }
    }

    .right {
      width: 55%;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      height: 550px;
      justify-content: space-between;

      .item {
        width: 33%;
        padding: 20px;
        height: 220px;
        text-align: left;

        .cover {
          height: 180px;
          width: 100%;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.5);
          border-radius: 10px;

          img {
            width: 100%;
            height: 180px;
            transition: 0.5s;
            cursor: pointer;
            object-fit: cover;
        object-position: center;
            &:hover {
              transform: scale(1.2);
            }
          }
        }

        .class-title {
          font-weight: bold;
          line-height: 40px;
          cursor: pointer;

          &:hover {
            text-decoration: underline;
            color: #90bbeb;
          }
        }

        .class-author {
          color: rgba(0, 0, 0, 0.5);
          cursor: default;
        }
      }
    }
  }
}</style>