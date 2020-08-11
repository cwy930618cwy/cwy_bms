<template>
  <div class="system">
    <Search :searchList="searchList" @handle-search="handleSearch"/>
    <Table :showSelect="false" :fields="fields" :tableData="tableData" :tableButton="tableButton" @handle-table-button="handleTableButton"/>
    <div class="footer">
      <pagination :total="50" @pagination="currentChange" />
    </div>
    <Dialog :width="chooseTableButton.width" v-if="changeGold" :buttons="chooseTableButton.dialogButton" class="company-content__dialog" :title="chooseTableButton.title" @close="close" @button-click="buttonClick">
      <div class="company-content__dialog__center">
        <Form :formData="formSystemData"/>
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import Search from '@/views/user/components/Search/index.vue'
import Table from '@/views/user/components/Table/index.vue'
import Dialog from '@/views/user/components/dialog/Dialog.vue'
import Form from '@/views/user/components/Form/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import { getUserList, getSelectSysAdminListByCurrentUser } from '@/api/department'
@Component({
  components: { Search, Table, Dialog, Form, Pagination }
})
export default class Show extends Vue {
  // table列表
  userList = {
    pageIndex: 1,
    length: 1000,
    parentId: 0,
    deptName: '',
    id: 0
  }
  fields = [
    {
      prop: 'id',
      label: 'id'
    },
    {
      prop: 'username',
      label: '用户名'
    },
    {
      prop: 'nickname',
      label: '昵称'
    },
    {
      prop: 'phone',
      label: '手机'
    },
    {
      prop: 'email',
      label: '邮箱'
    },
    {
      prop: 'gender',
      label: '性别'
    }
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
          value: '确认'
        }
      ]
    }
  ]

  // 搜索框
  searchList = [
    {
      key: 'id',
      name: '',
      placeholder: 'id'
    },
    {
      key: 'username',
      name: '',
      placeholder: '用户名'
    },
    {
      key: 'phone',
      name: '',
      placeholder: '手机'
    }
  ]

  mounted() {
    console.log('system--mounted---')
    this.getUserList()
  }

  handleSearch(data: any) {
    console.log('handleSearch--', data)
    data.forEach((item: any)=>{
      (this.userList as any)[item.key] = item.name
    })
    this.getUserList()
  }

  // 底部按钮
  currentChange(index: any) {
    console.log('currentChange---', index)
    this.userList.pageIndex = index.page
    this.userList.length = index.limit
    this.getUserList()
  }

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
        defaultdata: []
      }
    ]}
  changeGold = false
  handleTableButton(val: any, item: any){
    item.id = val.id
    this.chooseTableButton = item
    this.getSelectSysAdminListByCurrentUser()
  }

  buttonClick(index: any) {
    console.log('queren---', this.updateSystemData)
    this.getAllocationDeptSysAdmin()
  }

  close () {
    this.changeGold = false
  }

  // 监听form值变化
  updateSystemData: any = {}
  @Watch('formSystemData',{immediate: true, deep: true})
  onChangeFormData(newVal: string[], oldVal: string){
    // this.formData = Object.assign({},newVal)
    this.updateSystemData = newVal
    console.log('newVal----', newVal)
  }

  // 接口调取
  // 分页查询用户第三方信息
  getUserList() {
    console.log('getUserList---')
    
    // getUserList(this.userList).then((response: any) => {
    //   console.log('jiekouhaole ---', response)
    // })
    console.log('params---', this.userList)
    const ff = getUserList(this.userList)
    this.tableData = ff.content
  }

  // 选择子系统
  getSelectSysAdminListByCurrentUser(){
    getSelectSysAdminListByCurrentUser().then((response: any) => {
      response.data.forEach((element: any) => {
        this.formSystemData.formList[0].defaultdata.push(
          {
            label: element.systemName
          }
        )
      })
      this.changeGold = true
    })
  }

  // 选择子系统确认
  getAllocationDeptSysAdmin(){
    console.log('getAllocationDeptSysAdmin---')
    const data = {
      systemId: this.chooseTableButton.id,
      userIdList: this.updateSystemData.formList[0].data
    }
    console.log('data----====', data)
    this.changeGold = false
  }

}
</script>
<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

.system{
  width: dim(900);
  .footer{
    display: flex;
  }
  ::v-deep .el-checkbox-group{
    display: flex;
    flex-wrap: wrap;
  }
}

</style>
