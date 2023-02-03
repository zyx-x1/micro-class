<template>
  <div id="root">
    <div id="banner">
      <div id="carousel">
        <el-carousel width="100%" height="450px">
          <el-carousel-item v-for="item in 4" :key="item">
            <h3 class="small">{{ item }}</h3>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <div id="recommend">
      <div id="foto-main">
        <div class="foto-box" v-for="(item, i) in data" :key="i">
          <div class="c-titleimg">
            <img :src="item.cover_image" alt="" />
          </div>
          <div class="c-titlecon">
            <h3 class="c-title" :title="item.title">
              {{ item.title.substr(0, 20)
              }}<span v-show="item.content_description.length > 20">...</span>
            </h3>
            <p class="c-intro" :title="item.content_description">
              {{ item.content_description.substr(0, 18)
              }}<span v-show="item.content_description.length > 18">...</span>
            </p>
            <div class="c-tbottom">
              <div class="c-author">
                <img
                  :src="item.author_avatar"
                  alt=""
                  style="width: 30px; border-radius: 50%"
                />
                <div>{{ item.author_name }}</div>
              </div>
              <div class="c-date">{{ item.upload_time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      baseUrl: this.$store.state.baseUrl,
    };
  },
  methods: {
    async getMicroClass() {
      let res = await this.axios.get(`${this.baseUrl}/class/get`, {
        params: {
          page_size: 80,
          curr_page: 0,
        },
      });
      this.data = res.data.data;
    },
  },
  created() {
    this.getMicroClass();
  },
};
</script>

<style lang="less" scoped>
#root {
  background-color: #f6f7f8;
}
#banner {
  width: 100%;
  position: absolute;
  top: 0;
  z-index: 1;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 400px;
  margin: 0;
}
.el-carousel__item {
  &:nth-child(2n) {
    background-color: #99a9bf;
  }
  &:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
}
#foto-main {
  width: 90%;
  margin: 0 auto;
  min-height: 400px;
  margin-top: 450px;
  padding-top: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-evenly;
}
.foto-box {
  background-color: #fff;
  width: 20%;
  height: 220px;
  color: #000;
  padding: 10px;
  display: flex;
  flex-direction: column;
  transition: all 0.5s;
  margin-bottom: 20px;
  border-radius: 15px;
}
.foto-box:hover {
  //   border: 1px solid transparent;
  box-shadow: 0px 0px 10px 3px rgba(56, 56, 56, 0.788);
}
.c-titleimg {
  width: 100%;
  height: 120px;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
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
.c-intro {
  text-align: left;
  padding-left: 0px;
  margin-top: 0px;
  padding: 2px 0;
  // height: 30px;
  color: #333;
  line-height: 12px;
  font-size: 12px;
  cursor: default;
  // font-weight: bold;
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
.c-b-interactive {
  width: 200px;
  height: 20px;
  position: absolute;
  right: 5%;
}
.c-b-i-star {
  background-size: cover;
  width: 20px;
  height: 20px;
  color: #000;
}
</style>
