<template>
  <!-- 我的积分 -->
  <div id="my-credits">
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
          >补签
        </el-button>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      signinCreditsValue: this.$store.state.signinCreditsValue,
      signInDates: [],
      calendarDate: new Date(),
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
              creditsValue: this.signinCreditsValue,
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
  },
  mounted() {
    this.getSigninDates();
  },
};
</script>

<style lang="less">
.el-calendar {
  width: 70%;
  height: 45vh;
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