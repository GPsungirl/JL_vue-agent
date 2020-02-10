<template>
    <!-- manageAreaAgent.vue 区域机构管理-->
    <div class="pad_5">
        <!-- M1 查询区域 -->
        <div class="query_fields pad_b_no">
            <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
            <!-- 业务地区 -->
            <el-form-item label="业务地区" prop="province_code">
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
                <el-select v-model="queryForm.city_code"
                    placeholder="选择市"
                    class="wid_140"
                    >
                    <el-option v-for="(item, index) in queryForm.cities"
                        :key="index"
                        :label=" item.city "
                        :value=" item.adcode ">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 合同编号 -->
            <el-form-item label="合同编号" prop="contract_no">
                <el-input v-model="queryForm.contract_no" placeholder="请输入机构名称" class="wid_140"></el-input>
            </el-form-item>
            <!-- 机构状态 -->
            <el-form-item label="机构状态" prop="agent_status">
               <el-select v-model="queryForm.agent_status"
                    class="wid_140"
                    placeholder="选输入机构状态"
                    >
                    <el-option v-for="(item, index) in queryForm.agent_statuss"
                        :key="index"
                        :label=" item.value "
                        :value=" item.id ">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 机构名称 -->
            <el-form-item label="机构名称" prop="agent_name">
                <el-input v-model="queryForm.agent_name" placeholder="请输入机构名称" class="wid_140"></el-input>
            </el-form-item>
            <!-- 联系人 -->
            <el-form-item label="联系人" prop="charger" label-width="68px">
                <el-input v-model="queryForm.charger" placeholder="请输入机构名称" class="wid_140"></el-input>
            </el-form-item>
            <!-- 联系电话 -->
            <el-form-item label="联系电话" prop="phone">
                <el-input v-model="queryForm.phone" placeholder="请输入机构名称" class="wid_140"></el-input>
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
                <el-table-column prop="account_total" label="联系人" width="">
                </el-table-column>
                <el-table-column prop="phone" label="联系电话" width="">
                </el-table-column>
                <el-table-column prop="business_region" label="业务地区" width="">
                </el-table-column>
                <el-table-column prop="shell_division" label="贝壳分成" width="">
                </el-table-column>
                <el-table-column prop="travel_division" label="出行分成" width="">
                </el-table-column>
                <el-table-column prop="contractNo" label="合同编号" width="">
                </el-table-column>
                <el-table-column prop="state" label="状态" width="">
                </el-table-column>
                <el-table-column prop="" label="操作" width="">
                <template slot-scope="scope">
                    <el-button @click="handle_detail(scope.row)" type="text" size="small">详情</el-button>
                    <el-button @click="handle_frozen(scope.row)" type="text" size="small">冻结</el-button>
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
    </div>
</template>
<script>
import provinces from '../../utils/area.js'
import commonUrl from '../../utils/common'
export default {
    name: 'manageAreaAgent',
    data(){
        return {
            // 地图
            districtSearch:'',
            // 主列表
            tableLoading:false,
            tableData:[],
            // 分页
            pageTotal: 100,
            currentPage:1,
            // 查询参数
            queryForm: {
                // 初始化 省 regions  市 cities
                regions:'',
                cities: [],
                // 1可用 2冻结 3注销
                agent_statuss:[
                    {
                        id:1,
                        value:'可用',
                    },
                    {
                        id:2,
                        value:'冻结',
                    },
                    {
                        id:3,
                        value:'注销',
                    }
                ],
                // 机构名称  机构状态  联系人   合同编号 电话
                province_code:'',
                city_code: '',
                agent_name:'',
                agent_status:'',
                charger:'',
                contract_no:'',
                phone:'',
            },

        }
    },
    created(){
        // 初始化 地图plugin
        this.initMap();
        // 初始化 省份
        this.initProvinces();
        // 初始化 主列表数据
        this.getTableDataList(1)
    },
    methods:{
        // 初始化 主列表数据
        getTableDataList(pageNum){
            let param = {
                data: {
                    // 公有
                    signInUserId: this.$store.getters.userId,
                    signInRoleId: this.$store.getters.roleId,
                    pageNum: pageNum,
                    pageSize: 10,
                    // 私有参数
                    // 机构名称  机构状态  联系人   合同编号 电话
                    province_code:this.queryForm.province_code,
                    city_code: this.queryForm.city_code,
                    agent_name:this.queryForm.agent_name,
                    agent_status:this.queryForm.agent_status,
                    charger:this.queryForm.charger,
                    contract_no:this.queryForm.contract_no,
                    phone:this.queryForm.phone,
                }
            }
            this.tableLoading = true
            this.$http.post(`${ commonUrl.baseUrl }/agent/getManageAreaAgent`, param).then(res=>{
                if(res.data.code == '0000'){
                    console.log(res)
                    this.tableData = res.data.data.agentList
                    // 分页总数
                    this.pageTotal = res.data.data.page.pageTotal;
                    this.tableLoading = false
                }
            }).catch(err=>{

            })

        } ,
        // 查询按钮
        queryData(){
            this.getTableDataList(1);
            this.currentPage = 1
        },
        // 重置查询条件
        resetData(formName){
            this.city_code = ''
            this.$refs[formName].resetFields();
        },
        // 省份change事件
        changeOption_province(e){
            // 赋值cities (先清理 后赋值)
            this.queryForm.cities = [];
            this.queryCity(provinces.province_list[e]);
        },
        // 查 市区 txt: String 省份名
        queryCity(txt){
            let vm = this
            // 搜索所有省/直辖市信息
            this.districtSearch.search(txt, function (status, result) {
                // console.log(result);
                // 查询成功时，result即为对应的行政区信息
                for(let item of result.districtList[0].districtList){
                    vm.queryForm.cities.push({
                        adcode:item.adcode,
                        city  :item.name
                     })
                }
            })
        },
        // 分页
        handleCurrentChange(val){
            this.currentPage = val
            // 获取主页列表数据(loading状态)
            this.getTableDataList(val)
            //console.log(`当前页: ${val}`);
        },
        // 初始化 地图
        initMap(){
            let vm = this
            //利用高德地图API 获取 所有省
            AMap.plugin('AMap.DistrictSearch', function () {
                vm.districtSearch = new AMap.DistrictSearch({
                    // 关键字对应的行政区级别，country表示国家
                    level: 'country',
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

        },
    }
}
</script>
