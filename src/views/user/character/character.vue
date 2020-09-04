<template>
  <div class="content">
    <div class="components_search">
      <el-input placeholder="角色名称" v-model="characterList.roleName" clearable></el-input>
      <el-select v-model="characterList.relSystemId" placeholder="请选择所属系统">
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
      <el-button type="primary" @click="addCharacter">添加</el-button>
      <el-button type="danger" @click="deleteCharacter()">删除</el-button>
    </div>

    <el-table
      :data="tableData.content"
      tooltip-effect="dark"
      style="width: 100%"
      row-key="id"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column prop="characterCode" align="center" label="角色标识"></el-table-column>
      <el-table-column prop="roleName" align="center" label="角色名称"></el-table-column>
      <el-table-column prop="loginCallbackUrl" align="center" label="回调地址"></el-table-column>
      <el-table-column prop="remark" align="center" label="备注"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="getSelectPermissionByRoleId(scope.row.id)"
          >分配权限</el-button>
          <el-button type="primary" size="mini" @click="getRoleDetail(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteCharacter(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
      :title="characterFormName"
      center
      :visible.sync="showCharacterDialog"
      @close="closeCharacterForm"
      width="30%"
    >
      <div class="tableList">
        <el-form ref="addForm" :model="characterFormList" :rules="rules" label-width="80px">
          <el-form-item label="所属系统" prop="relSystemId">
            <el-select v-model="characterFormList.relSystemId" placeholder="请输入所属系统">
              <el-option
                v-for="(item, index) in systemList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色名称" prop="roleName">
            <el-input placeholder="请输入角色名称" v-model="characterFormList.roleName"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input placeholder="请输入备注" v-model="characterFormList.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeCharacterForm">取 消</el-button>
        <el-button type="primary" @click="validCharacter">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="授权角色" center :visible.sync="showLimitDialog" width="40%">
      <div class="tableList">
        <el-form ref="limitForm" :model="limitFormList" label-width="100px">
          <el-form-item label="可分配权限" prop="data">
            <el-tree
              ref="treeRef"
              node-key="id"
              :show-checkbox="true"
              :data="limitFormList.data"
              :props="limitFormList.defaultProps"
              highlight-current
              default-expand-all
            ></el-tree>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCharacterDialog = false">取 消</el-button>
        <el-button type="primary" @click="getAddUcRolePermissionRelation">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { getDeptTree } from '@/api/department'
import {
  getRoleList,
  getRoleDetail,
  postRoleAdd,
  postRoleUpdate,
  postRoleDelete,
  getSelectPermissionByRoleId,
  getAddUcRolePermissionRelation,
  getSelectSysAdminListByCurrentUser,
} from '@/api/character'

import { getPermissionDetail } from '@/api/limit'

@Component
export default class character extends Vue {
  // 搜索
  systemList: any = []
  // table列表
  characterList: any = {
    pageIndex: 1,
    length: 1000,
    roleName: '',
    relCharacterId: null,
    id: null,
  }

  tableData: any = {}

  selectList = []
  characterFormName = '添加子角色'

  // form列表
  characterFormList: any = {
    id: -1,
    roleName: '',
    relSystemId: null,
    remark: '',
  }
  rules = {
    roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    relSystemId: [
      { required: true, message: '请输入所属系统', trigger: 'blur' },
    ],
    remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
  }
  defaultForm: any = {}

  limitFormList: any = {
    id: null,
    data: [1],
    defaultProps: {
      children: 'children',
      label: 'name',
    },
  }

  // 弹窗显示
  showCharacterDialog = false
  showDeleteDialog = false
  showLimitDialog = false

  mounted() {
    this.getDeptTree()
    this.getSelectSysAdminListByCurrentUser()
    this.defaultForm = JSON.parse(JSON.stringify(this.characterFormList))
  }

  // 搜索框
  handleSearch() {
    this.getRoleList()
  }

  // 添加按钮点击显示弹窗
  addCharacter() {
    this.characterFormName = '添加子角色'
    this.showCharacterDialog = !this.showCharacterDialog
  }

  // 删除按钮点击显示弹窗
  deleteCharacter(arrId?: string[]) {
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
        this.postRoleDelete(id)
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
    this.characterList.length = val
  }

  // 分页选择
  currentChange(index: number) {
    this.characterList.pageIndex = index
    this.getRoleList()
  }

  // 添加/编辑按钮 关闭弹窗
  closeCharacterForm() {
    this.characterFormList = JSON.parse(JSON.stringify(this.defaultForm))
    this.showCharacterDialog = false
  }

  // 添加/编辑角色验证
  validCharacter() {
    ;(this.$refs.addForm as any).validate((valid: any) => {
      if (valid) {
        if (this.characterFormList.id >= 0) {
          this.postRoleUpdate()
        } else {
          this.postRoleAdd()
        }
      } else {
        return false
      }
    })
  }

  // 接口调取
  // 获取角色列表
  getSelectSysAdminListByCurrentUser() {
    getSelectSysAdminListByCurrentUser().then((response: any) => {
      response.data.forEach((item: any) => {
        this.systemList.push({
          value: item.id,
          label: item.systemName,
        })
      })
    })
  }
  // 分页查询角色
  getRoleList() {
    const params = JSON.parse(JSON.stringify(this.characterList))
    params.id = Number(params.id)
    getRoleList(params).then((response: any) => {
      this.tableData = response.data
    })
  }

  // 授权角色
  getSelectPermissionByRoleId(id: number) {
    getSelectPermissionByRoleId({ id: id }).then((response: any) => {
      this.limitFormList.id = id
      this.limitFormList.data = response.data.permissionTree
      const defaultExpandKeys = response.data.haveIdList
      this.showLimitDialog = true
      if (!!response.data.haveIdList) {
        this.$nextTick(() => {
          ;(this.$refs.treeRef as any).setCheckedKeys(defaultExpandKeys)
        })
      }
    })
  }

  // 给角色授权权限
  getAddUcRolePermissionRelation() {
    const treeKeys = (this.$refs.treeRef as any).getCheckedKeys()
    const params = {
      permissionIdList: treeKeys,
      roleId: this.limitFormList.id,
    }
    getAddUcRolePermissionRelation(params).then((response: any) => {
      this.showLimitDialog = false
    })
  }

  // 编辑按钮 回显
  getRoleDetail(id: number) {
    this.characterFormList.id = id
    getRoleDetail({ id: id }).then((response: any) => {
      Object.keys(this.characterFormList).forEach((key) => {
        this.characterFormList[key] = response.data[key]
      })
      this.characterFormName = '编辑子角色'
      this.showCharacterDialog = true
    })
  }

  // 添加角色提交
  postRoleAdd() {
    postRoleAdd(this.characterFormList).then((response: any) => {
      this.getRoleList()
      this.closeCharacterForm()
    })
  }

  // 编辑提交
  postRoleUpdate() {
    postRoleUpdate(this.characterFormList).then((response: any) => {
      this.getRoleList()
      this.closeCharacterForm()
    })
  }

  // 删除列表
  postRoleDelete(arrId: string[]) {
    const id = arrId ? arrId : this.selectList
    postRoleDelete(id).then((response: any) => {
      this.$message({
        type: 'success',
        message: '删除成功!',
      })
      this.getRoleList()
    })
  }

  // 分页查询部门树
  getDeptTree() {
    const params = {
      pageNum: 1,
      pageSize: 1000,
    }
    getDeptTree(params).then((response: any) => {
      const content = this.treeData(response.data.content)
      this.limitFormList.data = content
    })
  }

  treeData(data: any) {
    data.forEach((element: any) => {
      if (element.deptVOS.length === 0) {
        element.deptVOS = undefined
      } else {
        this.treeData(element.deptVOS)
      }
    })
    return data
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
