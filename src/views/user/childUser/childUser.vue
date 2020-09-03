<template>
  <div class="user">
    <div class="components_search">
      <el-input placeholder="用户名" v-model="userList.username" clearable></el-input>
      <el-input placeholder="手机" v-model="userList.phone" clearable></el-input>
      <el-button @click="handleSearch">搜索</el-button>
    </div>
    <div class="components_handleList">
      <el-button type="primary" @click="addUser">添加</el-button>
      <el-button type="danger" @click="deleteUser()">删除</el-button>
      <el-button type="primary" @click="resetPassword">重置密码</el-button>
    </div>

    <div class="contain">
      <div class="left">
        <el-tree
          :data="navMenuData"
          highlight-current
          :props="navMenuProp"
          @node-click="handleNavMenu"
        ></el-tree>
      </div>
      <div class="right">
        <el-table
          :data="tableData.content"
          tooltip-effect="dark"
          style="width: 100%"
          row-key="id"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          @selection-change="handleSelectionChange"
        >
          >
          <el-table-column align="center" type="selection"></el-table-column>
          <el-table-column prop="username" align="center" label="用户名"></el-table-column>
          <el-table-column prop="nickname" align="center" label="昵称"></el-table-column>
          <el-table-column prop="phone" align="center" label="手机"></el-table-column>
          <el-table-column prop="email" align="center" label="邮箱"></el-table-column>
          <el-table-column prop="gender" align="center" label="性别"></el-table-column>
          <el-table-column fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="getSelectSysAdminListByCurrentUserForAllocationDeptSysAdmin(scope.row.id)"
              >设置部门管理员</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="getSelectSysAdminListByCurrentUserForAllocationDeptSysAdmin(scope.row.id)"
              >设置系统管理员</el-button>
              <el-button type="primary" size="mini" @click="handleUser(scope.row.id)">授权角色</el-button>
              <el-button type="primary" size="mini" @click="getUserDetail(scope.row.id)">编辑</el-button>
              <el-button type="danger" size="mini" @click="deleteUser(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="pagination-container">
      <el-pagination
        background
        @current-change="currentChange"
        :page-sizes="[10, 20, 30, 50]"
        layout="sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>

    <el-dialog
      :title="userFormName"
      center
      :visible.sync="editUserDialog"
      @close="closeUserForm"
      width="30%"
    >
      <div class="tableList">
        <el-form ref="userForm" :model="userFormList" :rules="rules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input placeholder="请输入用户名" v-model="userFormList.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input placeholder="请输入密码" v-model="userFormList.password"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input placeholder="请输入昵称" v-model="userFormList.nickname"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input placeholder="请输入手机" v-model="userFormList.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input placeholder="请输入邮箱" v-model="userFormList.email"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="userFormList.gender">
              <el-radio
                :label="item.label"
                v-for="(item, index) in genderRadio"
                :key="index"
              >{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="城市" prop="city">
            <el-input placeholder="请输入城市" v-model="userFormList.city"></el-input>
          </el-form-item>
          <el-form-item label="职业" prop="job">
            <el-input placeholder="请输入职业" v-model="userFormList.job"></el-input>
          </el-form-item>
          <el-form-item label="个性签名" prop="personalizedSignature">
            <el-input placeholder="请输入个性签名" v-model="userFormList.personalizedSignature"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeUserForm">取 消</el-button>
        <el-button type="primary" @click="validUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title center :visible.sync="showUserDialog" @close="closeShowForm" width="60%">
      <div class="tableList">
        <el-form ref="userForm" :model="showFormList" :rules="rules" label-width="80px">
          <el-form-item label="系统" prop="system">
            <el-select
              v-model="showFormList.system"
              @change="getSelectRoleListByUserIdAndSysId"
              placeholder="所属系统"
            >
              <el-option
                v-for="(item, index) in systemList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="授权角色" prop="roles">
            <el-transfer v-model="transferList.data" :data="transferList.defaultdata"></el-transfer>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="postUserRoles">确认</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="选择子系统"
      center
      :visible.sync="showDeptDialog"
      :append-to-body="true"
      width="50%"
    >
      <div class="tableList">
        <el-form ref="systemForm" :model="deptFormList" :rules="rules" label-width="80px">
          <el-form-item label="所属系统" prop="deptName">
            <el-checkbox-group v-model="deptFormList.systemName">
              <el-checkbox
                v-for="(childItem, childIndex) in defaultDeptData"
                :key="childIndex"
                :label="childItem.value"
              >{{ childItem.label }} {{childItem.checked}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDeptDialog = false">取 消</el-button>
        <el-button type="primary" @click="getAllocationDeptSysAdmin">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="选择子系统"
      center
      :visible.sync="showAdminDialog"
      :append-to-body="true"
      width="50%"
    >
      <div class="tableList">
        <el-form ref="systemForm" :model="systemFormList" :rules="rules" label-width="80px">
          <el-form-item label="所属系统" prop="deptName">
            <el-checkbox-group v-model="systemFormList.systemName">
              <el-checkbox
                v-for="(childItem, childIndex) in defaultSystemData"
                :key="childIndex"
                :label="childItem.value"
              >{{ childItem.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAdminDialog = false">取 消</el-button>
        <el-button type="primary" @click="getAllocationDeptSysAdmin">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { getDeptTree, postUserList } from '@/api/department'
import {
  getUserDetail,
  postResetPassword,
  postUserAdd,
  putUserUpdate,
  deleteUserBatch,
  postUserRoles,
  getSelectRoleListByUserIdAndSysId,
  getSelectDeptSysAdminListByCurrentUser,
  getSelectSysAdminListByCurrentUserForAllocationSysAdmin,
  getAllocationSysAdmin,
  getSelectSysAdminListByCurrentUserForAllocationDeptSysAdmin,
  getAllocationDeptSysAdmin,
} from '@/api/childUser'
@Component({
  components: {},
})
export default class user extends Vue {
  // 用户树侧边栏
  navMenuData = []
  navMenuProp = {
    children: 'deptVOS',
    label: 'deptName',
  }
  // table列表
  userList: any = {
    pageIndex: 1,
    length: 10,
    deptId: null,
  }

  tableData: any = {}

  selectList = []
  userFormName = '添加用户'

  // form列表
  userFormList: any = {
    deptId: null,
    userFormList: '',
    id: 0,
    username: '',
    password: '',
    nickname: '',
    phone: '',
    email: '',
    gender: 1,
    city: '',
    job: '',
    personalizedSignature: '',
  }
  defaultForm: any = {}

  rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    phone: [{ required: true, message: '请输入手机', trigger: 'blur' }],
    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
    gender: [{ required: true, message: '请输入性别', trigger: 'blur' }],
    city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
    job: [{ required: true, message: '请输入职业', trigger: 'blur' }],
    personalizedSignature: [
      { required: true, message: '请输入个性签名', trigger: 'blur' },
    ],
  }

  genderRadio = [
    {
      label: 1,
      name: '男',
    },
    {
      label: 2,
      name: '女',
    },
  ]

  // 系统管理员
  systemFormList: any = {
    id: null,
    systemName: [],
  }
  defaultSystemData: any = []

  // 系统部门管理员
  deptFormList: any = {
    id: null,
    systemName: [],
  }
  defaultDeptData: any = []

  // 授权角色
  showFormList: any = {
    id: null,
    system: null,
    roles: [],
  }

  systemList: any = []

  transferList: any = {
    data: [],
    defaultdata: [],
  }

  // 弹窗显示
  editUserDialog = false
  showDeleteDialog = false
  showUserDialog = false
  showAdminDialog = false
  showDeptDialog = false

  mounted() {
    this.getDeptTree()
    this.getSelectDeptSysAdminListByCurrentUser()
    this.defaultForm = JSON.parse(JSON.stringify(this.userFormList))
  }

  // 左边系统展示
  handleNavMenu(data: any) {
    this.userList.deptId = data.id
    this.postUserList()
  }

  // 搜索框
  handleSearch() {
    this.postUserList()
  }

  // 添加按钮点击显示弹窗
  addUser() {
    if (this.userList.deptId == null) {
      this.$message({
        message: '请选择部门',
        type: 'warning',
      })
      return
    }
    this.userFormName = '添加用户'
    this.editUserDialog = !this.editUserDialog
  }

  // 删除按钮点击显示弹窗
  deleteUser(arrId?: string[]) {
    let id: any[] = []
    if (arrId) {
      id = [arrId]
    } else {
      if (this.selectList.length === 0) {
        this.$message({
          message: '请选择至少一名用户',
          type: 'warning',
        })
        return
      }
      this.selectList.forEach((item: any) => {
        id.push(item.id)
      })
    }
    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        this.deleteUserBatch(id)
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
  }

  resetPassword() {
    if (this.selectList.length === 0) {
      this.$message({
        message: '请选择至少一名用户',
        type: 'warning',
      })
      return
    }
    this.$confirm('是否重置密码?新密码为默认手机号后6位。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        this.postResetPassword()
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
  }

  // 分页选择当前页
  handleSelectionChange(val: []) {
    this.selectList = val
  }

  // 每页显示多少
  handleSizeChange(val: any) {
    this.userList.length = val
  }

  // 分页选择
  currentChange(index: number) {
    this.userList.pageIndex = index
    this.postUserList()
  }

  // 添加/编辑按钮 关闭弹窗
  closeUserForm() {
    this.userFormList = JSON.parse(JSON.stringify(this.defaultForm))
    this.editUserDialog = false
  }

  // 显示按钮 关闭弹窗
  closeShowForm() {
    this.userFormList = JSON.parse(JSON.stringify(this.defaultForm))
    this.showUserDialog = false
  }

  // 添加/编辑用户验证
  validUser() {
    ;(this.$refs.userForm as any).validate((valid: any) => {
      if (valid) {
        if (this.userFormList.id !== 0) {
          this.putUserUpdate()
        } else {
          this.postUserAdd()
        }
      } else {
        return false
      }
    })
  }

  // 授权角色按钮
  handleUser(index: number) {
    this.showFormList.id = index
    this.showUserDialog = true
  }

  // 设置管理员
  handleAdmin() {
    this.showAdminDialog = true
  }

  // 接口调取
  // 分页查询用户树
  getDeptTree() {
    const params = {
      pageNum: 1,
      pageSize: 1000,
    }
    getDeptTree(params).then((response: any) => {
      const content = response.data.content
      this.navMenuData = content
      this.userFormList.deptId = content[0].id
    })
  }
  // 分页查询用户
  postUserList() {
    const params = JSON.parse(JSON.stringify(this.userList))
    params.id = Number(params.id)
    postUserList(params).then((response: any) => {
      this.tableData = response.data
    })
  }

  // 授权角色
  getSelectDeptSysAdminListByCurrentUser() {
    getSelectDeptSysAdminListByCurrentUser().then((response: any) => {
      response.data.forEach((item: any) => {
        this.systemList.push({
          value: item.id,
          label: item.systemName,
        })
      })
    })
  }

  // 授权角色 选择部门
  getSelectRoleListByUserIdAndSysId(index: any) {
    const params = {
      sysId: index,
      userId: this.showFormList.id,
    }
    getSelectRoleListByUserIdAndSysId(params).then((response: any) => {
      const data = response.data
      this.transferList.data = []
      this.transferList.defaultdata = []
      const allHaveList = response.data.haveList.concat(
        response.data.noHaveList
      )
      data.haveList.forEach((item: any) => {
        this.transferList.data.push(item.id)
      })

      allHaveList.forEach((item: any) => {
        this.transferList.defaultdata.push({
          key: item.id,
          label: item.roleName,
        })
      })
    })
  }

  // 编辑按钮 回显
  getUserDetail(id: number) {
    this.userFormList.id = id
    getUserDetail(id).then((response: any) => {
      Object.keys(this.userFormList).forEach((key) => {
        this.userFormList[key] = response.data[key]
      })
      this.userFormName = '编辑用户'
      this.editUserDialog = true
    })
  }

  // 添加用户提交
  postUserAdd() {
    const params = Object.assign(this.userFormList, {
      deptId: this.userList.deptId,
    })
    postUserAdd(params).then((response: any) => {
      this.postUserList()
      this.closeUserForm()
    })
  }

  // 编辑提交
  putUserUpdate() {
    putUserUpdate(this.userFormList).then((response: any) => {
      this.postUserList()
      this.closeUserForm()
    })
  }

  // 删除列表
  deleteUserBatch(arrId: string[]) {
    const id = arrId ? arrId : this.selectList
    deleteUserBatch(id).then((response: any) => {
      this.$message({
        type: 'success',
        message: '删除成功!',
      })
      this.postUserList()
    })
  }

  // 重置密码
  postResetPassword() {
    const id: any = []
    this.selectList.forEach((item: any) => {
      id.push(item.id)
    })
    postResetPassword(id).then((response: any) => {
      this.$message({
        type: 'success',
        message: '重置成功!',
      })
      this.postUserList()
    })
  }

  // 授权提交
  postUserRoles() {
    const params = {
      roleIds: this.transferList.data,
      userId: this.showFormList.id,
    }
    postUserRoles(params).then((response: any) => {
      this.postUserList()
      this.showUserDialog = false
    })
  }

  // 选择子部门
  getSelectSysAdminListByCurrentUserForAllocationDeptSysAdmin(id: Number) {
    this.deptFormList.id = id
    this.deptFormList.systemName = []
    getSelectSysAdminListByCurrentUserForAllocationDeptSysAdmin({
      userId: id,
    }).then((response: any) => {
      const defaultDeptData: any = []
      response.data.forEach((element: any) => {
        if (element.checked) {
          this.deptFormList.systemName.push(element.id)
        }
        defaultDeptData.push({
          value: element.id,
          label: element.systemName,
        })
      })
      this.defaultDeptData = defaultDeptData
      this.showDeptDialog = true
    })
  }

  // 选择子部门确认
  getAllocationDeptSysAdmin() {
    const data = {
      userIdList: [this.deptFormList.id],
      systemIdList: this.deptFormList.systemName,
    }
    getAllocationDeptSysAdmin(data).then((response: any) => {
      this.showDeptDialog = false
    })
  }

  // 选择子系统
  getSelectSysAdminListByCurrentUserForAllocationSysAdmin(id: Number) {
    this.systemFormList.id = id
    this.systemFormList.systemName = []
    getSelectSysAdminListByCurrentUserForAllocationSysAdmin({
      userId: id,
    }).then((response: any) => {
      this.defaultSystemData = []
      response.data.forEach((element: any) => {
        if (element.checked) {
          this.systemFormList.systemName.push(element.id)
        }
        this.defaultSystemData.push({
          value: element.id,
          label: element.systemName,
        })
      })
      this.showAdminDialog = true
    })
  }

  // 选择子系统确认
  getAllocationSysAdmin() {
    const data = {
      userIdList: [this.systemFormList.id],
      systemIdList: this.systemFormList.systemName,
    }
    getAllocationDeptSysAdmin(data).then((response: any) => {
      this.showAdminDialog = false
    })
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

.user {
  background: white;
  padding: dim(30) dim(20);
  position: relative;
  margin: dim(20);
  .contain {
    width: 100%;
    display: flex;
    margin-bottom: dim(40);
    .left {
      width: dim(200);
      border: dim(1) solid #eee;
    }
    .right {
      padding: 0 dim(20);
      flex: 1;
      height: 100%;
    }
  }
  .showList {
    text-align: left;
    margin-top: dim(20);
    font-size: dim(20);
    color: #606266;
    .item {
      margin-right: dim(10);
    }
  }
}
.company-content__dialog__center {
  height: 100%;
  width: 100%;
}

.components_search {
  display: flex;
  margin-bottom: dim(10);
  .el-input {
    width: dim(140);
    margin-right: dim(10);
    display: flex;
    align-items: center;
    ::v-deep .el-input__inner {
      height: dim(30) !important;
    }
    ::v-deep .el-input__suffix {
      display: flex;
      align-items: center;
    }
  }
  .el-select {
    margin-right: dim(10);
    ::v-deep .el-input__inner {
      height: dim(30) !important;
    }
    ::v-deep .el-input__suffix {
      display: flex;
      align-items: center;
    }
  }
  .el-button {
    height: 30px;
    line-height: 30px;
    padding: 0 30px;
  }
}

.components_handleList {
  display: flex;
  height: dim(36);
  margin-bottom: dim(20);
}

.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}

.tableList {
  width: 100%;
  .el-form {
    margin: dim(20) dim(20) 0 dim(20);
  }
  .el-select {
    width: 100%;
  }
  ::v-deep .el-transfer {
    text-align: left;
    .el-transfer-panel {
      width: 160px;
    }
    .el-transfer__button {
      padding: 10px;
    }
  }
}
</style>
