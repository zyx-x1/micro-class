<template>
  <div id="config" class="container">
    <el-card class="box-card">
      <h3 class="title item">Open AI配置</h3>
      <div class="item">
        <div class="label">Open AI SDK</div>
        <div class="input">
          <el-input v-model="configs.openai_sdk"></el-input>
        </div>
      </div>
      <div class="item">
        <div class="label">Open AI Model</div>
        <div class="input">
          <el-select
            class="model-select"
            v-model="configs.openai_model"
            slot="prepend"
            placeholder="请选择AI模型"
          >
            <el-option
              v-for="(item, index) in models"
              :key="index"
              :label="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="item">
        <div class="label">AI回答字数限制</div>
        <div class="input">
          <el-input v-model="configs.openai_max_token_size"></el-input>
        </div>
      </div>
      <div class="item">
        <div class="label"></div>
        <el-button @click="saveConfig">保存</el-button>
      </div>
    </el-card>
    <el-card class="box-card">
      <h3 class="title item">图片配置</h3>
      <div class="item">
        <div class="label lineh200">首页Banner</div>
        <div class="input image">
          <input
            type="file"
            class="image-upload"
            :style="{
              '--avatar': 'url(' + configs.index_banner + ')',
            }"
            name=""
            id=""
            accept="*"
            @change="changeBanner('index_banner', $event)"
          />
        </div>
      </div>
      <div class="item">
        <div class="label lineh200">二级页面Banner</div>
        <div class="input image">
          <input
            type="file"
            class="image-upload"
            :style="{
              '--avatar': 'url(' + configs.subpage_banner + ')',
            }"
            name=""
            id=""
            accept="*"
            @change="changeBanner('subpage_banner', $event)"
          />
        </div>
      </div>
      <div class="item">
        <div class="label lineh200">AI头像</div>
        <div class="input image small-circle-image">
          <input
            type="file"
            class="image-upload"
            :style="{
              '--avatar': 'url(' + configs.ai_avatar + ')',
            }"
            name=""
            id=""
            accept="*"
            @change="changeBanner('ai_avatar', $event)"
          />
        </div>
      </div>
      <div class="item">
        <div class="label lineh200">默认头像</div>
        <div class="input image small-circle-image">
          <input
            type="file"
            class="image-upload"
            :style="{
              '--avatar': 'url(' + configs.default_avatar + ')',
            }"
            name=""
            id=""
            accept="*"
            @change="changeBanner('default_avatar', $event)"
          />
        </div>
      </div>
      <div class="item">
        <div class="label"></div>
        <el-button @click="saveConfig">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "main-config",
  data() {
    return {
      configs: {},
      models: [],
    };
  },
  methods: {
    async getConfigs() {
      let res = await this.axios.get(
        `${this.$store.state.baseUrl}/admin/config/get`
      );
      this.configs = res.data.data;
      let modelRes = await this.axios.get("https://api.openai.com/v1/models", {
        params: {},
        headers: {
          Authorization:
            "Bearer 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",
        },
      });
      if (modelRes.status == 200) {
        this.models = modelRes.data.data;
      } else {
        this.$message.error("模型获取出错！请联系管理员后重试！");
      }
    },
    changeBanner(type, e) {
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
      let _this = this;
      reader.onload = function () {
        _this.configs[type] = reader.result;
      };
    },
    async saveConfig() {
      let res = await this.axios.post(
        `${this.$store.state.baseUrl}/admin/config/update`,
        this.configs,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (res.data.status == "success") {
        this.$message({
          type: "success",
          message: "保存成功！",
        });
      }
    },
  },
  mounted() {
    this.getConfigs();
  },
};
</script>

<style lang="less" scoped>
#config {
  overflow-y: auto;
  .lineh200 {
    line-height: 200px !important;
  }
  .el-card {
    margin-bottom: 20px;
    .item {
      margin: 20px auto;
      display: flex;
      .label {
        width: 200px;
        line-height: 40px;
        text-align: left;
        text-indent: 20px;
      }
      .input {
        width: 50%;
        display: flex;
      }
      .image {
        width: 500px;
      }
      .el-button {
        width: 50%;
      }
      .image-upload {
        width: 500px;
        height: 200px;
        float: left;
        position: relative;
        padding: 5px 0;
        color: #fff;

        &::before {
          content: "";
          width: 500px;
          height: 200px;
          position: absolute;
          top: 0;
          left: 0;
          background-color: #fff;
        }

        &::after {
          content: "";
          width: 500px;
          height: 200px;
          line-height: 200px;
          text-align: center;
          position: absolute;
          top: 0;
          left: 0;
          background-color: #fff;
          border: 1px dashed rgba(0, 0, 0, 0.3);
          background: var(--avatar);
          object-fit: cover;
          background-size: cover;
          transition: 0.5s;
          cursor: pointer;
          object-position: center;
        }

        &:hover::after {
          content: "选择图片";
          color: #000;
          filter: opacity(0.5);
        }
      }
      .small-circle-image {
        .image-upload {
          width: 200px;
          &::after {
            width: 200px;
            border-radius: 50%;
          }
        }
      }
    }
  }
}
</style>