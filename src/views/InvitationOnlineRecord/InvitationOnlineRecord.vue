<template>
<!-- 向导管理>>邀请上线记录 -->
<div class="pad_5">
  <!-- M1 查询区域 -->
  <div class="query_fields pad_b_no">
    <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
      <!-- 所属机构 -->
      <el-form-item label="所属机构" prop="agent_name">
        <el-input v-model="queryForm.agent_name" placeholder="请输入所属机构" class="wid_140"></el-input>
      </el-form-item>
      <!-- 向导id -->
      <el-form-item label="向导ID" prop="live_customid">
        <el-input v-model="queryForm.live_customid" placeholder="请输入向导ID" class="wid_140"></el-input>
      </el-form-item>
      <!-- 向导姓名 -->
      <el-form-item label="向导姓名" prop="name">
        <el-input v-model="queryForm.name" placeholder="请输入向导姓名" class="wid_140"></el-input>
      </el-form-item>
      <!-- 用户ID -->
      <el-form-item label="用户ID" prop="customid" label-width="68px">
        <el-input v-model="queryForm.customid" placeholder="请输入上级ID" class="wid_140"></el-input>
      </el-form-item>
      <!-- 订单时间 -->
      <el-form-item label="订单时间" prop="orderTime">
          <el-date-picker
              v-model="queryForm.orderTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
          </el-date-picker>
      </el-form-item>
      <!-- 预约时间 -->
      <el-form-item label="预约时间" prop="reserveTime">
          <el-date-picker
              v-model="queryForm.reserveTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
          </el-date-picker>
      </el-form-item>
      <!-- 查询 -->
      <el-form-item>
        <el-button type="primary" size='mini' @click="queryData">查询</el-button>
        <el-button type="success" size='mini' @click="resetData('queryForm')">重置</el-button>
        <el-button type="primary" size='mini' @click="handle_refresh">刷新</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- M2 主列表 -->
  <div>
    <!-- 表格 -->
    <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
      <!-- 用户ID customid-->
      <el-table-column prop="customid" label="用户ID" width="80">
      </el-table-column>
      <!-- 昵称 -->
      <el-table-column prop="nickname" label="昵称" width="80">
      </el-table-column>
      <!-- 向导ID 可查询向导详情 -->
      <el-table-column prop="" label="向导ID" width="80">
          <template slot-scope="scope">
            <el-button @click="handle_detail(scope.row)" type="text" size="small">
              {{ scope.row.live_customid }}</el-button>
          </template>
      </el-table-column>
      <el-table-column prop="name" label="向导姓名" width="80">
      </el-table-column>
      <el-table-column prop="agent_name" label="所属机构" width="">

      </el-table-column>
      <!-- 订单时间 -->
      <el-table-column prop="orderCreatetime" label="订单时间" width="160">
      </el-table-column>
      <!-- 订单状态 -->
      <!-- 0下单 1订单完成  3支付成功 4订单确认 5订单取消 6订单取消已退款 7订单取消退款失败 8以评价  -->
      <el-table-column prop="" label="订单状态" width="80">
        <template slot-scope="scope">
        <span v-if="scope.row.live_order_status == 0">下单</span>
        <span v-else-if="scope.row.live_order_status == 1">订单完成</span>
        <span v-else-if="scope.row.live_order_status == 3">支付成功</span>
        <span v-else-if="scope.row.live_order_status == 4">订单确认</span>
        <span v-else-if="scope.row.live_order_status == 5">订单取消</span>
        <span v-else-if="scope.row.live_order_status == 6">订单取消已退款</span>
        <span v-else-if="scope.row.live_order_status == 7">订单取消退款失败</span>

        </template>
      </el-table-column>
      <!-- 拒绝类别 reject_type-->
      <!-- 0未拒绝 1直接拒绝 2未接单到时拒绝 3未完成清理 -->
      <el-table-column prop="" label="拒绝类别" width="80">
        <template slot-scope="scope">
        <span v-if="scope.row.reject_type == 0">未拒绝</span>
        <span v-else-if="scope.row.reject_type == 1">直接拒绝</span>
        <span v-else-if="scope.row.reject_type == 2">未接单到时拒绝</span>
        <span v-else-if="scope.row.reject_type == 3">未完成清理</span>
        </template>
      </el-table-column>
      <!-- 预约时间 -->
      <el-table-column prop="task_begin_time" label="预约时间" width="160">
      </el-table-column>
      <!-- 贝壳 -->
      <el-table-column prop="amount" label="贝壳" width="60">
      </el-table-column>


    </el-table>
    <!-- 分页 -->
    <div class="block mar_t10">
        <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :total="pageTotal"
        background
        layout="total, prev, pager, next, jumper"
        >
        </el-pagination>
    </div>
  </div>
  <!-- M3 dialog详情-->
  <el-dialog
      title="向导详情"
      :visible.sync="detail_dialogVisible"
      width="50%"
      center
      :close-on-click-modal="false"
      v-loading="detail_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="agent_detail"
      >
      <!-- 业务信息 -->
      <el-form :inline="true" :model="detail_form"   class="demo-form-inline " label-width="68px" disabled>

          <el-form-item label="向导ID" prop="customid">
              <el-input v-model="detail_form.customid" placeholder="" class="wid_180"></el-input>
          </el-form-item>
          <el-form-item label="向导姓名" prop="name">
              <el-input v-model="detail_form.name" placeholder="" class="wid_180"></el-input>
          </el-form-item>
          <!-- 民族 -->
          <el-form-item label="民族" prop="traveler_native">
              <el-input v-model="detail_form.traveler_native" placeholder="" class="wid_180"></el-input>
          </el-form-item>
          <!-- 性别 -->
          <el-form-item label="性别" prop="sex">
              <el-input v-model="detail_form.sex" placeholder="" class="wid_180"></el-input>
          </el-form-item>
          <!-- 居住地 -->
          <el-form-item label="居住地" prop="juzhudi">
              <el-input v-model="detail_form.juzhudi" placeholder="" class="wid_180"></el-input>
          </el-form-item>
          <!-- 职业 -->
          <el-form-item label="职业" prop="profession">
              <el-input v-model="detail_form.profession" placeholder="" class="wid_180"></el-input>
          </el-form-item>
          <!-- 详细地址 -->
          <el-form-item label="详细地址" prop="address">
              <el-input v-model="detail_form.address" placeholder="" class="wid_180"></el-input>
          </el-form-item>
          <!-- 身高 -->
          <el-form-item label="身高" prop="tall">
              <el-input v-model="detail_form.tall" placeholder="" class="wid_180"></el-input>
          </el-form-item>
          <!-- 体重 -->
          <el-form-item label="体重" prop="weight">
              <el-input v-model="detail_form.weight" placeholder="" class="wid_180"></el-input>
          </el-form-item>
          <!-- 手机号 -->
          <el-form-item label="联系电话" prop="phone" >
              <el-input v-model="detail_form.phone" placeholder="" class="wid_180"></el-input>
          </el-form-item>
          <!-- 陌陌号 -->
          <el-form-item label="陌陌号" prop="momo" >
              <el-input v-model="detail_form.momo" placeholder="" class="wid_180"></el-input>
          </el-form-item>
          <!-- 微信号 -->
          <el-form-item label="微信号" prop="webchat" >
              <el-input v-model="detail_form.webchat" placeholder="" class="wid_180"></el-input>
          </el-form-item>
          <!-- 出生日期 -->
          <el-form-item label="出生日期" prop="birthday">
              <el-input v-model="detail_form.birthday" placeholder="" class="wid_180"></el-input>
          </el-form-item>
          <!-- 分成 -->
          <!-- <el-form-item label="贝壳分成" prop="virtual_rate">
              <el-input v-model="detail_form.virtual_rate" placeholder="贝壳分成" class="wid_181"></el-input>%
          </el-form-item>
          <el-form-item label="出行分成" prop="account_rate">
              <el-input v-model="detail_form.account_rate" placeholder="出行分成" class="wid_181"></el-input>%
          </el-form-item> -->

      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button @click="detail_dialogVisible = false" size="mini">关 闭</el-button>
      </span>
  </el-dialog>


</div>
</template>

<script>
import provinces from "../../utils/area.js";
import commonUrl from "../../utils/common";
import { validNum100, validNum15, validDyNum, filterSpace} from '../../utils/validate'
import {
  isvalidPhone
} from "../../utils/validate";

export default {
  name: "InvitationOnlineRecord",
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
    let validRate=(val,value,callback)=>{
        if (!value ){
            callback(new Error('请输入值'))
        }else  if (!validNum100(value)){
            callback(new Error('请输入0-100之间的数'))
        }else {
            callback()
        }
    }
    // 提成分成15
    let validRate15=(val,value,callback)=>{
        if (!value && value != 0){
            callback(new Error('请输入值'))
        }else  if (!validNum15(value)){
            callback(new Error('请输入0-15之间的数'))
        }else {
            callback()
        }
    }
    // 校验分成 动态上限 dyval是上限值
    let validRateDy=(val,value,callback)=>{
      let dyval = this.limit_virtual_rate
      if (!value && value != 0){
          callback(new Error('请输入值'))
        }else  if (!validDyNum(value,dyval)){
          callback(new Error('请输入0-'+dyval+'之间的数'))
        }else {
          callback()
      }
    }
    return {
      roleId:'',
      loading:false,
      searchResult:'',
      // 新增客服弹框
      add_dialogVisible: false,
      add_loading:false,
      limit_virtual_rate:'',
      add_form_traveler:{
        name:'',
        customId:'',
        virtual_rate:'',
        profit_virtual_rate:'',
        profit_account_rate:'',
        phone:'',
      },
      add_bank_traveler_rules:{
        name:[
            { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        customId:[
            { required: true, message: '请输入向导ID', trigger: 'blur' }
        ],
        // 贝壳分成
        virtual_rate:[
            { required: true, validator:validRateDy, trigger: 'blur' },
            { type: 'number', message: '贝壳分成必须为数字'}
        ],
        // 贝壳提成分成
        profit_virtual_rate:[
            { required: true, validator:validRate15, trigger: 'blur' },
            { type: 'number', message: '贝壳分成必须为数字'}
        ],
        // 出行提成分成
        profit_account_rate:[
            { required: true, validator:validRate15, trigger: 'blur' },
            { type: 'number', message: '贝壳分成必须为数字'}
        ],
        phone:[
            { required: true, validator:validPhone, trigger: 'blur' }
        ],
      },
      // 地图
      districtSearch: "",
      // 主列表
      tableLoading: false,
      tableData: [],
      // 详情
      detail_dialogVisible: false,
      detail_loading: false,
      up_detail_dialogVisible: false,
      up_detail_loading: false,
      agent_detail_dialogVisible: false,
      agent_detail_loading: false,
      // 分页
      pageTotal: 0,
      currentPage: 1,
      // 查询参数
      queryForm: {
        // 所属机构
        agent_name: "",
        // 向导姓名
        name: "",
        // 向导ID
        customid: "",
        // 用户ID
        live_customid: "",
        // 预约时间
        orderTime:'',
        liveStartTime:'',
        liveEndTime:'',
        // 订单时间
        reserveTime:'',
        orderStartTime:'',
        orderEndTime:'',
      },
      // 详情
      detail_form: {
        // 向导ID
        customid: "",
        // 向导姓名
        name: "",
        // 上级ID
        up_customid: "",
        // 上级姓名
        up_name: "",
        // 民族
        traveler_native: "",
        // 性别
        sex: "",
        // 居住地
        juzhudi: "",
        // 职业
        profession: "",
        // 详细地址
        address: "",
        // 身高
        tall: "",
        // 体重
        weight: "",
        // 手机号
        phone: "",
        // 微信号
        webchat: "",
        // 陌陌号
        momo: "",
        // 出生日期
        birthday: "",
        // 贝壳分成
        virtual_rate: "",
        // 出行分成
        account_rate: ""
      },
      // 上级 详情
      up_detail_form: {
        // 向导ID
        customid: "",
        // 向导姓名
        name: "",
        // 上级ID
        up_customid: "",
        // 上级姓名
        up_name: "",
        // 民族
        traveler_native: "",
        // 性别
        sex: "",
        // 居住地
        juzhudi: "",
        // 职业
        profession: "",
        // 详细地址
        address: "",
        // 身高
        tall: "",
        // 体重
        weight: "",
        // 手机号
        phone: "",
        // 微信号
        webchat: "",
        // 陌陌号
        momo: "",
        // 出生日期
        birthday: "",
        // 贝壳分成
        virtual_rate: "",
        // 出行分成
        account_rate: ""
      },
      bankInfo: "",
      // 所属机构的详情
      agent_detail_form: {
        regions: [],
        cities: [],
        bankInfo: "",
        // 机构编号
        agentid: "",
        // 机构名称
        agent_name: "",
        // 负责人
        charger: "",
        // 业务地区
        province_code: "",
        city_code: "",
        // 联系地址
        address: "",
        // 贝壳分成
        virtual_rate: "",
        // 出行分成
        account_rate: "",
        // 电话
        phone: "",
        // 邮箱
        email: "",
        // 合同编号
        contract_no: "",
        // 开户行
        bank_code: "",
        // 开户名
        account_user: "",
        // 账号
        account_no: "",
        // 开户地
        account_regions: "",
        account_cities: [],
        account_province_code: "",
        account_city_code: ""
      }
    };
  },
  created() {
    // 初始化roleId
    this.roleId = this.$store.getters.roleId;

    // 初始化 主列表
    this.getTableDataList(1);
  },
  methods: {
    // 获取主列表
    getTableDataList(pageNum) {
      let param = {
        data: {
          // 公有
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          pageNum: pageNum,
          pageSize: 10,
          // 私有
          // 所属机构
          agent_name:this.queryForm.agent_name,
          // 向导ID
          customid:this.queryForm.customid,
          // 向导姓名
          name:this.queryForm.name,
          // 用户ID
          live_customid:this.queryForm.live_customid,
          // 订单时间
          liveStartTime:this.queryForm.liveStartTime,
          liveEndTime:this.queryForm.liveEndTime,
          // 预约时间
          orderStartTime:this.queryForm.orderStartTime,
          orderEndTime:this.queryForm.orderEndTime,
        }
      };
      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/liveOrderInfo/selectLiveOrderInfoList`, param)
        .then(res => {
          if (res.data.code == "0000") {
            console.log(res);
            debugger
            this.tableData = res.data.data.liveOrderInfoList;
            // 分页总数
            this.pageTotal = res.data.data.page.pageTotal;
            this.tableLoading = false;
          }
        })
        .catch(err => {});
    },
    // 重置密码操作
    resetPsw(row) {
      this.$confirm("是否重置密码", "重置密码", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        size: "mini",
        center: true
      }).then(() => {
        let param = {
          data: {
            travelerid: row.travelerid,
            signInRoleId:this.roleId
          }
        };
        this.$http
          .post(`${commonUrl.baseUrl}/travelerInfo/resetTravelerPassword`, param)
          .then(res => {
            if (res.data.code == "0000") {
              this.m_message(res.data.msg, "success");
              // 刷新
              this.handle_refresh();
            } else {
              this.m_message(res.data.msg, "warning");
            }
          })
          .catch(err => {});
      });
    },
    // 查询按钮
    queryData() {
      console.log(this.queryForm)
      if(this.queryForm.reserveTime.length > 0){
        this.queryForm.liveStartTime = this.queryForm.reserveTime[0]
        this.queryForm.liveEndTime = this.queryForm.reserveTime[1]
      }
      if(this.queryForm.orderTime.length > 0){
        this.queryForm.orderStartTime = this.queryForm.orderTime[0]
        this.queryForm.orderEndTime = this.queryForm.orderTime[1]
      }

      // 根据参数进行查询
      this.getTableDataList(1);
    },
    // 重置按钮
    resetData(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
      this.queryForm.liveStartTime = ''
      this.queryForm.liveEndTime = ''
      this.queryForm.orderStartTime = ''
      this.queryForm.orderEndTime = ''
    },
    // 刷新按钮
    handle_refresh() {
      this.getTableDataList(1);
      this.currentPage = 1;
    },


    // 详情操作
    handle_detail(row) {
      this.detail_dialogVisible = true;
      this.detail_loading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/travelerInfo/selectTravelerInfo`, {
          data: {
            customid: row.live_customid
          }
        })
        .then(res => {
          if (res.data.code == "0000") {
            console.log(res);
            debugger
            let result = res.data.data.travelerInfo;

            // 向导姓名
            this.detail_form.name = result.name;
            // 向导ID
            this.detail_form.customid = result.customid;
            // 所属机构
            this.detail_form.agent_name = result.agent_name;
            // 上级ID
            this.detail_form.up_customid = result.up_customid;
            // 上级姓名
            this.detail_form.up_name = result.up_name;
            // 民族 性别  居住地  职业 详细地址 身高 体重 手机号 微信号 陌陌号  出生日期
            this.detail_form.traveler_native = result.traveler_native;
            this.detail_form.sex = result.sex == "01" ? "男" : "女";
            this.detail_form.juzhudi = result.province + result.city;
            // 判断职业
            // '职业类别 0其他 1学生 2都市白领 3导游 4自由职业
            let _profession = "";
            switch (result.profession_type) {
              case 0:
                _profession = "其他";
                break;
              case 1:
                _profession = "学生";
                break;
              case 2:
                _profession = "都市白领";
                break;
              case 3:
                _profession = "导游";
                break;
              case 4:
                _profession = "自由职业";
                break;
            }
            this.detail_form.profession = _profession;
            this.detail_form.address = result.address;
            this.detail_form.tall = result.tall + "cm";
            this.detail_form.weight = result.weight + "kg";
            this.detail_form.phone = result.phone;
            this.detail_form.webchat = result.webchat;
            this.detail_form.momo = result.momo;
            this.detail_form.birthday = result.birthday;
            // 贝壳分成
            this.detail_form.virtual_rate = result.virtual_rate;
            // 出行分成
            this.detail_form.account_rate = result.account_rate;
            this.detail_loading = false;
          }
        })
        .catch(err => {});
    },



    // 提示信息 message:提示信息   type 提示类型
    m_message(message, type) {
      this.$message({
        message,
        type
      });
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

    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      // 获取单前页数据列表
      this.getTableDataList(val);
    },

  }
};
</script>
