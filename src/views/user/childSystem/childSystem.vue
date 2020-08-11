<template>
  <div class="page1">
    <Search :searchList="searchList" @handle-search="handleSearch"/>
    <Button :buttonList="buttonList" @handle-button="handleButton"/>
    <div class="contain">
      <div class="right">
        <Table :fields="fields" :tableData="tableData" :tableButton="tableButton" @handle-selection-change="handleSelectionChange" @handle-table-button="handleTableButton"/>
      </div>
    </div>
    <div class="footer">
      <pagination :total="50" @pagination="currentChange" />
    </div>

    <Dialog :width="chooseTableButton.width" v-if="changeGoldDialog" :buttons="chooseTableButton.dialogButton" class="company-content__dialog" :title="chooseTableButton.title" @close="close" @button-click="buttonClick">
      <div class="company-content__dialog__center">
        <Form ref="formRefs" v-if="chooseTableButton.type === 'edit' | chooseTableButton.type === 'add'" :formData="formData" @handle-validate="handleValidate"/>
        <div v-if="chooseTableButton.type === 'delete' | chooseTableButton.type === 'formdelete'">是否确认删除</div>
        <System v-if="chooseTableButton.type === 'system'"/>
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
import System from './components/System.vue'

@Component({
    components: { Search, Button, Table, Pagination, Dialog, Form, System }
})
export default class Page1 extends Vue {
  // table列表
  fields = [
    {
      prop: 'id',
      label: 'id'
    },
    {
      prop: 'biaoshi',
      label: '系统标识'
    },
    {
      prop: 'name',
      label: '系统名称'
    },
    {
      prop: 'address',
      label: '回调地址'
    },
    {
      prop: 'beizhu',
      label: '备注'
    },
  ]
  tableData = [{
    id: 1,
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    id: 2,
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    id: 3,
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    id: 4,
    date: '2016-05-01',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    id: 5,
    date: '2016-05-08',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    id: 6,
    date: '2016-05-06',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    id: 7,
    date: '2016-05-07',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }]
  tableButton = [
    {
      type: 'edit',
      name: '编辑',
      title: '编辑子系统',
      buttonType: 'primary',
      dialogButton: [
        {
          type: 'primary',
          value: '确认'
        },
        {
          type: 'info',
          value: '取消'
        }
      ]
    },
    {
      type: 'delete',
      name: '删除',
      title: '确认删除',
      buttonType: 'danger',
      dialogButton: [
        {
          type: 'primary',
          value: '确认'
        },
        {
          type: 'info',
          value: '取消'
        }
      ]
    }
  ]
  selectList = []

  // 搜索框
  searchList = [
    {
      key: 'id',
      name: '',
      placeholder: 'id'
    },
    {
      key: 'bumen',
      name: '',
      placeholder: '系统名称'
    },
    {
      key: 'biaoshi',
      name: '',
      placeholder: '设置标识'
    }
  ]

  // 列表按钮控制
  buttonList = ['删除', '添加', '设置管理员']

  // 弹窗
  chooseTableButton: any = {}
  formData: any = {
    formList: [
      {
        key: 'bumen',
        type: 'Input',
        name: '系统标识',
        data: ''
      },
      {
        key: 'name',
        type: 'Input',
        name: '系统名称',
        data: ''
      },
      {
        key: 'address',
        type: 'Input',
        name: '回调地址',
        data: ''
      },
      {
        key: 'beizhu',
        type: 'Textarea',
        name: '备注',
        data: ''
      }
    ]
  }
  newFormData: any = {}
  changeGoldDialog = false

  // table列表
  handleSelectionChange(val: any){
    console.log('handleSelectionChange---', val)
    this.selectList = val
  }
  
  // 搜索框
  handleSearch(data: any) {
    console.log('handleSearch--', data)
    let submitData: any = {}
    data.forEach((item: any)=>{
      submitData[item.key] = item.name
    })
    console.log('submitData---', submitData)
  }

  // 左边系统展示
  handleNavMenu(data: any) {
    console.log('handleNavMenu---', data)
    if(!data.children){
      console.log('diaojiekou--')
    }
  }

  // 分页选择
  currentChange(index: any) {
    console.log('currentChange---', index)
  }

  // 列表按钮控制
  handleButton(index: any) {
    console.log('handleButton---', index)
    if(index === 0){
      this.chooseTableButton = {
        type: 'formdelete',
        name: '删除',
        title: '确认删除',
        dialogButton: [
          {
            type: 'primary',
            value: '确认'
          },
          {
            type: 'info',
            value: '取消'
          }
        ]
      },
      this.changeGoldDialog = true
    }
    // 添加
    if(index === 1){
      this.chooseTableButton = {
        type: 'add',
        name: '添加',
        title: '添加子系统',
        buttonType: 'primary',
        dialogButton: [
          {
            type: 'primary',
            value: '确认'
          },
          {
            type: 'info',
            value: '取消'
          }
        ]
      }
      this.newFormData = JSON.parse(JSON.stringify(this.formData))
      this.changeGoldDialog = true
    }
    // 设置管理员
    if(index === 2){
      this.chooseTableButton = {
        type: 'mima',
        title: '重置密码',
        dialogButton: [
          {
            type: 'primary',
            value: '确认'
          },
          {
            type: 'info',
            value: '取消'
          }
        ]
      }
    }
    this.changeGoldDialog = true

    console.log('newFormData', this.newFormData)
  }

  // 弹窗
  handleTableButton(val: any, item: any){
    console.log('handleTableButton---', val)
    console.log('index---', item)
    this.newFormData = JSON.parse(JSON.stringify(this.formData));
    item.id = val.id
    this.chooseTableButton = item
    this.changeGoldDialog = true
  }

  buttonClick(index: any) {
    console.log('tijiao---', index)
    const type = this.chooseTableButton.type

    console.log(type)
    switch(type)
    {
      case 'show':
        this.handleShow()
        break
      case 'edit':
        (this.$refs.formRefs as any).submitForm()
        break
      case 'delete':
        this.handleDelete(index)
        break
      case 'formdelete':
        this.handleFormdelete(index)
        break
      case 'add':
        this.handleFormAdd()
        break
      default:
        this.changeGoldDialog = false
    }
  }

  handleShow(){
    console.log('handleShow---')
    console.log('chooseTableButton---',this.chooseTableButton)
    console.log('updateShowData---',this.updateShowData)
    let submitData: any = {}
    this.updateShowData.formList.forEach((item: any)=>{
      submitData[item.key] = item.data
    })

    console.log(submitData)
    this.changeGoldDialog = false
  }

  handleDelete(index: any) {
    console.log('handleDelete---')
    if(index === 0){
      console.log('确认删除------')
      console.log('chooseTableButton---',this.chooseTableButton)
    }
    this.changeGoldDialog = false
  }

  handleFormdelete(index: any) {
    console.log('handleFormdelete---')
    if(index === 0){
      let idArr: any = []
      this.selectList.forEach((item: any)=>{
        idArr.push(item.id)
      })
      console.log('selectList',this.selectList)
      console.log('确认删除------', idArr)
    }
    this.changeGoldDialog = false
  }

  handleFormAdd() {
    console.log('handleFormAdd---')

    console.log('handleValidate----hhhh', this.updateData)
    let submitData: any = {}
    this.updateData.formList.forEach((item: any)=>{
      submitData[item.key] = item.data
    })

    console.log(submitData)
  }

  close () {
    this.changeGoldDialog = false
  }

  // 提交操作
  handleValidate(){
    console.log('chooseTableButton---',this.chooseTableButton)
    console.log('handleValidate----hhhh', this.updateData)
    let submitData: any = {}
    this.updateData.formList.forEach((item: any)=>{
      submitData[item.key] = item.data
    })

    console.log('submitData0---')
    // this.changeGoldDialog = false
    console.log(submitData)
  }

  // 监听form值变化
  updateData: any = {}
  @Watch('newFormData',{immediate: true, deep: true})
  onChangeFormData(newVal: string[], oldVal: string){
    this.updateData = newVal
    console.log('newVal----', newVal)
  }

  updateShowData: any = {}
  @Watch('showData',{immediate: true, deep: true})
  onChangeFormShowData(newVal: string[], oldVal: string){
    this.updateShowData = newVal
    console.log('newVal----', newVal)
  }

}
</script>
<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

.page1{
  background: white;
  padding: dim(30) dim(20);
  position: relative;
  .contain{
    width: 100%;
    display: flex;
    margin-bottom: dim(40);
    .left{
      width: dim(160);
      border: dim(1) solid #eee;
    }
    .right{
      padding: 0 dim(20);
      flex: 1;
      height: 100%;
    }
  }
}
</style>
