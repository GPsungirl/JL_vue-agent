<template>
  <!-- 红包活动》》红包领取记录 -->
  <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields pad_b_no">
      <el-form
        :inline="true"
        :model="queryForm"
        ref="queryForm"
        size="mini"
        class="demo-form-inline" label-width="70px">
        <!-- 向导ID -->
        <el-form-item label="向导ID" prop="customid" label-width>
          <el-input v-model="queryForm.customid" placeholder="请输入向导ID" class="wid_140"></el-input>
        </el-form-item>
        <!-- 向导姓名 -->
        <el-form-item label="向导姓名" prop="name">
          <el-input v-model="queryForm.name" placeholder="请输入向导姓名" class="wid_140"></el-input>
        </el-form-item>
        <!-- 向导昵称 -->
        <el-form-item label="向导昵称" prop="nickname">
          <el-input v-model="queryForm.nickname" placeholder="请输入向导昵称" class="wid_140"></el-input>
        </el-form-item>
        <!-- 上级ID -->
        <el-form-item label="上级ID" prop="up_customid" label-width>
          <el-input v-model="queryForm.up_customid" placeholder="请输入上级ID" class="wid_140"></el-input>
        </el-form-item>
        <!-- 上级姓名 -->
        <el-form-item label="上级姓名" prop="up_name">
          <el-input v-model="queryForm.up_name" placeholder="请输入上级姓名" class="wid_140"></el-input>
        </el-form-item>
        <!-- 领取日期 -->
        <el-form-item label="领取日期" prop="allTime">
            <el-date-picker
                v-model="queryForm.allTime"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
            </el-date-picker>
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
        <el-table-column prop="customid" label="向导ID"  width></el-table-column>
        <el-table-column prop="name" label="向导姓名" width=""></el-table-column>
        <el-table-column prop="nickname" label="向导昵称" width=""></el-table-column>
        <el-table-column prop="up_customid" label="上级ID" width></el-table-column>
        <el-table-column prop="up_name" label="上级姓名" width></el-table-column>
        <!-- 时间 account_instant_day-->
        <el-table-column prop="account_instant_day" label="领取时间" :show-overflow-tooltip="true" width></el-table-column>
        <!-- 领取金额 amount-->
        <el-table-column prop="amount" label="领取金额(元)" width></el-table-column>
        <!-- 备注 task_sub_type 1机构任务签到红包 2机构任务助力红包-->
        <el-table-column prop="amount" label="备注" width>
            <template slot-scope="scope">
                <span v-if="scope.row.task_sub_type == '1'">签到红包</span>
                <span v-else-if="scope.row.task_sub_type == '2'">助力红包</span>
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

  </div>
</template>
<script>
import provinces from "../../utils/area.js";
import commonUrl from "../../utils/common";
import {
  isvalidPhone,
  validNum100,
  validNum15,
  validDyNum
} from "../../utils/validate";

export default {
  name: "redEnveiopeRecord",
  data() {
    // 校验分成
    let validRate = (val, value, callback) => {
      if (!value) {
        callback(new Error("请输入值"));
      } else if (!validNum100(value)) {
        callback(new Error("请输入0-100之间的数"));
      } else {
        callback();
      }
    };

    return {
      roleId: "",
      _signInUserId:'',
      // 主列表
      tableLoading: false,
      tableData: [],
      // 分页
      pageTotal: 0,
      currentPage: 1,
      // 查询参数
      queryForm: {
        // 向导昵称
        nickname:'',
        // 上级姓名 上级id
        up_customid: "",
        up_name: "",
        // 姓名
        name: "",
        // 向导id
        customid: "",
       // 所有时间
        allTime:'',
        // 结束时间
        endTime:'',
        // 开始时间
        startTime:'',
      },

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
            pageNum: pageNum,
            pageSize: 10,
            // 私有
            // 所属机构 姓名 向导状态 上级id  上级姓名
            nickname:this.queryForm.nickname,
            up_customid: this.queryForm.up_customid,
            up_name: this.queryForm.up_name,
            name: this.queryForm.name,
            customid: this.queryForm.customid,
            startTime:this.queryForm.startTime,
            endTime:this.queryForm.endTime,
        }
      };
      this.tableLoading = true;
      this.$http
        .post(
          `${commonUrl.baseUrl}/travelerInfo/travelerRedEnvelopeRecordList`,
          param
        )
        .then(res => {
          if (res.data.code == "0000") {

            this.tableData = res.data.data.redEnvelopeRecordList;
            // 分页总数
            this.pageTotal = res.data.data.page.pageTotal;
            this.tableLoading = false;
          }
        })
        .catch(err => {});
    },
    // 查询按钮
    queryData() {
      // console.log(this.queryForm)
      // 根据参数进行查询

      if(typeof this.queryForm.allTime != 'string'){
          if(this.queryForm.allTime.length > 0){
            // 修正 开始 和结束 时间
            this.queryForm.startTime = this.queryForm.allTime[0]
            this.queryForm.endTime = this.queryForm.allTime[1]
        }
      }
        this.getTableDataList(1);
    },
    // 重置按钮
    resetData(formName) {
        if (this.$refs[formName]) {
            this.$refs[formName].resetFields();
        }
        this.queryForm.startTime = ''
        this.queryForm.endTime = ''
    },
    // 刷新按钮
    handle_refresh() {
      this.getTableDataList(1);
      this.currentPage = 1;
    },
    // 机构状态change事件
    changeOption_traveler_status(e) {
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
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      // 获取单前页数据列表
      this.getTableDataList(val);
    },

  }
};
</script>
<style lang="scss">
.modi_rate .el-form-item {
  display: flex;
  justify-content: center;
}
.cell .el-button--small,
.cell .el-button--small.is-round {
  padding: 1px 0px;
}
</style>
