<template>
  <div id="root">
    <el-empty
      description="暂无数据，请先投稿后再来吧~"
      :image-size="200"
    ></el-empty>
  </div>
</template>

<script>
export default {
  mounted() {
    console.log("我的视频");
  },
};
</script>

<style lang="less" scoped></style>
