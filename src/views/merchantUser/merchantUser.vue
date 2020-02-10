<template>
    <!-- 招商中心业务人员管理 (该页面拷贝于:区域经理的业务人员)-->
    <div class="pad_5">
        <!-- M1 查询区域 -->
        <div class="query_fields">
            <el-form :inline="true" :model="queryForm" :rules="queryForm_rules" ref="queryForm" size="mini" class="demo-form-inline ">
                <el-form-item label="姓名" prop="real_name">
                    <el-input v-model="queryForm.real_name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <!-- <el-form-item label="手机号" prop="phone">
                    <el-input v-model.number="queryForm.phone" placeholder="请输入手机号"></el-input>
                </el-form-item> -->
                <!-- <el-form-item label="业务区域" prop="management_area">
                    <el-select v-model="queryForm.management_area"
                        placeholder="请选择业务区域"
                        >
                        <el-option v-for="(item, index) in queryForm.regions"
                            :key="index"
                            :label=" item.province "
                            :value=" item.adcode ">
                        </el-option>

                    </el-select>
                </el-form-item> -->
                <el-form-item>
                    <el-button type="primary" size='mini' @click="queryData">查询</el-button>
                    <el-button type="success" size='mini' @click="resetData('queryForm')">重置</el-button>
                    <el-button type="primary" size='mini' @click="handle_refresh">刷新</el-button>
                    <el-button type="success" size='mini' @click="handle_add">新增业务人员</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- M2 主列表 -->
        <div>
            <!-- 表格 -->
            <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
                <el-table-column prop="real_name" label="姓名" width="" >
                </el-table-column>
                <!-- <el-table-column prop="management_area" label="业务区域" width="">
                </el-table-column> -->
                <el-table-column prop="phone" label="电话" width="">
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="">
                </el-table-column>
                <el-table-column prop="" label="状态" width="">
                    <template slot-scope="scope">
                        <span v-if="scope.row.is_del == 0">可用</span>
                        <span v-else-if="scope.row.is_del == 1">不可用</span>
                    </template>
                </el-table-column>
                <el-table-column v-if="roleId == 5" prop="" label="操作" width="">
                <template slot-scope="scope">
                    <el-button  @click="handle_modi(scope.row)" type="text" size="small">修改</el-button>
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
        <!-- M3 dialog 新增/修改-->
        <el-dialog
            title="新增招商业务人员"
            :visible.sync="add_dialog"
            width="30%"
            center
            class="valid_form"
            v-loading="add_loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            >
            <!-- body -->
            <div class="wid_b75">
                <el-form  :model="add_formInline" :rules="rules" ref="add_formInline" label-width="50px"  class="demo-ruleForm">
                    <el-form-item label="姓名" prop="real_name">
                        <el-input v-model="add_formInline.real_name" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="phone">
                        <el-input v-model.number="add_formInline.phone" :disabled="modi_user"  placeholder="请输入电话"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="add_formInline.email" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="区域" prop="region" class="modiWidth_select">
                        <el-select v-model="add_formInline.region"
                            multiple
                            placeholder="请选择区域"
                            @change="add_changeOption($event)">
                            <el-option v-for="(item, index) in add_formInline.regions"
                            :key="index"
                            :label=" item.province "
                            :value=" item.adcode "
                            >
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                </el-form>
            </div>
             <!-- footer  -->
            <span slot="footer" class="dialog-footer">
            <el-button @click="add_dialog = false" size='mini'>取 消</el-button>
            <el-button v-show="add_formInline.id == ''" type="primary" @click="save_add" size='mini'>确 定</el-button>
            <el-button v-show="add_formInline.id != ''" type="primary" @click="save_modi" size='mini'>确 定</el-button>

            </span>
        </el-dialog>


    </div>
</template>
<script>
import commonUrl from '../../utils/common'
import provinces from '../../utils/area.js'
import {isvalidPhone} from '../../utils/validate'
export default {
    name: 'merchantUser',
    data(){
        // 校验手机号
        let validPhone=(rule, value,callback)=>{
            if (!value){
                callback(new Error('请输入电话号码'))
            }else  if (!isvalidPhone(value)){
                callback(new Error('请输入正确手机号码'))
            }else {
                callback()
            }
        };
        return {
            // 角色ID
            roleId:'',
            // 招商中心编号
            merchant_center_code:'',
            queryForm: {
                // 预存省份(固)
                regions:'',
                // 区域(省)
                management_area:'',


                // 姓名
                real_name:'',
                // 电话
                phone:'',


            },
            // 查询 参数
            query_param: {
                // 姓名
                real_name:'',

                // 区域(省)
                management_area:'',
            },
            queryForm_rules:{
                // phone:[
                //     { validator: validPhone, trigger: 'blur' }
                // ]
            },
            // 主表list
            tableLoading:false,
            add_loading:false,
            tableData: [],
            // 分页
            pageTotal: 100,
            currentPage:1,
            // 弹框
            add_dialog: false,
            modi_diaog: false,

            // 新增弹框的数据
            modi_phone:false,
            add_formInline: {
                real_name: '',

                phone: '',
                email: '',

                id:'',
            },
            // 新增 解禁，修改封禁
            modi_user:false,
            rules: {
                real_name: [
                    { required: true, message:'请输入姓名', trigger: 'blur' }
                ],
                phone: [
                    { required: true, validator: validPhone, trigger: 'blur' }
                ],
                email: [
                    { required: true, message:'请输入邮箱', trigger: 'blur' }
                ],
                // region: [
                //     { required: true, message:'请选择业务区域', trigger: 'change' }
                // ]
            },
            // 修改弹框的数据
            modi_formInline: {

            },
            // 修改页面需要用到id
            modi_id:''

        }
    },
    created(){
        // 初始化角色
        this.roleId = this.$store.getters.roleId;
        // 初始化招商中心编号
        this.merchant_center_code = this.$store.getters.merchant_center_code;
        // 初始化 省份数据
        // this.initProvinces();
        // 初始化主列表数据
        this.getTableDataList(1);

    },
    methods: {
        // 初始化主列表数据
        getTableDataList(pageNum){
            // 参数
            let param = {
                data:{
                    // 公有
                    signInUserId: this.$store.getters.userId,
                    signInRoleId: this.$store.getters.roleId,
                    pageNum: pageNum,
                    pageSize: 10,
                    merchant_center_code:this.$store.getters.merchant_center_code,
                    // 私有     姓名  电话
                    real_name:this.queryForm.real_name,
                    phone:this.queryForm.phone,
                }
            }
            // 请求
            this.tableLoading = true
            this.$http.post(`${ commonUrl.baseUrl }/merchantCenter/selectMerchantSalesman`, param).then(res=>{
                if(res.data.code == '0000'){
                    console.log(res)
                    this.tableData =  res.data.data.userList
                    // 分页 总数
                    this.pageTotal = res.data.data.page.pageTotal;
                    // 关闭加载
                    this.tableLoading = false
                }
            }).catch(err=>{})
        },
        // 初始化 省份数据
        initProvinces(){
            // 处理一下 数据
            let arr = [];
            for(let i in provinces.province_list){
                arr.push({
                    adcode:i,
                    province:provinces.province_list[i]
                })
            }
            this.queryForm.regions = arr
            this.add_formInline.regions = arr
        },
        // 查询按钮
        queryData(){
            this.getTableDataList(1);
            this.currentPage = 1
        },
        // 省份change事件
        changeOption(e){

            this.query_param.province = { adcode:e, txt: provinces.province_list[e] }
        },
        // 新增按钮 招商中心业务人员
        handle_add(){
            // 清空id
            this.add_formInline.id = ''
            // 以后可能需要数据，此刻先请求接口(初始化新增)
            let param = {
                data:{
                }
            }
            this.add_loading = true
            this.add_dialog = true
            this.$http.post(`${ commonUrl.baseUrl}/merchantCenter/addMerchantSalesman`, param).then(res=>{
                if(res.data.code == '0000'){
                    // 解禁
                    this.modi_user = false
                    // 清空 数据
                    this.resetData('add_formInline')
                    this.add_loading = false
                    // 处理数据  。。。。。
                }
            }).catch(err=>{})
        },
        // 修改操作
        handle_modi(row){
            // 存个id (保存修改时用到)
            this.add_formInline.id = row.id;
            // 参数
            let param = {
                data:{
                    id:row.id
                }
            }
            this.add_dialog = true
            this.add_loading = true
            this.$http.post(`${ commonUrl.baseUrl }/merchantCenter/updateMerchantSalesman`, param).then(res=>{
                if(res.data.code == '0000'){
                    let result = res.data.data.merchantSalesmanInfo
                    // 赋值  姓名  电话 邮箱
                    this.add_formInline.real_name = result.real_name
                    this.add_formInline.phone = result.phone
                    this.add_formInline.email = result.email
                    // 封禁电话
                    this.modi_user = true
                    this.add_loading = false
                }
            }).catch(err=>{

            })
            // this.add_dialog = true
            // // 赋值
            // this.set_formData(row);
            console.log(row)
        },
        // 分页
        handleCurrentChange(val){
            this.currentPage = val
            // 获取主页列表数据(loading状态)
            this.getTableDataList(val);
            //console.log(`当前页: ${val}`);
        },
        // 新增的dialog内选区域
        add_changeOption(e){

            this.add_formInline.region_name = []
            for(let item of this.add_formInline.region){
                this.add_formInline.region_name.push(provinces.province_list[item])
            }
            // console.log(this.add_formInline.region)
            // console.log(this.add_formInline.region_name)
            // console.log(this.add_formInline.regions)
        },
        // 保存 新增
        save_add(){
            // 验证
            if(this.valid_form('add_formInline')){
                // 参数
                let param = {
                    data: {
                        // 公有
                        signInUserId: this.$store.getters.userId,
                        signInRoleId: this.$store.getters.roleId,
                        // 私有
                        email:this.add_formInline.email,
                        phone:this.add_formInline.phone,
                        real_name:this.add_formInline.real_name,

                    }
                }
                this.add_loading = true
                this.$http.post(`${ commonUrl.baseUrl }/merchantCenter/saveMerchantSaleman`, param).then(res=>{
                    if(res.data.code == '0000'){
                        this.add_loading = false
                        // 关闭弹框
                        this.add_dialog = false
                        // 提示 新增成功
                        this.m_message(res.data.msg, 'success')
                        // 加载数据列表
                        this.getTableDataList(1)
                    }else{
                        this.add_loading = false
                        this.m_message(res.data.msg, 'warning')
                    }
                }).catch(err=>{

                })
            }
            // 接口
            // 关弹框


        },
        // 保存 修改
        save_modi(){
            // 验证
            if(this.valid_form('add_formInline')){
                // 参数
                let param = {
                    data: {
                        // 公有
                        signInUserId: this.$store.getters.userId,
                        signInRoleId: this.$store.getters.roleId,
                        // 私有
                        email:this.add_formInline.email,
                        phone:this.add_formInline.phone,
                        real_name:this.add_formInline.real_name,
                        id:this.add_formInline.id,
                    }
                }
                this.add_loading = true
                this.$http.post(`${ commonUrl.baseUrl }/merchantCenter/saveMerchantSaleman`, param).then(res=>{
                    if(res.data.code == '0000'){
                        this.add_loading = false
                        // 关闭弹框
                        this.add_dialog = false
                        // 提示 新增成功
                        this.m_message(res.data.msg, 'success')
                        // 加载数据列表
                        this.getTableDataList(1)
                    }else{
                        this.add_loading = false
                        this.m_message(res.data.msg, 'warning')
                    }
                }).catch(err=>{

                })
            }
        },
        // 校验规则
        valid_form(formName) {
            let  flag  = false ;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                flag = true;
                return true
                } else {
                flag = false;
                return false;
                }
            });
            return flag;
        },
        // dialog 表单赋值操作
        set_formData(row){
            this.add_formInline.name = row.name;
            this.add_formInline.phone = row.phone;
            this.add_formInline.email = row.email;
            this.add_formInline.region = ['210000'];
        },
        // dialog 表单清空操作
        clear_formData(){

        },
        // 重置查询条件
        resetData(formName){
            if(this.$refs[formName]){
                this.$refs[formName].resetFields();
            }

        },
        // 提示信息 message:提示信息   type 提示类型
        m_message(message,type){
            this.$message({
                message,
                type
            })
        },
        // 刷新 主列表
        handle_refresh(){
            this.getTableDataList(this.currentPage);

        },
    }
}
</script>
<style lang="scss">
    .wid_b75{
        width:75%;
        margin:auto;
    }
    .modiWidth_select .el-form-item__content .el-select{
        width:100%;
    }
</style>
