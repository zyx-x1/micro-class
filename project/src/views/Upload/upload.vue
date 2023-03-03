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
          ref="video_upload"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将视频拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            只能上传视频文件，且不超过100MB
          </div>
        </el-upload>
      </div>
      <div class="form-items">
        <div class="form-item">
          <div class="label">
            上传附件 <span class="color-red">*</span>
            <i
              class="el-icon-warning-outline"
              title="仅支持上传pptx文件
  文件大小限制为10MB
  当前仅支持上传一个附件"
              style="margin-left: 5px; font-size: 14px; line-height: 16px"
            ></i>
          </div>
          <div class="annex-container" style="display: flex">
            <input
              type="file"
              class="class-annex"
              ref="annex"
              accept=".pptx"
              :style="{ '--annex': `url(${uploadAnnexIcon})` }"
              v-show="!annex.file"
              @change="uploadAnnex($event)"
            />
            <div class="annex-name">
              {{ annex.fileName }}
            </div>
            <div class="annex-remove" v-show="annex.file">
              <i
                class="el-icon-close annex-remove-icon"
                @click="removeAnnex"
              ></i>
            </div>
          </div>
        </div>
        <div class="form-item">
          <div class="label">附件下载积分 <span class="color-red">*</span></div>
          <el-input v-model="annex.credits"></el-input>
        </div>
      </div>
      <div class="info">
        <div class="author-info form-items">
          <div class="form-item author-name">
            <div class="label">作者姓名 <span class="color-red">*</span></div>
            <el-input
              placeholder="请输入作者姓名"
              v-model="info.authorName"
              clearable
            >
            </el-input>
          </div>
          <div class="form-item author-avatar">
            <div class="label">作者图片 <span class="color-red"> </span></div>
            <input
              type="file"
              class="author-avatar-upload"
              :style="{
                '--avatar': !!info.authorAvatar
                  ? 'url(' + info.authorAvatar + ')'
                  : 'url(' + defaultAvatar + ')',
              }"
              @change="uploadAuthorAvatar($event)"
              name=""
              id=""
              accept="*"
            />
          </div>
          <div class="form-item author-area">
            <div class="label">所在地区 <span class="color-red">*</span></div>
            <el-cascader
              size="large"
              :options="options"
              v-model="info.authorArea"
              @change="handleChange"
            >
            </el-cascader>
          </div>
          <div class="form-item author-school">
            <div class="label">所属学校 <span class="color-red">*</span></div>
            <el-input
              placeholder="请输入所属学校"
              v-model="info.authorSchool"
              clearable
            >
            </el-input>
          </div>
          <div class="form-item author-area">
            <div class="label">作者简介 <span class="color-red">*</span></div>
            <el-input
              type="textarea"
              placeholder="请输入作者简介"
              v-model="info.authorIntro"
              clearable
              maxlength="30"
              show-word-limit
            >
            </el-input>
          </div>
        </div>
        <div class="class-info form-items">
          <div class="form-item class-title">
            <div class="label">微课标题 <span class="color-red">*</span></div>
            <el-input
              placeholder="请输入微课标题"
              v-model="info.classTitle"
              clearable
            >
            </el-input>
          </div>
          <div class="form-item class-intro">
            <div class="label">微课简介 <span class="color-red">*</span></div>
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="info.classIntro"
              maxlength="30"
              show-word-limit
            >
            </el-input>
          </div>
          <div class="form-item class-type">
            <div class="label">微课类型 <span class="color-red">*</span></div>
            <el-select
              placeholder="请选择微课类型"
              v-model="info.classType"
              clearable
            >
              <el-option
                v-for="item in typeOptions"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="form-item class-level">
            <div class="label">微课难度 <span class="color-red">*</span></div>
            <el-select
              placeholder="请选择微课难度"
              v-model="info.classLevel"
              clearable
            >
              <el-option
                v-for="item in levelOptions"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="form-item knowladge-tags">
            <div class="label">知识点标签 <span class="color-red">*</span></div>
            <div class="tags">
              <div
                class="tag"
                v-for="(item, index) in info.knowladgeTags"
                :key="index"
                title="点击标签外即可自动保存"
              >
                <span
                  class="tag-item"
                  @click="tagGetFocus($event)"
                  ref="tag"
                  contenteditable="true"
                  v-show="!knowladgeTagFoucs[index]"
                  @blur="updateTag($event, 'knowladge', index)"
                  >{{ item }}</span
                >
                <i
                  v-show="index == info.knowladgeTags.length - 1"
                  class="el-icon-close"
                  title="删除此标签项"
                  @click="deleteTag('knowladge', index)"
                ></i>
              </div>
              <div class="add" @click="addTag('knowladge')">
                <i class="el-icon-circle-plus-outline"></i>
              </div>
            </div>
          </div>
          <div class="form-item chapter-tags">
            <div class="label">章节标签 <span class="color-red">*</span></div>
            <div class="tags">
              <div
                class="tag"
                v-for="(item, index) in info.chapterTags"
                :key="index"
                title="点击标签外即可自动保存
                                                                                                                                                                                                                                                                                                                                                                                                                            最长可输入20字"
              >
                <span
                  class="tag-item"
                  @click="tagGetFocus($event)"
                  ref="tag"
                  contenteditable="true"
                  v-show="!chapterTagFoucs[index]"
                  @blur="updateTag($event, 'chapter', index)"
                  @keydown="stopInput($event)"
                  >{{ item }}</span
                >
                <i
                  v-show="index == info.chapterTags.length - 1"
                  class="el-icon-close"
                  title="删除此标签项"
                  @click="deleteTag('chapter', index)"
                ></i>
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
import { getVideoCover } from "../../utils/index";
import uploadAnnexIcon from "../../../static/images/upload_annex.png";

export default {
  data() {
    return {
      defaultAvatar: null,
      uploadAnnexIcon: uploadAnnexIcon,
      baseUrl: this.$store.state.baseUrl,
      accept: ".mp4,.avi,.wmv",
      fileName: "",
      info: {
        authorName: "",
        authorAvatar: "",
        authorIntro: "",
        authorSchool: "",
        classTitle: "",
        classIntro: "",
        chapterTags: [],
        knowladgeTags: [],
        classType: "",
        classLevel: "",
        authorArea: [],
      },
      annex: {
        fileName: "",
        fileSize: 0,
        file: null,
        fileType: "",
        maxFileSize: 1024 * 1024 * 10,
        credits: 0,
      },
      options: regionData,
      knowladgeTagFoucs: [],
      chapterTagFoucs: [],
      typeOptions: ["讲授", "解题", "答疑", "实验", "其他类型"],
      levelOptions: [
        "简单（入门学习）",
        "普通（基本运用）",
        "困难（提高扩展）",
      ],
    };
  },
  methods: {
   
    removeAnnex() {
      this.annex = {
        fileName: "",
        fileSize: 0,
        file: null,
        fileType: "",
        maxFileSize: 1024 * 1024 * 10,
      };
      this.$refs.annex.value = "";
    },
    async getDefaultAvatar() {
      let res = await this.axios.get(
        `${this.baseUrl}/config/default_avatar/get`
      );
      this.defaultAvatar = res.data.data;
    },
    uploadAnnex(e) {
      console.log(e.target.files);
      let file = e.target.files[0];

      let fileType = file.type;
      if (
        fileType !==
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        this.$message.error("请上传pptx文件！");
        return;
      }
      let fileSize = file.size;
      if (fileSize > this.annex.maxFileSize) {
        this.$message.error("文件大小超出限制!");
        return;
      }
      let fileName = file.name;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.annex = {
          fileName,
          fileSize,
          file: reader.result,
          fileType,
          maxFileSize: this.annex.maxFileSize,
        };
      };
    },
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
      this.info[`${type}Tags`].push(" ");
      this[`${type}TagFoucs`].push(false);
    },
    updateTag(e, type, index) {
      this[`${type}TagFoucs`][index] = false;
      e.target.setAttribute("contenteditable", false);
      if (!e.target.textContent.trim()) {
        this.info[`${type}Tags`].splice(index, 1);
        this[`${type}TagFoucs`].splice(index, 1);
      } else {
        this.info[`${type}Tags`][index] = e.target.textContent;
      }
    },
    deleteTag(type, index) {
      this.info[`${type}Tags`].splice(index, 1);
    },
    tagGetFocus(e) {
      e.target.setAttribute("contenteditable", true);
      e.target.focus();
    },
    async submit() {
      let isLegitimacy = this.checkForm();
      // if (!isLegitimacy) return;
      let data = JSON.parse(JSON.stringify(this.info));
      data.knowladgeTags = this.info.knowladgeTags.join("|");
      data.chapterTags = this.info.chapterTags.join("|");
      data.authorArea = this.info.authorArea
        .map((el) => {
          el = CodeToText[el];
          return el;
        })
        .join("");
      let coverImage = await getVideoCover(`${this.baseUrl}/${this.fileName}`);
      console.log("data ->", data);
      const fd = new FormData();
      fd.append("author_name", this.info.authorName);
      fd.append(
        "author_avatar",
        !!this.info.authorAvatar ? this.info.authorAvatar : this.defaultAvatar
      );
      fd.append("fileName", this.annex.fileName);
      fd.append("file", this.annex.file);
      fd.append("fileCredits", this.annex.credits);
      fd.append("fileType", this.annex.fileType);
      fd.append("author_area", data.authorArea);
      fd.append("author_school", this.info.authorSchool);
      fd.append("author_intro", this.info.authorIntro);
      fd.append("class_title", this.info.authorSchool);
      fd.append("class_intro", this.info.authorSchool);
      fd.append("class_type", this.info.authorSchool);
      fd.append("class_level", this.info.authorSchool);
      fd.append("knowladge_tags", data.knowladgeTags);
      fd.append("chapter_tags", data.chapterTags);
      fd.append("cover_image", coverImage);
      fd.append("video_src", `${this.baseUrl}/${this.fileName}`);
      fd.append("creator_id", this.$store.state.loginCredentials.id);
      let res = await this.axios.post(`${this.baseUrl}/upload/submit`, fd, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
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
          authorArea: [],
        };
        this.fileName = "";
        this.$message({
          type: "success",
          message: "微课已提交管理员审核，审核完成后会以消息形式对您进行通知。",
        });
      }
      this.$refs.annex.value = "";
      this.$refs.video_upload.value = "";
    },
    checkForm() {
      if (!this.fileName) {
        this.$message.error("请上传视频！");
        return false;
      }
      if (!this.annex.file) {
        this.$message.error("请上传附件！");
        return false;
      }
      if (!this.annex.credits) {
        this.$message.error("请设置附件积分！");
        return false;
      }
      if (!this.info.authorName) {
        this.$message.error("作者姓名不能为空！");
        return false;
      }
      if (this.info.authorArea.length == 0) {
        this.$message.error("作者地区不能为空！");
        return false;
      }
      if (!this.info.authorSchool) {
        this.$message.error("作者所属学校不能为空！");
        return false;
      }
      if (!this.info.classTitle) {
        this.$message.error("微课标题不能为空！");
        return false;
      }
      if (!this.info.classIntro) {
        this.$message.error("微课简介不能为空！");
        return false;
      }
      if (!this.info.classType) {
        this.$message.error("微课类型不能为空！");
        return false;
      }
      if (!this.info.classLevel) {
        this.$message.error("微课难度不能为空！");
        return false;
      }
      if (this.info.knowladgeTags.length == 0) {
        this.$message.error("知识点标签不能为空！");
        return false;
      }
      if (this.info.chapterTags.length == 0) {
        this.$message.error("章节标签不能为空！");
        return false;
      }
    },
    uploadAuthorAvatar(e) {
      let _this = this;
      let file = e.target.files[0];
      let fileSize = file.size;
      let fileType = file.type;
      if (fileType.split("/")[0] !== "image") {
        this.$message.error("格式异常！请上传正确格式的图片!");
        return;
      }
      if (fileSize > 1024 * 1024 * 10) {
        this.$message.error("图片过大！请勿上传10MB以上的图片!");
        return;
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        _this.info.authorAvatar = reader.result;
      };
    },
    checkLogin() {
      let status = this.$store.state.loginCredentials.status;
      if (!status) this.$router.push("/login");
    },
  },
  mounted() {
    this.getDefaultAvatar();
    this.checkLogin();
  },
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
      margin-bottom: 50px;
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
    .form-items {
      width: 800px;

      margin: 0 auto;

      .form-item {
        width: 800px;
        display: flex;
        margin-bottom: 20px;
        // justify-content: space-between;

        .label {
          width: 150px;
          text-align: left;
          line-height: 40px;
        }

        .label + div {
          width: calc(100% - 150px);
        }
        .class-annex {
          position: relative;
          width: 210px;
          height: 40px;
          outline: none;
          margin-right: 20px;
          &::before {
            content: "";
            width: 210px;
            height: 40px;
            position: absolute;
            top: 0;
            left: 0;
            background-color: #fff;
          }
          &::after {
            content: "";
            width: 200px;
            height: 38px;
            position: absolute;
            top: 0;
            left: 0;
            background-image: var(--annex);
            background-repeat: no-repeat;
            background-position: center;
            border: 1px dashed rgba(0, 0, 0, 0.1);
          }
        }
        .annex-name {
          line-height: 40px;
          user-select: none;
          cursor: default;
          color: rgba(144, 187, 235, 1);
        }
        .annex-remove {
          .annex-remove-icon {
            line-height: 40px;
            margin-left: 5px;
            cursor: pointer;
            &:hover {
              color: #f56c6c;
            }
          }
        }
        .el-cascader > .el-input {
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
                color: rgba(0, 0, 0, 0.5);
              }
            }
          }
        }
      }

      .author-avatar {
        justify-content: unset;
        // margin-left: 20px;

        .author-avatar-upload {
          width: 110px;
          height: 100px;
          float: left;
          position: relative;
          padding: 5px 0;
          color: #fff;
          margin-left: 20px;

          &::before {
            content: "";
            width: 110px;
            height: 100px;
            position: absolute;
            top: 0;
            left: 0;
            background-color: #fff;
          }

          &::after {
            content: "";
            width: 100px;
            height: 100px;
            line-height: 100px;
            text-align: center;
            position: absolute;
            top: 0;
            left: 0;
            background-color: #fff;
            border: 1px dashed rgba(0, 0, 0, 0.3);
            border-radius: 50%;
            background: var(--avatar);
            object-fit: cover;
            background-size: cover;
            transition: 0.5s;
            cursor: pointer;
          }

          &:hover::after {
            content: "选择图片";
            color: #000;
            filter: opacity(0.5);
          }
        }
      }
    }
    .info {
      margin-top: 50px;

      .submit {
        width: 800px;
        overflow: hidden;

        margin: 0 auto;

        .el-button {
          width: 200px;
          float: right;
        }

        margin-bottom: 100px;
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