<template>
  <div class="page1">
    <Search :searchList="searchList" @handle-search="handleSearch" />
    <Button :buttonList="buttonList" @handle-button="handleButton" />
    <div class="contain">
      <div class="right">
        <Table
          :fields="fields"
          :tableData="tableData.content"
          :tableButton="tableButton"
          @handle-selection-change="handleSelectionChange"
          @handle-table-button="handleTableButton"
        />
      </div>
    </div>
    <div class="footer">
      <pagination
        :total="tableData.totalPages ? tableData.totalPages : 0"
        @pagination="currentChange"
      />
    </div>

    <Dialog
      :width="chooseTableButton.width"
      v-if="changeGoldDialog"
      :buttons="chooseTableButton.dialogButton"
      class="company-content__dialog"
      :title="chooseTableButton.title"
      @close="close"
      @button-click="handleDialogButton"
    >
      <div class="company-content__dialog__center">
        <Form
          ref="formRefs"
          v-if="chooseTableButton.type === 'edit' | chooseTableButton.type === 'add'"
          :formData="newFormData"
          @handle-validate="handleValidate"
        />
        <div
          v-if="chooseTableButton.type === 'delete' | chooseTableButton.type === 'formdelete'"
        >是否确认删除</div>
        <Form
          ref="showRefs"
          v-if="chooseTableButton.type === 'allocation'"
          :formData="showData"
          @getCheckedKeys="handleCheckedKeys"
        />
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import Search from '@/views/user/components/Search/index.vue'
import Button from '@/views/user/components/Button/index.vue'
import Table from '@/views/user/components/Table/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import Dialog from '@/views/user/components/dialog/Dialog.vue'
import Form from '@/views/user/components/Form/index.vue'
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

@Component({
  components: { Search, Button, Table, Pagination, Dialog, Form },
})
export default class Page1 extends Vue {
  // table列表
  deptList = {
    pageIndex: 1,
    length: 1000,
  }
  fields = [
    {
      prop: 'id',
      label: 'id',
    },
    {
      prop: 'roleName',
      label: '角色名称',
    },
    {
      prop: 'relSystemId',
      label: '所属系统',
    },
    {
      prop: 'remark',
      label: '备注',
    },
  ]
  tableData: any = {}
  tableButton = [
    {
      type: 'allocation',
      name: '分配权限',
      title: '分配权限',
      buttonType: 'primary',
      dialogButton: [
        {
          type: 'primary',
          value: '确认',
        },
      ],
    },
    {
      type: 'edit',
      name: '编辑',
      title: '编辑角色',
      buttonType: 'primary',
      dialogButton: [
        {
          type: 'primary',
          value: '确认',
        },
        {
          type: 'info',
          value: '取消',
        },
      ],
    },
    {
      type: 'delete',
      name: '删除',
      title: '确认删除',
      buttonType: 'danger',
      dialogButton: [
        {
          type: 'primary',
          value: '确认',
        },
        {
          type: 'info',
          value: '取消',
        },
      ],
    },
  ]
  selectList = []

  // 搜索框
  searchList: any = [
    {
      type: 'Input',
      key: 'roleName',
      name: '',
      placeholder: '角色名称',
    },
    {
      key: 'relSystemId',
      type: 'Select',
      name: '',
      placeholder: '请选择所属系统',
      label: [],
    },
  ]

  // 列表按钮控制
  buttonList = [
    {
      key: 'delete',
      name: '删除',
    },
    {
      key: 'add',
      name: '添加',
    },
  ]

  // 弹窗
  chooseTableButton: any = {}
  formData: any = {
    formList: [
      {
        key: 'relSystemId',
        type: 'Select',
        name: '所属系统',
        data: '',
        label: [],
      },
      {
        key: 'roleName',
        type: 'Input',
        name: '角色名称',
        data: '',
        placeholder: '请输入角色名称',
        rules: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
      },
      {
        key: 'remark',
        type: 'Textarea',
        name: '备注',
        data: '',
        placeholder: '请输入备注',
        rules: [{ required: true, message: '请输入备注', trigger: 'blur' }],
      },
    ],
  }
  showData: any = {
    formList: [
      {
        key: 'fatherName',
        type: 'tree',
        showCheckBox: true,
        name: '分配权限',
        data: [],
        defaultExpandKeys: [0],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
      },
    ],
  }
  newFormData: any = {}
  changeGoldDialog = false

  mounted() {
    this.getSelectSysAdminListByCurrentUser()
  }

  // 分页选择当前页
  handleSelectionChange(val: any) {
    this.selectList = val
  }

  // 搜索框
  handleSearch(data: any) {
    data.forEach((item: any) => {
      ;(this.deptList as any)[item.key] = item.name
    })
    this.getRoleList()
  }

  // 分页选择
  currentChange(index: any) {
    this.deptList.pageIndex = index.page
    this.deptList.length = index.limit
    this.getRoleList()
  }

  // 总体按钮点击弹窗
  handleButton(type: any) {
    if (type === 'delete') {
      if (this.selectList.length === 0) {
        this.$message({
          message: '请选择至少一名用户',
          type: 'warning',
        })
        return
      }
      ;(this.chooseTableButton = {
        type: 'formdelete',
        name: '删除',
        title: '确认删除',
        dialogButton: [
          {
            type: 'primary',
            value: '确认',
          },
          {
            type: 'info',
            value: '取消',
          },
        ],
      }),
        (this.changeGoldDialog = true)
    }
    // 添加
    if (type === 'add') {
      this.chooseTableButton = {
        type: 'add',
        name: '添加',
        title: '添加部门',
        dialogButton: [
          {
            type: 'primary',
            value: '确认',
          },
        ],
      }
      this.newFormData = JSON.parse(JSON.stringify(this.formData))
      this.changeGoldDialog = true
    }
  }

  // table点击弹窗
  handleTableButton(val: any, item: any) {
    item.id = val.id
    this.chooseTableButton = item

    if (item.type === 'allocation') {
      this.getSelectPermissionByRoleId(val.id)
    } else if (item.type === 'edit') {
      this.getRoleDetail(val.id)
    } else {
      this.changeGoldDialog = true
    }
  }

  // 弹窗按钮点击
  handleDialogButton(index: any) {
    const type = this.chooseTableButton.type
    switch (type) {
      case 'allocation':
        this.handleAllocation()
        break
      case 'edit':
        ;(this.$refs.formRefs as any).submitForm()
        break
      case 'delete':
        this.handleDelete(index)
        break
      case 'formdelete':
        this.handleFormdelete(index)
        break
      case 'add':
        ;(this.$refs.formRefs as any).submitForm()
        break
      default:
        this.changeGoldDialog = false
    }
  }

  // 总体删除按钮
  handleFormdelete(index: any) {
    if (index === 0) {
      let idArr: any = []
      this.selectList.forEach((item: any) => {
        idArr.push(item.id)
      })
      this.postRoleDelete(idArr)
    }
  }

  // 编辑/添加提交操作
  handleValidate(arrId?: any) {
    let submitData: any = {}
    this.updateData.formList.forEach((item: any) => {
      submitData[item.key] = item.data
    })
    if (this.chooseTableButton.id) {
      submitData.id = this.chooseTableButton.id
      this.postRoleUpdate(submitData)
    } else {
      this.postRoleAdd(submitData)
    }
  }

  // 分配权限
  handleAllocation() {
    ;(this.$refs.showRefs as any).getCheckedKeys()
  }

  // table删除单个角色
  handleDelete(index: any) {
    if (index === 0) {
      this.postRoleDelete()
    } else {
      this.changeGoldDialog = false
    }
  }

  // 树组件回调
  handleCheckedKeys(treeData: any) {
    this.getAddUcRolePermissionRelation(treeData)
  }

  close() {
    this.changeGoldDialog = false
  }

  // 监听form值变化
  updateData: any = {}
  @Watch('newFormData', { immediate: true, deep: true })
  onChangeFormData(newVal: string[], oldVal: string) {
    this.updateData = newVal
  }

  updateShowData: any = {}
  @Watch('showData', { immediate: true, deep: true })
  onChangeFormShowData(newVal: string[], oldVal: string) {
    this.updateShowData = newVal
  }

  // 接口调取
  // 获取角色列表
  getSelectSysAdminListByCurrentUser() {
    getSelectSysAdminListByCurrentUser().then((response: any) => {
      this.searchList[1].name = response.data[0].id
      response.data.forEach((item: any) => {
        this.searchList[1].label.push({
          value: item.id,
          label: item.systemName,
        })
      })
      this.formData.formList[0].data = response.data[0].id
      this.formData.formList[0].label = this.searchList[1].label
    })
  }
  // 分页查询角色
  getRoleList() {
    getRoleList(this.deptList).then((response: any) => {
      this.tableData = response.data
    })
  }

  // 授权角色
  getSelectPermissionByRoleId(data: any) {
    getSelectPermissionByRoleId({ id: data }).then((response: any) => {
      this.showData.formList[0].data = response.data.permissionTree
      const defaultExpandKeys = response.data.haveIdList
      this.changeGoldDialog = true
      if (!!response.data.haveIdList) {
        this.$nextTick(() => {
          ;(this.$refs.showRefs as any).setCheckedKeys(defaultExpandKeys)
        })
      }
    })
  }

  // 给角色授权权限
  getAddUcRolePermissionRelation(data: any) {
    const params = {
      permissionIdList: data,
      roleId: this.chooseTableButton.id,
    }
    getAddUcRolePermissionRelation(params).then((response: any) => {
      this.changeGoldDialog = false
    })
  }

  // 编辑按钮 回显
  getRoleDetail(data: any) {
    getRoleDetail({ id: data }).then((response: any) => {
      this.newFormData = JSON.parse(JSON.stringify(this.formData))
      this.newFormData.formList.forEach((element: any) => {
        element.data = response.data[element.key]
      })
      this.changeGoldDialog = true
    })
  }

  // 添加角色提交
  postRoleAdd(data: any) {
    postRoleAdd(data).then((response: any) => {
      this.getRoleList()
      this.changeGoldDialog = false
    })
  }

  // 编辑提交
  postRoleUpdate(data: any) {
    postRoleUpdate(data).then((response: any) => {
      this.getRoleList()
      this.changeGoldDialog = false
    })
  }

  // 删除列表
  postRoleDelete(arrId?: any) {
    const id = arrId ? arrId : [this.chooseTableButton.id]
    postRoleDelete(id).then((response: any) => {
      this.getRoleList()
      this.changeGoldDialog = false
    })
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

.page1 {
  background: white;
  padding: dim(30) dim(20);
  position: relative;
  .contain {
    width: 100%;
    display: flex;
    margin-bottom: dim(40);
    .left {
      width: dim(160);
      border: dim(1) solid #eee;
    }
    .right {
      padding: 0 dim(20);
      flex: 1;
      height: 100%;
    }
  }
}
</style>
