<template>
    <div class="pad_5">
        <!-- M1 查询区域 -->
        <div class="query_fields pad_b_no handle_timerange">
            <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
            <!-- 机构名称 只有市代显示机构名称-->
            <el-form-item v-if="roleId == 6" label="机构名称" prop="agentName" label-width="68px">
                <el-input v-model="queryForm.agentName" placeholder="请输入机构名称" class="wid_140"></el-input>
            </el-form-item>
            <!-- 用户ID -->
            <el-form-item label="用户ID" prop="customid" label-width="68px">
                <el-input v-model="queryForm.customid" placeholder="请输入用户ID" class="wid_140"></el-input>
            </el-form-item>
            <!-- 向导姓名 -->
            <el-form-item label="向导姓名" prop="name">
              <el-input v-model="queryForm.name" placeholder="请输入向导姓名" class="wid_140"></el-input>
            </el-form-item>
            <!-- 向导ID -->
            <el-form-item label="向导ID" prop="traveler_customid" label-width="68px">
                <el-input v-model="queryForm.traveler_customid" placeholder="请输入向导ID" class="wid_140"></el-input>
            </el-form-item>
            <!-- 出行项目 -->

            <el-form-item label="出行项目" prop="travel_projects" label-width="68px">
                <el-select v-model="queryForm.travel_projects"
                        class="wid_140"
                        placeholder="选选出行项目"
                        >
                        <el-option v-for="(item, index) in queryForm.travel_projectss"
                            :key="index"
                            :label=" item.txt"
                            :value=" item.txt">
                        </el-option>
                </el-select>

            </el-form-item>
            <!-- 出行时间 -->
            <el-form-item label="出行时间" prop="allTime">
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
                <el-table-column prop="customid" label="用户ID" width="" >
                </el-table-column>
                <el-table-column prop="custom_name" label="用户姓名" width="78px">
                </el-table-column>
                <!-- 用户电话 -->
                <el-table-column prop="custom_phone" label="用户电话" width="110px">
                </el-table-column>
                <!--出行项目 1晨光出行2暖阳午后3星空夜景 -->
                <el-table-column prop="travel_projects" label="出行项目" width="78px">
                    <!-- <template slot-scope="scope">
                        <span v-if="scope.row.travel_projects == 1">晨光出行</span>
                        <span v-else-if="scope.row.travel_projects == 2">暖阳午后</span>
                        <span v-else-if="scope.row.travel_projects == 3">星空夜景</span>
                    </template> -->
                </el-table-column>
                <!-- 集合地点 -->
                <el-table-column prop="meet_address" show-overflow-tooltip label="集合地点" width="">
                </el-table-column>
                <el-table-column prop="traveler_customid" label="向导ID" width="80px">
                </el-table-column>
                <el-table-column prop="name" label="向导姓名" width="78px">
                </el-table-column>
                <!-- 区代理不显示 所属机构 -->
                <el-table-column v-if="roleId != 10" prop="agentName" :show-overflow-tooltip="true" label="所属机构" width="">
                </el-table-column>
                <el-table-column prop="travel_time" label="出行日期" :show-overflow-tooltip="true" width="">
                </el-table-column>
                <!--订单状态 0下单 1订单完成 2待支付 3支付成功 4订单确认 5订单取消 6订单取消已退款 7订单 -->
                <el-table-column prop="" label="订单状态" width="">
                    <template slot-scope="scope">
                        <span v-if="scope.row.order_status == 0">下单</span>
                        <span v-else-if="scope.row.order_status == 1">订单完成</span>
                        <span v-else-if="scope.row.order_status == 2">待支付</span>
                        <span v-else-if="scope.row.order_status == 3">支付成功</span>
                        <span v-else-if="scope.row.order_status == 4">订单确认</span>
                        <span v-else-if="scope.row.order_status == 5">订单取消</span>
                        <span v-else-if="scope.row.order_status == 6">订单取消已退款</span>
                        <span v-else-if="scope.row.order_status == 7">订单</span>
                    </template>
                </el-table-column>
                <el-table-column prop="custom_evaluate" show-overflow-tooltip label="对用户评价" width="">
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
    </div>
</template>
<script>
import commonUrl from '../../utils/common';

export default {
    name: 'travelOrder',
    data(){
      return {
          roleId:'',
          _signInUserId:'',
          // 主列表
          tableLoading:false,
          tableData:[],
          // 分页
          pageTotal: 0,
          currentPage:1,
          // 查询参数
          queryForm: {
              // 机构名称
              agentName:'',
              // 向导姓名
              name:'',
              // 用户ID
              customid:'',
              // 记录 开始和结束时间的数组
              allTime:'',
              // 开始时间
              startTime:'',
              // 结束时间
              endTime:'',
              // 出行项目
              // 1晨光出行2暖阳午后3星空夜景
              travel_projectss:[
                  {
                      id:1,
                      txt:'晨光出行'
                  },
                  {
                      id:2,
                      txt:'暖阳午后'
                  },
                  {
                      id:3,
                      txt:'星空夜景'
                  }
              ],
              travel_projects:'',
              // 向导ID
              traveler_customid:'',

          },


      }
    },
    created(){
        this.roleId = this.$store.getters.roleId;
         // 判断是否为roleid是否为11并处理
    this._signInUserId = this.transformSignInUserId();
        // 初始化主列表
        this.getTabelDataList(1)
    },
    methods:{
      // 处理signInUserId的值（当roleid为11时）
    transformSignInUserId(){
      // 先判断roleid == 11 ,若11，则up_userid 作为 signinuserid的值
      if(this.$store.getters.roleId == 11){
        return this.$store.getters.up_userId
      }else{
        return this.$store.getters.userId
      }
    },
        // 初始化主列表
        getTabelDataList(pageNum){
            // 参数
            let param = {
                data: {
                    // 公有
                    signInUserId: this._signInUserId,
                    signInRoleId: this.$store.getters.roleId,
                    pageNum: pageNum,
                    pageSize: 10,
                    // 私有
                    // 机构名称
                    agentName:this.queryForm.agentName,
                    // 用户ID
                    customid:this.queryForm.customid,
                    // 向导ID
                    traveler_customid:this.queryForm.traveler_customid,
                    // 向导姓名
                    name:this.queryForm.name,
                    // 出行项目
                    travel_projects:this.queryForm.travel_projects,
                    // 出行开始时间
                    startTime:this.queryForm.startTime,
                    // 出行结束时间
                    endTime:this.queryForm.endTime,
                }
            }
            this.tableLoading = true
            this.$http.post(`${ commonUrl.baseUrl }/customOrder/getCustomOrder`, param).then(res=>{
                // console.log(res)
                // debugger
                if(res.data.code == '0000'){
                    this.tableData =  res.data.data.customOrderList
                    // 分页 总数
                    this.pageTotal = res.data.data.page.pageTotal;
                    // 关闭加载
                    this.tableLoading = false
                }
            }).catch(err=>{})
        },
        // 查询按钮
        queryData(){

            // 修正 开始 和结束 时间
            this.queryForm.startTime = this.queryForm.allTime[0]
            this.queryForm.endTime = this.queryForm.allTime[1]
            // console.log(this.queryForm)
            this.getTabelDataList(1);
            this.currentPage = 1
        },
        // 刷新
        handle_refresh(){
            this.getTabelDataList(this.currentPage)
            // this.currentPage = 1
        },
        // 重置按钮
        resetData(formName){
            this.$refs[formName].resetFields();
            // 对于queryForm 下拉
            this.queryForm.startTime = ''
            this.queryForm.endTime = ''
        },
        // 分页
        handleCurrentChange(val){
             this.currentPage = val
            // 获取单前页数据列表
            this.getTabelDataList(val);
            //console.log(`当前页: ${val}`);
        },

    }
}
</script>
