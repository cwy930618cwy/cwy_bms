<template>
  <div class="content">
    <div class="components_search">
      <el-input placeholder="权限名称" v-model="limitList.name" clearable></el-input>
      <el-input placeholder="权限标识" v-model="limitList.value" clearable></el-input>
      <el-select v-model="limitList.relSystemId" @change="handleSystem" placeholder="请选择所属系统">
        <el-option
          v-for="(item, index) in systemList"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button @click="handleSearch">搜索</el-button>
    </div>
    <div class="components_handleList">
      <el-button type="primary" @click="addLimit">添加</el-button>
      <el-button type="danger" @click="deleteLimit()">删除</el-button>
    </div>

    <div class="contain">
      <div class="left">
        <el-tree
          node-key="id"
          ref="treeRef"
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
          <el-table-column align="center" type="selection"></el-table-column>
          <el-table-column prop="name" align="center" label="权限名称"></el-table-column>
          <el-table-column prop="value" align="center" label="权限值"></el-table-column>
          <el-table-column prop="enabled" align="center" label="启用状态">
            <template slot-scope="scope">
              <el-switch
                :value="scope.row.enabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeSourcePublice(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="remark" align="center" label="备注"></el-table-column>
          <el-table-column fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="getPermissionDetail(scope.row.id)">编辑</el-button>
              <el-button type="danger" size="mini" @click="deleteLimit(scope.row.id)">删除</el-button>
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
      :title="limitFormName"
      center
      :visible.sync="showAddDialog"
      @close="closeLimitForm"
      width="30%"
    >
      <div class="tableList">
        <el-form ref="addForm" :model="limitFormList" :rules="rules" label-width="80px">
          <el-form-item label="所属系统">
            <span>{{limitList.relSystemName}}</span>
          </el-form-item>
          <el-form-item label="权限名称" prop="name">
            <el-input placeholder="请输入权限名称" v-model="limitFormList.name"></el-input>
          </el-form-item>
          <el-form-item label="权限值" prop="value">
            <el-input placeholder="请输入权限值" v-model="limitFormList.value"></el-input>
          </el-form-item>
          <el-form-item label="父级权限">
            <span>{{limitList.parentName}}</span>
          </el-form-item>
          <el-form-item label="权限类型" prop="type">
            <el-radio-group v-model="limitFormList.type">
              <el-radio
                :label="item.label"
                v-for="(item, index) in activeRadio"
                :key="index"
              >{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="前端路径" prop="uri">
            <el-input placeholder="请输入前端路径" v-model="limitFormList.uri"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input placeholder="请输入图标" v-model="limitFormList.icon"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input placeholder="请输入备注" v-model="limitFormList.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeLimitForm">取 消</el-button>
        <el-button type="primary" @click="validLimit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import {
  getPermissionList,
  getPermissionDetail,
  postPermissionAdd,
  postPermissionUpdate,
  postPermissionDelete,
  getSelectAllPermissionTreeBySubSysId,
  postDoEnable,
  postDoDeactivate,
} from '@/api/limit'
import {
  getSelectPermissionByRoleId,
  getSelectAllSysListByCurrentUser,
} from '@/api/character'

@Component({
  components: {},
})
export default class limit extends Vue {
  // 搜索
  systemList: any = []
  // 部门树侧边栏
  navMenuData: any = [
    {
      name: '根',
      children: [],
    },
  ]
  navMenuProp = {
    children: 'children',
    label: 'name',
  }
  // table列表
  limitList: any = {
    pageIndex: 1,
    length: 1000,
    name: '',
    value: '',
    relSystemId: null,
    id: null,
    parentName: '根',
  }

  tableData: any = {}

  selectList = []
  limitFormName = '添加权限'

  // form列表
  limitFormList: any = {
    id: -1,
    name: '',
    value: '',
    type: 0,
    uri: '',
    icon: '',
    remark: '',
  }
  defaultForm: any = {}

  rules = {
    name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
    value: [{ required: true, message: '请输入权限值', trigger: 'blur' }],
    type: [{ required: true, message: '请输入权限类型', trigger: 'blur' }],
    uri: [{ required: true, message: '请输入前端路径', trigger: 'blur' }],
    icon: [{ required: true, message: '请输入图标', trigger: 'blur' }],
    remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
  }

  activeRadio = [
    {
      name: '目录',
      label: 0,
    },
    {
      name: '菜单',
      label: 1,
    },
    {
      name: '按钮',
      label: 2,
    },
  ]

  // 弹窗显示
  showAddDialog = false
  showDeleteDialog = false

  mounted() {
    this.getSelectAllSysListByCurrentUser()
    this.defaultForm = JSON.parse(JSON.stringify(this.limitFormList))
  }

  // 切换系统
  handleSystem(id: number) {
    this.limitList.relSystemName = this.systemList.find(
      (item: any) => item.value == id
    ).label
  }

  // 搜索框
  handleSearch() {
    this.getSelectAllPermissionTreeBySubSysId(this.limitList.relSystemId)
  }

  // 左边系统展示
  handleNavMenu(data: any) {
    this.limitList.parentName = data.name
    this.limitList.parentId = data.id
    if (!!this.limitList.relSystemId) {
      this.getPermissionList()
    }
  }

  // 添加按钮点击显示弹窗
  addLimit() {
    console.log('this.limitList.relSystemId', this.limitList.relSystemId)
    if (
      this.limitList.relSystemId >= 0 &&
      this.limitList.relSystemId !== null
    ) {
      this.limitFormName = '添加权限'
      this.showAddDialog = !this.showAddDialog
    } else {
      this.$message({
        message: '请选择系统',
        type: 'warning',
      })
    }
  }

  // 删除按钮点击显示弹窗
  deleteLimit(arrId?: string[]) {
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
        this.postPermissionDelete(id)
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
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
    this.limitList.length = val
  }

  // 分页选择
  currentChange(index: number) {
    this.limitList.pageIndex = index
    this.getPermissionList()
  }

  // 添加/编辑按钮 关闭弹窗
  closeLimitForm() {
    this.limitFormList = JSON.parse(JSON.stringify(this.defaultForm))
    this.showAddDialog = false
  }

  // 添加/编辑系统验证
  validLimit() {
    ;(this.$refs.addForm as any).validate((valid: any) => {
      if (valid) {
        if (this.limitFormList.id >= 0) {
          this.postPermissionUpdate()
        } else {
          this.postPermissionAdd()
        }
      } else {
        return false
      }
    })
  }

  // 接口调取
  // 获取权限列表
  getSelectAllSysListByCurrentUser() {
    getSelectAllSysListByCurrentUser().then((response: any) => {
      response.data.forEach((item: any) => {
        this.systemList.push({
          value: item.id,
          label: item.systemName,
        })
      })
    })
  }
  // 分页查询权限
  getPermissionList() {
    const params = JSON.parse(JSON.stringify(this.limitList))
    params.id = Number(params.id)
    getPermissionList(params).then((response: any) => {
      const tableData = response.data
      tableData.content.forEach((element: any) => {
        element.enabled = !!element.enabled
      })
      this.tableData = tableData
    })
  }

  // 编辑按钮 回显
  getPermissionDetail(id: number) {
    const self = this
    this.limitFormList.id = id
    getPermissionDetail({ id: id }).then((response: any) => {
      Object.keys(this.limitFormList).forEach((key) => {
        this.limitFormList[key] = response.data[key]
      })
      this.limitFormName = '编辑权限'
      this.showAddDialog = true
    })
  }

  // 添加权限提交
  postPermissionAdd() {
    this.limitFormList.relSystemId = this.limitList.relSystemId
    this.limitFormList.parentId = this.limitList.parentId
    postPermissionAdd(this.limitFormList).then((response: any) => {
      this.getPermissionList()
      this.closeLimitForm()
    })
  }

  // 编辑提交
  postPermissionUpdate() {
    this.limitFormList.relSystemId = this.limitList.relSystemId
    this.limitFormList.parentId = this.limitList.parentId
    postPermissionUpdate(this.limitFormList).then((response: any) => {
      this.getPermissionList()
      this.closeLimitForm()
    })
  }

  // 删除列表
  postPermissionDelete(arrId: string[]) {
    const id = arrId ? arrId : this.selectList
    postPermissionDelete(id).then((response: any) => {
      this.$message({
        type: 'success',
        message: '删除成功!',
      })
      this.getPermissionList()
    })
  }

  // 添加根据系统id获取权限树
  getSelectAllPermissionTreeBySubSysId(id: any) {
    getSelectAllPermissionTreeBySubSysId({ id: id }).then((response: any) => {
      this.navMenuData[0].children = response.data
    })
  }

  // 发布状态
  changeSourcePublice(item: any) {
    if (item.enabled) {
      postDoDeactivate([item.id]).then((response: any) => {
        this.getPermissionList()
      })
    } else {
      postDoEnable([item.id]).then((response: any) => {
        this.getPermissionList()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

.content {
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

.company-content__dialog__center {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: dim(30) 0;
}
.company-content__dialog__input {
  width: dim(300);
  height: dim(40);
  padding: 0 dim(14);
}
.table {
  &__image {
    height: 100px;
    width: 100px;
    img {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
