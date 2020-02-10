<template>

    <div class="pad_5">
        <!-- M1 查询区域 -->
        <div class="query_fields pad_b_no">
            <el-form :inline="true" :model="queryForm" size="mini" class="demo-form-inline">
            <!-- 所属机构1 -->
            <el-form-item label="昵称">
                <el-input v-model="queryForm.nickname" placeholder="请输入昵称" class="wid_140"></el-input>
            </el-form-item>
            <!-- 是否会员2 -->
            <el-form-item label="会员状态" >
               <el-select v-model="queryForm.member_status"
                    class="wid_140"
                    placeholder="请选择会员状态"
                    @change="changeOption_vip($event)">
                    <el-option v-for="(item, index) in queryForm.member_statuss"
                        :key="index"
                        :label=" item.txt "
                        :value=" item.id ">
                    </el-option>
                </el-select>
            </el-form-item>

            <!-- 查询 -->
            <el-form-item>
                <el-button type="primary" size='mini' @click="queryData">查询</el-button>
                <el-button type="success" size='mini' @click="resetData">重置</el-button>

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
                <el-table-column prop="phone" label="电话" width="">
                </el-table-column>
                <el-table-column prop="sex" label="性别" width="">
                </el-table-column>
                <el-table-column prop="" label="客户类别" width="">
                    <template slot-scope="scope">

                        <span v-if="scope.row.custom_type == 0">普通客户</span>
                        <span v-else-if="scope.row.custom_type == 1">兼职向导</span>
                        <span v-else-if="scope.row.custom_type == 2">全职向导</span>
                        <span v-else-if="scope.row.custom_type == 3">咨询人员</span>
                        <span v-else-if="scope.row.custom_type == 4">校园代理</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="用户状态" width="">
                    <template slot-scope="scope">

                        <span v-if="scope.row.custom_status == 1">可用</span>
                        <span v-else-if="scope.row.custom_status == 2">不可用</span>

                    </template>
                </el-table-column>
                <el-table-column prop="" label="会员状态" width="">
                    <template slot-scope="scope">
                        <span v-if="scope.row.member_status == 1">普通会员</span>
                        <span v-else-if="scope.row.member_status == 2">超级会员</span>
                    </template>
                </el-table-column>

                <el-table-column prop="" label="操作" width="">
                    <template slot-scope="scope">
                        <el-button @click="handle_detail(scope.row)" type="text" size="small">详情</el-button>
                        <!-- 可用 -->
                        <el-button v-if="scope.row.custom_status == 1" @click="handle_frozen(scope.row)" type="text" size="small">冻结</el-button>
                        <!-- 不可用 -->
                        <el-button v-if="scope.row.custom_status == 2" @click="handle_frozen(scope.row)" type="text" size="small">解冻</el-button>
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
        <!-- M3 dialog 新增 -->
        <el-dialog
            :title="detailForm.detailForm_title"
            :visible.sync="dialogVisible_detail"
            width="42%"
            class="addUsers_dialog"
            center
            v-loading="add_loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            >
            <!--新增 body -->
            <div class="dialogBody_addPermission">
                <div class="grid-content bg-purple-dark pad_t2">
                    <el-form :inline="true" :model="detailForm"   label-width="80px" class="demo-form-inline valid_form">
                        <el-form-item label="昵称" >
                            <el-input v-model="detailForm.nickname" :disabled="true" class="wid_140" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="电话" >
                        <el-input v-model="detailForm.phone" :disabled="true" class="wid_140" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="性别" class="wid_parent">
                            <template >
                                <el-radio disabled v-model="detailForm.sex" label="男">男</el-radio>
                                <el-radio disabled v-model="detailForm.sex" label="女">女</el-radio>
                            </template>
                        </el-form-item>
                        <el-form-item label="会员状态"  >

                        <el-input v-model="detailForm.member_status" :disabled="true" class="wid_140" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱"  >
                            <el-input v-model="detailForm.email" :disabled="true" class="wid_140" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="客户ID"  >
                            <el-input v-model="detailForm.customid" :disabled="true" class="wid_140" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="客户类别"  >
                            <el-input v-model="detailForm.custom_type" :disabled="true" class="wid_140" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="用户状态"  >
                            <el-input v-model="detailForm.custom_status" :disabled="true" class="wid_140" placeholder=""></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="info" @click="dialogVisible_detail = false" size='mini'>关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import commonUrl from '../../utils/common';

export default {
    name: 'customInfo',
    data(){
        let validMobile=(rule,value,callback)=>{
            if(value==''||value==undefined){
                callback()
            }else{
                let reg=/^1[3|4|5|7|8][0-9]\d{8}$/
                if(!reg.test(value)){callback(new Error('请输入正确手机号'))}else{
                    callback()
                }
            }
        };
        return {
            // 主列表
            tableLoading:false,
            tableData:[],
            // 分页
            pageTotal: 100,
            currentPage:1,
            // 查询参数
            queryForm: {
                member_statuss:[
                    {
                        id:1,
                        txt:'普通会员'
                    },
                    {
                        id:2,
                        txt:'超级会员'
                    }
                ],
                nickname:'',
                member_status:''
            },
            value1:'',
            // 弹框
            dialogVisible_detail:false,
            add_loading:false,
            // 新增 弹框规则 修改也用该弹框
            detailForm: {
                // 标题
                detailForm_title:'',
                nickname:'',
                phone:'',
                sex:'',
                member_status:'',
                email:'',
                customid:'',
                custom_type:'', // 客户类别  0普通客户 1兼职向导人员 2全职向导人员 3咨询人员 4校园代
                custom_status:'',//用户状态  1可用 2不可用
                apple_pay:'',    //是否可以进行苹果支付 1支持 2不支持
                app_openid:'',   //第三方登录标识 微信Openid 陌陌
                app_logintype:'',//app登录类别 0手机号 1微信 2陌陌 3邮箱
            },

        }
    },
    created(){
        // 初始化 主列表数据
        this.getTableDataList(1)
    },
    methods:{
        // 初始化 主列表数据
        getTableDataList(pageNum){

            let param = {
                data:{

                    nickname:this.queryForm.nickname,
                    member_status:this.queryForm.member_status,

                    signInUserId: this.$store.getters.userId,
                    signInRole: this.$store.getters.roleId,
                    pageNum: pageNum,
                    pageSize: 10,
                }
            }
            this.tableLoading = true;
            this.$http.post(`${ commonUrl.baseUrl }/customInfo/getCustomInfo`, param).then( res =>{
                console.log(res)
                if (res.data.code == '0000') {

                    this.tableLoading = false
                    this.tableData = res.data.data.customInfoList
                    // 分页 总数
                    this.pageTotal = res.data.data.page.pageTotal;


                }
            }).catch( err => {

            })
        },
        // 查询按钮
        queryData(){
            // 参数
            let param ={
                member_status:this.queryForm.member_status,
                nickname:this.queryForm.nickname
            }
            console.log(param)
            this.getTableDataList(1);
            this.currentPage = 1
        },
        // 重置按钮
        resetData(){
            this.queryForm.nickname = '';
            this.queryForm.member_status = '';

        },
        // 冻结/解冻 解冻1 冻结2
        handle_frozen(row){

            let tip_txt = row.custom_status == 1? '冻结成功' : '解冻成功'
            let param = {
                data:{
                     // 公有
                    signInUserId: this.$store.getters.userId,
                    signInRole: this.$store.getters.roleId,
                    // 参数 私有
                    custom_status: row.custom_status == 1 ? 2 : 1,
                    customid:row.customid,
                }

            }
            this.tableLoading = true
            this.$http.post(`${commonUrl.baseUrl}/customInfo/updateStatus`, param).then( res=>{

                if(res.data.code == '0000'){
                    this.tableLoading = false
                    this.m_message(tip_txt, 'success')
                    this.getTableDataList(1)
                }
            }).catch(err=>{

            })

        },
        // 详情操作
        handle_detail(row){
            // 标题
            this.detailForm.detailForm_title = row.nickname
            // 参数
            let param = {
                data:{
                    // 公有
                    signInUserId: this.$store.getters.userId,
                    signInRole: this.$store.getters.roleId,
                    // 私有 当前id
                    customid:row.customid
                }
            }
            // 开弹框
            this.dialogVisible_detail = true
            // 加载中
            this.add_loading = true
            this.$http.post(`${ commonUrl.baseUrl }/customInfo/findCustomInfoDetails`, param).then( res => {
                if(res.data.code == '0000'){
                    // 数据赋值
                    let result = res.data.data.customInfo;
                    this.detailForm.nickname = result.nickname
                    this.detailForm.phone   = result.phone
                    this.detailForm.sex = result.sex == 1 ? '男' : '女'
                    // 1普通会员 2超级会员
                    this.detailForm.member_status = result.member_status == 1 ? '普通会员' : '超级会员'
                    this.detailForm.email = result.email
                    this.detailForm.customid = result.customid
                    // 客户类别
                    // 0普通客户 1兼职向导人员 2全职向导人员 3咨询人员 4校园代理
                    switch(result.custom_type){
                        case 0:
                            this.detailForm.custom_type = '普通客户';
                            break;
                        case 1:
                            this.detailForm.custom_type = '兼职向导';
                            break;
                        case 2:
                            this.detailForm.custom_type = '全职向导';
                            break;
                        case 3:
                            this.detailForm.custom_type = '咨询人员';
                            break;
                        case 4:
                            this.detailForm.custom_type = '校园代理';
                            break;
                    }
                    this.detailForm.custom_status = result.custom_status == 1 ? '可用' : '不可用'
                    // 加载完
                    this.add_loading = false
                }
            }).catch( err =>{

            })

        },
        // 机构状态change事件
        changeOption_vip(e){
            console.log(e);
        },

        // 分页
        handleCurrentChange(val) {
            this.currentPage = val
            // 获取单前页数据列表
            this.getTableDataList(val);
            //console.log(`当前页: ${val}`);
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
