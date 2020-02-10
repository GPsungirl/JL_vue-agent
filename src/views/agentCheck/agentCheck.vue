<template>
    <!-- agentCheck.vue 代理商 机构管理-->
    <div class="pad_5">
        <!-- M1 查询区域 -->
        <div class="query_fields pad_b_no">
            <el-form :inline="true" :model="queryForm" ref="queryForm" size="mini" class="demo-form-inline">
            <!-- 业务地区 -->
            <el-form-item label="业务地区" >
                <!-- 省 -->
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
                <!-- 市 -->
                <el-col :span="8">
                    <el-form-item prop="city_code">
                        <el-select v-model="queryForm.city_code"
                            placeholder="选择市"
                            class="wid_140"
                            @change="changeOption_city($event)"
                            >
                            <el-option v-for="(item, index) in queryForm.cities"
                                :key="index"
                                :label=" item.city "
                                :value=" item.adcode ">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- 区 -->
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
            </el-form-item>
            <!-- 机构状态 -->
            <el-form-item label="机构状态" prop="agent_status">
                <el-select v-model="queryForm.agent_status" placeholder="请选择机构状态">
                    <el-option
                        v-for="(item, index) in queryForm.agent_statuss"
                        :key="index"
                        :label="item.txt"
                        :value="item.id"
                        >
                    </el-option>
                </el-select>
            </el-form-item>

            <!-- 查询 -->
            <el-form-item>
                <el-button type="primary" size='mini' @click="queryData">查询</el-button>
                <el-button type="success" size='mini' @click="resetData('queryForm')">重置</el-button>
                <!-- 只有代理商 市级机构6有权限 新增 -->
                <el-button v-if="roleId == 6" type="primary" size='mini' @click="handle_add">新增成员</el-button>
                <el-button type="primary" size='mini' @click="handle_refresh">刷新</el-button>

            </el-form-item>
            </el-form>
        </div>
        <!-- M2 主列表 -->
        <div>
            <!-- 表格 -->
            <!-- 机构名称 联系人 联系电话 业务地区 贝壳分成  出行分成 合同编号 审核原因  详情并审核     0新增机构 1修改信息
            agent_name charger  phone account_province account_city account_rate contract_no check_cause  -->
            <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">
                <el-table-column prop="agent_name" label="机构名称" width="" >
                </el-table-column>
                <el-table-column prop="charger" label="联系人" width="80px">
                </el-table-column>
                <el-table-column prop="phone" label="联系电话" width="">
                </el-table-column>
                <!-- 业务地区：省+市 -->
                <el-table-column prop="" label="业务地区" width="">
                    <template slot-scope="scope">
                        {{ scope.row.province + scope.row.city +scope.row.area}}
                    </template>
                </el-table-column>
                <el-table-column prop="" label="贝壳分成" width="80px">
                    <template slot-scope="scope">
                        {{ scope.row.virtual_rate + '%'}}
                    </template>
                </el-table-column>
                <el-table-column prop="" label="出行分成" width="80px">
                    <template slot-scope="scope">
                        {{ scope.row.account_rate + '%'}}
                    </template>
                </el-table-column>
                <el-table-column prop="contract_no" label="合同编号" width="120">
                </el-table-column>

                <el-table-column prop="" label="状态" width="50px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.agent_status == 1">可用</span>
                        <span v-if="scope.row.agent_status == 2">不可用</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" width="">
                    <template slot-scope="scope">
                        <el-button  @click="handle_detail(scope.row)" type="text" size="small">详情</el-button>
                        <el-button  @click="handle_modiRate(scope.row)" type="text" size="small">调整分成</el-button>
                        <el-button v-if="scope.row.agent_status == 1"  @click="handle_frozen(scope.row)" type="text" size="small">冻结</el-button>
                        <el-button v-if="scope.row.agent_status == 2"  @click="handle_frozen(scope.row)" type="text" size="small">解冻</el-button>
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
            title="新增机构"
            :visible.sync="add_dialogVisible"
            width="55%"
            top="8vh"
            class="invoiceimg_wrap"
            center
            :close-on-click-modal="false"
            v-loading="add_loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            >
            <!-- 成员类型 -->
            <!-- <el-form :inline="true" :model="add_form" :rules="add_rules" ref="add_form" label-width="80px" class="demo-form-inline valid_form">
                <el-form-item label="成员类型" prop="member_type" class="marg_r0">
                  <el-select
                      v-model="add_form.member_type"
                      @change="changeOption_memberType($event)"
                      class="wid_180 "
                      placeholder="请选择成员类型">
                      <el-option
                          v-for="(item, index) in add_form.member_types"
                          :key="index"
                          :label="item.txt"
                          :value="item.id"

                          >
                      </el-option>

                  </el-select>
                </el-form-item>
            </el-form> -->
            <!-- 代理机构2 -->
            <div v-show="show_memberType">
                <!-- 业务信息 -->
                <el-form :inline="true" :model="add_form" :rules="add_rules" ref="add_form" label-width="80px" class="demo-form-inline valid_form">
                    <el-form-item label="机构名称" prop="agent_name">
                        <el-input v-model="add_form.agent_name" placeholder="机构名称" class="wid_180"></el-input>
                    </el-form-item>
                    <el-form-item label="负责人" prop="charger" >
                        <el-input v-model="add_form.charger" placeholder="负责人" class="wid_180"></el-input>
                    </el-form-item>
                    <el-form-item label="业务地区" required class="marg_r0">
                        <el-col :span="8">
                            <el-form-item  class="marg_b0">
                                <el-select v-model="add_form.province_code"
                                    placeholder="选择省"
                                    :disabled="true"
                                    class="wid_90"
                                    @change="changeOption_province_addBusiness($event)">
                                    <el-option v-for="(item, index) in add_form.regions"
                                        :key="index"
                                        :label=" item.province "
                                        :value=" item.adcode ">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item  class="marg_b0">
                                <el-select v-model="add_form.city_code"
                                    placeholder="选择市"
                                    class="wid_90"
                                    :disabled="true"
                                    @change="changeOption_city_addBusiness($event)">
                                    <el-option v-for="(item, index) in add_form.cities"
                                        :key="index"
                                        :label=" item.city "
                                        :value=" item.adcode ">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="area_code" class="marg_b0">
                                <el-select v-model="add_form.area_code"
                                    placeholder="选择区"
                                    class="wid_90"
                                    @change="changeOption_area_addBusiness($event)"
                                    >
                                    <el-option v-for="(item, index) in add_form.areas"
                                        :key="index"
                                        :label=" item.city "
                                        :value=" item.adcode ">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="联系地址" prop="address">
                        <el-input v-model="add_form.address" placeholder="联系地址" class="wid_180"></el-input>
                    </el-form-item>
                    <el-form-item label="贝壳分成" prop="virtual_rate">
                        <el-input v-model.number="add_form.virtual_rate" placeholder="贝壳分成" class="wid_181"></el-input>%
                    </el-form-item>
                    <el-form-item label="联系电话" prop="phone" >
                        <el-input v-model="add_form.phone" placeholder="联系电话" class="wid_180"></el-input>
                    </el-form-item>
                    <el-form-item label="出行分成" prop="account_rate">
                        <el-input v-model.number="add_form.account_rate" placeholder="出行分成" class="wid_181"></el-input>%
                    </el-form-item>
                    <el-form-item label="联系邮箱" prop="email">
                        <el-input v-model="add_form.email" placeholder="联系邮箱" class="wid_180"></el-input>
                    </el-form-item>
                    <el-form-item label="合同编号" prop="contract_no">
                        <el-input v-model="add_form.contract_no" placeholder="合同编号" class="wid_180"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 开户信息 -->
                <el-form :inline="true" :model="add_form_bank" :rules="add_bank_rules" ref="add_bank_form" label-width="80px" class="demo-form-inline valid_form">
                    <el-form-item label="开户名" prop="account_user" >
                        <el-input v-model="add_form_bank.account_user" placeholder="开户名" class="wid_180"></el-input>
                    </el-form-item>
                    <el-form-item label="开户行" prop="bank_code" >
                        <el-select v-model="add_form_bank.bank_code"
                            placeholder="开户行"
                            class="wid_190"
                            @change="changeOption_bank($event)">
                            <el-option v-for="(item, index) in add_form_bank.bankInfo"
                                :key="index"
                                :label=" item.bankname "
                                :value=" item.bankcode ">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="账号" prop="account_no" >
                        <el-input v-model="add_form_bank.account_no" placeholder="账号" class="wid_180"></el-input>
                    </el-form-item>
                    <el-form-item label="开户地" required  class="marg_r0">
                        <el-col :span="11">
                            <el-form-item prop="province_code" class="marg_b0">
                                <el-select v-model="add_form_bank.province_code"
                                    placeholder="选择省"
                                    class="wid_90"
                                    @change="changeOption_province_addBank($event)">
                                    <el-option v-for="(item, index) in add_form_bank.regions"
                                        :key="index"
                                        :label=" item.province"
                                        :value=" item.adcode ">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item prop="city_code" class="marg_b0">
                                <el-select v-model="add_form_bank.city_code"
                                    placeholder="选择市"
                                    class="wid_90"
                                    @change="changeOption_city_addBank($event)">
                                    <el-option v-for="(item, index) in add_form_bank.cities"
                                        :key="index"
                                        :label=" item.city "
                                        :value=" item.adcode ">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 旅游咨询1 -->
            <div v-show="!show_memberType">
                <el-form :inline="true" :model="add_form_traveler" :rules="add_bank_traveler_rules" ref="add_form_traveler" label-width="80px" class="demo-form-inline valid_form">
                    <el-form-item label="姓名" prop="name" >
                        <el-input v-model="add_form_traveler.name" placeholder="姓名" class="wid_180"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="phone" >
                        <el-input v-model="add_form_traveler.phone" placeholder="联系电话" class="wid_180"></el-input>
                    </el-form-item>
                    <el-form-item label="贝壳分成" prop="virtual_rate" >
                        <el-input v-model.number="add_form_traveler.virtual_rate" placeholder="贝壳分成" class="wid_181"></el-input>%
                    </el-form-item>
                    <el-form-item label="向导ID" prop="customId" >
                        <el-input v-model="add_form_traveler.customId" placeholder="向导ID" class="wid_130"></el-input>
                        <el-button type="primary" size="mini" :loading="loading" @click="check_customId">检索</el-button>
                        <span >{{ searchResult }}</span>
                    </el-form-item>

                    <!-- 贝壳提成分成 -->
                    <el-form-item label="贝壳提成分成" prop="profit_virtual_rate" >
                        <el-input v-model.number="add_form_traveler.profit_virtual_rate" placeholder="贝壳提成分成" class="wid_181"></el-input>%
                    </el-form-item>
                    <!-- 出行提成分成 -->
                    <el-form-item label="出行提成分成" prop="profit_account_rate" >
                        <el-input v-model.number="add_form_traveler.profit_account_rate" placeholder="出行提成分成" class="wid_181"></el-input>%
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="add_dialogVisible = false" size="mini">取 消</el-button>
                <!-- 新增机构代理 -->
                <el-button type="primary" v-show="show_memberType"  @click="save_add" size="mini" :key="'jigou'">确 定</el-button>
                <!-- 新增旅游咨询 -->
                <el-button type="primary" v-show="!show_memberType"  @click="save_travel" size="mini" :key="'vlyou'">确 定</el-button>
            </span>
        </el-dialog>
        <!-- M4 dialog 详情 -->
        <el-dialog
            title="机构详情"
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
                <!-- 业务信息 -->
                <!-- <p class="form_title">业务信息</p> -->
                <el-form-item label="机构名称" prop="agent_name">
                    <el-input v-model="detail_form.agent_name" placeholder="审批人" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="机构编号" prop="agentid">
                    <el-input v-model="detail_form.agentid" placeholder="" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="负责人" prop="charger" label-width="68px">
                    <el-input v-model="detail_form.charger" placeholder="负责人" class="wid_180"></el-input>
                </el-form-item>
                <el-form-item label="业务地区"  class="marg_r0">
                    <el-input v-model="detail_form.pro_city_area" placeholder="负责人" class="wid_180"></el-input>
                </el-form-item>
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
        <!-- M5 dialog 调整分成 -->
        <el-dialog
            title="调整分成"
            :visible.sync="modi_rate_dialogVisible"
            width="30%"
            top="26vh"
            center
            :close-on-click-modal="false"
            v-loading="modi_rate_loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            class="modi_rate"
            >
            <!-- 业务信息 -->
            <el-form  :model="modi_rate_form" :rules="modi_rate_rules" ref="modi_rate_form"  class="demo-ruleForm valid_form"  >

                <el-form-item label="贝壳分成" prop="virtual_rate">
                    <el-input v-model.number="modi_rate_form.virtual_rate" placeholder="贝壳分成" class="wid_181"></el-input>%
                </el-form-item>

                <el-form-item label="出行分成" prop="account_rate">
                    <el-input v-model.number="modi_rate_form.account_rate" placeholder="出行分成" class="wid_181"></el-input>%
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="modi_rate_dialogVisible = false" size="mini">关 闭</el-button>
                <el-button type="primary"  @click="save_modi_rate" size="mini" >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import provinces from '../../utils/area.js'
import commonUrl from '../../utils/common'
import {isvalidPhone, validNum100, validNum15, validDyNum, filterSpace} from '../../utils/validate'
export default {
    name: 'agentCheck',
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
        // 校验分成
        let validRate=(val,value,callback)=>{
            if (!value ){
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
        // 校验分成 动态上限 dyval是上限值
        let validRateDy=(val,value,callback)=>{
          let dyval = this.limit_virtual_rate
          if (!value && value != 0){
              callback(new Error('请输入值'))
            }else  if (!validDyNum(value,dyval)){
              callback(new Error('请输入0-'+dyval+'之间的数'))
            }else {
              callback()
          }
        }
        // 贝壳 出行分成 新增成员中的代理机构
        let validRateDy_vir=(val,value,callback)=>{
          let dyval = this.limit_account_rate_addagent
          if (!value && value != 0){
              callback(new Error('请输入值'))
            }else  if (!validDyNum(value,dyval)){
              callback(new Error('请输入0-'+dyval+'之间的数'))
            }else {
              callback()
          }
        }
        let validRateDy_acc=(val,value,callback)=>{
          let dyval = this.limit_virtual_rate_addagent
          if (!value && value != 0){
              callback(new Error('请输入值'))
            }else  if (!validDyNum(value,dyval)){
              callback(new Error('请输入0-'+dyval+'之间的数'))
            }else {
              callback()
          }
        }
        //贝壳 出行分成 调整分成操作
        let validRateDy_vir2=(val,value,callback)=>{
          let dyval = this.limit_virtual_rate_modiRate
          if (!value && value != 0){
              callback(new Error('请输入值'))
            }else  if (!validDyNum(value,dyval)){
              callback(new Error('请输入0-'+dyval+'之间的数'))
            }else {
              callback()
          }
        }
        let validRateDy_acc2=(val,value,callback)=>{
          let dyval = this.limit_virtual_rate_modiRate
          if (!value && value != 0){
              callback(new Error('请输入值'))
            }else  if (!validDyNum(value,dyval)){
              callback(new Error('请输入0-'+dyval+'之间的数'))
            }else {
              callback()
          }
        }
        return {
            loading:false,
            // 角色ID
            roleId:'',
            // 加载
            add_loading:false,
            modi_rate_dialogVisible:false,
            modi_rate_loading:false,
            // 地图 需要省市区三级联动
            districtSearch:'',
            areaSearch:'',

            // 检索结果
            searchResult:'',

            // 主列表
            tableLoading:false,
            tableData:[],
            // 展示代理机构或旅游咨询
            show_memberType:true,
            // 分页
            pageTotal: 100,
            currentPage:1,
            // 银行信息
            bankInfo:'',
            // 调整分成
            modi_rate_form:{
                virtual_rate:'',
                account_rate:'',
                agentid:'',
            },
            modi_rate_rules:{
                // 贝壳分成
                virtual_rate:[
                    { required: true, validator:validRateDy_vir2, trigger: 'blur' },
                    { type: 'number', message: '贝壳分成必须为数字'}
                ],
                // 出行分成
                account_rate:[
                    { required: true, validator:validRateDy_acc2, trigger: 'blur' },
                    { type: 'number', message: '出行分成必须为数字'}
                ],
            },
            // 查询参数
            queryForm: {
                // 初始化 省 regions  市 cities
                regions:'',
                cities: [],
                areas:[],

                province_code: '',
                city_code:'',
                area_code:'',

                city_param:'',
                agent_statuss:[
                    {
                        id:1,
                        txt:'可用'
                    },
                    {
                        id:2,
                        txt:'不可用'
                    }
                ],
                agent_status:'',


            },
            // dialog add
            add_dialogVisible: false,
            detail_dialogVisible:false,
            detail_loading:false,
            detail_check_dialogVisible:false,
            detail_check_loading:false,
            // 预存省份
            pre_regions:'',
            // 新增 对话框表单
            add_form:{
                // 业务信息
                agent_name: '',
                charger:'',
                // 初始化 省 regions  市 cities
                regions:'',
                cities: [],
                areas:[],

                province_code: '',
                area_code:'',
                province_param:'', // 收集参数
                city_param:'',

                city_code:'',
                province:'',
                city:'',
                email:'',
                phone:'',
                // 联系地址
                address:'',
                // 合同编号
                contract_no:'',
                // 出行分成
                account_rate:'',
                // 贝壳分成
                virtual_rate:'',

                // 成员类型
                member_types:[
                    {
                        id:1,
                        txt:'旅游咨询'
                    },
                    {
                        id:2,
                        txt:'代理机构'
                    }
                ],
                member_type:2,
            },
            // 贝壳分成上限(新增成员：旅游咨询)
            limit_virtual_rate:'',
            // 贝壳分成、出行分成上限(新增成员：代理机构)
            limit_virtual_rate_addagent:'',
            limit_account_rate_addagent:'',
            // 贝壳分成 出行分成上限值(调整分成操作)
            limit_virtual_rate_modiRate:'',
            limit_virtual_rate_modiRate:'',

            add_form_bank:{
                // 开户信息
                    // 开户行
                bankInfo:[],
                bank_code: '',   // v-model
                bankname:'',
                    //开户地
                regions:'',
                cities: [],
                province: '',
                city:'',
                province_code:'',
                city_code:'',
                province_param:'', // 收集参数
                city_param:'',
                // 开户名
                account_user:'',
                // 开户行
                account_bank:'',
                // 开户账户
                account_no:'',
            },
            add_rules:{
                // 机构名称
                agent_name:[
                    { required: true, message: '请输入机构名称', trigger: 'blur' }
                ],
                // 负责人
                charger:[
                    { required: true, message: '请输入负责人', trigger: 'blur' }
                ],
                // 业务地区
                province_code:[
                    { required: true, message: '请选择业务地区', trigger: 'change' }
                ],
                city_code:[
                    { required: true, message: '请选择业务地区', trigger: 'change' }
                ],
                area_code:[
                    { required: true, message: '请选择业务地区', trigger: 'change' }
                ],
                // 联系地址
                address:[
                    { required: true, message: '请输入地址', trigger: 'blur' }
                ],
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
                // 成员类型
                member_type:[
                    { required: true, message: '请选择成员类型', trigger: 'change' }
                ]
            },
            add_bank_rules:{
                // 开户名
                account_user:[
                    { required: true, message: '请输入开户名', trigger: 'blur' }
                ],
                // 开户行
                bank_code:[
                    { required: true, message: '请输入开户行', trigger: 'change' }
                ],
                // 账号
                account_no:[
                    { required: true, message: '请选择账号', trigger: 'blur' }
                ],
                // 开户地
                province_code:[
                    { required: true, message: '请选择开户地', trigger: 'change' }
                ],
                city_code:[
                     { required: true, message: '请选择开户地', trigger: 'change' }
                ]
            },
            add_form_traveler:{
                name:'',
                customId:'',
                virtual_rate:'',
                profit_virtual_rate:'',
                profit_account_rate:'',
                phone:'',
            },
            add_bank_traveler_rules:{
                name:[
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                customId:[
                    { required: true, message: '请输入向导ID', trigger: 'blur' }
                ],
                // 贝壳分成
                virtual_rate:[
                    { required: true, validator:validRateDy, trigger: 'blur' },
                    { type: 'number', message: '贝壳分成必须为数字'}
                ],
                // 贝壳提成分成
                profit_virtual_rate:[
                    { required: true, validator:validRate15, trigger: 'blur' },
                    { type: 'number', message: '贝壳分成必须为数字'}
                ],
                // 出行提成分成
                profit_account_rate:[
                    { required: true, validator:validRate15, trigger: 'blur' },
                    { type: 'number', message: '贝壳分成必须为数字'}
                ],
                phone:[
                    { required: true, validator:validPhone, trigger: 'blur' }
                ],

            },
            // 详情
            detail_form:{
                regions:[],
                cities:[],
                // 机构编号
                agentid:'',
                // 机构名称
                agent_name:'',
                // 负责人
                charger:'',
                // 业务地区
                province_code:'',
                pro_city_area:'', // 用来存 省市区
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
            // 详情并审核
            detail_check_form:{
                regions:[],
                cities:[],
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

                // 审核类别
                agent_checks:[
                    {
                        id:2,
                        txt:'审核通过'
                    },
                    {
                        id:4,
                        txt:'审核拒绝'
                    },
                    {
                        id:5,
                        txt:'修改审核拒绝'
                    }
                ],
                agent_check:'',
                // 审核说明
                check_remark:'',
                // 用户id
                userid:'',
            },
            // 详情并审核 规则
            detail_check_rules:{
                // 审核状态
                agent_check:[
                    { required: true, message: '请选择审核状态', trigger: 'change' }
                ],
                check_remark:[
                    { required: true, message: '请输入审核说明', trigger: 'blur' }
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
        // 初始化 银行信息
        this.getBankList();
        // 初始化 主数据列表
        this.getTableDataList(1)

    },
    methods:{
        // 初始化 银行信息
        getBankList(){
            this.$http.post(`${ commonUrl.baseUrl}/agent/addAgent`,{data:{
                signInUserId: this.$store.getters.userId,
                signInRoleId: this.$store.getters.roleId,
            }}).then(res=>{
                if(res.data.code == '0000'){

                    this.bankInfo = this.add_form_bank.bankInfo = this.detail_form.bankInfo = res.data.data.bankList

                    // 组合省份
                    let arr = [];
                    if(res.data.data.manageProvinceCodeList.length > 0){
                        for(let item of res.data.data.manageProvinceCodeList){
                            arr.push({
                                adcode: item.province_code,
                                province: provinces.province_list[item.province_code]
                            })
                        }
                    }
                    this.add_form.regions = arr;

                }
            }).catch(err=>{

            })
        },
        // 初始化 主数据列表
        getTableDataList(pageNum){
            let param = {
               data:{
                    // 公有
                    signInUserId: this.$store.getters.userId,
                    signInRoleId: this.$store.getters.roleId,
                    pageNum: pageNum,
                    pageSize: 10,
                    // 私有
                    // 机构状态 省市区 编号
                    agent_status:this.queryForm.agent_status,
                    province_code:this.queryForm.province_code,
                    city_code:this.queryForm.city_code,
                    area_code:this.queryForm.area_code,
               }
            }
            this.tableLoading = true

            this.$http.post(`${ commonUrl.baseUrl }/agent/selectAreaAgentList`, param).then(res=>{

                if(res.data.code == '0000'){
                    // console.log(res)
                    this.tableData = res.data.data.agentList

                    // 分页总数
                    this.pageTotal = res.data.data.page.pageTotal;
                    this.tableLoading = false
                }else{
                  this.tableLoading = false
                  this.m_message(res.data.msg, 'warning')

                }
            }).catch(err=>{

            })

        },
        // 刷新 主列表
        handle_refresh(){
            this.getTableDataList(this.currentPage);

        },
        // 调整分成操作
        handle_modiRate(row){
            // 存agentid
            this.modi_rate_form.agentid = row.agentid
            // 打开弹框
            this.modi_rate_dialogVisible = true
            this.modi_rate_loading = true
            let _param = {
              data:{
                // 公有
                signInUserId: this.$store.getters.userId,
                signInRoleId: this.$store.getters.roleId,
                agentid:row.agentid
              }
            }
            this.$http.post(`${ commonUrl.baseUrl }/agent/selectAreaAgentInfo`, _param).then(res=>{
                // console.log(res)
                // debugger
                if(res.data.code ==  '0000'){
                    let result = res.data.data.agent
                    // 贝壳分成
                    this.modi_rate_form.virtual_rate = result.virtual_rate
                    // 出行分成
                    this.modi_rate_form.account_rate = result.account_rate

                    // 贝壳分成 出行分成 上限值
                    this.limit_virtual_rate_modiRate = res.data.data.virtual_rate
                    this.limit_account_rate_modiRate = res.data.data.account_rate

                    this.modi_rate_loading = false
                }
            }).catch(err=>{})
        },
        // 保存 调整分成
        save_modi_rate(){
            if(this.m_valid_addForm('modi_rate_form')){
                console.log(111)
                let param = {
                    data: {
                        // 公参
                        signInUserId: this.$store.getters.userId,
                        signInRoleId: this.$store.getters.roleId,
                        // 私参
                        account_rate:this.modi_rate_form.account_rate,
                        virtual_rate:this.modi_rate_form.virtual_rate,
                        agentid:this.modi_rate_form.agentid
                    }
                }
                this.modi_rate_loading = true

                this.$http.post(`${ commonUrl.baseUrl }/agent/updateAgentRate`, param).then(res=>{
                    if(res.data.code == '0000'){
                        this.modi_rate_loading = false
                        this.modi_rate_dialogVisible = false
                        this.m_message(res.data.msg, 'success')
                        // 刷新
                        this.handle_refresh();
                    }else{
                        this.modi_rate_loading = false
                        this.m_message(res.data.msg, 'warning')
                    }
                }).catch(err=>{})
            }
        },
        // 选择成员类型
        changeOption_memberType(e){
            // 根据类型 显示不同的 信息  1：旅游咨询  2：代理机构
            if(e == 1){
                // 展示信息
                this.show_memberType = false
                // 重置旅游数据
                this.resetForm('add_form_traveler')
                // 初始化旅游咨询
                let param = {
                    data:{
                      // 公有
                      signInUserId: this.$store.getters.userId,
                      signInRoleId: this.$store.getters.roleId,
                    }
                }
                this.add_loading = true
                this.$http.post(`${ commonUrl.baseUrl }/travelerInfo/addTravelAdvisoryPage`, param).then(res=>{
                    if(res.data.code == '0000'){
                        this.add_loading = false
                        // 控制旅游咨询贝壳分成上限
                        this.limit_virtual_rate = res.data.data.virtual_rate
                        console.log(res)
                    }
                }).catch(err=>{})
            }else{
                this.show_memberType = true
                // 重置机构数据
                this.resetForm('add_form');
                this.resetForm('add_bank_form');
            }
        },
        // 检索
        check_customId(){
            let param = {
                data:{
                    customId:this.add_form_traveler.customId
                }
            }
            this.loading = true
            this.$http.post(`${ commonUrl.baseUrl }/customInfo/selectNickname`, param).then(res=>{
                if(res.data.code == '0000'){
                    let result = res.data.data.nickname
                    this.searchResult = result.nickname
                    this.loading = false
                }else{
                    this.m_message(res.data.msg, 'warning')
                    this.loading = false
                }
            }).catch(err=>{})
        },
        // 保存旅游咨询信息
        save_travel(){

            if(this.m_valid_addForm('add_form_traveler')){
                let param = {
                    data:{
                        // 公参
                        signInUserId: this.$store.getters.userId,
                        signInRoleId: this.$store.getters.roleId,
                        // 私参
                        customId:this.add_form_traveler.customId,
                        name:this.add_form_traveler.name,
                        phone:this.add_form_traveler.phone,
                        virtual_rate:this.add_form_traveler.virtual_rate,
                        // 贝壳提成分成  出行提成分成
                        profit_virtual_rate:this.add_form_traveler.profit_virtual_rate,
                        profit_account_rate:this.add_form_traveler.profit_account_rate
                    }
                }
                this.add_loading = true
                this.$http.post(`${ commonUrl.baseUrl }/travelerInfo/addTravelAdvisory`, param).then(res=>{
                    if(res.data.code == '0000'){
                        this.add_loading = false
                        this.add_dialogVisible = false
                        this.m_message(res.data.msg,'success')
                        this.handle_refresh();


                        // 清空旅游数据
                        this.searchResult = '' // 清空 查询结果
                        this.resetForm('add_form_traveler')
                    }else if(res.data.code == '0002'){//已注册（手机号重复）

                        this.add_loading = false
                        this.m_message(res.data.msg,'success')
                    }else{
                        this.add_loading = false
                        this.m_message(res.data.msg,'success')
                    }

                }).catch(err=>{})
            }
        },
        // 查询按钮
        queryData(){
            // 根据参数进行查询
            this.getTableDataList(1);
            this.currentPage = 1
        },
        // 详情操作
        handle_detail(row){
            this.detail_dialogVisible = true
            this.detail_loading = true
            let _param1 = {
              data:{
                // 公有
                signInUserId: this.$store.getters.userId,
                signInRoleId: this.$store.getters.roleId,
                // 私有
                agentid:row.agentid
              }
            }
            this.$http.post(`${ commonUrl.baseUrl }/agent/selectAreaAgentInfo`, _param1).then(res=>{
                if(res.data.code == '0000'){

                    let result = res.data.data.agent
                    // 机构id
                    this.detail_form.agentid = result.agentid
                    // 机构名称
                    this.detail_form.agent_name = result.agent_name
                    // 负责人
                    this.detail_form.charger = result.charger
                    // 业务地区
                    this.detail_form.province_code = result.province_code
                    this.detail_form.pro_city_area = result.province + result.city + result.area
                    // 根据省查询所有市
                    this.queryCity(result.province, 'detail_form')

                    this.detail_form.city_code = result.city_code
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
        // 冻结操作
        handle_frozen(row){
            // console.log(row)

            let  _flag = '';
            let  _flag_txt = '';
            let _flag_title = '';
            if(row.agent_status == 1){
                _flag = 2
                _flag_txt = '是否冻结该该机构?'
                _flag_title='冻结'
            }else{
                _flag = 1
                _flag_txt = '是否解冻该该机构?'
                _flag_title = '解冻'
            }

            this.$confirm(_flag_txt, _flag_title, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    size:'mini',
                    center: true
                }).then(() => {
                    let param = {
                        data:{
                            // 公参
                            signInUserId: this.$store.getters.userId,
                            signInRoleId: this.$store.getters.roleId,
                            // 私参
                            agent_status:_flag,
                            agentid:row.agentid,
                            userid:row.userid,
                        }
                    }
                    this.$http.post(`${ commonUrl.baseUrl }/agent/updateAreaAgentStatus`, param).then(res=>{
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
        // 详情审核
        handle_detail_check(row){

            this.detail_check_form.userid = row.userid

            this.detail_check_dialogVisible = true
            this.detail_check_loading = true
            this.$http.post(`${ commonUrl.baseUrl }/agent/selectAgentInfo`, {data:{agentid:row.agentid}}).then(res=>{
                if(res.data.code == '0000'){

                    let result = res.data.data.agentInfo
                    // 机构id
                    this.detail_check_form.agentid = result.agentid
                    // 机构名称
                    this.detail_check_form.agent_name = result.agent_name
                    // 负责人
                    this.detail_check_form.charger = result.charger
                    // 业务地区
                    this.detail_check_form.province_code = result.province_code
                    // 根据省查询所有市
                    this.queryCity(result.province, 'detail_check_form')

                    this.detail_check_form.city_code = result.city_code
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
        // 审核 按钮
        handle_check(){
            if(this.m_valid_addForm('detail_check_form')){
                let param = {
                    data: {
                        // 公参
                        signInUserId: this.$store.getters.userId,
                        signInRoleId: this.$store.getters.roleId,
                        userid: this.detail_check_form.userid,
                        // 私参
                        agentid:this.detail_check_form.agentid,
                        agent_check:this.detail_check_form.agent_check,
                        check_remark:this.detail_check_form.check_remark,
                    }
                }
                this.detail_check_loading = true
                this.$http.post(`${ commonUrl.baseUrl}/agent/checkAgent`, param).then(res=>{
                    if(res.data.code == '0000'){
                        console.log(res)
                        this.detail_check_loading = false
                        this.detail_check_dialogVisible = false
                        this.m_message('审核完成', 'success')
                        this.handle_refresh(1);
                    }
                }).catch(err=>{})
            }
        },
        // 选中审核状态
        selectedAgentCheck(e){
            if(e == 2){
                this.detail_check_rules.check_remark = null
            }else{
                this.detail_check_rules.check_remark = [
                    { required: true, message: '请输入审核说明', trigger: 'blur' }
                ]
            }
        },
        changeOption_bank(e){

            for(let item of this.add_form_bank.bankInfo){
                if(item.bankcode == e ){
                    this.add_form_bank.bankname = item.bankname
                }
            }

        },
        // 新增按钮
        handle_add(){
            this.add_dialogVisible = true
            // 清空机构数据
            this.resetForm('add_form');
            this.resetForm('add_bank_form');
            // 清空旅游数据
            this.resetForm('add_form_traveler')

            this.add_loading = true
            this.$http.post(`${ commonUrl.baseUrl}/agent/addAgent`,{data:{
                signInUserId: this.$store.getters.userId,
                signInRoleId: this.$store.getters.roleId,
            }}).then(res=>{
                if(res.data.code == '0000'){
                    this.add_loading = false
                    // 代理机构分成上限
                    // console.log(res.data.data.account_rate)
                    this.limit_virtual_rate_addagent = res.data.data.account_rate
                    this.limit_account_rate_addagent = res.data.data.virtual_rate
                    // console.log(res.data.data.virtual_rate)

                    this.bankInfo = this.add_form_bank.bankInfo = res.data.data.bankList
                    // // 组合省份
                    if(this.roleId == 6){ // 市级代理机构：限制管辖省份
                        let result = res.data.data.code

                        // 限制 省市
                        //this.add_form.province_param.txt =result.province
                        this.add_form.province_code = result.province_code
                        this.add_form.province_param = { txt:result.province, adcode: result.province_code}
                        // 查询该省下所有cities
                        this.queryCity(result.province, 'add_form');
                        this.add_form.city_code = result.city_code
                        this.add_form.city_param = { txt:result.city, adcode:result.city_code }
                        // 该市下面所有区
                        this.queryArea(result.city, 'add_form')

                    }


                }
            }).catch(err=>{  })

        },
        // 保存 新增机构
        save_add(){

            // 校验
            if(this.m_valid_addForm('add_form') && this.m_valid_addForm('add_bank_form')){
              // 过滤银行账户的空格
              this.add_form_bank.account_no = filterSpace(this.add_form_bank.account_no)
                let param = {
                    data:{
                        // 公参
                        signInUserId: this.$store.getters.userId,
                        signInRoleId: this.$store.getters.roleId,
                        // 私参
                        // 开户行
                        account_bank:this.add_form_bank.bankname,
                        // 省编号
                        account_pro_code:this.add_form_bank.province_param.adcode,
                        account_province:this.add_form_bank.province_param.provincename,
                        // 开户市
                        account_city:this.add_form_bank.city_param.cityname,
                        account_city_code:this.add_form_bank.city_param.adcode,
                        // 账号
                        account_no:this.add_form_bank.account_no,


                        account_rate:this.add_form.account_rate,
                        account_user:this.add_form_bank.account_user,
                        address:this.add_form.address,
                        agent_name:this.add_form.agent_name,
                        bank_code:this.add_form_bank.bank_code,
                        charger:this.add_form.charger,
                        contract_no:this.add_form.contract_no,
                        email:this.add_form.email,
                        phone:this.add_form.phone,
                        province:this.add_form.province_param.txt,
                        province_code:this.add_form.province_param.adcode,
                        city:this.add_form.city_param.txt,
                        city_code:this.add_form.city_param.adcode,
                        area:this.add_form.area_param.txt,
                        area_code:this.add_form.area_param.adcode,
                        virtual_rate:this.add_form.virtual_rate,

                    }
                }
                this.add_loading = true
                this.$http.post(`${commonUrl.baseUrl}/agent/saveAgent`, param).then(res=>{

                    if(res.data.code == '0000'){
                        this.add_loading = false
                        this.add_dialogVisible = false
                        this.m_message('新增机构成功','success')
                        this.handle_refresh();

                        // 清空机构数据
                        this.resetForm('add_form');
                        this.resetForm('add_bank_form');
                    }else if(res.data.code == '0002'){//已注册（手机号重复）

                        this.add_loading = false
                        this.m_message(res.data.msg,'success')
                    }else{
                        this.add_loading = false
                        this.m_message(res.data.msg,'success')
                    }



                }).catch(err=>{
                    console.log(err)
                })

            }
        },
        // 重置
        resetForm(formName) {
            if(this.$refs[formName]){
                this.$refs[formName].resetFields();
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

            this.queryCity(provinces.province_list[e],'queryForm');
        },
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
        changeOption_province_addBusiness(e){//新增dialog:业务地区:省
            // 参数收集
            this.add_form.province_param = { adcode:e, txt: provinces.province_list[e] }
            // 赋值cities (先清理 后赋值)
            this.add_form.cities = [];
            this.add_form.city_code = '';

            this.add_form.areas= [];
            this.add_form.area_code = '';
            this.queryCity(provinces.province_list[e],'add_form');
        },
        changeOption_city_addBusiness(e){//新增dialog:业务地区:市
            // 收集参数
            for(let item of this.add_form.cities){
               if(item.adcode == e){
                   this.add_form.city_param = { txt:item.city, adcode:e  }
               }
            }
            // 清空下级
            this.add_form.areas = [];
            this.add_form.area_code = '';

            this.queryArea(this.add_form.city_param.txt,'add_form');

        },
        changeOption_area_addBusiness(e){//新增dialog:业务地区:区
            //收集参数
            for(let item of this.add_form.areas){
               if(item.adcode == e){
                   this.add_form.area_param = { txt:item.city, adcode:e  }
               }
            }
        },
        changeOption_province_addBank(e){
            this.add_form_bank.province_param = { provincename:provinces.province_list[e], adcode:e }
            // 赋值cities (先清理 后赋值)
            this.add_form_bank.cities = [];
            this.add_form_bank.city_code = '';
            this.queryCity(provinces.province_list[e],'add_form_bank');
        },
        // 开户地
        changeOption_city_addBank(e){
            for(let item of this.add_form_bank.cities){
               if(item.adcode == e){
                   console.log(item)
                   this.add_form_bank.city_param = { cityname:item.city, adcode:e  }
               }
            }
        },
        // 查 市区 txt: String 省份名,dataOrigin 是指 add_form  或是queryeForm 这种 父级数据源
        queryCity(txt,dataOrigin){

            let vm = this
            // 搜索所有省/直辖市信息

            this.districtSearch.search(txt, function (status, result) {

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
        // 重置查询条件
        resetData(formName){

            this.$refs[formName].resetFields();
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
            //this.add_form.regions = arr
            this.add_form_bank.regions=arr
            this.add_form.regions = arr
            // 预存 省份
            //this.pre_regions = arr
            // 详情
            this.detail_form.regions = this.detail_form.account_regions = arr
            // 详情并审核
            this.detail_check_form.regions = this.detail_check_form.account_regions = arr
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
    .modi_rate .el-form-item{
        display:flex;
        justify-content:center;
    }
</style>
