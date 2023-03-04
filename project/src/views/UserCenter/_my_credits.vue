<template>
  <!-- 我的积分 -->
  <div id="my-credits">
    <div class="credits">
      <div class="credits-info">
        <div class="current-credits">
          当前积分：{{ this.$store.state.loginCredentials.credits }}
        </div>
        <div
          class="credits-open"
          v-show="!showCreditsDetail"
          @click="openCreditsDetails()"
        >
          查看积分明细
        </div>
      </div>
      <transition name="slide-fade">
        <div class="credits-detail-items" v-show="showCreditsDetail">
          <el-table :data="creditsDetails" style="width: 100%">
            <el-table-column
              prop="date"
              label="日期"
              width="180"
              align="center"
            >
            </el-table-column
            ><el-table-column label="类型" width="200" align="center">
              <template slot-scope="scope">
                <span v-show="scope.row.type == 'add'">增加</span>
                <span v-show="scope.row.type == 'deduct'">扣除</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="credits_value"
              label="积分值"
              width="180"
              align="center"
            >
            </el-table-column
            ><el-table-column prop="change_type" label="描述" align="center">
            </el-table-column>
          </el-table>
          <div class="credits-detail-close" @click="showCreditsDetail = false">
            <i class="el-icon-arrow-up"></i> 收起
          </div>
        </div>
      </transition>
    </div>
    <el-calendar v-model="calendarDate">
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
      <template slot="dateCell" slot-scope="{ date, data }">
        <p
          style="line-height: 10px"
          :class="
            signInDates.includes(date.toISOString().split('T')[0])
              ? 'is-sign'
              : ''
          "
        >
          {{ data.day.split("-").slice(1).join("-") }}
          <br />
          <br />

          {{
            signInDates.includes(date.toISOString().split("T")[0])
              ? "已签到"
              : ""
          }}
        </p>
        <el-button
          v-show="
            !signInDates.includes(date.toISOString().split('T')[0]) &&
            date.getMonth() == calendarDate.getMonth() &&
            date.toISOString().split('T')[0] ==
              new Date().toISOString().split('T')[0]
          "
          @click="
            signIn(
              contrastDate(
                new Date().toISOString().split('T')[0],
                date.toISOString().split('T')[0]
              ),
              date
            )
          "
          :title="`签到获得${signinCredits}积分`"
          >签到
        </el-button>

        <el-button
          style="margin-left: 0"
          v-show="
            !signInDates.includes(date.toISOString().split('T')[0]) &&
            date.getMonth() == calendarDate.getMonth() &&
            contrastDate(
              new Date().toISOString().split('T')[0],
              date.toISOString().split('T')[0]
            )
          "
          @click="
            signIn(
              contrastDate(
                new Date().toISOString().split('T')[0],
                date.toISOString().split('T')[0]
              ),
              date
            )
          "
          :title="`补签消耗${retroactiveConsumptionCredits}积分`"
          >补签
        </el-button>
      </template>
    </el-calendar>
  </div>
</template>

<script>
import { formatTime } from "@/utils/index";
export default {
  data() {
    return {
      signinCreditsValue: this.$store.state.signinCreditsValue,
      signInDates: [],
      calendarDate: new Date(),
      signinCredits: 5,
      retroactiveConsumptionCredits: 3,
      showCreditsDetail: false,
      creditsDetails: [],
    };
  },
  methods: {
    async getSigninDates() {
      let res = await this.axios.get(
        `${this.$store.state.baseUrl}/user/signin/get`,
        {
          params: {
            userId: this.$store.state.loginCredentials.id,
          },
        }
      );
      if (res.data.status == "success") {
        this.signInDates = res.data.data.map((el) => {
          console.log(`el`, el);
          if (!!el) el = new Date(el).toISOString().split("T")[0];
          return el;
        });
      }
    },
    contrastDate(dateStr1, dateStr2) {
      // 日期格式为yyyy-mm-dd
      let [dateY1, dateM1, dateD1] = dateStr1.split("-");
      let [dateY2, dateM2, dateD2] = dateStr2.split("-");
      if (dateY1 > dateY2 || dateM1 > dateM2) {
        return true;
      }
      if (dateY1 == dateY2 && dateM1 == dateM2) {
        return dateD1 > dateD2;
      } else {
        return false;
      }
    },
    async signIn(isRetroactive, date) {
      console.log(isRetroactive);
      console.log(`date`, date);
      if (isRetroactive) {
        let res = await this.axios.get(
          `${this.$store.state.baseUrl}/user/signin/retroactive`,
          {
            params: {
              userId: this.$store.state.loginCredentials.id,
              userCredits: this.$store.state.loginCredentials.credits,
              date,
              creditsValue: this.signinCredits,
              consumptionCredits: this.retroactiveConsumptionCredits,
            },
          }
        );
        if (res.data.status == "success") {
          this.$message({
            type: "success",
            message: "补签成功",
          });
          this.getSigninDates();
        }
      } else {
      }
    },
    async openCreditsDetails() {
      this.showCreditsDetail = true;
      let res = await this.axios.get(
        `${this.$store.state.baseUrl}/user/credits/detail/get`,
        {
          params: {
            userId: this.$store.state.loginCredentials.id,
          },
        }
      );
      if (res.data.status == "success") {
        this.creditsDetails = res.data.data.map((el) => {
          el.date = formatTime(el.date);
          return el;
        });
      }
    },
  },
  mounted() {
    this.getSigninDates();
  },
};
</script>

<style lang="less">
.credits {
  width: 70%;
  margin: 0 auto;
  margin-bottom: 10px;
  overflow: hidden;
  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(-100px);
    opacity: 0;
  }
  .credits-detail-items {
    .credits-detail-close {
      background-color: #fff;
      font-size: 12px;
      color: cornflowerblue;
      padding: 10px 0;
      cursor: pointer;
    }
  }
  .credits-info {
    height: 40px;
    background-color: #fff;
    line-height: 40px;
    text-align: right;
    margin-bottom: 10px;
    border-radius: 15px;
    display: flex;
    justify-content: flex-end;
    .current-credits {
      margin-right: 20px;
      cursor: default;
    }
    .credits-open {
      font-size: 12px;
      margin-right: 20px;
      cursor: pointer;
      color: cornflowerblue;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
.el-calendar {
  width: 70%;

  margin: 0 auto;

  .el-calendar-table td.is-selected {
    background-color: #fff !important;
  }
  .is-selected {
    color: #2c3e50 !important;
  }
  .el-calendar-day {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .is-sign {
    color: #1989fa;
  }
}
</style>
