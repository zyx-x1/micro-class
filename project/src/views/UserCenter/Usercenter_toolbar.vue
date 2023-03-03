<template>
  <div id="usercenter-toolbar">
    <div id="main" style="position: relative">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="我的视频" name="my_video">
          <span slot="label">
            <i class="el-icon-video-play"></i>
            我的视频</span
          >
          <MyVideo v-if="activeName == 'my_video'" />
        </el-tab-pane>
        <el-tab-pane label="我的积分" name="my_credits">
          <span slot="label">
            <i class="el-icon-coin"></i>
            我的积分</span
          >
          <MyCredits v-if="activeName == 'my_credits'" />
        </el-tab-pane>
        <el-tab-pane label="我的收藏" name="my_collection">
          <span slot="label">
            <i class="el-icon-collection-tag"></i> 我的收藏</span
          >
          <MyCollection v-if="activeName == 'my_collection'" />
        </el-tab-pane>
        <el-tab-pane label="设置" name="setting">
          <span slot="label"> <i class="el-icon-setting"></i> 个人资料</span>
          <Setting v-if="activeName == 'setting'" />
        </el-tab-pane> </el-tabs
      ><el-input
        v-model="searchText"
        v-show="activeName == 'my_video' || activeName == 'my_collection'"
        placeholder="请输入内容"
        clearable
        size="small"
        prefix-icon="el-icon-search"
        @keyup.enter.native="search()"
        style="
          position: absolute;
          top: 0px;
          right: 0;
          z-index: 120;
          width: 200px;
          margin-top: 3px;
        "
      ></el-input>
    </div>
  </div>
</template>

<script>
import MyVideo from "./_my_video.vue";
import MyCollection from "./_my_collection.vue";
import Setting from "./_setting.vue";
import MyCredits from "./_my_credits.vue";
export default {
  components: { MyVideo, MyCollection, Setting, MyCredits },
  data() {
    return {
      activeName: "my_video",
      searchText: "",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      console.log("activeName ->", this.activeName);
      this.$router.push("/usercenter?view=" + this.activeName);
    },
    checkHash() {
      let hash = location.hash;
      let search = hash.split("?")[1];
      let searchParams = search.split("&");
      let obj = {};
      searchParams.forEach((el) => {
        obj[el.split("=")[0]] = el.split("=")[1];
      });
      this.activeName = obj.view;
    },
    search() {
      this.$router.push("/search?search_txt=" + this.searchText);
    },
  },
  mounted() {
    this.checkHash();
  },
  watch: {
    $route() {
      this.checkHash();
    },
  },
};
</script>

<style lang="less" scoped>
#usercenter-toolbar {
  width: 100%;
  margin: 0 auto;

  #main {
    width: 80%;
    margin: 0 auto;
  }
}
</style>
