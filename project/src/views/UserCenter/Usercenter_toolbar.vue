<template>
  <div id="root">
    <div id="main" style="position: relative">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="我的视频" name="my_video">
          <span slot="label">
            <i class="el-icon-video-play"></i>
            我的视频</span
          ><MyVideo v-if="activeName == 'my_video'" />
        </el-tab-pane>
        <el-tab-pane label="我的收藏" name="my_collection">
          <span slot="label">
            <i class="el-icon-collection-tag"></i> 我的收藏</span
          ><MyCollection v-if="activeName == 'my_collection'"
        /></el-tab-pane>
        <el-tab-pane label="设置" name="setting">
          <span slot="label"> <i class="el-icon-setting"></i> 设置</span
          ><Setting v-if="activeName == 'setting'"
        /></el-tab-pane> </el-tabs
      ><el-input
        v-model="searchText"
        placeholder="请输入内容"
        clearable
        size="small"
        suffix-icon="el-icon-search"
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
export default {
  components: { MyVideo, MyCollection, Setting },
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
    },
  },
};
</script>

<style lang="less" scoped>
#root {
  width: 80%;
  margin: 0 auto;
}
</style>
