<template>
  <div id="detail" class="container">
    <div class="wrap">
      <div class="left">
        <h3 class="title">{{ data.title }}</h3>
        <div class="creator">
          投稿人：
          <img :src="!!data._user ? data._user.avatar : ''" alt="" srcset="" />
          <div class="name">
            {{ !!data._user ? data._user.username : "" }}
          </div>
        </div>
        <video
          id="play_container"
          :src="data.video_src"
          controls
          style="width: 100%"
        ></video>
        <div class="micro-class">
          <div class="tags">
            <span
              class="tag"
              v-for="(item, index) in !!data.knowledge_information
                ? data.knowledge_information.split('|')
                : []"
              :key="index"
              @click="tagSearch(item)"
              >{{ item }}</span
            >
          </div>
          <div class="intro text-align-left">
            <span class="bold">微课简介：</span> {{ data.content_description }}
          </div>
          <div class="type text-align-left">
            <span class="bold">微课类型：</span> {{ data.type }}
          </div>
          <div class="level text-align-left">
            <span class="bold">微课难度：</span> {{ data.level }}
          </div>
          <div
            class="file text-align-left"
            style="
              line-height: 40px;
              user-select: none;
              cursor: default;
              color: rgba(144, 187, 235, 1);
            "
          >
            <span class="bold" style="color: #000">微课附件：</span>
            {{ !!data._file ? data._file.filename : "无 " }}
          </div>
        </div>
      </div>
      <div class="right">
        <h4 class="right-title">作者简介</h4>
        <div class="author-item author-avatar">
          <img :src="data.author_avatar" alt="" srcset="" />
          <div class="name">
            {{ data.author_name }}
          </div>
        </div>
        <div class="author-item">
          {{ data.author_area }}
        </div>
        <div class="author-item">
          {{ data.author_school }}
        </div>
        <div class="author-item author-introduce">
          {{ data.author_introduce }}
        </div>
      </div>
    </div>
    <div class="submit">
      <el-button type="info" @click="refuse">不通过</el-button>
      <el-button type="primary" @click="pass">通过</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "audit-detail",
  data() {
    return {
      id: -1,
      data: {},
    };
  },
  methods: {
    getId() {
      let search = location.hash.split("?")[1];
      let searchParams = search.split("&");
      let obj = {};
      searchParams.forEach((el) => {
        obj[el.split("=")[0]] = el.split("=")[1];
      });
      this.id = obj.id;
    },
    async getData() {
      this.getId();
      let res = await this.axios.get(`${this.$store.state.baseUrl}/class/get`, {
        params: {
          id: this.id,
        },
      });
      this.data = res.data.data[0];
    },
    pass() {
      this.$confirm("是否确认审核通过此微课？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "通过",
        cancelButtonText: "放弃",
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "审核完成",
          });
          let res = await this.axios.get(
            `${this.$store.state.baseUrl}/admin/audit/submit`,
            {
              params: {
                status: "pass",
                id: this.id,
                creatorId: this.data.creator_id,
                adminName: this.$store.state.loginCredentials.username,
                admin: this.$store.state.loginCredentials.id,
              },
            }
          );
          if (res.data.status == "success") {
            this.$router.push("/audit");
          }
        })
        .catch((action) => {
          this.$message({
            type: "info",
            message: action === "cancel" ? "放弃操作" : "停留在当前页面",
          });
        });
    },
    refuse() {
      this.$confirm("此操作将拒绝通过此微课, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.axios.get(
            `${this.$store.state.baseUrl}/admin/audit/submit`,
            {
              params: {
                status: "refuse",
                id: this.id,
                admin: this.$store.state.loginCredentials.id,
                creatorId: this.data.creator_id,
                adminName: this.$store.state.loginCredentials.username,
              },
            }
          );
          if (res.data.status == "success") {
            this.$router.push("/audit");
            this.$message({
              type: "success",
              message: "审核成功!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "操作已取消",
          });
        });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style lang="less">
#detail {
  overflow-y: auto;
  .bold {
    font-weight: bold;
  }
  .text-align-left {
    text-align: left;
    line-height: 30px;
  }
  .wrap {
    width: 70%;
    margin: 0 auto;
    display: flex;
    .left {
      width: 65%;
      .creator {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px 0;
        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin: auto 10px;
        }
      }
      .micro-class {
        .tags {
          width: 100%;
          display: flex;
          margin: 10px 0;

          .tag {
            background-color: #f1f2f3;
            margin: 5px;
            padding: 4px 8px;
            border-radius: 20px;
            user-select: none;
            cursor: pointer;
          }
        }
        .intro {
          text-align: left;
        }
      }
    }
    .right {
      width: 30%;
      margin-left: 50px;
      margin-top: 110px;
      background-color: rgba(0, 0, 0, 0.1);
      padding: 20px;
      border-radius: 15px;
      .author-item {
        text-align: left;
        margin: 10px auto;
        font-size: 14px;
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }
      .author-avatar {
        text-align: center;
      }
      .author-introduce {
        text-indent: 2em;
      }
    }
  }
  .submit {
    width: 70%;
    margin: 20px auto 0;
    display: flex;
    justify-content: space-between;
    .el-button {
      width: 48%;
    }
  }
}
</style>
