<template>
  <div id="wrap">
    <div id="upload">
      <div class="upload-container">
        <el-upload class="upload-demo" drag action="http://localhost:3000/video/upload" multiple width="800px"
          :accept="accept" :before-upload="beforeUpload">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将视频拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            只能上传视频文件，且不超过100MB
          </div>
        </el-upload>
      </div>
      <div class="info">
        <div class="author-info form-items">
          <div class="form-item author-name">
            <div class="label">作者姓名 <span class="color-red">*</span> </div>
            <el-input placeholder="请输入作者姓名" v-model="info.authorName" clearable>
            </el-input>
          </div>
          <div class="form-item author-area">
            <div class="label">所在地区 <span class="color-red">*</span></div>
            <el-cascader size="large" :options="options" v-model="info.authorArea" @change="handleChange">
            </el-cascader>
          </div>
          <div class="form-item author-school">
            <div class="label">所属学校 <span class="color-red">*</span> </div>
            <el-input placeholder="请输入所属学校" v-model="info.authorSchool" clearable>
            </el-input>
          </div>
          <div class="form-item author-area">
            <div class="label">作者简介 <span class="color-red">*</span></div>
            <el-input type="textarea" placeholder="请输入作者简介" v-model="info.authorIntro" clearable maxlength="30"
              show-word-limit>
            </el-input>
          </div>
        </div>
        <div class="class-info form-items">
          <div class="form-item class-title">
            <div class="label">微课标题 <span class="color-red">*</span> </div>
            <el-input placeholder="请输入微课标题" v-model="info.classTitle" clearable>
            </el-input>
          </div>
          <div class="form-item class-intro">
            <div class="label">微课简介 <span class="color-red">*</span></div>
            <el-input type="textarea" placeholder="请输入内容" v-model="info.classIntro" maxlength="30" show-word-limit>
            </el-input>
          </div>
          <div class="form-item class-type">
            <div class="label">微课类型 <span class="color-red">*</span> </div>
            <el-select placeholder="请选择微课类型" v-model="info.classType" clearable>
              <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="form-item class-level">
            <div class="label">微课难度 <span class="color-red">*</span> </div>
            <el-select placeholder="请选择微课难度" v-model="info.classLevel" clearable>
              <el-option v-for="item in levelOptions" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="form-item knowladge-tags">
            <div class="label">知识点标签 <span class="color-red">*</span></div>
            <div class="tags">
              <div class="tag" v-for="(item, index) in info.knowladgeTags" :key="index" title="点击标签外即可自动保存">
                <span class="tag-item" @click="tagGetFocus($event)" ref="tag" contenteditable="true"
                  v-show="!knowladgeTagFoucs[index]" @blur="updateTag($event, 'knowladge', index)">{{ item
                  }}</span>
                <i v-show="index == info.knowladgeTags.length - 1" class="el-icon-close" title="删除此标签项"
                  @click="deleteTag('knowladge', index)"></i>
              </div>
              <div class="add" @click="addTag('knowladge')">
                <i class="el-icon-circle-plus-outline"></i>
              </div>

            </div>
          </div>
          <div class="form-item chapter-tags">
            <div class="label">章节标签 <span class="color-red">*</span></div>
            <div class="tags">
              <div class="tag" v-for="(item, index) in info.chapterTags" :key="index"
                title="点击标签外即可自动保存
                                                                                                                                                                                            最长可输入20字">
                <span class="tag-item" @click="tagGetFocus($event)" ref="tag" contenteditable="true"
                  v-show="!chapterTagFoucs[index]" @blur="updateTag($event, 'chapter', index)"
                  @keydown="stopInput($event)">{{ item
                  }}</span>
                <i v-show="index == info.chapterTags.length - 1" class="el-icon-close" title="删除此标签项"
                  @click="deleteTag('chapter', index)"></i>
              </div>
              <div class="add" @click="addTag('chapter')">
                <i class="el-icon-circle-plus-outline"></i>
              </div>

            </div>
          </div>
        </div>
        <div class="submit">
          <el-button @click="submit()">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { regionData, CodeToText } from "element-china-area-data";
import { getVideoCover } from "../../utils/index"

export default {
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      accept: ".mp4,.avi,.jpg",
      fileName: "",
      info: {
        authorName: "",
        authorIntro: "",
        authorSchool: "",
        classTitle: "",
        classIntro: "",
        chapterTags: [],
        knowladgeTags: [],
        classType: "",
        classLevel: "",
        authorArea: []
      },
      options: regionData,
      knowladgeTagFoucs: [],
      chapterTagFoucs: [],
      typeOptions: ["讲授", "解题", "答疑", "实验", "其他类型"],
      levelOptions: ["简单（入门学习）", "普通（基本运用）", "困难（提高扩展）"],

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
      this.fileName = file.name;
    },
    handleChange(value) {
      console.log(CodeToText[value[0]]);
    },
    stopInput(e) {
      if (e.target.innerText.length > 20) {
        e.preventDefault();
      }
    },
    addTag(type) {
      this.info[`${type}Tags`].push(" ")
      this[`${type}TagFoucs`].push(false)
    },
    updateTag(e, type, index) {
      this[`${type}TagFoucs`][index] = false
      e.target.setAttribute("contenteditable", false)
      if (!(e.target.textContent.trim())) {
        this.info[`${type}Tags`].splice(index, 1)
        this[`${type}TagFoucs`].splice(index, 1)
      } else {
        this.info[`${type}Tags`][index] = e.target.textContent

      }
    },
    deleteTag(type, index) {
      this.info[`${type}Tags`].splice(index, 1)
    },
    tagGetFocus(e) {
      e.target.setAttribute("contenteditable", true)
      e.target.focus()
    },
    async submit() {
      let isLegitimacy = this.checkForm()
      // if (!isLegitimacy) return
      let data = JSON.parse(JSON.stringify(this.info))
      data.knowladgeTags = this.info.knowladgeTags.join("|")
      data.chapterTags = this.info.chapterTags.join("|")
      data.authorArea = this.info.authorArea.map(el => {
        el = CodeToText[el]
        return el
      }).join("")
      let coverImage = await getVideoCover(`${this.baseUrl}/${this.fileName}`)
      console.log("data ->", data)
      const fd = new FormData()
      fd.append("author_name", this.info.authorName)
      fd.append("author_area", data.authorArea)
      fd.append("author_school", this.info.authorSchool)
      fd.append("author_intro", this.info.authorIntro)
      fd.append("class_title", this.info.authorSchool)
      fd.append("class_intro", this.info.authorSchool)
      fd.append("class_type", this.info.authorSchool)
      fd.append("class_level", this.info.authorSchool)
      fd.append("knowladge_tags", data.knowladgeTags)
      fd.append("chapter_tags", data.chapterTags)
      fd.append("cover_image", coverImage)
      fd.append("video_src", `${this.baseUrl}/${this.fileName}`)
      let res = await this.axios.post(`${this.baseUrl}/upload/submit`, fd, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      if (res.data.status == "success") {
        this.info = {
          authorName: "",
          authorIntro: "",
          authorSchool: "",
          classTitle: "",
          classIntro: "",
          chapterTags: [],
          knowladgeTags: [],
          classType: "",
          classLevel: "",
          authorArea: []
        }
        this.fileName = ""
        this.$message({
          type: "success",
          message: "上传成功"
        })
      }
      console.log("fd ->", fd)
    },
    checkForm() {
      if (!this.info.authorName) {
        this.$message.error("作者姓名不能为空！")
        return false;
      }
      if (this.info.authorArea.length == 0) {
        this.$message.error("作者地区不能为空！")
        return false;
      }
      if (!this.info.authorSchool) {
        this.$message.error("作者所属学校不能为空！")
        return false;
      }
      if (!this.info.classTitle) {
        this.$message.error("微课标题不能为空！")
        return false;
      }
      if (!this.info.classIntro) {
        this.$message.error("微课简介不能为空！")
        return false;
      }
      if (!this.info.classType) {
        this.$message.error("微课类型不能为空！")
        return false;
      }
      if (!this.info.classLevel) {
        this.$message.error("微课难度不能为空！")
        return false;
      }
      if (this.info.knowladgeTags.length == 0) {
        this.$message.error("知识点标签不能为空！")
        return false;
      }
      if (this.info.chapterTags.length == 0) {
        this.$message.error("章节标签不能为空！")
        return false;
      }
    },
    getCover() {

    }
  },
  mounted() {

  }
};
</script>

<style lang="less">
#wrap {
  background-color: rgba(0, 0, 0, 0.1);
  // min-height: 100vh;
  padding-top: 100px;
  padding-bottom: 50px;

  #upload {
    width: 1000px;
    background-color: #fff;
    min-height: calc(100vh - 140px);
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

    .info {
      margin-top: 50px;

      .form-items {
        width: 800px;

        margin: 0 auto;

        .form-item {
          width: 800px;
          display: flex;
          margin-bottom: 20px;
          justify-content: space-between;

          .label {
            width: 100px;
            text-align: left;
            line-height: 40px;
          }

          .label+div {
            width: calc(100% - 120px)
          }

          .el-cascader>.el-input {
            width: 300px;
            float: left;
          }

          .tags {
            display: flex;
            flex-wrap: wrap;

            .tag {
              margin-right: 20px;
              position: relative;
              height: 40px;
              margin-bottom: 10px;

              i {
                position: absolute;
                right: 5px;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;

                &:hover {
                  color: rgba(144, 187, 235, 1);
                }
              }

              .tag-item {
                background-color: rgba(144, 187, 235, 0.3);
                padding: 0px 20px;
                padding-right: 30px;
                height: 40px;
                line-height: 40px;
                display: inline-block;
                border-radius: 20px;
                outline: none;
              }
            }

            .add {
              font-size: 25px;
              line-height: 45px;

              i {
                color: rgba(144, 187, 235, 1);
                cursor: pointer;
                transition: 0.5s;

                &:hover {
                  color: rgba(0, 0, 0, .5);
                }
              }
            }
          }
        }
      }

      .submit {
        width: 800px;
        overflow: hidden;

        margin: 0 auto;

        .el-button {
          width: 200px;
          float: right;
        }

        margin-bottom:100px;
      }

      .author-info {
        padding-top: 20px;
        position: relative;
        margin-bottom: 50px;

        &::before {
          content: "作者信息";
          width: 100%;
          display: inline-block;
          text-align: left;
          border-bottom: 1px solid rgba(144, 187, 235, 1);
          color: rgba(144, 187, 235, 1);
          font-size: 18px;
          position: absolute;
          top: -20px;
          left: 0;
        }
      }

      .class-info {
        padding-top: 20px;
        position: relative;

        &::before {
          content: "微课信息";
          width: 100%;
          display: inline-block;
          text-align: left;
          border-bottom: 1px solid rgba(144, 187, 235, 1);
          color: rgba(144, 187, 235, 1);
          font-size: 18px;
          position: absolute;
          top: -20px;
          left: 0;
        }

        .knowladge-tags {
          .tag {
            input {
              width: 100px;
              outline: none;
              height: 30px;
              border: none;
              border-radius: 15px;
              background-color: rgba(144, 187, 235, 0.3);
              padding: 0 20px;
            }
          }
        }
      }
    }
  }

  .color-red {
    color: red;
  }
}
</style>