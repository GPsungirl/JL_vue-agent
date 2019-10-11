<template>
  <div class="dashboard-container">
    <p class="title">
      <span>{{agent_name}}</span>
      ，欢迎登陆角落管理系统，您的机构代码为
      <span>{{agentid}}</span>
    </p>
    <div class="main_content">
      <el-row>
        <el-col :span="8" :offset="4">
          <div class="grid-content bg-purple box_shadow">
            <p class="jl_layout_center">上月收益</p>
            <el-row style="margin-bottom:10px;margin-top:30px">
              <el-col :span="10" style="text-align:right">
                <span>贝壳收入：</span>
              </el-col>
              <el-col :span="14" style="text-align:left;padding-left:10px">
                <span>{{ lastMonth_virtualamount }}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" style="text-align:right">
                <span>出行收入：</span>
              </el-col>
              <el-col :span="14" style="text-align:left;padding-left:10px">
                <span>{{ lastMonth_accountamount }}</span>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple box_shadow">
            <p class="jl_layout_center">昨日收益</p>
            <el-row style="margin-bottom:10px;margin-top:30px">
              <el-col :span="10" style="text-align:right">
                <span>贝壳收入：</span>
              </el-col>
              <el-col :span="14" style="text-align:left;padding-left:10px">
                <span>{{ yesterday_virtualamount }}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10" style="text-align:right">
                <span>出行收入：</span>
              </el-col>
              <el-col :span="14" style="text-align:left;padding-left:10px">
                <span>{{ yesterday_accountamount }}</span>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <!-- <el-col :span="8">
          <div class="grid-content bg-purple box_shadow">
            <p class="jl_layout_center">本月收益</p>
          </div>
        </el-col>-->
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import commonUrl from "../../utils/common";
import qs from "qs";
import { setTimeout } from "timers";
export default {
  name: "Dashboard",
  data() {
    return {
      agent_name: "",
      agentid: "",
      // 昨日收益
      yesterday_virtualamount: "",
      yesterday_accountamount: "",
      // 上月收益
      lastMonth_virtualamount: "",
      lastMonth_accountamount: ""
    };
  },
  created() {
    // 初始化数据
    this.getData();
    console.log(this.getYestoday());
  },
  computed: {
    ...mapGetters(["name", "roles"])
  },
  methods: {
    // 初始化数据
    getData() {
      // 机构信息
      let _param1 = {
        data: {
          // 公有
          signInUserId: this.$store.getters.userId
        }
      };
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http
        .post(`${commonUrl.baseUrl}/agent/selectAgentInfo`, _param1)
        .then(res => {
          if (res.data.code == "0000") {
            let result = res.data.data.userAgent;
            this.agent_name = result.agent_name;
            this.agentid = result.agentid;

            // 昨日收益 和上月收益
            this.getEarnings(loading);
          } else {
            this.m_message(res.data.msg, "warning");
            loading.close();
          }
        })
        .catch(err => {});
    },
    // 获取昨日收益 上月收益
    getEarnings() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      // 昨日收益
      let _param1 = {
        data: {
          agentid: this.agentid,
          yesterday: this.getYestoday()
        }
      };
      // 上月收益
      let _param2 = {
        data: {
          agentid: this.agentid,
          month: this.getLastMonth()
        }
      };

      let _promise1 = this.$http.post(
        `${commonUrl.baseUrl}/ProfitAgentRecord/selectYesterdayAgentEarnings`,
        _param1
      );
      let _promise2 = this.$http.post(
        `${commonUrl.baseUrl}/agentAccount/selectLastMonthAgentEarnings`,
        _param2
      );

      Promise.all([_promise1, _promise2])
        .then(res => {
          let [res1, res2] = res;
          console.log(res);
          // 昨日收益
          if (res1.data.code == "0000") {
            let result = res1.data.data;
            if (result.agentVirtualEarnings) {
              this.yesterday_virtualamount =
                result.agentVirtualEarnings.virtualAmount + "贝壳";
            }
            if (result.agentAccountEarnings) {
              this.yesterday_accountamount =
                result.agentAccountEarnings.accountAmount  + "元";
            }
          } else {
            // setTimeout(()=>{this.m_message(res1.data.msg, "warning");},1)
          }
          console.log(res2);
          // 上月收益
          if (res2.data.code == "0000") {
            let result = res2.data.data.agentAccount;
            this.lastMonth_virtualamount = result.virtualMonthTotal + "贝壳";
            this.lastMonth_accountamount =
              result.accountMonthTotal + "元";
          } else {
            //  setTimeout(()=>{this.m_message(res2.data.msg, "warning");},1)
          }

          loading.close();
        })
        .catch(err => {});
    },
    // 获取 昨日 日期
    getYestoday() {
      var day1 = new Date();
      day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
      var _month =
        day1.getMonth() + 1 < 10
          ? "0" + (day1.getMonth() + 1)
          : day1.getMonth() + 1;
      var _date = day1.getDate() < 10 ? "0" + day1.getDate() : day1.getDate();
      var s1 = day1.getFullYear() + ''+ _month + ''+_date;
      return s1;
    },
    // 获取 上月
    getLastMonth() {
      /*默认显示上个月的日期*/
      var nowdays = new Date();
      var year = nowdays.getFullYear();
      var month = nowdays.getMonth();
      if (month == 0) {
        month = 12;
        year = year - 1;
      }
      if (month < 10) {
        month = "0" + month;
      }
      var firstDay = year + month;
      return firstDay;
    },
    // 提示信息 message:提示信息   type 提示类型
    m_message(message, type) {
      this.$message({
        message,
        type
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  .font14 {
    font-size: 12px;
  }
}
.main_content {
  margin-top: 40px;
}
.title {
  color: #666;
  text-align: center;
}
.title span {
  color: #000;
}
</style>
<style scoped>
.box .myBtn {
  color: gray;
  background: gray;
}
</style>
