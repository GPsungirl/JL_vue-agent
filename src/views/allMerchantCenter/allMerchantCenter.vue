<template>
    <!-- 招商中心详情 参考机构管理下的机构详情-->
    <div class="pad_5">
        <!-- M1 查询区域 -->
        <div class="query_fields pad_b_no">
            <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
            <!-- 业务地区 -->
            <!-- <el-form-item label="业务地区" prop="">
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


            </el-form-item> -->
             <!-- 联系人 -->
            <el-form-item label="联系人" prop="charger" label-width="68px">
                <el-input v-model="queryForm.charger" placeholder="请输入机构名称" class="wid_140"></el-input>
            </el-form-item>
            <!-- 合同编号 -->
            <el-form-item label="合同编号" prop="contract_no">
                <el-input v-model="queryForm.contract_no" placeholder="请输入机构名称" class="wid_140"></el-input>
            </el-form-item>
            <!-- 审核状态 -->
            <el-form-item label="审核状态" prop="merchant_check">
               <el-select v-model="queryForm.merchant_check"
                    class="wid_140"
                    placeholder="选择审核状态"
                    @change="changeOption_institutionalStatus($event)">
                    <el-option v-for="(item, index) in queryForm.merchant_checks"
                        :key="index"
                        :label=" item.txt "
                        :value=" item.id ">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 招商名称 -->
            <el-form-item label="招商名称" prop="merchant_name">
                <el-input v-model="queryForm.merchant_name" placeholder="请输入机构名称" class="wid_140"></el-input>
            </el-form-item>
            <!-- 联系电话 -->
            <el-form-item label="联系电话" prop="phone">
                <el-input v-model="queryForm.phone" placeholder="请输入机构名称" class="wid_140" ></el-input>
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
            <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
                <el-table-column prop="merchant_name" label="招商名称" width="" >
                </el-table-column>
                <el-table-column prop="charger" label="联系人" width="">
                </el-table-column>
                <el-table-column prop="phone" label="联系电话" width="">
                </el-table-column>
                <!-- 业务地区：省+市 -->
                <!-- <el-table-column prop="" label="业务地区" width="210">
                    <template slot-scope="scope">
                        {{ scope.row.province + scope.row.city }}
                    </template>
                </el-table-column>-->
                <el-table-column prop="" label="贝壳分成" width="">
                    <template slot-scope="scope">
                        {{ scope.row.virtual_rate + '%'}}
                    </template>
                </el-table-column>
                <el-table-column prop="" label="出行分成" width="">
                    <template slot-scope="scope">
                        {{ scope.row.account_rate + '%'}}
                    </template>
                </el-table-column>
                <el-table-column prop="contract_no" label="合同编号" width="120">
                </el-table-column>
                <!-- 审核状态 -->
                <el-table-column prop="" label="状态" width="120">
                    <template slot-scope="scope">
                        <span v-if="scope.row.merchant_check == 1">待审核</span>
                        <span v-else-if="scope.row.merchant_check == 2">审核通过</span>
                        <span v-else-if="scope.row.merchant_check == 3">修改待审核</span>
                        <span v-else-if="scope.row.merchant_check == 4">审核拒绝</span>
                        <span v-else-if="scope.row.merchant_check == 5">修改审核拒绝</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" width="">
                <template slot-scope="scope">

                    <el-button  @click="handle_detail(scope.row)" type="text" size="small">详情</el-button>
                    <!-- 只有运营  有权限 修改 -->
                    <el-button v-if="roleId == 7"  @click="handle_detail_check(scope.row)" type="text" size="small">修改</el-button>

                </template>
                </el-table-column>
            </el-table>
            <!--module3 分页 -->
            <div class="block mar_t10">
                <el-pagination

                    @current-change="handleCurrentChange"
                    :current-page="currentPage"

                    background
                    layout="total, prev, pager, next, jumper"
                    :total="pageTotal"
                    >
                </el-pagination>
            </div>
        </div>
        <!-- M3 dialog 详情(招商中心) -->
        <el-dialog
            title="招商中心详情"
            :visible.sync="detail_dialogVisible"
            width="50%"
            center
            :close-on-click-modal="false"
            v-loading="detail_loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"

            >
            <!-- 业务信息 -->
            <el-form :inline="true" :model="detail_form"   class="demo-form-inline " label-width="68px" disabled>
                <!-- 业务信息 -->
                <!-- <p class="form_title">业务信息</p> -->
                <el-form-item label="招商名称" prop="merchant_name">
                    <el-input v-model="detail_form.merchant_name" placeholder="审批人" class="wid_180"></el-input>
                </el-form-item>
                <!-- <el-form-item label="招商编号" prop="agentid">
                    <el-input v-model="detail_form.agentid" placeholder="" class="wid_180"></el-input>
                </el-form-item> -->
                <el-form-item label="负责人" prop="charger" label-width="68px">
                    <el-input v-model="detail_form.charger" placeholder="负责人" class="wid_180"></el-input>
                </el-form-item>
                <!-- <el-form-item label="业务地区"  class="marg_r0">
                    <el-col :span="11">
                        <el-form-item prop="province_code" class="marg_b0">
                            <el-select v-model="detail_form.province_code"
                                placeholder="选择省"
                                class="wid_90"
                                @change="changeOption_province_addBusiness($event)">
                                <el-option v-for="(item, index) in detail_form.regions"
                                    :key="index"
                                    :label=" item.province "
                                    :value=" item.adcode ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="city_code" class="marg_b0">
                            <el-select v-model="detail_form.city_code"
                                placeholder="选择市"
                                class="wid_90"
                                @change="changeOption_city_addBusiness($event)">
                                <el-option v-for="(item, index) in detail_form.cities"
                                    :key="index"
                                    :label=" item.city "
                                    :value=" item.adcode ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item> -->
                <el-form-item label="联系地址" prop="address">
                    <el-input v-model="detail_form.address" placeholder="联系地址" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="贝壳分成" prop="virtual_rate">
                    <el-input v-model="detail_form.virtual_rate" placeholder="贝壳分成" class="wid_181"></el-input>%
                </el-form-item>
                <el-form-item label="联系电话" prop="phone" >
                    <el-input v-model="detail_form.phone" placeholder="联系电话" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="出行分成" prop="account_rate">
                    <el-input v-model="detail_form.account_rate" placeholder="出行分成" class="wid_181"></el-input>%
                </el-form-item>
                <el-form-item label="联系邮箱" prop="email" >
                    <el-input v-model="detail_form.email" placeholder="联系邮箱" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="合同编号" prop="contract_no">
                    <el-input v-model="detail_form.contract_no" placeholder="合同编号" class="wid_180"></el-input>
                </el-form-item>
                <div></div>
                 <el-form-item label="开户名" prop="account_user" label-width="68px">
                    <el-input v-model="detail_form.account_user" placeholder="开户名" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="开户行" prop="bank_code" label-width="68px">
                    <el-select v-model="detail_form.bank_code"
                        placeholder="开户行"
                        class="wid_190"
                        @change="changeOption_bank($event)">
                        <el-option v-for="(item, index) in detail_form.bankInfo"
                            :key="index"
                            :label=" item.bankname "
                            :value=" item.bankcode ">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号" prop="account_no" label-width="68px">
                    <el-input v-model="detail_form.account_no" placeholder="账号" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="开户地"  label-width="68px" class="marg_r0">
                    <el-col :span="11">
                        <el-form-item prop="account_province_code" class="marg_b0">
                            <el-select v-model="detail_form.account_province_code"
                                placeholder="选择省"
                                class="wid_90"
                                @change="changeOption_province_addBank($event)">
                                <el-option v-for="(item, index) in detail_form.account_regions"
                                    :key="index"
                                    :label=" item.province"
                                    :value=" item.adcode ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="city_code" class="marg_b0">
                            <el-select v-model="detail_form.account_city_code"
                                placeholder="选择市"
                                class="wid_90"
                                @change="changeOption_city_addBank($event)">
                                <el-option v-for="(item, index) in detail_form.account_cities"
                                    :key="index"
                                    :label=" item.city "
                                    :value=" item.adcode ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="detail_dialogVisible = false" size="mini">关 闭</el-button>
            </span>
        </el-dialog>
        <!-- M4 dialog  修改详情 -->
         <el-dialog
            title="机构修改"
            :visible.sync="detail_check_dialogVisible"
            width="50%"
            center
            :close-on-click-modal="false"
            v-loading="detail_check_loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            class="agent_detail"
            >
            <!-- 业务信息 -->
            <el-form
                :inline="true"
                :model="detail_check_form"
                :rules="detail_check_rules"
                ref="detail_check_form"
                label-position="right"
                label-width="80px"
                class="demo-form-inline valid_form"
                >
                <!-- 业务信息 -->
                <!-- <p class="form_title">业务信息</p> -->
                <el-form-item label="招商名称" prop="merchant_name" >
                    <el-input v-model="detail_check_form.merchant_name" placeholder="招商名称" class="wid_180" ></el-input>
                </el-form-item>
                <!-- <el-form-item label="机构编号" prop="agentid">
                    <el-input v-model="detail_check_form.agentid" placeholder="" class="wid_180" disabled></el-input>
                </el-form-item> -->
                <el-form-item label="负责人" prop="charger" >
                    <el-input v-model="detail_check_form.charger" placeholder="负责人" class="wid_180"></el-input>
                </el-form-item>
                <!-- <el-form-item label="业务地区"  class="marg_r0" >
                    <el-col :span="11">
                        <el-form-item prop="province_code" class="marg_b0">
                            <el-select v-model="detail_check_form.province_code"
                                placeholder="选择省"
                                class="wid_90"
                                disabled
                                @change="changeOption_province_addBusiness($event)">
                                <el-option v-for="(item, index) in detail_check_form.regions"
                                    :key="index"
                                    :label=" item.province "
                                    :value=" item.adcode ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="city_code" class="marg_b0">
                            <el-select v-model="detail_check_form.city_code"
                                placeholder="选择市"
                                class="wid_90"
                                disabled
                                @change="changeOption_city_addBusiness($event)">
                                <el-option v-for="(item, index) in detail_check_form.cities"
                                    :key="index"
                                    :label=" item.city "
                                    :value=" item.adcode ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item> -->
                <el-form-item label="联系地址" prop="address">
                    <el-input v-model="detail_check_form.address" placeholder="联系地址" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="贝壳分成" prop="virtual_rate">
                    <el-input v-model.number="detail_check_form.virtual_rate" placeholder="贝壳分成" class="wid_181"></el-input>%
                </el-form-item>
                <el-form-item label="联系电话" prop="phone" >
                    <el-input v-model="detail_check_form.phone" placeholder="联系电话" class="wid_180" disabled></el-input>
                </el-form-item>
                <el-form-item label="出行分成" prop="account_rate">
                    <el-input v-model.number="detail_check_form.account_rate" placeholder="出行分成" class="wid_181"></el-input>%
                </el-form-item>
                <el-form-item label="联系邮箱" prop="email">
                    <el-input v-model="detail_check_form.email" placeholder="联系邮箱" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="合同编号" prop="contract_no">
                    <el-input v-model="detail_check_form.contract_no" placeholder="合同编号" class="wid_180"></el-input>
                </el-form-item>
                <div></div>
                 <el-form-item label="开户名" prop="account_user" >
                    <el-input v-model="detail_check_form.account_user" placeholder="开户名" class="wid_180" disabled></el-input>
                </el-form-item>
                <el-form-item label="开户行" prop="bank_code" >
                    <el-select v-model="detail_check_form.bank_code"
                        placeholder="开户行"
                        class="wid_190"
                        @change="changeOption_bank($event)">
                        <el-option v-for="(item, index) in detail_check_form.bankInfo"
                            :key="index"
                            :label=" item.bankname "
                            :value=" item.bankcode ">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号" prop="account_no" >
                    <el-input v-model="detail_check_form.account_no" placeholder="账号" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="开户地"   class="marg_r0">
                    <el-col :span="11">
                        <el-form-item prop="account_province_code" class="marg_b0">
                            <el-select v-model="detail_check_form.account_province_code"
                                placeholder="选择省"
                                class="wid_90"
                                @change="changeOption_province_addBank($event)">
                                <el-option v-for="(item, index) in detail_check_form.account_regions"
                                    :key="index"
                                    :label=" item.province"
                                    :value=" item.adcode ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="account_city_code" class="marg_b0">
                            <el-select v-model="detail_check_form.account_city_code"
                                placeholder="选择市"
                                class="wid_90"
                                @change="changeOption_city_addBank($event)">
                                <el-option v-for="(item, index) in detail_check_form.account_cities"
                                    :key="index"
                                    :label=" item.city "
                                    :value=" item.adcode ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="detail_check_dialogVisible = false" size="mini">关 闭</el-button>
                <el-button type="primary" @click="modi_detail" size="mini">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import provinces from '../../utils/area.js'
import commonUrl from '../../utils/common'
import {isvalidPhone} from '../../utils/validate'
export default {
    name: 'agentDetails',
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
        }
        return {
            // 角色ID
            roleId:'',
            // 地图
            districtSearch:'',
            bankInfo:'',
            // 主列表
            tableLoading:false,
            detail_dialogVisible:false,
            detail_loading:false,
            detail_check_dialogVisible:false,
            detail_check_loading:false,
            tableData:[],
            // 分页
            pageTotal: 100,
            currentPage:1,
            // 查询参数
            queryForm: {

                // 审核状态
                merchant_checks:[

                    {
                        id:1,
                        txt:'待审核',
                    },
                    {
                        id:2,
                        txt:'审核通过',
                    },
                    {
                        id:3,
                        txt:'修改待审核',
                    },
                    {
                        id:4,
                        txt:'审核拒绝',
                    },
                    {
                        id:5,
                        txt:'修改审核拒绝'
                    }
                ],
                merchant_check:'',
                // 机构名称
                merchant_name:'',
                // 联系人
                charger:'',
                // 合同编号
                contract_no:'',
                // 电话
                phone:'',

            },
           // 详情
            detail_form:{
                regions:[],
                cities:[],
                // 机构编号
                agentid:'',
                // 招商名称
                merchant_name:'',
                // 负责人
                charger:'',
                // 业务地区
                province_code:'',
                city_code:'',
                // 联系地址
                address:'',
                // 贝壳分成
                virtual_rate:'',
                // 出行分成
                account_rate:'',
                // 电话
                phone:'',
                // 邮箱
                email:'',
                // 合同编号
                contract_no:'',
                // 开户行
                bank_code:'',
                // 银行信息（预存）
                bankInfo:'',
                // 开户名
                account_user:'',
                // 账号
                account_no:'',
                // 开户地
                account_regions:'',
                account_cities:[],
                account_province_code:'',
                account_city_code:'',
            },
            // 详情修改数据
            detail_check_form:{
                regions:[],
                cities:[],
                // 机构编号
               // agentid:'',
                // 机构名称
                merchant_name:'',
                // 负责人
                charger:'',
                // 业务地区
                province_code:'',
                city_code:'',

                province_param:'',
                city_param:'',

                // 联系地址
                address:'',
                // 贝壳分成
                virtual_rate:'',
                // 出行分成
                account_rate:'',
                // 电话
                phone:'',
                // 邮箱
                email:'',
                // 合同编号
                contract_no:'',

                // 开户行数据信息
                bankInfo:'',

                // 开户行
                bank_code:'',
                account_bank:'',
                // 开户名
                account_user:'',
                // 账号
                account_no:'',
                // 开户地
                account_regions:'',
                account_cities:[],

                account_province_param:'',
                account_city_param:'',

                account_province_code:'',
                account_city_code:'',
                // 用户id
                merchant_center_code:'',
                merchantid:'',
            },
            // 详情修改规则
            detail_check_rules:{
                // 招商名称
                merchant_name:[
                    { required: true, message: '请输入招商名称', trigger: 'blur' }
                ],
                // 负责人
                charger:[
                    { required: true, message: '请输入负责人', trigger: 'blur' }
                ],
                // // 业务地区
                // province_code:[
                //     { required: true, message: '请选择业务地区', trigger: 'change' }
                // ],
                city_code:[
                    { required: true, message: '请选择业务地区', trigger: 'change' }
                ],
                // 联系地址
                address:[
                    { required: true, message: '请输入地址', trigger: 'blur' }
                ],
                // 贝壳分成
                virtual_rate:[
                    { required: true, message: '请输入贝壳分成', trigger: 'blur' },
                    { type: 'number', message: '贝壳分成必须为数字'}
                ],
                // 出行分成
                account_rate:[
                    { required: true, message: '请输入出行分成', trigger: 'blur' },
                    { type: 'number', message: '出行分成必须为数字'}
                ],
                // 邮箱
                email:[
                    { required: true, message: '请输入邮箱', trigger: 'blur' }
                ],
                // 合同编号
                 contract_no:[
                    { required: true, message: '请输入合同编号', trigger: 'blur' }
                ],
                // 电话
                phone:[
                    { required: true, trigger: 'blur', validator: validPhone }
                ],
                // // 开户名
                // account_user:[
                //     { required: true, message: '请输入开户名', trigger: 'blur' }
                // ],
                // 开户行
                bank_code:[
                    { required: true, message: '请输入开户行', trigger: 'change' }
                ],
                // 账号
                account_no:[
                    { required: true, message: '请选择账号', trigger: 'blur' }
                ],
                // 开户地
                account_province_code:[
                    { required: true, message: '请选择开户地', trigger: 'change' }
                ],
                account_city_code:[
                     { required: true, message: '请选择开户地', trigger: 'change' }
                ]
            },
        }
    },
    created(){
        // 初始化roleId
        this.roleId = this.$store.getters.roleId
        // 初始化 地图plugin
        this.initMap();
        // 初始化 省份
        this.initProvinces();
        // 获取主列表数据
        this.getTableDataList(1);
        // 初始化 银行信息
        this.getBankList();

    },
    methods:{
        // 初始化 银行信息
        getBankList(){
            this.$http.post(`${ commonUrl.baseUrl}/agent/addAgent`,{data:{
                signInUserId: this.$store.getters.userId,
                signInRoleId: this.$store.getters.roleId,
            }}).then(res=>{
                if(res.data.code == '0000'){

                    this.bankInfo = this.detail_check_form.bankInfo = this.detail_form.bankInfo = res.data.data.bankList
                }
            }).catch(err=>{

            })
        },
        // 获取主列表
        getTableDataList(pageNum){
            let param = {
               data:{
                    // 公有
                    signInUserId: this.$store.getters.userId,
                    signInRoleId: this.$store.getters.roleId,
                    pageNum: pageNum,
                    pageSize: 10,
                    // 私有
                    // 机构编号 省编号 市编号 合同编号
                    merchant_check:this.queryForm.merchant_check,
                    merchant_name:this.queryForm.merchant_name,
                    charger:this.queryForm.charger,
                    contract_no:this.queryForm.contract_no,
                    phone:this.queryForm.phone,
               }
            }
            this.tableLoading = true
            this.$http.post(`${ commonUrl.baseUrl }/merchantCenter/selectAllMerchantCenter`, param).then(res=>{
                if(res.data.code == '0000'){
                    console.log(res)
                    this.tableData = res.data.data.centerList
                    // 分页总数
                    this.pageTotal = res.data.data.page.pageTotal;
                    this.tableLoading = false
                }
            }).catch(err=>{

            })
        },
        // 详情操作
        handle_detail(row){
            this.detail_dialogVisible = true
            this.detail_loading = true
            this.$http.post(`${ commonUrl.baseUrl }/merchantCenter/selectCenterInfo`, {data:{merchantid:row.merchantid}}).then(res=>{
                if(res.data.code == '0000'){

                    let result = res.data.data.centerInfo
                    // 机构id
                    // this.detail_form.agentid = result.agentid
                    // 招商名称
                    this.detail_form.merchant_name = result.merchant_name
                    // 负责人
                    this.detail_form.charger = result.charger
                    // 业务地区
                    //this.detail_form.province_code = result.province_code
                    // 根据省查询所有市
                    //this.queryCity(result.province, 'detail_form')

                    //this.detail_form.city_code = result.city_code
                    // 联系地址
                    this.detail_form.address = result.address
                    // 贝壳分成
                    this.detail_form.virtual_rate = result.virtual_rate
                    // 出行分成
                    this.detail_form.account_rate = result.account_rate
                    // 电话
                    this.detail_form.phone = result.phone
                    // 邮箱
                    this.detail_form.email = result.email
                    // 合同编号
                    this.detail_form.contract_no = result.contract_no
                    // 开户行
                    this.detail_form.bank_code = result.bank_code
                    // 开户名
                    this.detail_form.account_user = result.account_user
                    // 账号
                    this.detail_form.account_no = result.account_no
                    // 开户地
                    // 查询开户行所在省份下的所有市列表
                    this.queryBankCity(result.account_province, 'detail_form')
                    this.detail_form.account_province_code = result.account_pro_code
                    this.detail_form.account_city_code = result.account_city_code

                    this.detail_loading = false
                }
            }).catch(err=>{})
        },
        // 修改操作
        handle_detail_check(row){
            // agentid  userid  作为修改 的证明（而不是新增）

            this.detail_check_form.merchant_center_code = row.merchant_center_code
            this.detail_check_form.merchantid = row.merchantid


            this.detail_check_dialogVisible = true
            this.detail_check_loading = true
            this.$http.post(`${ commonUrl.baseUrl }/merchantCenter/selectCenterInfo`, {data:{merchantid:row.merchantid}}).then(res=>{
                if(res.data.code == '0000'){

                    let result = res.data.data.centerInfo
                    console.log(res)
                    // 机构id
                    // this.detail_check_form.agentid = result.agentid
                    // 招商名称
                    this.detail_check_form.merchant_name = result.merchant_name
                    // 负责人
                    this.detail_check_form.charger = result.charger
                    // 业务地区
                    // this.detail_check_form.province_code = result.province_code
                    // 根据省查询所有市
                    // this.queryCity(result.province, 'detail_check_form')

                    // this.detail_check_form.city_code = result.city_code
                    // 联系地址
                    this.detail_check_form.address = result.address
                    // 贝壳分成
                    this.detail_check_form.virtual_rate = result.virtual_rate
                    // 出行分成
                    this.detail_check_form.account_rate = result.account_rate
                    // 电话
                    this.detail_check_form.phone = result.phone
                    // 邮箱
                    this.detail_check_form.email = result.email
                    // 合同编号
                    this.detail_check_form.contract_no = result.contract_no
                    // 开户行
                    this.detail_check_form.bank_code = result.bank_code
                    // 开户名
                    this.detail_check_form.account_user = result.account_user
                    // 账号
                    this.detail_check_form.account_no = result.account_no
                    // 开户地
                    // 查询开户行所在省份下的所有市列表
                    this.queryBankCity(result.account_province, 'detail_check_form')
                    this.detail_check_form.account_province_code = result.account_pro_code
                    this.detail_check_form.account_city_code = result.account_city_code

                    this.detail_check_loading = false
                }
            }).catch(err=>{})
        },
        // 提交修改
        modi_detail(){

            if(this.m_valid_addForm('detail_check_form')){
                let param = {
                    data:{
                        // 公参
                        signInUserId: this.$store.getters.userId,
                        signInRoleId: this.$store.getters.roleId,
                        agentid:this.detail_check_form.agentid,
                        userid:this.detail_check_form.userid,
                        // 私参
                        merchant_center_code:this.detail_check_form.merchant_center_code,
                        merchantid:this.detail_check_form.merchantid,
                        // 开户行
                        account_bank:this.detail_check_form.account_bank,
                        // 开户地：省市
                        account_pro_code:this.detail_check_form.account_province_param.adcode,
                        account_province:this.detail_check_form.account_province_param.provincename,
                        account_city:this.detail_check_form.account_city_param.cityname,
                        account_city_code:this.detail_check_form.account_city_param.adcode,
                        // 账号
                        account_no:this.detail_check_form.account_no,
                        account_rate:this.detail_check_form.account_rate,
                        account_user:this.detail_check_form.account_user,
                        address:this.detail_check_form.address,
                        merchant_name:this.detail_check_form.merchant_name,
                        bank_code:this.detail_check_form.bank_code,
                        charger:this.detail_check_form.charger,
                        contract_no:this.detail_check_form.contract_no,
                        email:this.detail_check_form.email,
                        phone:this.detail_check_form.phone,

                        // 业务地区

                        // province:this.detail_check_form.province_param.txt,
                        // province_code:this.detail_check_form.province_param.adcode,
                        // city:this.detail_check_form.city_param.cityname,
                        // city_code:this.detail_check_form.city_param.adcode,

                        virtual_rate:this.detail_check_form.virtual_rate,

                    }
                }
                this.detail_check_loading = true
                this.$http.post(`${commonUrl.baseUrl}/merchantCenter/saveMerchantCenter`, param).then(res=>{

                    if(res.data.code == '0000'){
                        this.detail_check_loading = false
                        this.detail_check_dialogVisible = false

                        this.m_message('机构修改成功','success')
                        this.handle_refresh();
                    }else if(res.data.code == '0002'){//已注册（手机号重复）

                        this.detail_check_loading = false
                        this.m_message(res.data.msg,'success')
                    }else{
                        this.detail_check_loading = false
                        this.m_message(res.data.msg,'success')
                    }


                }).catch(err=>{
                    console.log(err)
                })
            }
        },
        // 查询按钮
        queryData(){
            // console.log(this.queryForm)
            // 根据参数进行查询
            this.getTableDataList(1)
            this.currentPage = 1
        },
        // 重置按钮
        resetData(formName){
            if(this.$refs[formName]){
                this.$refs[formName].resetFields();
            }
        },
        // 刷新按钮
        handle_refresh(){
            this.getTableDataList(this.currentPage);

        },
        // 省份change事件
        changeOption_province(e){
            // 参数收集
            this.queryForm.province_param = { adcode:e, txt: provinces.province_list[e] }
            // console.log(e)
            // console.log(provinces.province_list[e])
            // 赋值cities (先清理 后赋值)
            this.queryForm.cities = [];
            this.queryForm.city = '';
            this.queryCity(provinces.province_list[e], 'queryForm');
        },
        // 市区change事件
        changeOption_city(e){
        },
        // 机构状态change事件
        changeOption_institutionalStatus(e){
            console.log(e);
        },
        changeOption_province_addBusiness(e){
            // 参数收集
            this.detail_check_form.province_param = { adcode:e, txt: provinces.province_list[e] }
            // 赋值cities (先清理 后赋值)
            this.detail_check_form.cities = [];
            this.detail_check_form.city_code = '';
            this.queryCity(provinces.province_list[e],'detail_check_form');
        },
        changeOption_city_addBusiness(e){

            for(let item of this.detail_check_form.cities){
               if(item.adcode == e){
                   this.detail_check_form.city_param = { cityname:item.city, adcode:e  }
               }
            }


        },
        // 开户地 省
        changeOption_province_addBank(e){
            this.detail_check_form.account_province_param = { provincename:provinces.province_list[e], adcode:e }
            // 赋值cities (先清理 后赋值)
            this.detail_check_form.account_cities = [];
            this.detail_check_form.account_city_code = '';
            this.queryBankCity(provinces.province_list[e],'detail_check_form');
        },
        // 开户地 市
        changeOption_city_addBank(e){
            for(let item of this.detail_check_form.account_cities){
               if(item.adcode == e){

                   this.detail_check_form.account_city_param = { cityname:item.city, adcode:e  }
               }
            }
        },
        // 选择开户行
        changeOption_bank(e){

            for(let item of this.detail_check_form.bankInfo){
                if(item.bankcode == e ){
                    this.detail_check_form.account_bank = item.bankname
                }
            }

        },
        // 新增 校验规则
        m_valid_addForm(formName) {
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
        // 查 市区 txt: String 省份名,dataOrigin 是指 add_form  或是queryeForm 这种 父级数据源
        queryCity(txt,dataOrigin){

            let vm = this
            // 搜索所有省/直辖市信息

            this.districtSearch.search(txt, function (status, result) {
                // console.log(result)
                // 查询成功时，result即为对应的行政区信息
                for(let item of result.districtList[0].districtList){
                    vm[dataOrigin].cities.push({
                        adcode:item.adcode,
                        city  :item.name
                     })
                }

            })

        },
        // 针对 account_cities这个特殊（后期合并方法***）
        queryBankCity(txt,dataOrigin){

            let vm = this
            // 搜索所有省/直辖市信息

            this.districtSearch.search(txt, function (status, result) {

                // 查询成功时，result即为对应的行政区信息
                for(let item of result.districtList[0].districtList){
                    vm[dataOrigin].account_cities.push({
                        adcode:item.adcode,
                        city  :item.name
                     })
                }

            })

        },
        // 分页
        handleCurrentChange(val){
             this.currentPage = val
            // 获取单前页数据列表
            this.getTableDataList(val);
        },
        // 初始化 地图
        initMap(){
            let vm = this
            //利用高德地图API 获取 所有省
            AMap.plugin('AMap.DistrictSearch', function () {
                vm.districtSearch = new AMap.DistrictSearch({
                    // 关键字对应的行政区级别，country表示国家
                    level: 'city',
                    //  显示下级行政区级数，1表示返回下一级行政区
                    subdistrict: 1
                })
            })


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
            // 详情
            this.detail_form.regions = this.detail_form.account_regions = arr
            // 详情并修改
            this.detail_check_form.regions = this.detail_check_form.account_regions = arr
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
