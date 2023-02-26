<template>
  <div id="root">
    <div id="banner">
      <img :src="bannerImage" alt="" srcset="" />
      <!-- <div id="carousel">
        <el-carousel width="100%" height="450px">
          <el-carousel-item v-for="item in 4" :key="item">
            <h3 class="small">{{ item }}</h3>
          </el-carousel-item>
        </el-carousel>
      </div> -->
    </div>
    <div id="recommend">
      <div id="mclass-main">
        <Commend />
        <FilterClass />
        <NewClass />
      </div>
    </div>
    <Foot />
  </div>
</template>

<script>
import { formatTime } from "../../utils/index";
import Commend from "./commend";
import FilterClass from "./filter";
import NewClass from "./new";
import Foot from "../../components/foot/foot.vue";
import BannerImage from "../../../static/images/banner.png";
export default {
  components: { Commend, FilterClass, NewClass, Foot },
  data() {
    return {
      data: [],
      baseUrl: this.$store.state.baseUrl,
      bannerImage: BannerImage,
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
      this.data = res.data.data.map((el) => {
        el.upload_time = formatTime(el.upload_time);
        return el;
      });
    },
    toDetail(id) {
      this.$router.push(`/detail/${id}`);
      // location.reload();
    },
  },
  created() {
    this.getMicroClass();
    console.log(`Filter`, FilterClass);
  },
};
</script>

<style lang="less" scoped>
#root {
  background-color: #f6f7f8;
}

#banner {
  width: 100%;
  height: 400px;
  position: absolute;
  top: 0;
  z-index: 1;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}

#mclass-main {
  width: 90%;
  margin: 0 auto;
  min-height: 400px;
  margin-top: 400px;
  padding-top: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-evenly;
  margin-bottom: 100px;
}

.mclass-boxs {
  width: 100%;
  color: #000;

  display: flex;
  flex-wrap: wrap;
  // flex-direction: column;
  justify-content: space-between;

  .mclass-box {
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
  }
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
