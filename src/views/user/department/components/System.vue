<template>
  <div class="system">
    <Search :searchList="searchList" @handle-search="handleSearch" />
    <Table
      :showSelect="false"
      :fields="fields"
      :tableData="tableData.content"
      :tableButton="tableButton"
      @handle-table-button="handleTableButton"
    />
    <div class="footer">
      <pagination
        :total="tableData.totalPages ? tableData.totalPages : 0"
        @pagination="currentChange"
      />
    </div>
    <Dialog
      :width="chooseTableButton.width"
      v-if="changeGold"
      :buttons="chooseTableButton.dialogButton"
      class="company-content__dialog"
      :title="chooseTableButton.title"
      @close="close"
      @button-click="handleDialogButton"
    >
      <div class="company-content__dialog__center">
        <Form :formData="formSystemData" />
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import Search from '@/views/user/components/Search/index.vue'
import Table from '@/views/user/components/Table/index.vue'
import Dialog from '@/views/user/components/dialog/Dialog.vue'
import Form from '@/views/user/components/Form/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import {
  postUserList,
  getSelectSysAdminListByCurrentUser,
  getAllocationDeptSysAdmin,
} from '@/api/department'
@Component({
  components: { Search, Table, Dialog, Form, Pagination },
})
export default class Show extends Vue {
  @Prop({ default: () => [] }) parentId!: any

  // table列表
  userList = {
    pageIndex: 1,
    length: 1000,
    deptId: 0,
  }
  fields = [
    {
      prop: 'id',
      label: 'id',
    },
    {
      prop: 'username',
      label: '用户名',
    },
    {
      prop: 'nickname',
      label: '昵称',
    },
    {
      prop: 'phone',
      label: '手机',
    },
    {
      prop: 'email',
      label: '邮箱',
    },
    {
      prop: 'gender',
      label: '性别',
    },
  ]
  tableData: any = []
  tableButton = [
    {
      type: 'edit',
      name: '选择子系统',
      title: '选择子系统',
      buttonType: 'primary',
      dialogButton: [
        {
          type: 'primary',
          value: '确认',
        },
      ],
    },
  ]

  // 搜索框
  searchList = [
    {
      type: 'Input',
      key: 'username',
      name: '',
      placeholder: '用户名',
    },
    {
      type: 'Input',
      key: 'phone',
      name: '',
      placeholder: '手机',
    },
  ]

  // 弹窗
  chooseTableButton: any = {}
  formSystemData: any = {
    formList: [
      {
        key: 'bumen',
        type: 'Checkbox',
        name: '所属系统',
        data: [],
        rules: [],
        defaultdata: [],
      },
    ],
  }
  changeGold = false

  mounted() {
    this.postUserList()
  }

  // 搜索框
  handleSearch(data: any) {
    data.forEach((item: any) => {
      ;(this.userList as any)[item.key] = item.name
    })
    this.postUserList()
  }

  // 分页选择
  currentChange(index: any) {
    this.userList.pageIndex = index.page
    this.userList.length = index.limit
    this.postUserList()
  }

  // table点击弹窗
  handleTableButton(val: any, item: any) {
    item.id = val.id
    this.chooseTableButton = item
    this.getSelectSysAdminListByCurrentUser()
  }

  // 弹窗按钮点击
  handleDialogButton() {
    this.getAllocationDeptSysAdmin()
  }

  close() {
    this.changeGold = false
  }

  // 监听form值变化
  updateSystemData: any = {}
  @Watch('formSystemData', { immediate: true, deep: true })
  onChangeFormData(newVal: string[], oldVal: string) {
    this.updateSystemData = newVal
  }

  // 接口调取
  // 分页查询用户第三方信息
  postUserList() {
    this.userList.deptId = this.parentId
    postUserList(this.userList).then((response: any) => {
      this.tableData = response.data
    })
  }

  // 选择子系统
  getSelectSysAdminListByCurrentUser() {
    getSelectSysAdminListByCurrentUser().then((response: any) => {
      this.formSystemData.formList[0].defaultdata = []
      response.data.forEach((element: any) => {
        this.formSystemData.formList[0].defaultdata.push({
          value: element.id,
          label: element.systemName,
        })
      })
      console.log(this.formSystemData.formList)
      this.changeGold = true
    })
  }

  // 选择子系统确认
  getAllocationDeptSysAdmin() {
    const data = {
      userIdList: [this.chooseTableButton.id],
      systemIdList: this.updateSystemData.formList[0].data,
    }
    getAllocationDeptSysAdmin(data).then((response: any) => {
      this.changeGold = false
    })
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

.system {
  width: dim(900);
  .footer {
    display: flex;
  }
  ::v-deep .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
