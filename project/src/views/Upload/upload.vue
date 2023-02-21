<template>
  <div id="wrap">
    <div id="upload">
      <div class="upload-container">
        <el-upload
          class="upload-demo"
          drag
          action="http://localhost:3000/video/upload"
          multiple
          width="800px"
          :accept="accept"
          :before-upload="beforeUpload"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            只能上传视频文件，且不超过100MB
          </div>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accept: ".mp4,.avi,.jpg",
    };
  },
  methods: {
    beforeUpload(file) {
      
      if (file.type.split("/")[0] !== "video") {
        this.$message.error("请上传视频格式的文件！");
        return false;
      }
      if (file.size > 1024 * 1024 * 100) {
        this.$message.error("视频文件过大！请上传小于100MB的视频文件！");
        return false;
      }
    },
  },
};
</script>

<style lang="less">
#wrap {
  background-color: rgba(0, 0, 0, 0.1);
  // min-height: 100vh;
  padding-top: 100px;
  #upload {
    width: 1000px;
    background-color: #fff;
    height: calc(100vh - 100px);
    margin: 0 auto;
    padding: 20px;
    .upload-container {
      width: 100%;
      // border: 1px dashed rgba(0, 0, 0, 0.1);
      &::before {
        content: "";
      }
      .el-upload-dragger {
        width: 800px;
        height: 400px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .el-icon-upload {
        margin: 0;
        margin-bottom: 10px;
      }
    }
  }
}
</style>