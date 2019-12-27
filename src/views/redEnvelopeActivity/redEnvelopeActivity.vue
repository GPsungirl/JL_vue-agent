<template>
  <div class="dashboard-container">
    <p class="title">
      账户余额：
      <span>{{dataForm.accountRemain}}</span>
      元
    </p>
    <p class="title zh_tip">
      账户余额目前采用对公转账方式充值，如需开启红包活动，请联系总部完成充值
    </p>
    <div class="main_content redEnverlop">
      <el-row>
        <!-- 活动未开始 -->
        <el-col v-show="showUnactive" :span="12" :offset="6">
          <div class="grid-content bg-purple box_shadow">
            <el-form  :model="dataForm" :rules="dataFormrules" ref="dataForm">
              <el-form-item label="今日发放红包金额" prop="redMoney">
                <el-input  v-model.number="dataForm.redMoney" class="wid_68" placeholder="今日发放红包金额"></el-input>元
              </el-form-item>
              <el-form-item label="今日发放红包个数" prop="redNum">
                <el-input :disabled="true" v-model.number="dataForm.redNum" class="wid_68" placeholder="发放红包个数"></el-input>个
              </el-form-item>
              <el-form-item>
                <p class="red_tip">(提示：红包数量根据机构下属已有向导数量上浮10%计算。人数小于50人时，按照基础50人计算，红包数量=向导数*(1+0.1)*2，今日根据数量动态调整)</p>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="playActive">开通红包活动</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <!-- 活动已开始 -->
        <el-col v-show="!showUnactive" :span="12" :offset="6">
          <div class="grid-content bg-purple box_shadow">
            <el-form  :model="dataForm" >
              <el-form-item label="今日发放红包金额" >
                <el-input :disabled="true" v-model="dataForm.redMoney2" class="wid_68" placeholder="今日发放红包金额"></el-input>元
              </el-form-item>
              <el-form-item label="今日发放红包个数">
                <el-input :disabled="true" v-model="dataForm.redNum2" class="wid_68" placeholder="发放红包个数"></el-input>个
              </el-form-item>
              <el-form-item label="明日发放红包金额">
                <el-input :disabled="true" v-model="dataForm.redMoney_tomorrow2" class="wid_68" placeholder="发放红包个数"></el-input>元
              </el-form-item>
              <el-form-item>
                <p class="red_tip">(提示：红包数量根据机构下属已有向导数量上浮10%计算。人数小于50人时，按照基础50人计算，红包数量=向导数*(1+0.1)*2，今日根据数量动态调整)</p>
                <p class="red_tip red_color">(**修改明日发放金额的时间段为:6:00-22:00,其他时间段禁止修改。)</p>
                <p class="red_tip green_color">(**当日关闭红包活动后禁止重新开启红包活动因此请谨慎关闭红包活动。)</p>

              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="handle_modi">修改明日发放金额</el-button>
                <el-button type="info" size="mini" @click="closeActive">关闭红包活动</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>

      </el-row>
    </div>
    <!-- dialog 修改明日金额-->
    <el-dialog
        title="修改明日红包发放金额"
        :visible.sync="detail_dialogVisible"
        width="30%"
        center
        :close-on-click-modal="false"
        v-loading="detail_loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class=""
        >
        <!-- 业务信息 -->
        <el-form :inline="true" :model="modiForm" :rules="modiFormrules" ref="modiForm" class="demo-form-inline " label-width="120px" >
          <el-form-item label="明日红包金额" prop="task_money">
              <el-input v-model.number="modiForm.task_money" placeholder="明日红包金额" class="wid_140"></el-input>元
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="detail_dialogVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="modiRedMoney" size="mini">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import commonUrl from "../../utils/common";
import qs from "qs";
import { setTimeout } from "timers";
import { validNum100, validNum15, validDyNum, filterSpace} from '../../utils/validate'
import {
  isvalidPhone
} from "../../utils/validate";
export default {
  name: "redEnvelopeActivity",
  data() {
     // 校验手机号
    let validPhone=(rule, value,callback)=>{
        if (!value){
            callback(new Error('请输入电话号码'))
        }else  if (!isvalidPhone(value)){
            callback(new Error('请输入正确手机号码'))
        }else {
            callback()
        }
    }
    // 校验分成
    let validNum=(val,value,callback)=>{
        if (!value ){
            callback(new Error('请输入值'))
        }else  if (typeof value != 'number'){
            callback(new Error('请输入数值'))
        }else {
            callback()
        }
    }
    return {
      // 显示未开通状态
      showUnactive:true,
      detail_dialogVisible:false,
      detail_loading:false,
      // 手机号设置
      queryForm:{
        notice_phone:''
      },
      notice_phone_rules:{
        notice_phone:[
            { required: true, validator:validPhone, trigger: 'blur' }
        ],
      },
      dataForm:{
        accountRemain:'',
        // 未开通
        // 红包金额
        redMoney:'',
        // 红包个数
        redNum:'',

        // 已开通
        redMoney2:'',
        redNum2:'',
        // 明日红包金额
        redMoney_tomorrow2:''
      },
      dataFormrules:{
        redMoney:[
          { required: true, validator:validNum, trigger: 'blur' },
          { type: 'number', message: '红包金额必须为数字'}
        ],
        redNum:[
          { required: true, validator:validNum, trigger: 'blur' },
          { type: 'number', message: '红包金额必须为数字'}
        ]
      },
      modiForm:{
        task_money:'',
      },
      modiFormrules:{
        task_money:[
          { required: true, validator:validNum, trigger: 'blur' },
          { type: 'number', message: '红包金额必须为数字'}
        ]
      },
      agent_name: "",
      agentid: "",

    };
  },
  created() {
    // 获取agentid
    this.getAgentid()
  },
  computed: {
    ...mapGetters(["name", "roles"])
  },
  methods: {
     // 设置手机号
    handle_setPhone(){
      if(this.m_valid_addForm('queryForm')){
        let param  = {
          data:{
            signInUserId:this.$store.getters.userId,
            notice_phone:this.queryForm.notice_phone
          }
        }
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http
        .post(`${commonUrl.baseUrl}/agent/setNoticePhone`, param)
        .then(res => {
          if (res.data.code == "0000") {
            this.m_message(res.data.msg, "success");
            this.getData();
          } else {
            this.m_message(res.data.msg, "warning");
            loading.close();
          }
        })
        .catch(err => {});
      }
    },

    // 1获取agentid
    getAgentid(){
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
            // 红包个数 今日红包金额
            //this.getData()
            this.initStatus()
          } else {
            this.m_message(res.data.msg, "warning");
            loading.close();
          }
        })
        .catch(err => {});
    },
    // 2查询账户余额以及是否开通状态
    initStatus(){
      let param = {
        data:{
          agentid:this.agentid
        }
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http.post(`${commonUrl.baseUrl}/agentRechargeAccount/selectAgentRechargeAccount`, param).then(res=>{
        if(res.data.code == '0000'){
          let result = res.data.data.rechargeAccount
          // 账户余额 开通状态
          this.dataForm.accountRemain = result.accountRemain
          if(result.task_status === '2' || result.task_status === null){ // 未开通
            this.showUnactive = true
            // 获取未开通的数据
            this.getData()
          }else{ // 已开通
            this.showUnactive = false
            // 获取已开通的数据
            this.getData2()
          }
          //loading.close()
        }else{
          this.m_message(res.data.msg, 'warning')
          loading.close()
        }
      }).catch(err=>{})
    },
    // 初始化数据(未开通状态下)
    getData() { //
      // 查询红包个数
      let _param1 = {
        data: {
          // 公有
          city_agentid: this.agentid
        }
      };
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let pro1 = this.$http.post(`${commonUrl.baseUrl}/travelerInfo/getRedEnvelopeAmount`, _param1).then(res=>{
        // 今日红包个数
        if(res.data.code == '0000'){
          let result1 = res.data.data.redEnvelopeAmount
          this.dataForm.redNum = result1
          // 清空红包金额
          this.dataForm.redMoney = ''
        }else{
          this.m_message(res.msg,'warning')

        }
        loading.close()
      }).catch(err=>{})
      // // 修改后明日红包金额作为今日红包金额
      // let _param2 = {
      //   data:{
      //     agentid:this.agentid
      //   }
      // }
      // let pro2 = this.$http.post(`${commonUrl.baseUrl}/agentTask/selectTaskMoneyTomorrow`, _param2)



      // Promise.all([pro1, pro2]).then(res=>{
      //   let [res1, res2] = res;
      //   // 今日红包个数
      //   if(res1.data.code == '0000'){
      //     let result1 = res1.data.data.redEnvelopeAmount
      //     this.dataForm.redNum = result1
      //   }else{
      //     //setTimeout(()=>{this.m_message(res1.data.msg, 'warning')},1)
      //   }
      //   // 修改后明日红包金额 作为今日红包金额
      //   if(res2.data.code == '0000'){
      //     let result2 = res2.data.data.taskMoneyTomorrow
      //     this.dataForm.redMoney = result2.taskMoney
      //   }else{
      //     //console.log('修改明日红包金额')
      //     //setTimeout(()=>{this.m_message(res1.data.msg, 'warning')},1)
      //   }

      //   loading.close()
      // }).catch(err=>{

      // })
    },
    // 初始化数据(已开通状态下)
    getData2(){
      // 查询红包个数
      let _param1 = {
        data: {
          // 公有
          city_agentid: this.agentid
        }
      };
      let pro1 = this.$http.post(`${commonUrl.baseUrl}/travelerInfo/getRedEnvelopeAmount`, _param1)
      // 今日红包任务
      let _param2 = {
        data:{
          agentid:this.agentid
        }
      }
      let pro2 = this.$http.post(`${commonUrl.baseUrl}/agentTaskSub/selectTaskMoneyToday`, _param2)
      // 明日红包金额
      let _param3 = {
        data:{
          agentid:this.agentid
        }
      }
      let pro3 = this.$http.post(`${commonUrl.baseUrl}/agentTask/selectTaskMoneyTomorrow`, _param3)
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      Promise.all([pro1, pro2, pro3]).then(res=>{
        let [res1, res2, res3] = res
        // 今日红包个数
        if(res1.data.code == '0000'){
          let result1 = res1.data.data.redEnvelopeAmount
          this.dataForm.redNum2 = result1
        }else{
          //setTimeout(()=>{this.m_message(res1.data.msg, 'warning')},1)
        }
        // 今日红包金额
        if(res2.data.code == '0000'){
          let result2 = res2.data.data.taskMoneyToday
          this.dataForm.redMoney2 = result2.taskSrcMoney
        }else{
          //setTimeout(()=>{this.m_message(res1.data.msg, 'warning')},1)
        }
        // 明日红包金额
        if(res3.data.code == '0000'){
          // console.log(res)
          let result3 = res3.data.data.taskMoneyTomorrow
          this.dataForm.redMoney_tomorrow2 = result3.taskMoney
          // 将数据传递给 修改表单一份
          this.modiForm.task_money = result3.taskMoney
        }
        loading.close()
      }).catch(err=>{})
    },
    // 开通 红包
    playActive(){
      if(this.m_valid_addForm('dataForm')){
        let param = {
          data:{
            agentid:this.agentid,
            task_money:this.dataForm.redMoney*100,
            task_total_money:this.dataForm.redMoney*100,
            task_status:"1"
          }
        }
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.$http.post(`${commonUrl.baseUrl}/agentTask/openOrCloseAgentTask`, param).then(res=>{
          if(res.data.code == '0000'){
            this.m_message(res.data.msg,'success')
            // 展示修改栏
            this.showUnactive = false

            // 更新数据（已开通）
            this.initStatus()
            //this.getData2()

          }else{
            this.m_message(res.data.msg,'warning')

          }
          loading.close()
        }).catch(err=>{})
      }
    },
    // 操作 修改红包
    handle_modi(){
      let param = {
        data:{

        }
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http.post(`${commonUrl.baseUrl}/agentTask/updateTaskMoneyTime`, param).then(res=>{
        if(res.data.code == '0000'){
          this.m_message(res.data.msg,'success')
          // 打开页面
          this.detail_dialogVisible = true

        }else{
          this.m_message(res.data.msg, 'warning')
        }
        loading.close()
      }).catch(err=>{})
    },
    // 保存修改红包金额
    modiRedMoney(){
      if(this.m_valid_addForm('modiForm')){
        let param ={
          data:{
            agentid:this.agentid,
            task_money:this.modiForm.task_money*100,
            task_total_money:this.modiForm.task_money*100
          }
        }
        this.detail_loading = true
        this.$http.post(`${commonUrl.baseUrl}/agentTask/updateAgentTaskMoney`, param).then(res=>{
          if(res.data.code === '0000'){
            this.detail_loading = false
            this.m_message(res.data.msg,'success')
            this.detail_dialogVisible = false
            // 更新主列表
            this.initStatus()
            //this.getData2()
          }else{
            this.m_message(res.data.msg, 'warning')
          }
          loading.close()
        }).catch(err=>{})
      }
    },
    // 关闭 红包活动
    closeActive(){
      let param = {
        data:{
          agentid:this.agentid,
          task_status:'2'
        }
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http.post(`${commonUrl.baseUrl}/agentTask/openOrCloseAgentTask`, param).then(res=>{
        if(res.data.code === '0000'){
          // 切换显示栏 更新数据
          this.showUnactive = true
          this.m_message(res.data.msg, 'success')
          // 重新初始化
          this.initStatus()

        }else{
          this.m_message(res.data.msg,'warning')
        }
        loading.close()
      }).catch(err=>{})
    },
    // 新增 校验规则
    m_valid_addForm(formName) {
      let flag = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          flag = true;
          return true;
        } else {
          flag = false;
          return false;
        }
      });
      return flag;
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
     color: #666;
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
.phone_tip{
  font-size: 12px;
  color:#606266;
}
</style>
<style scoped>
.box .myBtn {
  color: gray;
  background: gray;
}
</style>
