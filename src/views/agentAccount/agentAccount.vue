<template>
 <div class="pad_5">
    <!-- M1 查询区域 -->
    <div class="query_fields">
        <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
          <!-- 名称 -->
          <el-form-item label="机构名称" prop="agentName">
              <el-input v-model="queryForm.agentName" placeholder="请输入机构名称" class="wid_140"></el-input>
          </el-form-item>
          <!-- 周期 -->
          <el-form-item label="收益周期" prop="month">
            <el-date-picker
              class="wid_140"
              v-model="queryForm.month"
              type="month"
              value-format="yyyy-MM"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <!-- 状态 -->
          <el-form-item label="收益状态" prop="revenue_status">
            <el-select v-model="queryForm.revenue_status"
              class="wid_140"
              placeholder="请选择收益状态"
              >
              <el-option v-for="(item, index) in queryForm.revenue_statuss"
                :key="index"
                :label="item.value"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 查询 -->
          <el-form-item>
              <el-button type="primary" size='mini' @click="queryData">查询</el-button>
              <el-button type="success" size='mini' @click="resetData('queryForm')">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
    <!-- M2 主列表 -->
    <div>
      <!-- 表格 -->
      <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
          <el-table-column prop="agentName" label="机构名称" width="" >
          </el-table-column>
          <el-table-column prop="userName" label="用户名称" width="" >
          </el-table-column>

          <el-table-column prop="account_total" label="出行收益" width="" >
          </el-table-column>
          <el-table-column prop="total_amont" label="总金额" width="" >
          </el-table-column>

          <el-table-column prop="virtual_src_total" label="贝壳数" width="" >
          </el-table-column>
          <el-table-column prop="virtual_total" label="贝壳金额" width="">
          </el-table-column>
          <el-table-column prop="month" label="收益周期" width="">
          </el-table-column>
          <!-- 收益状态 1待开票2已开票3已发放4待发放5财务拒绝 -->
          <el-table-column prop="revenue_status" label="收益状态" width="">
            <template slot-scope="scope">
              <span v-if="scope.row.revenue_status == 1">待开票</span>
              <span v-else-if="scope.row.revenue_status == 2">已开票</span>
              <span v-else-if="scope.row.revenue_status == 3">已发放</span>
              <span v-else-if="scope.row.revenue_status == 4">待发放</span>
              <span v-else-if="scope.row.revenue_status == 5">财务拒绝</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="">
          <template slot-scope="scope">
              <el-button v-if="scope.row.revenue_status == 1 || scope.row.revenue_status == 5" @click="handle_upload(scope.row)" type="text" size="small">上传发票</el-button>
              <el-button v-else="" @click="view_upload(scope.row)" type="text" size="small">查看发票</el-button>
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
          >
          </el-pagination>
      </div>
    </div>
    <!-- M3 dialog 上传发票-->
    <el-dialog
      title="上传发票"
      :visible.sync="add_dialog"
      width="30%"
      center

      v-loading="invoice_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      >
      <!-- body append-to-body-->
      <div class="wid_b75">
        <el-upload
          action=""
          :http-request="handleUpload"
          :before-upload="beforeInvoiceUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :limit="1"

          >
          <i  class="el-icon-plus"></i>
        </el-upload>
        <el-dialog

          title="查看发票"
          :visible.sync="invoiceDialogVisible"
          append-to-body
          center
          class="invoiceimg_wrap"
          >
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
      <!-- footer  -->
      <span slot="footer" class="dialog-footer">
      <el-button @click="add_dialog = false" size='mini'>取 消</el-button>
      <el-button type="primary" @click="saveData" size='mini'>确 定</el-button>
      </span>
    </el-dialog>
    <!-- M4 dialog 查看发票 -->
    <el-dialog
      title="查看发票"
      :visible.sync="view_dialog"
      width="30%"
      center
      v-loading="view_loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      >

      <img width="100%" :src="viewImageUrl" alt="">

      <!-- footer -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="add_dialog = false" size='mini'>取 消</el-button>
      </span>
    </el-dialog>
 </div>

</template>

<script>
import { mapGetters } from 'vuex'
import commonUrl from '../../utils/common'

import axios from 'axios'
// 引入 COS
import COS from 'cos-js-sdk-v5'
export default {
  name: 'agentAccount',
  data(){
      return {
          // COS 所需参数
          cos:'',
          Bucket:'',
          Region:'',
          // ***主列表数据
          tableLoading: false,
          view_loading: false,
          invoice_loading:false,
          tableData: [],
          // ***查询区
          queryForm: {
            agentName:'',
            month:'',
            // 1待开票2已开票3已发放4待发放5财务拒绝
            revenue_statuss:[
              {
                id:1,
                value:'待开票'
              },
              {
                id:2,
                value:'已开票'
              },
              {
                id:3,
                value:'已发放'
              },
              {
                id:4,
                value:'待发放'
              },
              {
                id:5,
                value:'财务拒绝'
              }

            ],
            revenue_status:'',
          },
          // 分页
          pageTotal: 100,
          currentPage:1,
          // 弹框
          add_dialog:false,
          view_dialog:false,

          invoiceDialogVisible:false,
          dialogImageUrl:'',
          viewImageUrl:'', // 查看发票
          // 机构id (每次上传时都要存一下)
          agent_accountid:'',

      }
  },
  created(){
    //  获取所有数据
    this.getTableDataList(1);
    // 获取cos参数
    this.getCOSParam();
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {
    // 获取cos参数
    getCOSParam(){
      let vm  = this
      axios.post(`${commonUrl.cosUrl}/api/live/getCosKey`)
      .then(function (res) {
        if(res.data.code == '0000'){
          let result = res.data.data.liveList
          // 创建cos实例
          vm.cos = new COS({
            AppId: result.Appid,
            SecretId: result.SecretId,
            SecretKey: result.SecretKey,
          });
          // 存 cos 桶 和 源
          vm.Bucket = result.Bucket
          vm.Region = result.Region
        }

      })
      .catch(function (err) {
        console.log(err);
      });
    },
    // 初始化 主列表 数据
    getTableDataList(pageNum){
      let param = {
        data:{
          // 公有
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          pageNum: pageNum,
          pageSize: 10,
          // 私有参数
          agentName:this.queryForm.agentName,
          month:this.queryForm.month,
          revenue_status:this.queryForm.revenue_status,
        }
      }
      this.tableLoading = true
      this.$http.post(`${ commonUrl.baseUrl }/agentAccount/getAgentAccount`, param).then(res=>{
        if(res.data.code == '0000'){

          // 数据
          this.tableData = res.data.data.agentAccountList
          // 分页总数
          this.pageTotal = res.data.data.page.pageTotal;
          this.tableLoading = false
        }
      }).catch(err=>{

      })
    },
    // 查询按钮
    queryData(){
      this.getTableDataList(1);
      this.currentPage = 1
    },
    // 预检 上传
    beforeInvoiceUpload(file){

      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      if(!isJPG){
        this.m_message('只能上传图片', 'warning')
        return false
      }

    },
    // 上传 发票
    handleUpload(param){

      const vm = this

      let file = param.file;
      if (!file) return;
      let originName = file.name;
      let originSize = file.size;
      let originType = file.type;
      // 文件夹 文件名
      let  fileName =   new Date().getTime() + originName
      let  fileFolder = 'InvoiceImg/'
      let  key = 'InvoiceImg/' + new Date().getTime() + originName   // fileFolder + fileName
      vm.invoice_loading = true
      vm.cos.sliceUploadFile({
        Bucket: vm.Bucket,
        Region: vm.Region,
        Key: key, //上传的文件夹和图片名称
        Body: file, //要上传的文件
        onProgress: function (progressData) {
            /* 上传进度 */
            // console.log(progressData);
        }
      }, function (err, data) {
          if (data.statusCode == 200) { // 上传成功返回url

            //  将数据传给后台
            vm.$http.post(`${commonUrl.baseUrl}/agentAccount/uploadInvoice`, {
              data:{
                agent_accountid:vm.agent_accountid+'',  // vm.agent_accountid
                invoice_url:'/'+key
              }
            }).then(res=>{

              if(res.data.code == '0000'){
                vm.invoice_loading = false

                // 提示成功
                vm.m_message(res.data.msg, 'success')

                // 刷新 主数据列表
                vm.getTableDataList(this.currentPage);
              }

            }).catch(err=>{  })
          }

      });

    },
    handlePictureCardPreview(file){

      this.dialogImageUrl = file.url;
      this.invoiceDialogVisible = true;
    },
    handleRemove(file, fileList) {

      console.log(file, fileList);
    },
    // 上传发票
    handle_upload(row){
      this.add_dialog = true
      this.agent_accountid = row.agent_accountid
    },
    // 保存上传发票
    saveData(){

    },
    // 查看发票
    view_upload(row){
      let param = {
        data:{
          agent_accountid:row.agent_accountid+''
        }
      }
      // 弹框  加载中
      this.view_dialog = true
      this.view_loading= true
      this.$http.post(`${commonUrl.baseUrl}/agentAccount/checkInvoices`, param).then(res=>{
        if(res.data.code == '0000'){
          this.viewImageUrl = res.data.data.agentAccount.invoice_url
          // 加载 结束
          this.view_loading = false
        }
      }).catch(err=>{  })
    },
    // 收益状态 change事件
    changeProfitState(e){
      
    },
    // 分页
    handleCurrentChange(val){
      this.currentPage = val
      // 获取主页列表数据(loading状态)
      this.getTableDataList(val)
      //console.log(`当前页: ${val}`);
    },
    // 重置查询条件
    resetData(formName){
        this.$refs[formName].resetFields();
    },
    // 提示信息 message:提示信息   type 提示类型
    m_message(message,type){
      this.$message({
        message,
        type
      })
    },
  }
}
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
}

</style>
<style scoped>
.box .myBtn {
  color: gray;
  background: gray;
}


</style>
