<template>
    <!-- 视频审核 -->
    <div class="pad_5">
        <!-- M1 查询区域 -->
        <div class="query_fields pad_b_no">
            <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
                <!-- 所属机构 -->
                <el-form-item label="所属机构" prop="agentName">
                    <el-input v-model="queryForm.agentName" placeholder="请输入所属机构" class="wid_140"></el-input>
                </el-form-item>
                <!-- 现居住地 -->
                <!-- <el-form-item label="现居住地" >
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
                <!-- 向导姓名 -->
                <el-form-item label="向导姓名" prop="name">
                    <el-input v-model="queryForm.name" placeholder="请输入向导姓名" class="wid_140"></el-input>
                </el-form-item>
                <!-- 向导ID -->
                <el-form-item label="向导ID" prop="customid">
                    <el-input v-model="queryForm.customid" placeholder="请输入向导ID" class="wid_140"></el-input>
                </el-form-item>
                <!-- 上级姓名 -->
                <!-- <el-form-item label="上级姓名" prop="up_name">
                    <el-input v-model="queryForm.up_name" placeholder="请输入上级姓名" class="wid_140"></el-input>
                </el-form-item>                             -->
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
                <el-table-column prop="customid" label="向导ID" width="" >
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="80px">
                </el-table-column>
                <!-- <el-table-column prop="up_customid" label="上级ID" width="">
                </el-table-column>
                <el-table-column prop="" label="上级姓名" width="">
                    <template slot-scope="scope">
                        <el-button @click="handle_up_name(scope.row)" type="text" size="small">{{ scope.row.up_name }}</el-button>
                    </template>
                </el-table-column> -->
                <el-table-column prop="" label="性别" width="50px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sex == '01'">男</span>
                        <span v-else-if="scope.row.sex == '02'">女</span>
                    </template>
                </el-table-column>

                <el-table-column prop="birthday" label="出生日期" width="">
                </el-table-column>
                <el-table-column prop="agentName" label="所属机构" width="">
                </el-table-column>
                <el-table-column prop="address" label="居住地" width="">
                </el-table-column>

                <el-table-column prop="" label="操作" width="">
                    <template slot-scope="scope">
                        <el-button @click="handle_choice(scope.row)" type="text" size="small">设置工作间视频</el-button>
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
        <!-- M3 设置视频dialog-->
        <el-dialog
            title="审核视频"
            :visible.sync="detail_dialogVisible"
            width="50%"
            center
            append-to-body
            :before-close="handle_close"
            :close-on-click-modal="false"
            v-loading="detail_loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            class="agent_detail"
            >
            <!-- 业务信息 -->
            <p>共{{ video_num }}条视频记录</p>
            <el-table :data="detail_tableData" v-loading="detail_tableLoading" border stripe style="width: 100%">
                <!-- 视频名 -->
                <el-table-column prop="file_id" label="视频名" width="" >

                </el-table-column>
                <!-- 时长 -->
                <el-table-column prop="duration" label="视频时长(秒)" width="">
                </el-table-column>
                <!-- 状态 -->
                <el-table-column label="状态" width="">
                    <template slot-scope="scope">
                        <span v-if="scope.row.video_status == 1">可选择</span>
                        <span v-if="scope.row.video_status == 3">已选择</span>
                    </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column prop="" label="操作" width="">
                    <template slot-scope="scope">
                        <el-button @click="handle_view(scope.row)" type="text" size="small">查看</el-button>
                        <el-button @click="handle_select(scope.row)" type="text" size="small">选择</el-button>
                        <el-button @click="handle_delete(scope.row)" type="text" size="small">删除</el-button>

                    </template>
                </el-table-column>

            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handle_close" size="mini">关 闭</el-button>
            </span>
            <!-- 视频框(内层) -->
            <el-dialog
                title="视频查看"
                :visible.sync="video_dialogVisible"
                width="50%"
                center
                append-to-body
                :before-close="handleDialogClose"
                :close-on-click-modal="false"
                v-loading="video_loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                class="agent_detail"
                >

                <div id="dplayer" style="height:300px"></div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="close_video" size="mini">关 闭</el-button>
                </span>
            </el-dialog>
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
            <el-form :inline="true" :model="agent_detail_form"   class="demo-form-inline " label-width="68px" disabled>
                <!-- 业务信息 -->

                <el-form-item label="机构名称" prop="agent_name">
                    <el-input v-model="agent_detail_form.agent_name" placeholder="审批人" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="机构编号" prop="agentid">
                    <el-input v-model="agent_detail_form.agentid" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="负责人" prop="charger" label-width="68px">
                    <el-input v-model="agent_detail_form.charger" placeholder="负责人" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="业务地区"  class="marg_r0">
                    <el-col :span="11">
                        <el-form-item prop="province_code" class="marg_b0">
                            <el-select v-model="agent_detail_form.province_code"
                                placeholder="选择省"
                                class="wid_90"
                                @change="changeOption_province_addBusiness($event)">
                                <el-option v-for="(item, index) in agent_detail_form.regions"
                                    :key="index"
                                    :label=" item.province "
                                    :value=" item.adcode ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="city_code" class="marg_b0">
                            <el-select v-model="agent_detail_form.city_code"
                                placeholder="选择市"
                                class="wid_90"
                                @change="changeOption_city_addBusiness($event)">
                                <el-option v-for="(item, index) in agent_detail_form.cities"
                                    :key="index"
                                    :label=" item.city "
                                    :value=" item.adcode ">
                                </el-option>
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
                <el-form-item label="联系电话" prop="phone" >
                    <el-input v-model="agent_detail_form.phone" placeholder="联系电话" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="出行分成" prop="account_rate">
                    <el-input v-model="agent_detail_form.account_rate" placeholder="出行分成" class="wid_181"></el-input>%
                </el-form-item>
                <el-form-item label="联系邮箱" prop="email" >
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
                    <el-select v-model="agent_detail_form.bank_code"
                        placeholder="开户行"
                        class="wid_190"
                        @change="changeOption_bank($event)">
                        <el-option v-for="(item, index) in agent_detail_form.bankInfo"
                            :key="index"
                            :label=" item.bankname "
                            :value=" item.bankcode ">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号" prop="account_no" label-width="68px">
                    <el-input v-model="agent_detail_form.account_no" placeholder="账号" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="开户地"  label-width="68px" class="marg_r0">
                    <el-col :span="11">
                        <el-form-item prop="account_province_code" class="marg_b0">
                            <el-select v-model="agent_detail_form.account_province_code"
                                placeholder="选择省"
                                class="wid_90"
                                @change="changeOption_province_addBank($event)">
                                <el-option v-for="(item, index) in agent_detail_form.account_regions"
                                    :key="index"
                                    :label=" item.province"
                                    :value=" item.adcode ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="city_code" class="marg_b0">
                            <el-select v-model="agent_detail_form.account_city_code"
                                placeholder="选择市"
                                class="wid_90"
                                @change="changeOption_city_addBank($event)">
                                <el-option v-for="(item, index) in agent_detail_form.account_cities"
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
                <el-button @click="agent_detail_dialogVisible = false" size="mini">关 闭</el-button>
            </span>
        </el-dialog>
        <!-- M6 dialog上级姓名-->
        <el-dialog
            title="向导详情"
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
            <el-form :inline="true" :model="up_detail_form"   class="demo-form-inline " label-width="68px" disabled>

                <el-form-item label="向导ID" prop="customid">
                    <el-input v-model="up_detail_form.customid" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="向导姓名" prop="name">
                    <el-input v-model="up_detail_form.name" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 上级ID -->
                <el-form-item label="上级ID" prop="up_customid">
                    <el-input v-model="up_detail_form.up_customid" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 上级姓名 -->
                <el-form-item label="上级姓名" prop="up_name">
                    <el-input v-model="up_detail_form.up_name" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 民族 -->
                <el-form-item label="民族" prop="traveler_native">
                    <el-input v-model="up_detail_form.traveler_native" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 性别 -->
                <el-form-item label="性别" prop="sex">
                    <el-input v-model="up_detail_form.sex" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 居住地 -->
                <el-form-item label="居住地" prop="juzhudi">
                    <el-input v-model="up_detail_form.juzhudi" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 职业 -->
                <el-form-item label="职业" prop="profession">
                    <el-input v-model="up_detail_form.profession" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 详细地址 -->
                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="up_detail_form.address" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 身高 -->
                <el-form-item label="身高" prop="tall">
                    <el-input v-model="up_detail_form.tall" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 体重 -->
                <el-form-item label="体重" prop="weight">
                    <el-input v-model="up_detail_form.weight" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 手机号 -->
                <el-form-item label="联系电话" prop="phone" >
                    <el-input v-model="up_detail_form.phone" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 陌陌号 -->
                <el-form-item label="陌陌号" prop="momo" >
                    <el-input v-model="up_detail_form.momo" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 微信号 -->
                <el-form-item label="微信号" prop="webchat" >
                    <el-input v-model="up_detail_form.webchat" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 出生日期 -->
                <el-form-item label="出生日期" prop="birthday">
                    <el-input v-model="up_detail_form.birthday" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 分成 -->
                <!-- <el-form-item label="贝壳分成" prop="virtual_rate">
                    <el-input v-model="up_detail_form.virtual_rate" placeholder="贝壳分成" class="wid_181"></el-input>%
                </el-form-item>
                <el-form-item label="出行分成" prop="account_rate">
                    <el-input v-model="up_detail_form.account_rate" placeholder="出行分成" class="wid_181"></el-input>%
                </el-form-item> -->

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="up_detail_dialogVisible = false" size="mini">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import provinces from '../../utils/area.js'
import commonUrl from '../../utils/common'
import {isvalidPhone} from '../../utils/validate'
import 'dplayer/dist/DPlayer.min.css'
import flv from 'flv.js'
import DPlayer from 'dplayer';
import { setTimeout } from 'timers';
export default {
    name: 'videoChoice',
    data(){
        return {
           _signInUserId:'',
            choice_row:'',
            dp:'',
            // 视频条数
            video_num:'',

            // 地图
            districtSearch:'',
            // 主列表
            tableLoading:false,
            tableData:[],
            // 视频审核的列表
            detail_tableData:[],
            detail_tableLoading:false,
            // 查看视频的弹框
            video_dialogVisible:false,
            video_loading:false,
            // 详情
            detail_dialogVisible:false,
            detail_loading:false,
            up_detail_dialogVisible:false,
            up_detail_loading:false,
            agent_detail_dialogVisible:false,
            agent_detail_loading:false,
            // 分页
            pageTotal: 0,
            currentPage:1,
            // 查询参数
            queryForm: {
                // 初始化 省 regions  市 cities
                regions:'',
                cities: [],
                // 所属机构
                agentName:'',
                // 省市
                province_code: '',
                city_code:'',
                // 姓名
                name:'',
                // 向导id
                customid:'',
                // 向导状态
                traveler_statuss:[
                    {
                        id:0,
                        txt:'待审核'
                    },
                    {
                        id:1,
                        txt:'可用 '
                    },
                    {
                        id:2,
                        txt:'审批拒绝'
                    },
                    {
                        id:3,
                        txt:'不可用'
                    }
                ],
                traveler_status:'',
                // 上级姓名 上级id
                up_customid:'',
                up_name:'',

                province_param:'',//作为收集参数
                city_param: '',   //作为收集参数


            },
            // 详情
            detail_form:{
                // 向导ID
                customid:'',
                // 向导姓名
                name:'',
                // 上级ID
                up_customid:'',
                // 上级姓名
                up_name:'',
                // 民族
                traveler_native:'',
                // 性别
                sex:'',
                // 居住地
                juzhudi:'',
                // 职业
                profession:'',
                // 详细地址
                address:'',
                // 身高
                tall:'',
                // 体重
                weight:'',
                // 手机号
                phone:'',
                // 微信号
                webchat:'',
                // 陌陌号
                momo:'',
                // 出生日期
                birthday:'',
                // 贝壳分成
                virtual_rate:'',
                // 出行分成
                account_rate:'',

            },
            videoForm:{
                video_url:'',
            },
            // 上级 详情
            up_detail_form:{
                // 向导ID
                customid:'',
                // 向导姓名
                name:'',
                // 上级ID
                up_customid:'',
                // 上级姓名
                up_name:'',
                // 民族
                traveler_native:'',
                // 性别
                sex:'',
                // 居住地
                juzhudi:'',
                // 职业
                profession:'',
                // 详细地址
                address:'',
                // 身高
                tall:'',
                // 体重
                weight:'',
                // 手机号
                phone:'',
                // 微信号
                webchat:'',
                // 陌陌号
                momo:'',
                // 出生日期
                birthday:'',
                // 贝壳分成
                virtual_rate:'',
                // 出行分成
                account_rate:'',
            },
            bankInfo:'',
            // 所属机构的详情
            agent_detail_form:{
                regions:[],
                cities:[],
                bankInfo:'',
                // 机构编号
                agentid:'',
                // 机构名称
                agent_name:'',
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
                // 开户名
                account_user:'',
                // 账号
                account_no:'',
                // 开户地
                account_regions:'',
                account_cities:[],
                account_province_code:'',
                account_city_code:'',
            }
        }
    },
    created(){
        // 初始化roleId
        this.roleId = this.$store.getters.roleId
        // 判断是否为roleid是否为11并处理
    this._signInUserId = this.transformSignInUserId();
        // 初始化 主列表
        this.getTableDataList(1)
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
        // 获取视频主列表
        getTableDataList(pageNum){
            let param = {
               data:{
                    // 公有
                    signInUserId: this._signInUserId,
                    signInRoleId: this.$store.getters.roleId,
                    pageNum: pageNum,
                    pageSize: 10,
                    // 私有
                    // 所属机构 姓名
                    agentName:this.queryForm.agentName,
                    name:this.queryForm.name,
                    // 向导id
                    customid:this.queryForm.customid

               }
            }
            this.tableLoading = true
            this.$http.post(`${ commonUrl.baseUrl }/liveVideoRecord/getTravelerVideoChoice`, param).then(res=>{
                if(res.data.code == '0000'){

                    this.tableData = res.data.data.liveVideoRecordList
                    // 分页总数
                    this.pageTotal = res.data.data.page.pageTotal;
                    this.tableLoading = false
                }
            }).catch(err=>{

            })
        },
        // 设置视频 查看
        handle_view(row){
            let param = {
                data:{
                    file_id:row.file_id
                }
            }
            this.detail_loading = true
            this.$http.post(`${commonUrl.baseUrl}/liveVideoRecord/getVideoPlay`, param).then(res=>{
                if(res.data.code == '0000'){
                    this.detail_loading = false

                    // 打开内层弹框 播放视频
                    this.video_dialogVisible = true
                    //this.video_loading = true
                    // 为了解决首次初始化空白的问题，而采用异步的调用方式
                    setTimeout(()=>{
                        this.dp = new DPlayer({
                            container: document.getElementById('dplayer'),
                            video: {
                                url: res.data.data.video_url,
                                type: 'customFlv',
                                autoplay:'auto',
                                customType: {
                                    'customFlv': function (video, player) {
                                        const flvPlayer = flv.createPlayer({
                                            type: 'flv',
                                            url: video.src
                                        });
                                        flvPlayer.attachMediaElement(video);
                                        flvPlayer.load();
                                    }
                                }
                            }
                        });
                    },1)


                }
            }).catch(err=>{})
        },
        // 设置视频 选择
        handle_select(row){

            let param = {
                data:{
                    video_status:3,
                    live_video_recordid:row.live_video_recordid,
                    customid:row.customid,
                }
            }
            this.detail_tableLoading = true
            this.$http.post(`${commonUrl.baseUrl}/liveVideoRecord/updateVideoChoiceStatus`, param).then(res=>{
                if(res.data.code == '0000'){
                    console.log(res)
                    //debugger
                    this.detail_tableLoading = false
                    this.m_message(res.data.msg, 'success')
                    // 刷新
                    this.refresh_examineTableData()
                }else{
                    this.detail_tableLoading = false
                    this.m_message(res.data.msg, 'warning')
                }
            }).catch(err=>{})
        },
        // 设置视频 删除
        handle_delete(row){
            let param = {
                data:{
                    video_status:2, // 删除
                    live_video_recordid:row.live_video_recordid,
                    fileId:row.file_id,
                }
            }
            this.detail_tableLoading = true
            this.$http.post(`${commonUrl.baseUrl}/liveVideoRecord/updateVideoStatus`, param).then(res=>{
                if(res.data.code == '0000'){
                    this.detail_tableLoading = false
                    this.m_message('删除成功', 'success')
                    // 刷新
                    this.refresh_examineTableData()
                }else{
                    this.detail_tableLoading = false
                    this.m_message(res.data.msg, 'warning')
                    // 刷新
                    this.refresh_examineTableData()
                }
            }).catch(err=>{})
        },
        // 操作 设置视频
        handle_choice(row){
            // 存一下row
            this.choice_row = row
            this.detail_dialogVisible = true
            this.detail_loading = true
            let param = {
                data:{
                    // 公有
                    signInUserId: this._signInUserId,
                    signInRoleId: this.$store.getters.roleId,
                    // 私有
                    customid:row.customid,

                }
            }
            this.$http.post(`${ commonUrl.baseUrl }/liveVideoRecord/getVideoChoice`, param).then(res=>{
                if(res.data.code == '0000'){

                    let result = res.data.data.liveVideoRecordList
                    this.detail_tableData = result

                    this.video_num = result.length
                    this.detail_loading = false
                }
            }).catch(err=>{})
        },
        // 关闭 播放的视频
        close_video(){
            // 先暂停
            if(this.dp){
                this.dp.destroy()
            }
            // 关闭
            this.video_dialogVisible = false
            // 刷新
            this.refresh_examineTableData()
        },
        // 监听 关闭按钮
        handleDialogClose(){
            // this.dp.destroy()
            if(this.dp){
                this.dp.destroy()
            }
            this.video_dialogVisible = false
            // 刷新
            this.refresh_examineTableData()
        },
        // 关闭 工作间视频列表dialog(按钮)
        handle_close(){

            this.detail_dialogVisible = false
            // 刷新主列表
            this.handle_refresh()
        },

        // 查询按钮
        queryData(){
            // console.log(this.queryForm)
            // 根据参数进行查询
            this.getTableDataList(1)
        },
        // 刷新 设置视频的dialog列表
        refresh_examineTableData(){
            let row = this.choice_row

            let param = {
                data:{
                    // 公有
                    signInUserId: this._signInUserId,
                    signInRoleId: this.$store.getters.roleId,
                    // 私有
                    customid:row.customid,
                    // name:row.name,
                    // agentName:row.agentName,
                }
            }
            this.detail_loading = true
            this.$http.post(`${ commonUrl.baseUrl }/liveVideoRecord/getVideoChoice`, param).then(res=>{
                if(res.data.code == '0000'){
                    //console.log(res)
                    //debugger
                    let result = res.data.data.liveVideoRecordList
                    this.detail_tableData = result
                    this.video_num = result.length // 数据条数
                    this.detail_loading = false
                }
            }).catch(err=>{})
        },
        // 视频视频 删除
        handle_fobidden(row){
            let param = {
                data:{
                    video_status:2, // 删除
                    live_video_recordid:row.live_video_recordid,
                    fileId:row.file_id,
                }
            }
            this.detail_tableLoading = true
            this.$http.post(`${commonUrl.baseUrl}/liveVideoRecord/updateVideoStatus`, param).then(res=>{
                if(res.data.code == '0000'){
                    this.detail_tableLoading = false
                    this.m_message('删除成功', 'success')
                    // 刷新
                    this.refresh_examineTableData()
                }else{
                    this.detail_tableLoading = false
                    this.m_message(res.data.msg, 'warning')
                }
            }).catch(err=>{})
        },
        // 重置按钮
        resetData(formName){
            if(this.$refs[formName]){
                this.$refs[formName].resetFields();
            }
        },
        // 刷新按钮
        handle_refresh(){
            this.getTableDataList(1);
            this.currentPage = 1
        },
        // 上级姓名操作
        handle_up_name(row){
            console.log(row.agentid)
            let param = {
                data:{
                    up_customid:row.up_customid
                }
            }
            this.up_detail_dialogVisible = true
            this.up_detail_loading = true
            this.$http.post(`${commonUrl.baseUrl}/travelerInfo/findByUpCustomId`, param).then(res=>{
                if(res.data.code == '0000'){
                    console.log(res)
                    let result = res.data.data.travelerInfo

                    // 向导姓名
                    this.up_detail_form.name = result.name
                    // 向导ID
                    this.up_detail_form.customid = result.customid
                    // 所属机构
                    this.up_detail_form.agent_name = result.agent_name
                    // 上级ID
                    this.up_detail_form.up_customid = result.up_customid
                    // 上级姓名
                    this.up_detail_form.up_name = result.up_name
                    // 民族 性别  居住地  职业 详细地址 身高 体重 手机号 微信号 陌陌号  出生日期
                    this.up_detail_form.traveler_native = result.traveler_native
                    this.up_detail_form.sex = result.sex == '01' ?'男' :'女'
                    this.up_detail_form.juzhudi = result.province +  result.city
                    // 判断职业
                    // '职业类别 0其他 1学生 2都市白领 3导游 4自由职业
                    let  _profession = '';
                    switch(result.profession_type){
                        case 0:
                            _profession = '其他';
                            break;
                        case 1:
                            _profession = '学生';
                            break;
                        case 2:
                            _profession = '都市白领';
                            break;
                        case 3:
                            _profession = '导游';
                            break;
                        case 4:
                            _profession = '自由职业';
                            break;
                    }
                    this.up_detail_form.profession = _profession
                    this.up_detail_form.address = result.address
                    this.up_detail_form.tall = result.tall + 'cm'
                    this.up_detail_form.weight = result.weight + 'kg'
                    this.up_detail_form.phone  = result.phone
                    this.up_detail_form.webchat = result.webchat
                    this.up_detail_form.momo = result.momo
                    this.up_detail_form.birthday = result.birthday
                    // 贝壳分成
                    this.up_detail_form.virtual_rate = result.virtual_rate
                    // 出行分成
                    this.up_detail_form.account_rate = result.account_rate
                    this.up_detail_loading = false
                }
            }).catch(err=>{})
        },
        // 所属机构操作
        handle_agent_name(row){
            let param = {
                data:{
                    agentid:row.agentid
                }
            }
            this.agent_detail_dialogVisible = true
            this.agent_detail_loading = true
            this.$http.post(`${ commonUrl.baseUrl }/agent/selectAgentInfo`, {data:{agentid:row.agentid}}).then(res=>{
                if(res.data.code == '0000'){
                    console.log('机构信息：')
                    console.log(res)
                    let result = res.data.data.agentInfo
                    // 机构id
                    this.agent_detail_form.agentid = result.agentid
                    // 机构名称
                    this.agent_detail_form.agent_name = result.agent_name
                    // 负责人
                    this.agent_detail_form.charger = result.charger
                    // 业务地区
                    this.agent_detail_form.province_code = result.province_code
                    // 根据省查询所有市
                    this.queryCity(result.province, 'agent_detail_form')

                    this.agent_detail_form.city_code = result.city_code
                    // 联系地址
                    this.agent_detail_form.address = result.address
                    // 贝壳分成
                    this.agent_detail_form.virtual_rate = result.virtual_rate
                    // 出行分成
                    this.agent_detail_form.account_rate = result.account_rate
                    // 电话
                    this.agent_detail_form.phone = result.phone
                    // 邮箱
                    this.agent_detail_form.email = result.email
                    // 合同编号
                    this.agent_detail_form.contract_no = result.contract_no
                    // 开户行
                    this.agent_detail_form.bank_code = result.bank_code
                    // 开户名
                    this.agent_detail_form.account_user = result.account_user
                    // 账号
                    this.agent_detail_form.account_no = result.account_no
                    // 开户地
                    // 查询开户行所在省份下的所有市列表
                    this.queryBankCity(result.account_province, 'agent_detail_form')
                    this.agent_detail_form.account_province_code = result.account_pro_code
                    this.agent_detail_form.account_city_code = result.account_city_code

                    this.agent_detail_loading = false
                }
            }).catch(err=>{})
        },
        // 冻结操作
        handle_frozen(row){
            console.log(row)
            this.$confirm('是否冻结该向导?', '冻结', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    size:'mini',
                    center: true
                })
                .then(() => {
                    let  _flag = '';
                    if(row.traveler_status == 1){
                        _flag = 3
                    }else{
                        _flag = 1
                    }
                    let param = {
                        data:{
                            traveler_status:_flag,
                            travelerid:row.travelerid
                        }
                    }
                    this.$http.post(`${ commonUrl.baseUrl }/travelerInfo/updateTravelerStatus`, param).then(res=>{
                        if(res.data.code == '0000'){
                            this.m_message(res.data.msg, 'success');

                            // 刷新
                            this.handle_refresh()
                        }else{
                             this.m_message(res.data.msg, 'warning');
                        }
                    }).catch(err=>{})
                })
        },



        // 机构状态change事件
        changeOption_traveler_status(e){
            console.log(e);
        },


        // 提示信息 message:提示信息   type 提示类型
        m_message(message,type){
            this.$message({
                message,
                type
            })
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

        // 分页
        handleCurrentChange(val){
             this.currentPage = val
            // 获取单前页数据列表
            this.getTableDataList(val);
        },

    }
}
</script>
