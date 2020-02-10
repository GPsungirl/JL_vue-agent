<template>
    <div class="pad_5">
        <!-- M1 查询区域 -->
        <div class="query_fields pad_b_no handle_timerange">
            <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
             <!-- 昵称 -->
            <el-form-item label="昵称" prop="nickname" label-width="68px">
                <el-input v-model="queryForm.nickname" placeholder="请输入昵称" class="wid_140"></el-input>
            </el-form-item>
            <!-- 订单编号 -->
            <el-form-item label="订单编号" prop="consume_no" label-width="68px">
                <el-input v-model="queryForm.consume_no" placeholder="请输入订单编号" class="wid_140"></el-input>
            </el-form-item>
            <!-- 支付方式 -->
            <el-form-item label="支付方式" prop="pay_type">
               <el-select v-model="queryForm.pay_type"
                    class="wid_140"
                    placeholder="请选择支付方式"
                    >
                    <el-option v-for="(item, index) in queryForm.pay_types"
                        :key="index"
                        :label=" item.value "
                        :value=" item.id ">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 消费用途 -->
            <el-form-item label="消费用途" prop="business_type">
               <el-select v-model="queryForm.business_type"
                    class="wid_140"
                    placeholder="请选择消费用途"
                    >
                    <el-option v-for="(item, index) in queryForm.business_types"
                        :key="index"
                        :label=" item.value "
                        :value=" item.id ">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 消费金额 -->
            <el-form-item label="消费金额" label-width="68px">
                <el-input v-model="queryForm.lowMoney"  placeholder="最小金额" class="wid_68"></el-input> -
                <el-input v-model="queryForm.highMoney"  placeholder="最大金额" class="wid_68"></el-input> 元
            </el-form-item>
            <!-- 消费时间 -->
            <el-form-item label="消费时间" prop="businessTime">
                <el-date-picker
                    v-model="queryForm.businessTime"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
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
                <el-table-column prop="customid" label="用户ID" width="" >
                </el-table-column>
                <el-table-column prop="nickname" label="昵称" width="">
                </el-table-column>
                <el-table-column prop="money" label="消费金额(元)" width="">
                </el-table-column>
                <el-table-column prop="sex" label="性别" width="50px">
                </el-table-column>
                <el-table-column prop="phone" label="电话" width="">
                </el-table-column>
                <!-- 消费用途 1订单支付 2充值 3会员-->
                <el-table-column prop="" label="消费用途" width="">
                    <template slot-scope="scope">
                        <span v-if="scope.row.business_type == 1">订单支付</span>
                        <span v-else-if="scope.row.business_type == 2">充值</span>
                        <span v-else-if="scope.row.business_type == 3">会员</span>
                    </template>
                </el-table-column>
                <!-- 支付方式  1支付宝 2微信-->
                <el-table-column prop="" label="支付方式" width="80px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.pay_type == 1">支付宝</span>
                        <span v-else-if="scope.row.pay_type == 2">微信</span>
                    </template>
                </el-table-column>
                <!-- 消费的订单编号 -->
                <el-table-column prop="consume_no" label="订单编号" width="200px">
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
    name: 'consumeOrderUnion',
    data(){
        return {

            // 主列表
            tableLoading:false,
            tableData:[],
            // 分页
            pageTotal: 100,
            currentPage:1,
            // 查询参数
            queryForm: {
                // 消费用途     1订单支付 2充值 3会员
                business_types:[
                    {
                        id:1,
                        value:'订单支付'
                    },
                    {
                        id:2,
                        value:'充值'
                    },
                    {
                        id:3,
                        value:'会员'
                    }

                ],
                business_type:'',
                // 订单编号
                consume_no:'',
                // 消费时间
                businessTime:'',
                // 开始时间  结束时间
                startTime:'',
                endTime:'',
                // 最大金额 最小进额
                lowMoney:'',
                highMoney:'',
                // 昵称
                nickname:'',
                // 支付方式  1支付宝 2微信
                pay_types:[
                    {
                        id:1,
                        value:'支付宝'
                    },
                    {
                        id:2,
                        value:'微信'
                    }
                ],
                pay_type:'',

            },


        }
    },
    created(){
        // 初始化主列表
        this.getTabelDataList(1)
    },
    methods:{
        // 初始化主列表
        getTabelDataList(pageNum){
            // 参数
            let param = {
                data: {
                    // 公有
                    signInUserId: this.$store.getters.userId,
                    signInRoleId: this.$store.getters.roleId,
                    pageNum: pageNum,
                    pageSize: 10,
                    // 私有
                    // 消费用途   1订单支付 2充值 3会员
                    business_type:this.queryForm.business_type,
                    // 订单编号
                    consume_no:this.queryForm.consume_no,
                    // 开始时间  结束时间
                    startTime:this.queryForm.startTime,
                    endTime:this.queryForm.endTime,
                    // 最大金额 最小进额
                    lowMoney:this.queryForm.lowMoney,
                    highMoney:this.queryForm.highMoney,
                    // 昵称
                    nickname:this.queryForm.nickname,
                    // 支付方式  1支付宝 2微信
                    pay_type:this.queryForm.pay_type,
                }
            }
            this.tableLoading = true
            this.$http.post(`${ commonUrl.baseUrl }/consumeOrderUnion/getConsumeOrderUnion`, param).then(res=>{
                console.log(res)
                if(res.data.code == '0000'){
                    this.tableData =  res.data.data.consumeOrderUnionList
                    // 分页 总数
                    this.pageTotal = res.data.data.page.pageTotal;
                    // 关闭加载
                    this.tableLoading = false
                }
            }).catch(err=>{})
        },
        // 查询按钮
        queryData(){
            // 修正一下 开始时间和结束时间
            this.queryForm.startTime = this.queryForm.businessTime[0]
            this.queryForm.endTime = this.queryForm.businessTime[1]

            this.getTabelDataList(1);
            this.currentPage = 1
        },
        // 重置按钮
        resetData(formName){
            this.$refs[formName].resetFields();
            // 对于queryForm 下拉
            this.queryForm.businessTime = ''
            this.queryForm.pay_type = ''
            this.queryForm.business_type = ''
            this.queryForm.lowMoney = ''
            this.queryForm.highMoney = ''
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
