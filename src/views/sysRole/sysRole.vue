
<template>
<!-- 权限管理页面 -->
<div class="userPermission">
  <!--module1 功能区域 -->
  <div class="query_field mar_b10">
    <el-row>
      <el-button type="primary" size='mini' @click="handle_addUserPermisson">新增角色</el-button>
      <el-button type="primary" size='mini' @click="refreshData">刷新</el-button>
    </el-row>
  </div>

  <!--module2 表格 -->
  <el-table :data="tableData" v-loading="tableLoading" border stripe style="width: 100%">

    <el-table-column prop="role_name" label="角色名称" width="">
    </el-table-column>
    <el-table-column prop="role_describe" label="角色描述" width="">
    </el-table-column>
    <el-table-column prop="permission" label="权限" width="">
    </el-table-column>

    <el-table-column prop="" label="操作" width="">
      <template slot-scope="scope">
          <el-button @click="modi_permisson(scope.row)" type="text" size="small">调整权限</el-button>
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
      :total="pageTotal">
    </el-pagination>
  </div>

  <!--module4 调整权限 dialog1 -->
  <el-dialog
    :title="d_modi_userPermission.modi_title"
    :visible.sync="permission_dialogVisible"
    width="40%"
    center
    class="modiUsers_dialog dialog_tip"
    :close-on-click-modal="false"
    v-loading="modi_loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    >
    <!--修改 body -->
    <div>
      <el-row>
        <!-- 左侧表单 -->
        <el-col :span="14">
          <div class="grid-content bg-purple-dark pad_t2">
            <el-form :model="valid_modiForm" :rules="modi_rules" ref="valid_modiForm" label-width="100px" class="demo-ruleForm valid_form">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="valid_modiForm.name"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="txt">
                <el-input v-model="valid_modiForm.txt"></el-input>
              </el-form-item>
              <el-form-item label="角色权限" prop="permission">
                <el-select v-model="valid_modiForm.permission" multiple="" placeholder="角色权限">
                  <el-option
                    v-for="(item, index) in valid_modiForm.permissions"
                    :key="index"
                    :label="item"
                    :value="item"
                    ></el-option>
                </el-select>

              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <!-- 右侧 tree -->
        <el-col :span="10">
          <div class="grid-content bg-purple-dark ">
            <!-- 修改 树 -->
            <el-tree
              :data="modiDialog_tree"
              show-checkbox
              node-key="id"
              ref="modiTree"
              :default-expanded-keys = "modi_default_ids"
              :default-checked-keys= "modi_default_ids"
              highlight-current
              accordion
              >
            </el-tree>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--dialog footer  -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="permission_dialogVisible = false" size='mini'>取 消</el-button>
      <el-button type="primary" @click="modiData_userPermission" size='mini'>确 定</el-button>
    </span>
  </el-dialog>

  <!--module5 新增 dialog2 -->
  <el-dialog
    title="新增角色"
    :visible.sync="addUsers_dialogVisible"
    width="40%"
    class="addUsers_dialog dialog_tip"
    center

    :close-on-click-modal="false"
    v-loading="add_loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    >
    <!--新增 body -->
    <div class="dialogBody_addPermission">
      <el-row>
        <!-- 左侧表单 -->
        <el-col :span="12">
          <div class="grid-content bg-purple-dark pad_t2">
            <el-form :model="valid_addForm" :rules="add_rules" ref="valid_addForm" label-width="100px" class="valid_form demo-ruleForm">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="valid_addForm.name" placeholder="角色名称"></el-input>
              </el-form-item>
              <el-form-item label="角色描述" prop="txt">
                <el-input v-model="valid_addForm.txt" placeholder="角色描述"></el-input>
              </el-form-item>
              <el-form-item label="角色权限" prop="permission">
                <el-select v-model="valid_addForm.permission" multiple placeholder="选择角色权限">
                  <el-option
                    v-for="(item, index) in valid_addForm.permissions"
                    :key="index"
                    :label="item"
                    :value="item"
                    ></el-option>
                </el-select>

              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <!-- 右侧 树 -->
        <el-col :span="12">
          <div class="grid-content bg-purple-dark pad_l34" >
            <!-- 新增 树 -->
            <el-tree
              :data="addDialog_tree"
              show-checkbox
              node-key="id"
              ref="add_tree"
              highlight-current
              accordion
              >
            </el-tree>
          </div>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" @click="addUsers_dialogVisible = false" size='mini'>取 消</el-button>
      <el-button type="primary" @click="save_addSysRole" size='mini'>确 定</el-button>
    </span>
  </el-dialog>



  </div>
</template>

<script>
import commonUrl from '../../utils/common';
import gpCommonJs from '../../utils/functions'
export default {
  name: 'sysRole',
  data() {
    return {
      //M1 主列表
      tableData: [],
      tableLoading: false,
      //M2 分页
      pageTotal: 100,
      currentPage: 1,
      //M3 俩弹框
      permission_dialogVisible: false,
      addUsers_dialogVisible: false,
      //M4 添加用户的form
      form: {
        // 角色名称
        name: '',
        // 角色描述
        txt: '',
        // 角色权限
        permission: ''
      },
      formLabelWidth: '120px',
      // 新增 树的数据
      addDialog_tree: [],
      // 修改 树
      modiDialog_tree: [],
      // 默认展开 和 默认选中项
      modi_default_ids: [],
      // 新增 弹框规则
      valid_addForm: {
        name: '',
        txt: '',
        permission:[],
        // 角色权限
        permissions:[
          'edit', 'view'
        ],
      },
      add_rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        txt: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
        permission: [
          { required: true, message: '请选择角色权限', trigger: 'change' },
        ],

      },
      // 修改权限
      valid_modiForm:{
        name: '',
        txt: '',
        permission:[],
        permissions:[
          'edit', 'view'
        ],
      },
      modi_rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        txt: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ],
        permission: [
          { required: true, message: '请选择角色权限', trigger: 'change' },
        ],

      },
      // 待修改的 用户信息
      d_modi_userPermission: {
        modi_title: '',
        role_name: '',
        id: '',
        permission:'',
        role_describe: ''
      },
      modi_loading:false,
      add_loading: false,
    }
  },
  created() {
    // 初始化数据列表
    this.getList_userPermission(1);
    // 获取当前登录者权限
    //this.getData_onePermission();

  },
  methods: {
    // 刷新
    refreshData(){
      // 初始化数据列表
      this.getList_userPermission(this.currentPage);
      // 回到第一页数据
      //this.currentPage = 1
    },
    // 主列表（获取所有用户权限管理列表)
    async getList_userPermission(pageNum) {
      this.tableLoading = true
      // 参数
      let param = {
        data: {
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
          pageNum: pageNum,
          pageSize: 10,
        }
      }
      const res = await this.$http.post(`${commonUrl.baseUrl}/sysRole/selectSysRole`, param)
      if (res.data.code == '0000') {
        this.tableData = res.data.data.sysRoleList
        // 分页 总数
        this.pageTotal = res.data.data.page.pageTotal;
        this.tableLoading = false
      }
    },
    // 新增按钮 (点击《新增用户权限》)
    async handle_addUserPermisson() {
      // 弹框
      this.addUsers_dialogVisible = true
      // 清空 值
      this.resetForm('valid_addForm')
      // 清空选中的权限
      if(this.$refs.add_tree){
        this.$refs.add_tree.setCheckedKeys([]);
      }
      // 获取登陆者权限
      let param = {
        data: {
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
        }
      }
      this.add_loading = true
      const res = await this.$http.post(`${commonUrl.baseUrl}/sysRole/addSysRole`, param)
      if (res.data.code == '0000') {
        // 处理数据
        let menuList = gpCommonJs.designData_tree(res.data.data.sysMenuList);
        this.addDialog_tree = menuList
        this.add_loading = false
      }
    },
    // 为新增获取某个 ：菜单权限
    async getData_onePermission() {
      let param = {
        data: {
          signInUserId: this.$store.getters.userId,
          signInRoleId: this.$store.getters.roleId,
        }
      }
      const res = await this.$http.post(`${commonUrl.baseUrl}/sysRole/addSysRole`, param)
      if (res.data.code == '0000') {
        // 处理数据
        let menuList = gpCommonJs.designData_tree(res.data.data.sysMenuList);
        this.addDialog_tree = menuList
        this.modiDialog_tree = menuList
      }
    },

    // 新增=保存按钮  (点击弹框中的《确定》)
    save_addSysRole(){
      // valid  右侧必选！  左侧必填！
      // 全选
      let  treeIds = this.$refs.add_tree.getCheckedKeys()

      // 半选
      let  halfIds = this.$refs.add_tree.getHalfCheckedKeys()
      if(halfIds.length>0){
        treeIds = treeIds.concat(halfIds)
      }

        //判断 树是否选了
      if(treeIds.length == 0){
        this.m_message('请为该用户分配权限', 'warning')
        return ;
      }
      if(this.m_valid_addForm('valid_addForm')){

        // 保存到 后台
        let param = {
          data:{
            // 用户 角色 id
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            //  权限  介绍 名称
            mid:treeIds.join(','),
            permission:this.valid_addForm.permission.join(','),
            role_describe:this.valid_addForm.txt,
            role_name:this.valid_addForm.name
          }
        }
        this.add_loading = true;
        this.$http.post(`${ commonUrl.baseUrl }/sysRole/saveSysRole`, param).then( res =>{
          if(res.data.code == '0000'){
            // 成功提示
            this.add_loading = false;
            this.m_message(res.data.msg, 'success')
            // 重新初始化数据列表
            this.getList_userPermission( this.currentPage );
            // 关闭 弹框
            this.addUsers_dialogVisible = false
          }else{
            this.m_message(res.data.msg, 'success')
          }
        }).catch( err => {
          console.log(err)
        })

      }


    },
    // 获取选中菜单节点
    getTreeNode() {
      console.log(this.$refs.add_tree.getCheckedKeys());
    },
    // 调整权限 操作
    modi_permisson(row) {

      // 展开弹框
      this.permission_dialogVisible = true
      // 存储当前行数据
      this.d_modi_userPermission.permission = row.permission;
      this.d_modi_userPermission.role_name = row.role_name;
      this.d_modi_userPermission.role_describe = row.role_describe;
      this.d_modi_userPermission.id = row.id;
      // 先清空  选中
      this.modi_default_ids = []
      this.d_modi_userPermission.modi_title ='调整'+ row.role_name + '的权限'
      // 获取当前待修改角色的权限菜单
      let param = {
        data: { id:row.id, signInUserId: this.$store.getters.userId, signInRoleId: this.$store.getters.roleId }
      }
      this.modi_loading = true
      this.$http.post(`${ commonUrl.baseUrl }/sysRole/updateSysRole`, param).then(res2=>{
        if(res2.data.code == '0000'){

          // 1赋值总体树
          let _menuList = gpCommonJs.designData_tree(res2.data.data.menuList);

          this.modiDialog_tree = _menuList
          // 2赋值当前待修改树
          let ids2_arr = []  // 用来存返回的id组成的数组
          if(res2.data.data.sysMenuList.length > 0){
            for(let item of res2.data.data.sysMenuList){
              this.modi_default_ids.push(item.id)
              ids2_arr.push(item.id)
            }
          }
          // 选出半选状态并从数组中干掉
          let level_one_arr = [] //存一级菜单
          for(let i=0; i<ids2_arr.length; i++){
            for(let j=0; j<this.modiDialog_tree.length; j++){
              if(ids2_arr[i] == this.modiDialog_tree[j].id && 'children' in this.modiDialog_tree[j]){
                // level_one_arr.push(ids2_arr[i])
                let flag = false
                for(let k=0; k<this.modiDialog_tree[j].children.length;k++){
                  let ii = ids2_arr.indexOf(this.modiDialog_tree[j].children[k].id);
                  if(ii == -1){ flag = true }
                }
                if(flag){ ids2_arr.splice(i,1) }
              }
            }
          }
          // 修复数据：去除那些半选中状态的id

          this.modi_default_ids = ids2_arr;

          if(this.$refs.modiTree){
            this.$refs.modiTree.setCheckedKeys(this.modi_default_ids);
          }
          // 角色名称 描述  权限 赋值
          let result = res2.data.data.sysRole
          this.valid_modiForm.name = result.role_name
          this.valid_modiForm.txt = result.role_describe
          this.valid_modiForm.permission = result.permission.split(',')
          // 加载完成
          this.modi_loading = false

        }
      }).catch(err=>{  })

    },
    // 保存 修改权限
    modiData_userPermission(){
      // console.log(this.d_modi_userPermission)
      // valid  右侧必选！  左侧必填！   判断 树是否选了
      // 全选
      let  treeIds = this.$refs.modiTree.getCheckedKeys()
      // if(treeIds.length == 0){
      //     this.m_message('请为该用户分配权限', 'warning')
      //     return ;
      // }
      // 半选
      let  halfIds = this.$refs.modiTree.getHalfCheckedKeys()
      if(halfIds.length>0){
        treeIds = treeIds.concat(halfIds)
      }
      // 校验
      if(this.m_valid_addForm('valid_modiForm')){
        // 保存到 后台
        let param = {
          data:{
            // 用户 角色 id
            signInUserId: this.$store.getters.userId,
            signInRoleId: this.$store.getters.roleId,
            //  权限  介绍 名称
            id:this.d_modi_userPermission.id,
            mid:treeIds.join(','),
            permission:this.valid_modiForm.permission.join(','),
            role_describe:this.valid_modiForm.role_describe,
            role_name:this.valid_modiForm.name,
          }
        }
        this.modi_loading = true;
        this.$http.post(`${ commonUrl.baseUrl }/sysRole/saveSysRole`, param).then( res =>{
          if(res.data.code == '0000'){
            this.modi_loading = false;
            // 成功提示
            this.m_message(res.data.msg, 'success')
            // 重新初始化数据列表
            this.getList_userPermission( this.currentPage );
            // 关闭 弹框
            this.permission_dialogVisible = false
          }else{
            this.m_message(res.data.msg, 'success')
          }
        }).catch( err => {
          console.log(err)
        })
      }


    },
    handleCurrentChange(val) {
      this.currentPage = val
      // 获取单前页数据列表
      this.getList_userPermission(val);
      //console.log(`当前页: ${val}`);
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
    // 重置
    resetForm(formName) {
      if(this.$refs[formName]){
        this.$refs[formName].resetFields();
      }
    },
    // 递归取 半选 的数据

    diguiquchu(datas, arr, v, i, needdelarr) {
      //递归找出半选中的数据
      arr.map((item, index) => {
        if (item.id == v && item.child) {
          // datas.splice(i, 1);//因为每次截取会改变原数组，所以不能这样
          needdelarr.push(v);
          this.diguiquchu(datas, item.child, v, i, needdelarr);
        } else if (item.id != v && item.child) {
          this.diguiquchu(datas, item.child, v, i, needdelarr);
        }
      });
    }



  },

}
</script>

<style lang="scss">
.userPermission {
  .mar_b10 {
    margin-bottom: 5px;
  }
  .mar_t10 {
    margin-top: 10px;
  }
  padding:5px; // 功能区域0
  .query_field {
    padding: 12px 8px;
    background-color: #fff;
  }

  .addUsers_dialog .el-dialog__body,
  .modiUsers_dialog .el-dialog__body{height: 50vh;overflow: auto;}
}
</style>
