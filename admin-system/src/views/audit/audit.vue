<template>
  <div id="audit" class="container" ref="audit">
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{ prop: 'date', order: 'descending' }"
    >
      <el-table-column prop="id" label="id" sortable width="180">
      </el-table-column>
      <el-table-column prop="title" label="标题" sortable width="180">
      </el-table-column>
      <el-table-column prop="upload_time" label="上传时间" sortable width="180">
      </el-table-column>
      <el-table-column align="center" label="投稿人">
        <template slot-scope="scope">
          <div class="creator">
            <img
              :src="!!scope.row._user ? scope.row._user.avatar : null"
              alt=""
              srcset=""
              style="
                width: 60px;
                height: 60px;
                background-size: cover;
                background-position: center;
              "
            />
            <span style="line-height: 120px">{{
              !!scope.row._user ? scope.row._user.username : null
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="作者">
        <template slot-scope="scope">
          <div class="creator">
            <img
              :src="scope.row.author_avatar"
              alt=""
              srcset=""
              style="
                width: 60px;
                height: 60px;
                background-size: cover;
                background-position: center;
              "
            />
            <span style="line-height: 200px">{{ scope.row.author_name }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="author_school"
        label="作者学校"
        align="center"
        sortable
        width="180"
      >
      </el-table-column>
      <el-table-column align="center" label="视频">
        <template slot-scope="scope">
          <video
            id="play_container"
            :src="scope.row.video_src"
            controls
            style="width: 200px; max-height: 120px"
          ></video>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div class="creator">
            <el-button @click="toDetail(scope.row)">详情</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="
        position: absolute;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
      "
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-size="pager.page_size"
      :page-sizes="pageSizes"
      layout="total, prev, pager, sizes, next,jumper"
      :total="pager.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { formatTime } from "../../utils/index";
export default {
  name: "main-audit",
  data() {
    let pageSize = 0;
    return {
      pager: {
        curr_page: 1,
        page_size: pageSize,
        total: 0,
      },
      pageSizes: [pageSize, pageSize * 2, pageSize * 3],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
    };
  },
  methods: {
    async getAuditVideo() {
      let res = await this.axios.get(
        `${this.$store.state.baseUrl}/admin/audit/get`,
        {
          params: {
            currPage: this.pager.curr_page,
            pageSize: this.pager.page_size,
          },
        }
      );
      console.log("res ->", res);
      this.tableData = res.data.data.map((el) => {
        el.upload_time = formatTime(el.upload_time);
        return el;
      });
      this.pager.total = res.data.total;
    },
    handleCurrentChange(val) {
      this.pager.curr_page = val;
      this.getAuditVideo();
    },
    handleSizeChange(val) {
      this.pager.page_size = val;
      this.getAuditVideo();
    },
    setPageSize() {
      this.$nextTick(() => {
        let pageSize = parseInt((this.$refs.audit.offsetHeight - 190) / 200);
        this.pager.page_size = pageSize;
        this.pageSizes = [pageSize, pageSize * 2, pageSize * 3];
      });
    },
    toDetail(row) {
      this.$router.push(`/audit/detail?id=${row.id}`);
    },
  },
  mounted() {
    this.setPageSize();
    let timer = setInterval(() => {
      if (!this.pager.page_size == false) {
        this.getAuditVideo();
        clearInterval(timer);
      }
    }, 50);
  },
};
</script>

<style lang="less">
#audit {
  .creator {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      margin-right: 10px;
      border-radius: 50%;
    }
  }
  .el-table__row {
    height: 150px !important;
  }
}
</style>