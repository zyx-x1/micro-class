<template>
  <div id="view" class="container">
    <!-- 访客信息 -->
    <div class="head">
      <div class="baseinfo">
        <h4>总访问</h4>
        <span>{{ baseinfo.total }}</span>
      </div>
      <div class="baseinfo">
        <h4>用户访问</h4>
        <span>{{ baseinfo.user }}</span>
      </div>
      <div class="baseinfo">
        <h4>游客访问</h4>
        <span>{{ baseinfo.visitor }}</span>
      </div>
      <div class="baseinfo">
        <h4>今日访问</h4>
        <span>{{ baseinfo.today }}</span>
      </div>
    </div>
    <div class="title">近14日访问信息</div>
    <div id="echart" ref="echart"></div>
  </div>
</template>
  
<script>
import * as echarts from "echarts";
export default {
  name: "main-index",
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      list: [],
      baseinfo: {
        total: 0,
        visitor: 0,
        today: 0,
        user: 0,
      },
      nearlyList: [],
      todayCount: 0,
      saveCount: 0,
      noUserCount: 0,
      option: {
        legend: {
          data: ["用户访问量", "游客访问量"],
        },
        xAxis: {
          type: "category",
          data: [], // x轴数据
          name: "日期", // x轴名称
          // x轴名称样式
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 18,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#000", // 字体颜色
              fontSize: 14, // 刻度字体大小
            },
          },
          axisTick: {
            //刻度相关设置
            show: false, //让刻度隐藏
          },
        },
        yAxis: {
          type: "value",
          name: "访问量",
          nameTextStyle: {
            fontWeight: 600,
            fontSize: 18,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#000", // 字体颜色
              fontSize: 14, // 刻度字体大小
            },
          },
          axisTick: {
            //刻度相关设置
            show: false, //让刻度隐藏
          },
        },
        label: {},
        tooltip: { trigger: "axis" },
        series: [
          {
            name: "用户访问量",
            data: [],
            type: "line",
          },
          {
            name: "游客访问量",
            data: [],
            type: "line",
          },
        ],
      },
    };
  },
  methods: {
    async getVisitorInfo() {
      this.list = (
        await this.axios.get(`${this.baseUrl}/visitor/get`)
      ).data.data;
      this.baseinfo = {
        total: this.list.length,
        visitor: this.list.filter((el) => el.visitor_type == "visitor").length,
        user: this.list.filter((el) => el.visitor_type == "user").length,
        today: this.list.filter((el) =>
          this.isSameDay(new Date(), new Date(el.date))
        ).length,
      };
      this.setAxis();
      echarts.init(this.$refs.echart).setOption(this.option);
    },
    setAxis() {
      let time = new Date();
      let year = time.getFullYear();
      let month = time.getMonth();
      let date = time.getDate();
      this.nearlyList = new Array(14).fill([]);
      if (date > 14) {
        let k = 13;
        for (let i = date; i > date - 14; i--) {
          this.option.xAxis.data.unshift(`${month + 1}-${i}`);
          this.nearlyList[k] = [];
          this.list.forEach((el) => {
            if (
              new Date(el.date).getFullYear() == year &&
              new Date(el.date).getMonth() == month &&
              new Date(el.date).getDate() == i
            ) {
              this.nearlyList[k].push(el);
            }
          });
          k--;
        }
      } else {
        let k = 13;
        for (let i = date; i > date - 14; i--) {
          this.nearlyList[k] = [];
          if (i <= 0) {
            let lastMonthDay = new Date(year, month, 0).getDate();
            this.option.xAxis.data.unshift(`${month}-${lastMonthDay + i}`);
            this.list.forEach((el) => {
              if (
                new Date(el.date).getFullYear() == year &&
                new Date(el.date).getMonth() == month - 1 &&
                new Date(el.date).getDate() == lastMonthDay + i
              ) {
                this.nearlyList[k].push(el);
              }
            });
          } else {
            this.option.xAxis.data.unshift(`${month + 1}-${i}`);
            this.list.forEach((el) => {
              if (
                new Date(el.date).getFullYear() == year &&
                new Date(el.date).getMonth() == month &&
                new Date(el.date).getDate() == i
              ) {
                this.nearlyList[k].push(el);
              }
            });
          }
          k--;
        }
      }
      this.nearlyList.forEach((el, i) => {
        this.option.series[0].data[i] = el.filter(
          (el) => el.visitor_type == "user"
        ).length;
        this.option.series[1].data[i] = el.filter(
          (el) => el.visitor_type == "visitor"
        ).length;
      });
    },
    isSameDay(dateObj1, dateObj2) {
      let year1 = dateObj1.getYear(),
        month1 = dateObj1.getMonth(),
        date1 = dateObj1.getDate();
      let year2 = dateObj2.getYear(),
        month2 = dateObj2.getMonth(),
        date2 = dateObj2.getDate();
      return year1 == year2 && month1 == month2 && date1 == date2;
    },
  },
  created() {
    this.getVisitorInfo();
  },
  mounted() {},
};
</script>
  
<style lang="less">
#view {
  .head {
    width: 85%;
    margin: 20px auto 50px;
    display: flex;
    justify-content: space-between;
    .baseinfo {
      width: 251px;
      height: 100px;
      padding: 10px;
      border-radius: 15px;
      color: #000;
      h4 {
        text-align: left;
        text-indent: 1em;
      }
      span {
        font-size: 40px;
        line-height: 60px;
        font-weight: bold;
      }
      &:nth-child(1) {
        background-color: rgba(127, 255, 212, 0.5);
      }
      &:nth-child(2) {
        background-color: rgba(101, 169, 224, 0.5);
      }
      &:nth-child(3) {
        background-color: rgba(101, 224, 117, 0.5);
      }
      &:nth-child(4) {
        background-color: rgba(224, 101, 197, 0.5);
      }
      &:hover {
        box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3);
      }
    }
  }
  #echart {
    width: 100%;
    height: calc(100% - 500px);
    margin: 20px auto;
  }
}
</style>