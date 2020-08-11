<template>
  <div class="page1">
    <Search :searchList="searchList" @handle-search="handleSearch"/>
    <Button :buttonList="buttonList" @handle-button="handleButton"/>
    <div class="contain">
      <div class="left">
        <NavMenu @handle-navmenu="handleNavMenu"/>
      </div>
      <div class="right">
        <Table :fields="fields" :tableData="tableData" :tableButton="tableButton" @handle-selection-change="handleSelectionChange" @handle-table-button="handleTableButton"/>
      </div>
    </div>
    <div class="footer">
      <pagination :total="50" @pagination="currentChange" />
    </div>

    <Dialog :width="chooseTableButton.width" v-if="changeGoldDialog" :buttons="chooseTableButton.dialogButton" class="company-content__dialog" :title="chooseTableButton.title" @close="close" @button-click="buttonClick">
      <div class="company-content__dialog__center">
        <Form ref="formRefs" v-if="chooseTableButton.type === 'edit' | chooseTableButton.type === 'add'" :formData="newFormData" @handle-validate="handleValidate"/>
        <div v-if="chooseTableButton.type === 'delete' | chooseTableButton.type === 'formdelete'">是否确认删除</div>
        <div v-if="chooseTableButton.type === 'mima'">新手机号为后6位</div>
        <Form v-if="chooseTableButton.type === 'show'" :formData="showData"/>
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
import { departmentList, departmentListPage, departmentDetail, departmentUpdate, departmentDelete } from '@/api/department'

@Component({
    components: { Search, Button, NavMenu, Table, Pagination, Dialog, Form }
})
export default class Page1 extends Vue {
  // table列表
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
      prop: 'ihone',
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
  tableData = []
  tableButton = [
    {
      type: 'show',
      name: '授权角色',
      title: '授权角色',
      buttonType: 'info',
      dialogButton: [
        {
          type: 'primary',
          value: '确认'
        }
      ]
    },
    {
      type: 'edit',
      name: '编辑',
      title: '编辑部门',
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
      key: 'user',
      name: '',
      placeholder: '用户名'
    },
    {
      key: 'iphone',
      name: '',
      placeholder: '手机'
    }
  ]

  // 列表按钮控制
  buttonList = ['删除', '添加', '重置密码']

  // 弹窗
  chooseTableButton: any = {}
  formData: any = {
    formList: [
      {
        key: 'user',
        type: 'Input',
        name: '用户名',
        data: '',
        rules: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ]
      },
      {
        key: 'nima',
        type: 'Input',
        name: '密码',
        data: '',
        rules: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ]
      },
      {
        key: 'nicheng',
        type: 'Input',
        name: '昵称',
        data: '',
        rules: [
          { required: true, message: "请输入昵称", trigger: "blur" }
        ]
      },
      {
        key: 'shouji',
        type: 'Input',
        name: '手机',
        data: '',
        rules: [
          { required: true, message: "请输入手机", trigger: "blur" }
        ]
      },
      {
        key: 'youx',
        type: 'Input',
        name: '邮箱',
        data: '',
        rules: [
          { required: true, message: "请输入邮箱", trigger: "blur" }
        ]
      },
      // {
      //   key: 'toux',
      //   type: 'upload',
      //   name: '头像',
      //   data: '',
      //   rules: [
      //     { required: true, message: "请输入头像", trigger: "blur" }
      //   ]
      // },
      {
        key: 'bumen',
        type: 'cascader',
        name: '部门',
        data: [],
        options: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }]
        }],
        rules: [
          { required: true, message: "请输入部门", trigger: "blur" }
        ]
      },
      {
        key: 'xingbie',
        type: 'Radio',
        name: '性别',
        data: '',
        label: ['男','女'],
        rules: [
          { required: true, message: "请输入性别", trigger: "blur" }
        ]
      },
      {
        key: 'chengshi',
        type: 'Input',
        name: '城市',
        data: '',
        rules: [
          { required: true, message: "请输入城市", trigger: "blur" }
        ]
      },
      {
        key: 'zhiye',
        type: 'Input',
        name: '职业',
        data: '',
        rules: [
          { required: true, message: "请输入职业", trigger: "blur" }
        ]
      },
      {
        key: 'beizhu',
        type: 'Textarea',
        name: '备注',
        data: '',
        rules: [
          { required: true, message: "请输入备注", trigger: "blur" }
        ]
      }
    ]
  }
  showData: any = {
    formList: [
      {
        key: 'bumen',
        type: 'Select',
        name: '选择系统',
        data: 'yi',
        label: [
          {
            value: 'yi',
            label: '部门一',
          },
          {
            value: 'er',
            label: '部门二',
          }
        ],
      },
      {
        key: 'shouquan',
        type: 'transfer',
        name: '角色授权',
        defaultdata: [
          {
            key: 0,
            label: '备选项0'
          },
          {
            key: 1,
            label: '备选项1'
          },
          {
            key: 2,
            label: '备选项2'
          }
        ],
        data: []
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
        title: '添加部门',
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

      console.log('newFormData', this.newFormData)
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
      this.changeGoldDialog = true
    }
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
