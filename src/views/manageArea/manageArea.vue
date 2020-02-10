<template>
    <!-- 业务人员管理  manageArea.vue页面 -->
    <div class="pad_5">
        <!-- M1 查询区域 -->
        <div class="query_fields">
            <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
                <el-form-item label="姓名" prop="real_name">
                    <el-input v-model="queryForm.real_name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="业务区域" prop="management_area">
                    <el-select v-model="queryForm.management_area"
                        placeholder="请选择业务区域"
                        >
                        <el-option v-for="(item, index) in queryForm.regions"
                            :key="index"
                            :label=" item.province "
                            :value=" item.adcode ">
                        </el-option>

                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size='mini' @click="queryData">查询</el-button>
                    <el-button type="success" size='mini' @click="resetData('queryForm')">重置</el-button>
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
                <el-table-column prop="management_area" label="业务区域" width="">
                </el-table-column>
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
                <el-table-column prop="" label="操作" width="">
                <template slot-scope="scope">
                    <el-button @click="handle_modi(scope.row)" type="text" size="small">修改</el-button>
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
            title="新增业务人员"
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
                        <el-input v-model="add_formInline.phone" :disabled="modi_phone" placeholder="请输入电话"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="add_formInline.email" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="区域" prop="region" class="modiWidth_select">
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
                    </el-form-item>
                </el-form>
            </div>
             <!-- footer  -->
            <span slot="footer" class="dialog-footer">
            <el-button @click="add_dialog = false" size='mini'>取 消</el-button>
            <el-button type="primary" @click="save_add" size='mini'>确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>
<script>
import commonUrl from '../../utils/common'
import provinces from '../../utils/area.js'
export default {
    name: 'manageArea',
    data(){
        // 手机号验证
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

            queryForm: {
                // 预存省份(固)
                regions:'',
                // 姓名
                real_name:'',
                // 区域(省)
                management_area:'',

            },
            // 查询 参数
            query_param: {
                // 姓名
                real_name:'',
                // 区域(省)
                management_area:'',
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
                region: [],
                region_name:[],
                // regions 存给定数据
                regions:'',
                //
                phone: '',
                email: '',
            },
            rules: {
                real_name: [

                    { required: true, message:'请输入姓名', trigger: 'blur' }
                ],
                phone: [
                    { required: true, validator: validMobile, trigger: 'blur' }
                ],
                email: [
                    { required: true, message:'请输入邮箱', trigger: 'blur' }
                ],
                region: [
                    { required: true, message:'请选择业务区域', trigger: 'change' }
                ]
            },
            // 修改弹框的数据
            modi_formInline: {

            },
            // 修改页面需要用到id
            modi_id:''

        }
    },
    created(){
        // 初始化 省份数据
        this.initProvinces();
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
                    // 私有
                    // 区域
                    management_area:provinces.province_list[this.queryForm.management_area],
                    // 姓名
                    real_name:this.queryForm.real_name,
                }
            }
            // 请求
            this.tableLoading = true
            this.$http.post(`${ commonUrl.baseUrl }/manageArea/selectManageArea`, param).then(res=>{

                if(res.data.code == '0000'){
                    this.tableData =  res.data.data.sysUsersList
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
        // 新增按钮 业务人员
        handle_add(){
            this.add_dialog = true
            // 解禁手机号 修改
            this.modi_phone = false
            // 且id为''
            this.modi_id = ''
            // 清空 数据
            this.resetData('add_formInline')
            // this.clear_formData();
        },
        // 修改操作
        handle_modi(row){
            // 冻结手机号修改
            this.modi_phone = true
            // 给 modi_id 赋值
            this.modi_id = row.id
            // 参数
            let param = {
                data:{
                    id:row.id
                }
            }
            this.add_dialog = true
            this.add_loading = true
            this.$http.post(`${ commonUrl.baseUrl }/manageArea/updateManageArea`, param).then(res=>{
                if(res.data.code == '0000'){
                    console.log(res)
                    let result = res.data.data.sysUser
                    // 赋值
                    // 姓名  电话 邮箱 区域
                    this.add_formInline.real_name = result.real_name
                    this.add_formInline.phone = result.phone
                    this.add_formInline.email = result.email
                    console.log(result.region)
                    // 解析省份 存adcode
                    this.add_formInline.region_name =  result.management_area.split(',')
                    this.add_formInline.region = []
                    for(let item of result.management_area.split(',')){
                        this.add_formInline.region.push(provinces.adcode_list[item])
                    }
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
                        province:this.add_formInline.region_name.join(','),
                        province_code:this.add_formInline.region.join(','),
                        real_name:this.add_formInline.real_name,
                        // 修改时需要id,新增时不需要id
                        id:this.modi_id
                    }
                }
                this.add_loading = true
                this.$http.post(`${ commonUrl.baseUrl }/manageArea/saveManageArea`, param).then(res=>{
                    if(res.data.code == '0000'){
                        console.log(res)
                        // 成功之后清空一下 modi_id
                        this.modi_id = ''

                        this.add_loading = false
                        // 关闭弹框
                        this.add_dialog = false
                        // 提示 新增成功
                        this.m_message(res.data.msg, 'success')
                        // 加载数据列表
                        this.getTableDataList(1)
                    }
                }).catch(err=>{

                })
            }
            // 接口
            // 关弹框


        },
        // 保存 修改
        save_modi(){

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
<style lang="scss">
    .wid_b75{
        width:75%;
        margin:auto;
    }
    .modiWidth_select .el-form-item__content .el-select{
        width:100%;
    }
</style>
