<template>
    <!-- 角落向导审核 -->
    <div class="pad_5">
        <!-- M1 查询区域 -->
        <div class="query_fields pad_b_no">
            <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
                <!-- 所属机构 -->
                <!-- <el-form-item label="所属机构" prop="agent_name">
                    <el-input v-model="queryForm.agent_name" placeholder="请输入所属机构" class="wid_140"></el-input>
                </el-form-item> -->
                <!-- 现居住地 -->
                <!-- <el-form-item label="现居住地" >

                    <el-col :span="8">
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

                    <el-col :span="8">
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

                    <el-col :span="8">
                        <el-form-item prop="area_code">
                            <el-select v-model="queryForm.area_code"
                                placeholder="选择区"
                                class="wid_140"

                                >
                                <el-option v-for="(item, index) in queryForm.areas"
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
                 <!-- 职业类型 -->
                <el-form-item label="职业类型" label-width="68px" prop="profession_type">
                    <el-select v-model="queryForm.profession_type"
                        class="wid_140"
                        placeholder="选选择职业类型"
                        >
                        <el-option v-for="(item, index) in queryForm.profession_types"
                            :key="index"
                            :label=" item.txt "
                            :value=" item.id ">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 向导ID -->
                <el-form-item label="向导ID" prop="customid" label-width="68px">
                    <el-input v-model="queryForm.customid" placeholder="请输入角落ID" class="wid_140"></el-input>
                </el-form-item>
                <!-- 上级姓名 -->
                <!-- <el-form-item label="上级姓名" prop="up_name">
                    <el-input v-model="queryForm.up_name" placeholder="请输入上级姓名" class="wid_140"></el-input>
                </el-form-item> -->
                <!-- 上级ID -->
                <!-- <el-form-item label="上级ID" prop="up_customid" label-width="68px">
                    <el-input v-model="queryForm.up_customid" placeholder="请输入上级ID" class="wid_140"></el-input>
                </el-form-item> -->

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
                <el-table-column prop="name" label="姓名" width="70px">
                </el-table-column>
                <el-table-column prop="up_customid" label="上级ID" width="">
                </el-table-column>
                <el-table-column prop="" label="上级姓名" width="80px">
                    <template slot-scope="scope">
                        <el-button @click="handle_up_name(scope.row)" type="text" size="small">{{ scope.row.up_name }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="性别" width="50px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.sex == '01'">男</span>
                        <span v-else-if="scope.row.sex == '02'">女</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="" label="常居住地" width=""
                    show-overflow-tooltip
                    >
                    <template slot-scope="scope">
                        {{ scope.row.province + scope.row.city +scope.row.area }}
                    </template>
                </el-table-column>
                <el-table-column prop="" label="职业类型" width="80px">
                    <!-- 0其他 1学生 2都市白领 3向导 4自由职业 -->
                    <template slot-scope="scope">
                        <span v-if="scope.row.profession_type == 0">其他</span>
                        <span v-else-if="scope.row.profession_type == 1">学生</span>
                        <span v-else-if="scope.row.profession_type == 2">都市白领</span>
                        <span v-else-if="scope.row.profession_type == 3">导游</span>
                        <span v-else-if="scope.row.profession_type == 4">自由职业</span>
                    </template>
                </el-table-column>
                <el-table-column prop="birthday" label="出生日期" width="">
                </el-table-column>
                <!-- 身高 体重  -->
                <el-table-column prop="tall" label="身高(cm)" width="80px">
                    <!-- <template slot-scope="scope">
                        {{ scope.row.tall + 'CM' }}
                    </template> -->
                </el-table-column>
                <el-table-column prop="weight" label="体重(kg)" width="80px">
                    <!-- <template slot-scope="scope">
                        {{ scope.row.weight + 'Kg' }}
                    </template> -->
                </el-table-column>
                <!-- <el-table-column prop="" label="贝壳分成" width="80px">
                    <template slot-scope="scope">
                        {{ scope.row.virtual_rate +'%'}}
                    </template>
                </el-table-column>
                <el-table-column prop="" label="出行分成" width="80px">
                    <template slot-scope="scope">
                        {{ scope.row.account_rate +'%'}}
                    </template>
                </el-table-column>

                <el-table-column prop="" label="所属机构" width="">
                    <template slot-scope="scope">
                        <el-button @click="handle_agent_name(scope.row)" type="text" size="small">{{ scope.row.agent_name }}</el-button>
                    </template>
                </el-table-column> -->

                <el-table-column prop="" label="状态" width="70px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.traveler_status == 0">待审核</span>
                        <span v-else-if="scope.row.traveler_status == 1">可用</span>
                        <span v-else-if="scope.row.traveler_status == 2">审批拒绝</span>
                        <span v-else-if="scope.row.traveler_status == 3">不可用</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" width="">
                <template slot-scope="scope">
                    <el-button @click="handle_detail(scope.row)" type="text" size="small">详情</el-button>
                    <el-button @click="handle_check(scope.row)" type="text" size="small">审核</el-button>
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
        <!-- M3 dialog详情-->
        <el-dialog
            title="上级详情"
            :visible.sync="detail_dialogVisible"
            width="50%"
            center
            :close-on-click-modal="false"
            v-loading="detail_loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            class="agent_detail"
            >
            <!-- 业务信息 -->
            <el-form :inline="true" :model="detail_form"   class="demo-form-inline " label-width="68px" disabled>

                <el-form-item label="向导ID" prop="customid">
                    <el-input v-model="detail_form.customid" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="向导姓名" prop="name">
                    <el-input v-model="detail_form.name" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 上级ID -->
                <el-form-item label="上级ID" prop="up_customid">
                    <el-input v-model="detail_form.up_customid" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 上级姓名 -->
                <el-form-item label="上级姓名" prop="up_name">
                    <el-input v-model="detail_form.up_name" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 民族 -->
                <el-form-item label="民族" prop="traveler_native">
                    <el-input v-model="detail_form.traveler_native" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 性别 -->
                <el-form-item label="性别" prop="sex">
                    <el-input v-model="detail_form.sex" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 居住地 -->
                <el-form-item label="居住地" prop="juzhudi">
                    <el-input v-model="detail_form.juzhudi" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 职业 -->
                <el-form-item label="职业" prop="profession">
                    <el-input v-model="detail_form.profession" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 详细地址 -->
                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="detail_form.address" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 身高 -->
                <el-form-item label="身高" prop="tall">
                    <el-input v-model="detail_form.tall" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 体重 -->
                <el-form-item label="体重" prop="weight">
                    <el-input v-model="detail_form.weight" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 手机号 -->
                <el-form-item label="联系电话" prop="phone" >
                    <el-input v-model="detail_form.phone" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 陌陌号 -->
                <el-form-item label="陌陌号" prop="momo" >
                    <el-input v-model="detail_form.momo" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 微信号 -->
                <el-form-item label="微信号" prop="webchat" >
                    <el-input v-model="detail_form.webchat" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 出生日期 -->
                <el-form-item label="出生日期" prop="birthday">
                    <el-input v-model="detail_form.birthday" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 身份证号 -->
                <el-form-item label="身份证号" prop="identity_no">
                    <el-input v-model="detail_form.identity_no" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 证件号 profession_no-->
                <el-form-item label="职业证号" prop="profession_no">
                    <el-input v-model="detail_form.profession_no" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <!-- 分成 -->
                <!-- <el-form-item label="贝壳分成" prop="virtual_rate">
                    <el-input v-model="detail_form.virtual_rate" placeholder="贝壳分成" class="wid_181"></el-input>%
                </el-form-item>
                <el-form-item label="出行分成" prop="account_rate">
                    <el-input v-model="detail_form.account_rate" placeholder="出行分成" class="wid_181"></el-input>%
                </el-form-item> -->


            </el-form>
            <!-- 证件照 -->
            <div class="demo-image card_photo">
                <el-row>
                    <el-col :span="8" >
                        <span class="demonstration">身份证正面</span>
                        <el-image
                            style="width: 200px; height: 100px"
                            :src="detail_form.idcard_back_url"
                            :preview-src-list="idcard_back_url_srcList"
                            fit="contain">
                        </el-image>
                    </el-col>
                    <el-col :span="8">
                        <span class="demonstration">身份证反面</span>
                        <el-image
                            style="width: 200px; height: 100px"
                            :src="detail_form.idcard_front_url"
                            :preview-src-list="idcard_front_url_srcList"
                            fit="contain">
                        </el-image>
                    </el-col>
                    <!-- 学生证 或者导游证 -->
                    <el-col :span="8" v-if="is_student_guider">
                        <span class="demonstration">{{ detail_form.profession_name }}</span>
                        <el-image
                            style="width: 200px; height: 100px"
                            :src="detail_form.profession_photo_url"
                            :preview-src-list="profession_photo_url_srcList"
                            fit="contain">
                        </el-image>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="detail_dialogVisible = false" size="mini">关 闭</el-button>
            </span>
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
            title="上级详情"
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
        <!-- M7 dialog 审核 -->
        <el-dialog
            title="向导审核"
            :visible.sync="modi_rate_dialogVisible"
            width="30%"

            center
            :close-on-click-modal="false"
            v-loading="modi_rate_loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            class="modi_rate agent_detail"
            >
            <!-- 业务信息 -->
            <el-form  :model="modi_rate_form" :rules="modi_rate_rules" ref="modi_rate_form"  class="demo-ruleForm valid_form"  >
                <el-form-item label="向导类别"  prop="traveler_type">
                    <el-select v-model="modi_rate_form.traveler_type"
                        class="wid_181"
                        placeholder="选择向导类别"
                        >
                        <el-option v-for="(item, index) in modi_rate_form.traveler_types"
                            :key="index"
                            :label=" item "
                            :value=" index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <h3 class="rate_title">工作分成</h3>
                <el-form-item label="贝壳分成" prop="virtual_rate">
                    <el-input v-model.number="modi_rate_form.virtual_rate" placeholder="贝壳分成" class="wid_181"></el-input>%
                </el-form-item>

                <el-form-item label="出行分成" prop="account_rate">
                    <el-input v-model.number="modi_rate_form.account_rate" placeholder="出行分成" class="wid_181"></el-input>%
                </el-form-item>
                <h3 class="rate_title">推荐分成</h3>
                <el-form-item label="贝壳分成" prop="profit_virtual_rate">
                    <el-input v-model.number="modi_rate_form.profit_virtual_rate" placeholder="贝壳分成" class="wid_181"></el-input>%
                </el-form-item>

                <el-form-item label="出行分成" prop="profit_account_rate">
                    <el-input v-model.number="modi_rate_form.profit_account_rate" placeholder="出行分成" class="wid_181"></el-input>%
                </el-form-item>

            </el-form>
            <!-- 审核拒绝原因 -->
            <el-form :model="modi_rate_form2" :rules="modi_rate_rules2" ref="modi_rate_form2"  class="demo-ruleForm valid_form" >
              <!-- 审核拒绝原因 -->
                <h3 class="rate_title">审核拒绝原因</h3>
                <el-form-item label="拒绝原因"  prop="refusedList">
                    <el-select v-model="modi_rate_form2.refusedList"
                        class="wid_181"
                        placeholder="选择审核拒绝原因"
                        >
                        <el-option v-for="(item, index) in modi_rate_form2.refusedLists"
                            :key="index"
                            :label=" item "
                            :value=" item">
                        </el-option>
                    </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modi_rate_dialogVisible = false" size="mini">关 闭</el-button>
                <el-button type="primary"  @click="save_check_ok" size="mini" >审核通过</el-button>
                <el-button type="primary"  @click="save_check_no" size="mini" >审核拒绝</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import provinces from '../../utils/area.js'
import commonUrl from '../../utils/common'
import {isvalidPhone, validNum100, validNum15, validDyNum} from '../../utils/validate'

export default {
    name: 'travelerCheck',
    data(){
        // 校验分成
        let validRate=(val,value,callback)=>{
            if (!value){
                callback(new Error('请输入值'))
            }else  if (!validNum100(value)){
                callback(new Error('请输入0-100之间的数'))
            }else {
                callback()
            }
        }
        // 提成分成15
        let validRate15=(val,value,callback)=>{
            if (!value && value != 0){
                callback(new Error('请输入值'))
            }else  if (!validNum15(value)){
                callback(new Error('请输入0-15之间的数'))
            }else {
                callback()
            }
        }
        // 贝壳 出行分成 审核中
        let validRateDy_vir=(val,value,callback)=>{
          let dyval = this.limit_virtual_rate
          if (!value && value != 0){
              callback(new Error('请输入值'))
            }else  if (!validDyNum(value,dyval)){
              callback(new Error('请输入0-'+dyval+'之间的数'))
            }else {
              callback()
          }
        }
        let validRateDy_acc=(val,value,callback)=>{
          let dyval = this.limit_account_rate
          if (!value && value != 0){
              callback(new Error('请输入值'))
            }else  if (!validDyNum(value,dyval)){
              callback(new Error('请输入0-'+dyval+'之间的数'))
            }else {
              callback()
          }
        }
        return {
           _signInUserId: "",
            // 上限分成
            limit_virtual_rate:'',
            limit_account_rate:'',

            // 预览图 身份证 职业照
            idcard_back_url_srcList:[],
            idcard_front_url_srcList:[],
            profession_photo_url_srcList:[],
            // 判断是否是学生或者导游 是则显示否则取消
            is_student_guider:false,
            // 地图
            districtSearch:'',
            // 主列表
            tableLoading:false,
            tableData:[],
            // 详情
            detail_dialogVisible:false,
            detail_loading:false,
            up_detail_dialogVisible:false,
            up_detail_loading:false,
            agent_detail_dialogVisible:false,
            agent_detail_loading:false,

            modi_rate_dialogVisible:false,
            modi_rate_loading:false,
            // 分页
            pageTotal: 0,
            currentPage:1,
            // 查询参数
            queryForm: {
                // 初始化 省 regions  市 cities
                regions:'',
                cities: [],
                areas:[],

                // 姓名
                name:'',
                customid:'',
                // 0其他 1学生 2都市白领 3向导 4自由职业
                profession_types:[

                    {
                        id:1,
                        txt:'学生'
                    },
                    {
                        id:2,
                        txt:'都市白领'
                    },
                    {
                        id:3,
                        txt:'向导'
                    },
                    {
                        id:4,
                        txt:'自由职业'
                    },
                    {
                        id:0,
                        txt:'其他'
                    },
                ],
                profession_type:'',
                // 省市
                province_code: '',
                city_code:'',
                area_code:'',

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

                // 身份证 照片
                idcard_back_url:'',
                idcard_front_url:'',
                identity_no:'',
                // 职业证照片
                profession_photo_url:'',
                profession_type:'',// 3导游证, 2学生证
                profession_name:'',// 职业证名称
                // 职业证号
                profession_no:'',
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
            },
            // 调整分成
            modi_rate_form:{
              virtual_rate:'',
              account_rate:'',
              profit_virtual_rate:'',
              profit_account_rate:'',

              customid:'', // 角落ID
              travelerid:'', // 同行人员主键id

              // 0申请人员 1兼职向导人员 2全职向导人员
              traveler_types:[
                  '-请选择-',
                  '兼职向导',
                  '全职向导'
              ],
              traveler_type:0,
              agentid:'',

            },
            modi_rate_rules:{
                // 贝壳分成
                virtual_rate:[
                    { required: true, validator:validRateDy_vir, trigger: 'blur' },
                    { type: 'number', message: '贝壳分成必须为数字'}
                ],
                // 出行分成
                account_rate:[
                    { required: true, validator:validRateDy_acc, trigger: 'blur' },
                    { type: 'number', message: '出行分成必须为数字'}
                ],
                // 推荐贝壳分成
                profit_virtual_rate:[
                    { required: true, validator:validRate15, trigger: 'blur' },
                    { type: 'number', message: '贝壳分成必须为数字'}
                ],
                // 推荐出行分成
                profit_account_rate:[
                    { required: true, validator:validRate15, trigger: 'blur' },
                    { type: 'number', message: '出行分成必须为数字'}
                ],

            },
            // 审核拒绝原因
            modi_rate_form2:{
              // 审核拒绝原因
              refusedLists:[],
              refusedList:'',
            },
            modi_rate_rules2:{
              refusedList:[{ required: true, message: '请选择审核拒绝原因', trigger:'change'}],
            }
        }
    },
    created(){
        // 初始化roleId
        this.roleId = this.$store.getters.roleId
        // 判断是否为roleid是否为11并处理
    this._signInUserId = this.transformSignInUserId();
        // 初始化 地图plugin
        this.initMap();
        // 初始化 银行信息
        this.getBankList();
        // 初始化 省份
        this.initProvinces();
        // 初始化 主列表
        this.getTableDataList(1)
    },
    methods:{
      // 处理signInUserId的值（当roleid为11时）
    transformSignInUserId() {
      // 先判断roleid == 11 ,若11，则up_userid 作为 signinuserid的值
      if (this.$store.getters.roleId == 11) {
        return this.$store.getters.up_userId;
      } else {
        return this.$store.getters.userId;
      }
    },
        // 初始化 银行信息
        getBankList(){
            this.$http.post(`${ commonUrl.baseUrl}/agent/addAgent`,{data:{
                signInUserId: this._signInUserId,
                signInRoleId: this.$store.getters.roleId,
            }}).then(res=>{
                if(res.data.code == '0000'){

                    this.bankInfo = this.agent_detail_form.bankInfo = res.data.data.bankList
                    // 组合省份
                    // let arr = [];
                    // if(res.data.data.manageProvinceCodeList.length > 0){
                    //     for(let item of res.data.data.manageProvinceCodeList){
                    //         arr.push({
                    //             adcode: item.province_code,
                    //             province: provinces.province_list[item.province_code]
                    //         })
                    //     }
                    // }
                    // this.add_form.regions = arr;

                }
            }).catch(err=>{

            })
        },
        // 获取主列表
        getTableDataList(pageNum){
            let param = {
               data:{
                    // 公有
                    signInUserId: this._signInUserId,
                    signInRoleId: this.$store.getters.roleId,
                    pageNum: pageNum,
                    pageSize: 10,
                    // 私有
                    // 角落id 姓名  职业类型
                    customid:this.queryForm.customid,
                    name:this.queryForm.name,
                    profession_type:this.queryForm.profession_type,

                    province_code:this.queryForm.province_code,
                    city_code:this.queryForm.city_code,
                    area_code:this.queryForm.area_code,
               }
            }
            this.tableLoading = true
            this.$http.post(`${ commonUrl.baseUrl }/travelerInfo/travelerInfoCheckList`, param).then(res=>{
                if(res.data.code == '0000'){
                    // console.log(res)
                    // debugger
                    this.tableData = res.data.data.agentList
                    // 分页总数
                    this.pageTotal = res.data.data.page.pageTotal;
                    this.tableLoading = false
                }
            }).catch(err=>{

            })
        },
        // 查询按钮
        queryData(){
            console.log(this.queryForm)

            // 根据参数进行查询
            this.getTableDataList(1)
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

            let param = {
                data:{
                    up_customid:row.up_customid
                }
            }
            this.up_detail_dialogVisible = true
            this.up_detail_loading = true
            this.$http.post(`${commonUrl.baseUrl}/travelerInfo/selectTravelerInfoByUpCustomId`, param).then(res=>{
                if(res.data.code == '0000'){

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
                    this.up_detail_form.tall = result.tall == ''?'': result.tall+ 'cm'
                    this.up_detail_form.weight = result.weight == ''?'': result.weight+ 'kg'
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
        // 详情操作
        handle_detail(row){
          // 清空一下 预览图片
          this.idcard_back_url_srcList = []
          this.idcard_front_url_srcList=[]
          this.profession_photo_url_srcList=[]

          this.detail_dialogVisible = true
          this.detail_loading = true
          this.$http.post(`${ commonUrl.baseUrl }/travelerInfo/selectTravelerInfo`, {data:{customid:row.customid}}).then(res=>{
            if(res.data.code == '0000'){

                let result = res.data.data.travelerInfo
                // console.log(result)
                // 向导姓名
                this.detail_form.name = result.name
                // 向导ID
                this.detail_form.customid = result.customid
                // 所属机构
                this.detail_form.agent_name = result.agent_name
                // 上级ID
                this.detail_form.up_customid = result.up_customid
                // 上级姓名
                this.detail_form.up_name = result.up_name
                // 民族 性别  居住地  职业 详细地址 身高 体重 手机号 微信号 陌陌号  出生日期
                this.detail_form.traveler_native = result.traveler_native
                this.detail_form.sex = result.sex == '01' ?'男' :'女'
                this.detail_form.juzhudi = result.province +  result.city
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
                // 如果是导游或者学生则显示 最后那块的图片 否则不显示
                if(result.profession_type == 1 || result.profession_type == 3){
                  this.is_student_guider = true
                }else{
                  this.is_student_guider = false
                }

                this.detail_form.profession = _profession
                this.detail_form.address = result.address
                this.detail_form.tall = result.tall + 'cm'
                this.detail_form.weight = result.weight + 'kg'
                this.detail_form.phone  = result.phone
                this.detail_form.webchat = result.webchat
                this.detail_form.momo = result.momo
                this.detail_form.birthday = result.birthday
                // 身份证号
                this.detail_form.identity_no = result.identity_no
                this.detail_form.idcard_back_url = result.idcard_back_url
                this.detail_form.idcard_front_url = result.idcard_front_url
                //  职业证类型 （根据类型判名称）
                this.detail_form.profession_no = result.profession_no,
                this.detail_form.profession_name = result.profession_type == 3 ? '导游证':'学生证'
                this.detail_form.profession_photo_url = result.profession_photo_url

                // 大图预览
                this.idcard_back_url_srcList.push(result.idcard_back_url),
                this.idcard_front_url_srcList.push(result.idcard_front_url)
                this.profession_photo_url_srcList.push(result.profession_photo_url)

                // 贝壳分成
                this.detail_form.virtual_rate = result.virtual_rate
                // 出行分成
                this.detail_form.account_rate = result.account_rate
                this.detail_loading = false
            }
          }).catch(err=>{})
        },
        // 审核 操作
        handle_check(row){
            this.modi_rate_form.customid = row.customid
            this.modi_rate_form.travelerid = row.travelerid
            // 打开弹框
            this.modi_rate_dialogVisible = true

            // 清空数据
            this.resetData('modi_rate_form')
            let param ={
              data:{
                // 公有
                signInUserId: this._signInUserId,
                signInRoleId: this.$store.getters.roleId,
                customid:row.customid
              }
            }
            let promise1 = this.$http.post(`${ commonUrl.baseUrl }/travelerInfo/selectTravelerInfo`, param)
            let promise2 = this.$http.post(`${ commonUrl.baseUrl }/remarkRefusedCause/selectRefusedList`,{data:{}})
            this.modi_rate_loading = true
            Promise.all([promise1, promise2]).then(res=>{
              console.log(res)
              let [res1, res2] = res
              //
              if(res1.data.code == '0000'){
                // 判断 区代 的贝壳 出行分成是不是空,空则取市代否则取区代
                let result = res1.data.data.travelerInfo
                if(result.area_account_rate == null && result.area_virtual_rate == null){
                  this.limit_virtual_rate = result.city_virtual_rate
                  this.limit_account_rate = result.city_account_rate
                }else{
                  this.limit_virtual_rate = result.area_virtual_rate
                  this.limit_account_rate = result.area_account_rate
                }
                // console.log(res)
                this.modi_rate_loading = false
              }else{

              }
              // 拒绝原因数据
              if(res2.data.code == '0000'){
                let result = res2.data.data.remarkRefusedCauseList
                // 先清空
                this.modi_rate_form2.refusedLists = []
                for(let item of result){
                  // 先清空

                  this.modi_rate_form2.refusedLists.push(item.refused_cause)
                }

              }

            }).catch(err=>{})



        },
        // 保存审核通过
        save_check_ok(){
            // 确保必填
            if(this.m_valid_addForm('modi_rate_form')){

                let param = {
                    data:{
                        account_rate:this.modi_rate_form.account_rate,
                        virtual_rate:this.modi_rate_form.virtual_rate,
                        profit_account_rate:this.modi_rate_form.profit_account_rate,
                        profit_virtual_rate:this.modi_rate_form.profit_virtual_rate,
                        customid:this.modi_rate_form.customid,
                        traveler_status:1,
                        traveler_type:this.modi_rate_form.traveler_type,
                        travelerid:this.modi_rate_form.travelerid,
                    }
                }
                this.modi_rate_loading = true
                this.$http.post(`${ commonUrl.baseUrl }/travelerInfo/checkTravelerInfo`, param).then(res=>{
                    if(res.data.code == '0000'){
                        this.modi_rate_loading = false
                        this.modi_rate_dialogVisible = false
                        // 提示
                        this.m_message(res.data.msg, 'success')
                        // 刷新主页面
                        this.handle_refresh();

                    }else{
                        this.m_message(res.data.msg, 'warning')
                        this.modi_rate_loading = false
                    }
                }).catch(err=>{})
            }
        },
        // 保存审核拒绝
        save_check_no(){
            // 先判断 是否选了
            if(this.m_valid_addForm('modi_rate_form2')){
              let param = {
                data:{
                    account_rate:this.modi_rate_form.account_rate,
                    virtual_rate:this.modi_rate_form.virtual_rate,
                    profit_account_rate:this.modi_rate_form.profit_account_rate,
                    profit_virtual_rate:this.modi_rate_form.profit_virtual_rate,
                    customid:this.modi_rate_form.customid,
                    traveler_status:2,
                    traveler_type:this.modi_rate_form.traveler_type,
                    travelerid:this.modi_rate_form.travelerid,

                    //审核拒绝原因
                    refused_cause:this.modi_rate_form2.refusedList
                }
              }
              this.modi_rate_loading = true
              this.$http.post(`${ commonUrl.baseUrl }/travelerInfo/checkTravelerInfo`, param).then(res=>{
                  if(res.data.code == '0000'){
                      this.modi_rate_loading = false
                      this.modi_rate_dialogVisible = false
                      // 提示
                      this.m_message(res.data.msg, 'success')
                      // 刷新主页面
                      this.handle_refresh();

                  }else{
                      this.m_message(res.data.msg, 'warning')
                      this.modi_rate_loading = false
                      this.modi_rate_dialogVisible = false
                      // 刷新主页面
                      this.handle_refresh();
                  }
              }).catch(err=>{})
            }
        },
        // 省份change事件
        changeOption_province(e){
            // 参数收集
            this.queryForm.province_param = { adcode:e, txt: provinces.province_list[e] }

            // 赋值cities (先清理 后赋值)
            this.queryForm.cities = [];
            this.queryForm.city_code = '';

            this.queryForm.areas = [];
            this.queryForm.area_code = '';
            this.queryCity(provinces.province_list[e], 'queryForm');
        },
        // 市区change事件
        changeOption_city(e){
            // 收集参数
            // console.log(this.queryForm.cities);
            for(let item of this.queryForm.cities){
                if(item.adcode == e ){
                    this.queryForm.area_param = { adcode:e, txt:item.city }
                }
            }
            // 清空下级
            this.queryForm.areas = [];
            this.queryForm.area_code = '';

            this.queryArea(this.queryForm.area_param.txt,'queryForm');
        },
        // 机构状态change事件
        changeOption_traveler_status(e){
            console.log(e);
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
        // 查 县
        queryArea(txt, dataOrigin){
            let vm = this
            // 搜索所有省/直辖市信息

            this.areaSearch.search(txt, function (status, result) {

                // 查询成功时，result即为对应的行政区信息
                for(let item of result.districtList[0].districtList){
                    vm[dataOrigin].areas.push({
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
            // 初始化县区级
            AMap.plugin('AMap.DistrictSearch', function () {
                vm.areaSearch = new AMap.DistrictSearch({
                    // 关键字对应的行政区级别，country表示国家
                    level: 'district',
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
            this.agent_detail_form.regions = this.agent_detail_form.account_regions = arr
        },
    }
}
</script>
<style lang="scss">
    .modi_rate .el-form-item{
        display:flex;
        justify-content:center;
    }
    .rate_title{
        margin-top:0;
        margin-bottom:0;
    }
    .card_photo .el-col{
        display:flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .demonstration{
        margin-bottom:10px;
    }
</style>
