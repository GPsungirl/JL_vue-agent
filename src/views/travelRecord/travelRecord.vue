<template>
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no">
      <el-form
        :inline="true"
        ref="queryForm"
        :model="queryForm"
        size="mini"
        class="demo-form-inline"
      >
        <!-- 姓名 -->
        <el-form-item label="姓名" prop="name" label-width="68px">
          <el-input v-model="queryForm.name" placeholder="请输入姓名" class="wid_140"></el-input>
        </el-form-item>
        <!-- 现居住地 -->
        <!-- <el-form-item label="籍贯地" >
                <el-col :span="12">
                    <el-form-item prop="province_code">
                        <el-select v-model="queryForm.province_code"
                            placeholder="选择省"
                            class="wid_140"
                            @change="changeOption_province($event)">
                            <el-option v-for="(item, index) in queryForm.regions"
                                :key="index"
                                :label=" item.province "
                                :value=" item.adcode ">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="city_code">
                        <el-select v-model="queryForm.city_code"
                            placeholder="选择市"
                            class="wid_140"
                            @change="changeOption_city($event)">
                            <el-option v-for="(item, index) in queryForm.cities"
                                :key="index"
                                :label=" item.city "
                                :value=" item.adcode ">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
        </el-form-item>-->
        <!-- 上级姓名 -->
        <el-form-item label="上级姓名" prop="up_name">
          <el-input v-model="queryForm.up_name" placeholder="请输入上级姓名" class="wid_140"></el-input>
        </el-form-item>
        <!-- 上级ID -->
        <el-form-item label="上级ID" prop="up_customid" label-width="68px">
          <el-input v-model="queryForm.up_customid" placeholder="请输入上级ID" class="wid_140"></el-input>
        </el-form-item>
        <!-- 向导ID -->
        <el-form-item label="向导ID" prop="customid" label-width>
          <el-input v-model="queryForm.customid" placeholder="请输入向导ID" class="wid_140"></el-input>
        </el-form-item>
        <!-- 所属机构 -->
        <!-- <el-form-item label="所属机构" prop="agent_name">
                <el-input v-model="queryForm.agent_name" placeholder="请输入所属机构" class="wid_140"></el-input>
        </el-form-item>-->
        <!-- 查询月 -->
        <el-form-item label="查询月" label-width="68px" prop="live_month">
          <el-date-picker
            v-model="queryForm.live_month"
            type="month"
            format="yyyy 年 MM 月"
            value-format="yyyyMM"
            placeholder="选择月"
          ></el-date-picker>
        </el-form-item>
        <!-- 查询 -->
        <el-form-item>
          <el-button type="primary" size="mini" @click="queryData">查询</el-button>
          <el-button type="success" size="mini" @click="resetData('queryForm')">重置</el-button>
          <el-button type="primary" size="mini" @click="handle_refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
        <el-table-column prop="customid" label="向导ID" width></el-table-column>
        <el-table-column prop="name" label="姓名" width></el-table-column>
        <!-- <el-table-column prop="" label="籍贯地" width="">
                    <template slot-scope="scope">
                        {{ scope.row.province + scope.row.city }}
                    </template>
        </el-table-column>-->
        <el-table-column prop="up_customid" label="上级ID" width></el-table-column>
        <el-table-column prop label="上级姓名" width>
          <template slot-scope="scope">
            <el-button
              @click="handle_up_name(scope.row)"
              type="text"
              size="small"
            >{{ scope.row.up_name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop label="性别" width>
          <template slot-scope="scope">
            <span v-if="scope.row.sex == '01'">男</span>
            <span v-else>女</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="" label="所属机构" width="">
                    <template slot-scope="scope">
                        <el-button @click="handle_agent_name(scope.row)" type="text" size="small">{{ scope.row.agent_name }}</el-button>
                    </template>
        </el-table-column>-->
        <el-table-column prop="live_month" label="工作月份" width></el-table-column>
        <el-table-column prop label="工作时长" width>
          <template slot-scope="scope">
            <span>{{ Math.round(scope.row.live_duration_month / 60) +'分钟'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="操作" width>
          <template slot-scope="scope">
            <el-button @click="handle_detail(scope.row)" type="text" size="small">详情</el-button>
          </template>
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
        ></el-pagination>
      </div>
    </div>
    <!-- M3 dialog详情-->
    <el-dialog
      title="工作记录表"
      :visible.sync="detail_dialogVisible"
      width="50%"
      center
      top="5vh"
      :close-on-click-modal="false"
      v-loading="detail_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="travel_record"
    >
      <!-- 业务信息 -->
      <div>
        <!-- 表头 -->
        <header style="margin-bottom:8px">
          <div class="inl_block mar_r10">
            <span class="pp_label">ID:</span>
            <span>{{ detail_form.customid }}</span>
          </div>
          <div class="inl_block">
            <span class="pp_label">姓名:</span>
            <span>{{ detail_form.name }}</span>
          </div>
        </header>
        <!-- 表格 -->
        <el-table
          :data="detail_tableData"
          v-loading="detail_tableLoading"
          border
          stripe
          style="width: 100%"
        >
          <el-table-column prop label="开始工作时间" width>
            <template
              slot-scope="scope"
            >{{ getFormatDate(new Date(scope.row.live_endtime) - scope.row.live_time_length*1000) }}</template>
          </el-table-column>
          <el-table-column prop="live_endtime" label="结束工作时间" width></el-table-column>

          <el-table-column prop label="工作时长" width>
            <template slot-scope="scope">{{ Math.floor(scope.row.live_time_length / 60) + '分钟'}}</template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block mar_t10">
          <el-pagination
            @current-change="detail_handleCurrentChange"
            :current-page="detail_currentPage"
            :total="detail_pageTotal"
            background
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detail_dialogVisible = false" size="mini">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- M5 dialog所属机构-->
    <el-dialog
      title="机构详情"
      :visible.sync="agent_detail_dialogVisible"
      width="50%"
      center
      :close-on-click-modal="false"
      v-loading="agent_detail_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="agent_detail"
    >
      <!-- 业务信息 -->
      <el-form
        :inline="true"
        :model="agent_detail_form"
        class="demo-form-inline"
        label-width="68px"
        disabled
      >
        <!-- 业务信息 -->

        <el-form-item label="机构名称" prop="agent_name">
          <el-input v-model="agent_detail_form.agent_name" placeholder="审批人" class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="机构编号" prop="agentid">
          <el-input v-model="agent_detail_form.agentid" placeholder class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="charger" label-width="68px">
          <el-input v-model="agent_detail_form.charger" placeholder="负责人" class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="业务地区" class="marg_r0">
          <el-col :span="11">
            <el-form-item prop="province_code" class="marg_b0">
              <el-select
                v-model="agent_detail_form.province_code"
                placeholder="选择省"
                class="wid_90"
                @change="changeOption_province_addBusiness($event)"
              >
                <el-option
                  v-for="(item, index) in agent_detail_form.regions"
                  :key="index"
                  :label=" item.province "
                  :value=" item.adcode "
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="city_code" class="marg_b0">
              <el-select
                v-model="agent_detail_form.city_code"
                placeholder="选择市"
                class="wid_90"
                @change="changeOption_city_addBusiness($event)"
              >
                <el-option
                  v-for="(item, index) in agent_detail_form.cities"
                  :key="index"
                  :label=" item.city "
                  :value=" item.adcode "
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="联系地址" prop="address">
          <el-input v-model="agent_detail_form.address" placeholder="联系地址" class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="贝壳分成" prop="virtual_rate">
          <el-input v-model="agent_detail_form.virtual_rate" placeholder="贝壳分成" class="wid_181"></el-input>%
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="agent_detail_form.phone" placeholder="联系电话" class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="出行分成" prop="account_rate">
          <el-input v-model="agent_detail_form.account_rate" placeholder="出行分成" class="wid_181"></el-input>%
        </el-form-item>
        <el-form-item label="联系邮箱" prop="email">
          <el-input v-model="agent_detail_form.email" placeholder="联系邮箱" class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="contract_no">
          <el-input v-model="agent_detail_form.contract_no" placeholder="合同编号" class="wid_180"></el-input>
        </el-form-item>
        <div></div>
        <el-form-item label="开户名" prop="account_user" label-width="68px">
          <el-input v-model="agent_detail_form.account_user" placeholder="开户名" class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="bank_code" label-width="68px">
          <el-select
            v-model="agent_detail_form.bank_code"
            placeholder="开户行"
            class="wid_190"
            @change="changeOption_bank($event)"
          >
            <el-option
              v-for="(item, index) in agent_detail_form.bankInfo"
              :key="index"
              :label=" item.bankname "
              :value=" item.bankcode "
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="account_no" label-width="68px">
          <el-input v-model="agent_detail_form.account_no" placeholder="账号" class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="开户地" label-width="68px" class="marg_r0">
          <el-col :span="11">
            <el-form-item prop="account_province_code" class="marg_b0">
              <el-select
                v-model="agent_detail_form.account_province_code"
                placeholder="选择省"
                class="wid_90"
                @change="changeOption_province_addBank($event)"
              >
                <el-option
                  v-for="(item, index) in agent_detail_form.account_regions"
                  :key="index"
                  :label=" item.province"
                  :value=" item.adcode "
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="city_code" class="marg_b0">
              <el-select
                v-model="agent_detail_form.account_city_code"
                placeholder="选择市"
                class="wid_90"
                @change="changeOption_city_addBank($event)"
              >
                <el-option
                  v-for="(item, index) in agent_detail_form.account_cities"
                  :key="index"
                  :label=" item.city "
                  :value=" item.adcode "
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="agent_detail_dialogVisible = false" size="mini">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- M6 dialog上级姓名-->
    <el-dialog
      title="上级详情"
      :visible.sync="up_detail_dialogVisible"
      width="50%"
      center
      :close-on-click-modal="false"
      v-loading="up_detail_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="agent_detail"
    >
      <!-- 业务信息 -->
      <el-form
        :inline="true"
        :model="up_detail_form"
        class="demo-form-inline"
        label-width="68px"
        disabled
      >
        <el-form-item label="向导ID" prop="customid">
          <el-input v-model="up_detail_form.customid" placeholder class="wid_180"></el-input>
        </el-form-item>
        <el-form-item label="向导姓名" prop="name">
          <el-input v-model="up_detail_form.name" placeholder class="wid_180"></el-input>
        </el-form-item>
        <!-- 上级ID -->
        <el-form-item label="上级ID" prop="up_customid">
          <el-input v-model="up_detail_form.up_customid" placeholder class="wid_180"></el-input>
        </el-form-item>
        <!-- 上级姓名 -->
        <el-form-item label="上级姓名" prop="up_name">
          <el-input v-model="up_detail_form.up_name" placeholder class="wid_180"></el-input>
        </el-form-item>
        <!-- 民族 -->
        <el-form-item label="民族" prop="traveler_native">
          <el-input v-model="up_detail_form.traveler_native" placeholder class="wid_180"></el-input>
        </el-form-item>
        <!-- 性别 -->
        <el-form-item label="性别" prop="sex">
          <el-input v-model="up_detail_form.sex" placeholder class="wid_180"></el-input>
        </el-form-item>
        <!-- 居住地 -->
        <el-form-item label="居住地" prop="juzhudi">
          <el-input v-model="up_detail_form.juzhudi" placeholder class="wid_180"></el-input>
        </el-form-item>
        <!-- 职业 -->
        <el-form-item label="职业" prop="profession">
          <el-input v-model="up_detail_form.profession" placeholder class="wid_180"></el-input>
        </el-form-item>
        <!-- 详细地址 -->
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="up_detail_form.address" placeholder class="wid_180"></el-input>
        </el-form-item>
        <!-- 身高 -->
        <el-form-item label="身高" prop="tall">
          <el-input v-model="up_detail_form.tall" placeholder class="wid_180"></el-input>
        </el-form-item>
        <!-- 体重 -->
        <el-form-item label="体重" prop="weight">
          <el-input v-model="up_detail_form.weight" placeholder class="wid_180"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="up_detail_form.phone" placeholder class="wid_180"></el-input>
        </el-form-item>
        <!-- 陌陌号 -->
        <el-form-item label="陌陌号" prop="momo">
          <el-input v-model="up_detail_form.momo" placeholder class="wid_180"></el-input>
        </el-form-item>
        <!-- 微信号 -->
        <el-form-item label="微信号" prop="webchat">
          <el-input v-model="up_detail_form.webchat" placeholder class="wid_180"></el-input>
        </el-form-item>
        <!-- 出生日期 -->
        <el-form-item label="出生日期" prop="birthday">
          <el-input v-model="up_detail_form.birthday" placeholder class="wid_180"></el-input>
        </el-form-item>
        <!-- 分成 -->
        <!-- <el-form-item label="贝壳分成" prop="virtual_rate">
                    <el-input v-model="up_detail_form.virtual_rate" placeholder="贝壳分成" class="wid_181"></el-input>%
                </el-form-item>
                <el-form-item label="出行分成" prop="account_rate">
                    <el-input v-model="up_detail_form.account_rate" placeholder="出行分成" class="wid_181"></el-input>%
        </el-form-item>-->
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="up_detail_dialogVisible = false" size="mini">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import provinces from "../../utils/area.js";
import commonUrl from "../../utils/common";
import { isvalidPhone } from "../../utils/validate";

export default {
  name: "travelRecord",
  data() {
    return {
      _signInUserId: "",
      // 地图
      districtSearch: "",
      // 主列表
      tableLoading: false,
      tableData: [],
      // 工作记录表
      detail_tableLoading: false,
      detail_tableData: [],

      detail_dialogVisible: false,
      detail_loading: false,

      up_detail_dialogVisible: false,
      up_detail_loading: false,

      agent_detail_dialogVisible: false,
      agent_detail_loading: false,
      // 分页
      pageTotal: 0,
      currentPage: 1,
      detail_pageTotal: 0,
      detail_currentPage: 1,
      bankInfo: "",
      // 查询参数
      queryForm: {
        // 初始化 省 regions  市 cities
        regions: "",
        cities: [],

        live_month: "",
        province_code: "",
        city_code: "",
        province_param: "",
        city_param: "",

        name: "",
        up_name: "",
        up_customid: "",
        agent_name: "",
        // 向导ID
        customid: ""
      },
      // 详情数据
      detail_form: {
        customid: "",
        name: "",
        row: ""
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
    // 判断是否为roleid是否为11并处理
    this._signInUserId = this.transformSignInUserId();
    // 初始化 地图plugin
    this.initMap();
    // 初始化 省份
    this.initProvinces();
    // 初始化 银行信息
    this.getBankList();
    // 初始化 主列表
    this.getTableDataList(1);
  },
  methods: {
    // 处理signInUserId的值（当roleid为11时）
    transformSignInUserId() {
      // 先判断roleid == 11 ,若11，则up_userid 作为 signinuserid的值
      if (this.$store.getters.roleId == 11) {
        return this.$store.getters.up_userId;
      } else {
        return this.$store.getters.userId;
      }
    },
    // 获取主列表
    getTableDataList(pageNum) {
      let param = {
        data: {
          // 公有
          signInUserId: this._signInUserId,
          signInRoleId: this.$store.getters.roleId,
          pageNum: pageNum,
          pageSize: 10,
          // 私有
          // 所属机构 姓名 向导状态 上级id  上级姓名
          agent_name: this.queryForm.agent_name,
          name: this.queryForm.name,
          live_month: this.queryForm.live_month,
          up_customid: this.queryForm.up_customid,
          up_name: this.queryForm.up_name,
          // 向导ID
          customid: this.queryForm.customid,
          province_code: this.queryForm.province_code,
          city_code: this.queryForm.city_code
        }
      };
      this.tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/travelerInfo/travelerRecordList`, param)
        .then(res => {
          if (res.data.code == "0000") {
            // console.log(res)
            // debugger
            this.tableData = res.data.data.agentList;
            // 分页总数
            this.pageTotal = res.data.data.page.pageTotal;
            this.tableLoading = false;
          }
        })
        .catch(err => {});
    },
    // 获取工作记录列表
    getTableDataList_detail(row, pageNum) {
      let param = {
        data: {
          customid: row.customid,
          live_month: row.live_month,
          pageNum: pageNum,
          pageSize: 10
        }
      };
      this.detail_tableLoading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/liveRecord/getLiveRecordInfo`, param)
        .then(res => {
          if (res.data.code == "0000") {
            // console.log(res)
            // debugger
            this.detail_tableData = res.data.data.liveRecordInfoList;
            //  分页
            this.detail_pageTotal = res.data.data.page.pageTotal;
            this.detail_tableLoading = false;
          }
        })
        .catch(err => {});
    },
    // 详情操作
    handle_detail(row) {
      // 展示在表头里
      this.detail_form.row = row;
      this.detail_form.customid = row.customid;
      this.detail_form.name = row.name;

      this.detail_dialogVisible = true;
      // 取工作记录表的数据
      this.getTableDataList_detail(row, 1);
    },
    // 上级姓名操作
    handle_up_name(row) {
      let param = {
        data: {
          up_customid: row.up_customid
        }
      };
      this.up_detail_dialogVisible = true;
      this.up_detail_loading = true;
      this.$http
        .post(
          `${commonUrl.baseUrl}/travelerInfo/selectTravelerInfoByUpCustomId`,
          param
        )
        .then(res => {
          if (res.data.code == "0000") {
            console.log(res);
            let result = res.data.data.travelerInfo;

            // 向导姓名
            this.up_detail_form.name = result.name;
            // 向导ID
            this.up_detail_form.customid = result.customid;
            // 所属机构
            this.up_detail_form.agent_name = result.agent_name;
            // 上级ID
            this.up_detail_form.up_customid = result.up_customid;
            // 上级姓名
            this.up_detail_form.up_name = result.up_name;
            // 民族 性别  居住地  职业 详细地址 身高 体重 手机号 微信号 陌陌号  出生日期
            this.up_detail_form.traveler_native = result.traveler_native;
            this.up_detail_form.sex = result.sex == "01" ? "男" : "女";
            this.up_detail_form.juzhudi = result.province + result.city;
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
            this.up_detail_form.profession = _profession;
            this.up_detail_form.address = result.address;
            this.up_detail_form.tall = result.tall + "cm";
            this.up_detail_form.weight = result.weight + "kg";
            this.up_detail_form.phone = result.phone;
            this.up_detail_form.webchat = result.webchat;
            this.up_detail_form.momo = result.momo;
            this.up_detail_form.birthday = result.birthday;
            // 贝壳分成
            this.up_detail_form.virtual_rate = result.virtual_rate;
            // 出行分成
            this.up_detail_form.account_rate = result.account_rate;
            this.up_detail_loading = false;
          }
        })
        .catch(err => {});
    },
    // 所属机构操作
    handle_agent_name(row) {
      let param = {
        data: {
          agentid: row.agentid
        }
      };
      this.agent_detail_dialogVisible = true;
      this.agent_detail_loading = true;
      this.$http
        .post(`${commonUrl.baseUrl}/agent/selectAgentInfo`, {
          data: { agentid: row.agentid }
        })
        .then(res => {
          if (res.data.code == "0000") {
            console.log("机构信息：");
            console.log(res);
            let result = res.data.data.agentInfo;
            // 机构id
            this.agent_detail_form.agentid = result.agentid;
            // 机构名称
            this.agent_detail_form.agent_name = result.agent_name;
            // 负责人
            this.agent_detail_form.charger = result.charger;
            // 业务地区
            this.agent_detail_form.province_code = result.province_code;
            // 根据省查询所有市
            this.queryCity(result.province, "agent_detail_form");

            this.agent_detail_form.city_code = result.city_code;
            // 联系地址
            this.agent_detail_form.address = result.address;
            // 贝壳分成
            this.agent_detail_form.virtual_rate = result.virtual_rate;
            // 出行分成
            this.agent_detail_form.account_rate = result.account_rate;
            // 电话
            this.agent_detail_form.phone = result.phone;
            // 邮箱
            this.agent_detail_form.email = result.email;
            // 合同编号
            this.agent_detail_form.contract_no = result.contract_no;
            // 开户行
            this.agent_detail_form.bank_code = result.bank_code;
            // 开户名
            this.agent_detail_form.account_user = result.account_user;
            // 账号
            this.agent_detail_form.account_no = result.account_no;
            // 开户地
            // 查询开户行所在省份下的所有市列表
            this.queryBankCity(result.account_province, "agent_detail_form");
            this.agent_detail_form.account_province_code =
              result.account_pro_code;
            this.agent_detail_form.account_city_code = result.account_city_code;

            this.agent_detail_loading = false;
          }
        })
        .catch(err => {});
    },
    // 查询按钮
    queryData() {
      // console.log(this.queryForm)
      // 根据参数进行查询
      this.getTableDataList(1);
    },
    // 重置按钮
    resetData(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },
    // 刷新按钮
    handle_refresh() {
      this.getTableDataList(1);
      this.currentPage = 1;
    },
    // 初始化 银行信息
    getBankList() {
      this.$http
        .post(`${commonUrl.baseUrl}/agent/addAgent`, {
          data: {
            signInUserId: this._signInUserId,
            signInRoleId: this.$store.getters.roleId
          }
        })
        .then(res => {
          if (res.data.code == "0000") {
            this.bankInfo = this.agent_detail_form.bankInfo =
              res.data.data.bankList;
            // 组合省份
            // let arr = [];
            // if(res.data.data.manageProvinceCodeList.length > 0){
            //     for(let item of res.data.data.manageProvinceCodeList){
            //         arr.push({
            //             adcode: item.province_code,
            //             province: provinces.province_list[item.province_code]
            //         })
            //     }
            // }
            // this.add_form.regions = arr;
          }
        })
        .catch(err => {});
    },
    // 省份change事件
    changeOption_province(e) {
      // 参数收集
      this.queryForm.province_param = {
        adcode: e,
        txt: provinces.province_list[e]
      };
      // console.log(e)
      // console.log(provinces.province_list[e])
      // 赋值cities (先清理 后赋值)
      this.queryForm.cities = [];
      this.queryForm.city = "";
      this.queryCity(provinces.province_list[e], "queryForm");
    },
    // 市区change事件
    changeOption_city(e) {},
    // 机构状态change事件
    changeOption_institutionalStatus(e) {
      console.log(e);
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
    // 查 市区 txt: String 省份名,dataOrigin 是指 add_form  或是queryeForm 这种 父级数据源
    queryCity(txt, dataOrigin) {
      let vm = this;
      // 搜索所有省/直辖市信息

      this.districtSearch.search(txt, function(status, result) {
        // console.log(result)
        // 查询成功时，result即为对应的行政区信息
        for (let item of result.districtList[0].districtList) {
          vm[dataOrigin].cities.push({
            adcode: item.adcode,
            city: item.name
          });
        }
      });
    },
    // 针对 account_cities这个特殊（后期合并方法***）
    queryBankCity(txt, dataOrigin) {
      let vm = this;
      // 搜索所有省/直辖市信息

      this.districtSearch.search(txt, function(status, result) {
        // 查询成功时，result即为对应的行政区信息
        for (let item of result.districtList[0].districtList) {
          vm[dataOrigin].account_cities.push({
            adcode: item.adcode,
            city: item.name
          });
        }
      });
    },
    // 开户地 市
    changeOption_city_addBank(e) {
      for (let item of this.detail_check_form.account_cities) {
        if (item.adcode == e) {
          this.detail_check_form.account_city_param = {
            cityname: item.city,
            adcode: e
          };
        }
      }
    },
    // 选择开户行
    changeOption_bank(e) {
      for (let item of this.detail_check_form.bankInfo) {
        if (item.bankcode == e) {
          this.detail_check_form.account_bank = item.bankname;
        }
      }
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      // 获取单前页数据列表
      this.getTableDataList(val);
    },
    // 工作记录分页
    detail_handleCurrentChange(val) {
      this.detail_currentPage = val;
      // 获取当前页工作记录
      this.getTableDataList_detail(this.detail_form.row, val);
    },
    // 格式化日期
    getFormatDate(date) {
      let _date = new Date(date);
      let YYYY = _date.getFullYear();
      let MM = _date.getMonth() + 1;
      let dd = _date.getDate(); //日
      let HH = _date.getHours(); //小时
      let mm = _date.getMinutes();
      let ss = _date.getSeconds();
      MM = MM > 9 ? MM : "0" + MM;
      dd = dd > 9 ? dd : "0" + dd;
      HH = HH > 9 ? HH : "0" + HH;
      mm = mm > 9 ? mm : "0" + mm;
      ss = ss > 9 ? ss : "0" + ss;
      return YYYY + "-" + MM + "-" + dd + " " + HH + ":" + mm + ":" + ss;
    },
    // 初始化 地图
    initMap() {
      let vm = this;
      //利用高德地图API 获取 所有省
      AMap.plugin("AMap.DistrictSearch", function() {
        vm.districtSearch = new AMap.DistrictSearch({
          // 关键字对应的行政区级别，country表示国家
          level: "city",
          //  显示下级行政区级数，1表示返回下一级行政区
          subdistrict: 1
        });
      });
    },
    // 初始化 省份数据
    initProvinces() {
      // 处理一下 数据
      let arr = [];
      for (let i in provinces.province_list) {
        arr.push({
          adcode: i,
          province: provinces.province_list[i]
        });
      }
      this.queryForm.regions = arr;
      // 详情
      this.detail_form.regions = this.detail_form.account_regions = arr;
      // 详情并修改
      this.agent_detail_form.regions = this.agent_detail_form.account_regions = arr;
    }
  }
};
</script>
