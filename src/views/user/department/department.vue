<template>
  <div class="page1">
    <Search :searchList="searchList" @handle-search="handleSearch"/>
    <Button :buttonList="buttonList" @handle-button="handleButton"/>
    <div class="contain">
      <div class="left">
        <NavMenu :data="navMenuData" :defaultProps="navMenuProp" @handle-navmenu="handleNavMenu"/>
      </div>
      <div class="right">
        <Table :fields="fields" :tableData="tableData.content" :tableButton="tableButton" @handle-selection-change="handleSelectionChange" @handle-table-button="handleTableButton"/>
      </div>
    </div>
    <div class="footer">
      <pagination :total="tableData.totalPages ? tableData.totalPages : 0" @pagination="currentChange" />
    </div>

    <Dialog :width="chooseTableButton.width" v-if="changeGoldDialog" :buttons="chooseTableButton.dialogButton" class="company-content__dialog" :title="chooseTableButton.title" @close="close" @button-click="buttonClick">
      <div class="company-content__dialog__center">
        <Form ref="formRefs" v-if="chooseTableButton.type === 'edit' | chooseTableButton.type === 'add'" :formData="newFormData" @handle-validate="handleValidate"/>
        <div v-if="chooseTableButton.type === 'delete' | chooseTableButton.type === 'formdelete'">是否确认删除</div>
        <Show v-if="chooseTableButton.type === 'show'" :formData="newFormData"/>
        <System v-if="chooseTableButton.type === 'system'"/>
      </div>
    </Dialog>

  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import Search from '@/views/user/components/Search/index.vue'
import Button from '@/views/user/components/Button/index.vue'
import NavMenu from '@/views/user/components/NavMenu/index.vue'
import Table from '@/views/user/components/Table/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import Dialog from '@/views/user/components/dialog/Dialog.vue'
import Form from '@/views/user/components/Form/index.vue'
import Show from './components/Show.vue'
import System from './components/System.vue'
import { departmentList, departmentListPage, departmentDetail, departmentUpdate, departmentDelete } from '@/api/department'

@Component({
    components: { Search, Button, NavMenu, Table, Pagination, Dialog, Form, Show, System }
})
export default class Page1 extends Vue {
  // table列表
  deptList = {
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
      prop: 'deptName',
      label: '部门名称'
    },
    {
      prop: 'tag',
      label: '备注'
    }
  ]
  tableData: any = {}
  tableButton = [
    {
      type: 'edit',
      name: '编辑',
      title: '编辑部门',
      buttonType: 'primary',
      dialogButton: [
        {
          type: 'primary',
          value: '确认'
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
    },
    {
      type: 'show',
      name: '显示',
      title: '显示系统信息',
      buttonType: 'info',
      dialogButton: [
        {
          type: 'primary',
          value: '关闭'
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
      key: 'deptName',
      name: '',
      placeholder: '部门名称'
    }
  ]

  // 部门树侧边栏
  navMenuData = []
  navMenuProp = {
    children: 'deptVOS',
    label: 'deptName'
  }

  // 弹窗
  chooseTableButton: any = {}
  formData: any = {
    formList: [
      {
        key: 'deptName',
        type: 'Input',
        name: '部门名称',
        data: '',
        rules: [
          { required: true, message: "请输入部门名称", trigger: "blur" }
        ]
      },
      // {
      //   key: 'father',
      //   type: 'Select',
      //   name: '父名称',
      //   data: 'yi',
      //   label: [
      //     {
      //       value: 'yi',
      //       label: '部门一',
      //     },
      //     {
      //       value: 'er',
      //       label: '部门二',
      //     }
      //   ],
      //   rules: [
      //     { required: true, message: "请输入父名称", trigger: "blur" }
      //   ]
      // },
      {
        key: 'sort',
        type: 'Input',
        name: '排序',
        data: '',
        rules: [
          { required: true, message: "请输入排序", trigger: "blur" }
        ]
      },
      {
        key: 'tag',
        type: 'Textarea',
        name: '备注',
        data: '',
        rules: [
          { required: true, message: "请输入备注", trigger: "blur" }
        ]
      }
    ]
  }
  newFormData: any = {}
  changeGoldDialog = false

  // 列表按钮控制
  buttonList = ['删除', '添加', '设置部门系统管理员']

  mounted() {
    console.log('mounted---')
    this.getUcDeptTree()
    this.getUcDeptListPage()
  }

  // table列表
  handleSelectionChange(val: any){
    console.log('handleSelectionChange---', val)
    this.selectList = val
  }
  
  // 搜索框
  handleSearch(data: any) {
    console.log('handleSearch--', data)
    data.forEach((item: any)=>{
      (this.deptList as any)[item.key] = item.name
    })
    this.getUcDeptListPage()
  }

  // 左边系统展示
  handleNavMenu(data: any) {
    console.log('handleNavMenu---', data)
    if(data.deptVOS.length <= 0){
      console.log('diaojiekou--', data.id)
      this.deptList.parentId = data.id
      this.getUcDeptListPage()
    }
  }

  // 分页选择
  currentChange(index: any) {
    console.log('currentChange---', index)
    this.deptList.pageIndex = index.page
    this.deptList.length = index.limit
    this.getUcDeptListPage()
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
        title: '添加部门',
        dialogButton: [
          {
            type: 'primary',
            value: '确认'
          }
        ]
      }
      this.newFormData = JSON.parse(JSON.stringify(this.formData))
      this.changeGoldDialog = true
    }
    // 设置管理员
    if(index === 2){
      this.chooseTableButton = {
        type: 'system',
        title: '设置系统部门管理员',
        dialogButton: [
          {
            type: 'primary',
            value: '关闭'
          }
        ]
      }
      this.changeGoldDialog = true
    }
  }

  // 弹窗
  handleTableButton(val: any, item: any){
    console.log('handleTableButton---', val)
    console.log('index---', item)
    item.id = val.id
    this.chooseTableButton = item

    if(item.type === 'edit' || item.type === 'show'){
      this.getdetailDept(val.id)
    }else{
      this.changeGoldDialog = true
    }
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
        (this.$refs.formRefs as any).submitForm()
        break
      default:
        this.changeGoldDialog = false
    }
  }

  handleShow(){
    console.log('handleShow---')
    console.log('chooseTableButton---',this.chooseTableButton)
    this.changeGoldDialog = false
  }

  handleDelete(index: any) {
    console.log('handleDelete---')
    if(index === 0){
      console.log('确认删除------')
      console.log('chooseTableButton---',this.chooseTableButton)
      this.deleteDepartment()
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
      this.deleteDepartment(idArr)
    }
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
  handleValidate(arrId?: any){
    console.log('handleValidate---')
    let submitData: any = {}
    this.updateData.formList.forEach((item: any)=>{
      submitData[item.key] = item.data
    })
    submitData.id = this.chooseTableButton.id
    this.postDepartmentUpdate(submitData)
  }

  // 监听form值变化
  updateData: any = {}
  @Watch('newFormData',{immediate: true, deep: true})
  onChangeFormData(newVal: string[], oldVal: string){
    this.updateData = newVal
    console.log('newVal----', newVal)
  }

  // 接口调取
  // 分页查询部门树
  getUcDeptTree() {
    console.log('getUcDeptTree---')
    const params = {
      pageNum: 1,
      pageSize: 1000
    }
    departmentList(params).then((response: any) => {
      console.log('jiekouhaole ---', response.data.content)
      this.navMenuData = response.data.content
    })
  }
  // 分页查询部门
  getUcDeptListPage() {
    const params = this.deptList

    console.log('params---',params)
  
    // departmentListPage(params).then((response: any) => {
    //   console.log('departmentListPage ---', response.data)
    // })

    const d = departmentListPage(params)

    console.log('d',d)
    this.tableData  = d
  }

  // 编辑按钮 回显
  getdetailDept(id: any){
    console.log('getdetailDept-----')

    departmentDetail(id).then((response: any) => {
      this.newFormData = JSON.parse(JSON.stringify(this.formData));
      this.newFormData.formList.forEach((element: any) => {
        element.data = response.data[element.key]
      })
      this.changeGoldDialog = true
    })
  }

  // 编辑提交
  postDepartmentUpdate(data: any) {
    console.log('postDepartmentUpdate-----', data)
    departmentUpdate(data).then((response: any) => {
      console.log('resopn=--', response)
      this.changeGoldDialog = false
    })
  }

  // 删除列表
  deleteDepartment(arrId?: any) {
    console.log('deleteDepartment-----')
    const id = arrId ? arrId : [this.chooseTableButton.id]
    departmentDelete(id).then((response: any) => {
      console.log('resopn=--', response)
      this.changeGoldDialog = false
    })
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
  margin: dim(20);
  .contain{
    width: 100%;
    display: flex;
    margin-bottom: dim(40);
    .left{
      width: dim(200);
      border: dim(1) solid #eee;
    }
    .right{
      padding: 0 dim(20);
      flex: 1;
      height: 100%;
    }
  }
}
.company-content__dialog__center{
  height: 100%;
  width: 100%;
}
</style>
