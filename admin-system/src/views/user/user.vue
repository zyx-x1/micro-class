<template>
  <div id="user" ref="wrap" class="container">
    <el-select
      style="width: 300px; float: left; margin: 20px"
      v-model="user_type"
      placeholder="请选择用户类别"
      @change="getTableData()"
    >
      <el-option label="全部" value=""></el-option>
      <el-option label="普通用户" value="user"></el-option>
      <el-option label="管理员" value="admin"></el-option>
    </el-select>
    <el-table
      :data="tableData"
      style="width: 100%; min-height: 400px; padding: 0 20px"
    >
      <el-table-column prop="id" sortable label="ID" align="center" width="180">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名"
        align="center"
        width="180"
      >
      </el-table-column>
      <el-table-column align="center" label="头像">
        <template slot-scope="scope">
          <img
            :src="scope.row.avatar"
            alt=""
            srcset=""
            style="
              width: 60px;
              height: 60px;
              background-size: cover;
              background-position: center;
            "
          />
        </template>
      </el-table-column>
      <el-table-column prop="email" align="center" label="邮箱">
      </el-table-column>
      <el-table-column
        prop="signuptime"
        sortable
        align="center"
        label="注册时间"
      >
      </el-table-column>
      <el-table-column
        prop="username_updatetime"
        align="center"
        sortable
        label="上次修改用户名时间"
      >
      </el-table-column>
      <el-table-column align="center" label="权限">
        <template slot-scope="scope">
          <span v-show="scope.row.user_type == 'admin'">管理员</span>
          <span v-show="scope.row.user_type == 'user'">普通用户</span>
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
import { formatTime } from "@/utils";
export default {
  name: "main-user",
  data() {
    let pageSize = 0;

    return {
      user_type: "",
      tableData: [],
      pager: {
        curr_page: 1,
        page_size: pageSize,
        total: 0,
      },
      pageSizes: [pageSize, pageSize * 2, pageSize * 3],
    };
  },
  methods: {
    // formatDate(row, column){
    //     return formatTime(row.column)
    // },
    async getTableData() {
      const res = await this.axios.get(
        `${this.$store.state.baseUrl}/admin/userinfo/get`,
        {
          params: {
            user_type: this.user_type,
            currPage: this.pager.curr_page,
            pageSize: this.pager.page_size,
          },
        }
      );
      this.tableData = res.data.data.map((el) => {
        el.signuptime = formatTime(el.signuptime);
        el.username_updatetime = formatTime(el.username_updatetime);
        return el;
      });
      this.pager.total = res.data.total;
    },
    handleCurrentChange(val) {
      this.pager.curr_page = val;
      this.getTableData();
    },
    handleSizeChange(val) {
      this.pager.page_size = val;
      this.getTableData();
    },
    setPageSize() {
      this.$nextTick(() => {
        let pageSize = parseInt((this.$refs.wrap.offsetHeight - 190) / 100);
        this.pager.page_size = pageSize;
        this.pageSizes = [pageSize, pageSize * 2, pageSize * 3];
      });
    },
  },
  created() {},
  mounted() {
    this.setPageSize();
    console.log(this.pager.page_size);
    let timer = setInterval(() => {
      if (this.pager.pageSize !== 0) {
        this.getTableData();
        clearInterval(timer);
      }
    }, 50);
  },
};
</script>
  
<style lang="less">
#user {
}
</style>