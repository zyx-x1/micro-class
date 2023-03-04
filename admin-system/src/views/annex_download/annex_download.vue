<template>
  <div id="main" class="container" ref="download_records">
    <el-table :data="records" style="width: 100%">
      <el-table-column prop="id" label="ID" width="50" align="center">
      </el-table-column>
      <el-table-column prop="date" label="日期" align="center" width="180">
      </el-table-column>
      <el-table-column label="附件名" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ !!scope.row._file ? scope.row._file.filename : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="class_id"
        label="微课ID"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="credits"
        label="消耗积分"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="user_surplus_credits"
        label="用户剩余积分"
        width="180"
        align="center"
      >
      </el-table-column>
      <el-table-column align="center" label="用户">
        <template slot-scope="scope">
          <div
            style="display: flex; align-items: center; justify-content: center"
          >
            <img
              :src="!!scope.row._user ? scope.row._user.avatar : null"
              alt=""
              srcset=""
              style="
                width: 40px;
                height: 40px;
                margin-right: 10px;
                border-radius: 50%;
                background-size: cover;
                background-position: center;
              "
            />
            <span>{{
              !!scope.row._user ? scope.row._user.username : null
            }}</span>
          </div>
        </template>
      </el-table-column> </el-table
    ><el-pagination
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
import { formatTime } from "@/utils/index";
export default {
  data() {
    return {
      records: [],
      pager: {
        curr_page: 1,
        page_size: 0,
        total: 0,
      },
      pageSizes: [0, 0 * 2, 0 * 3],
    };
  },
  methods: {
    async getRecords() {
      let res = await this.axios.get(
        `${this.$store.state.baseUrl}/admin/downloadrecord/get`,
        {
          params: {
            currPage: this.pager.curr_page,
            pageSize: this.pager.page_size,
          },
        }
      );
      if (res.data.status == "success") {
        this.records = res.data.data.map((el) => {
          el.date = formatTime(el.date);
          return el;
        });
        this.pager.total = res.data.total;
      }
    },
    handleCurrentChange(val) {
      this.pager.curr_page = val;
      this.getRecords();
    },
    handleSizeChange(val) {
      this.pager.page_size = val;
      this.getRecords();
    },
    setPageSize() {
      this.$nextTick(() => {
        let pageSize = parseInt(
          (this.$refs.download_records.offsetHeight - 160) / 65
        );
        this.pager.page_size = pageSize;
        this.pageSizes = [pageSize, pageSize * 2, pageSize * 3];
      });
    },
  },
  mounted() {
    this.setPageSize();
    let timer = setInterval(() => {
      if (!this.pager.page_size == false) {
        this.getRecords();
        clearInterval(timer);
      }
    }, 50);
  },
};
</script>

<style lang="less" scoped></style>
