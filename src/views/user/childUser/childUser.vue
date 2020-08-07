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
        <Form v-if="chooseTableButton.type === 'edit'" :formData="formData"/>
        <div v-if="chooseTableButton.type === 'delete'">是否确认删除</div>
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
      prop: 'name',
      label: '用户名'
    },
    {
      prop: 'nicheng',
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
      prop: 'address',
      label: '性别'
    }
  ]
  tableData = [{
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    date: '2016-05-01',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    date: '2016-05-08',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    date: '2016-05-06',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    date: '2016-05-07',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }]
  tableButton = [
    {
      type: 'show',
      name: '授权角色',
      title: '授权角色',
      buttonType: 'info',
      dialogButton: ['确认']
    },
    {
      type: 'edit',
      name: '编辑',
      title: '编辑部门',
      buttonType: 'primary',
      dialogButton: ['取消', '好的']
    },
    {
      type: 'delete',
      name: '删除',
      title: '确认删除',
      buttonType: 'danger',
      dialogButton: ['确认', '取消']
    }
  ]
  selectList = []
  handleSelectionChange(val: any){
    console.log('handleSelectionChange---', val)
    this.selectList = val
  }
  
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
      placeholder: '用户名'
    },
    {
      key: 'iphone',
      name: '',
      placeholder: '手机'
    }
  ]
  handleSearch(data: any) {
    console.log('handleSearch--', data)
  }

  // 左边系统展示
  handleNavMenu(data: any) {
    console.log('handleNavMenu---', data)
  }

  // 分页选择
  currentChange(index: any) {
    console.log('currentChange---', index)
  }

  // 列表按钮控制
  buttonList = ['删除', '添加', '重置密码']
  handleButton(index: any) {
    console.log('handleButton---', index)
    if(index === 0){
      this.chooseTableButton = this.tableButton[1]
      this.changeGoldDialog = true
    }
    // 添加
    if(index === 1){
      this.chooseTableButton = {
        type: 'edit',
        name: '编辑',
        title: '添加部门',
        buttonType: 'primary',
        dialogButton: ['取消', '好的']
      }
      this.changeGoldDialog = true
    }
    // 设置管理员
    if(index === 2){
      this.chooseTableButton = {
        type: 'mima',
        title: '重置密码',
        dialogButton: ['取消', '好的']
      }
      this.changeGoldDialog = true
    }
  }

  // 弹窗
  chooseTableButton = {}
  formData: any[] = [
    {
      key: 'user',
      type: 'Input',
      name: '用户名',
      data: ''
    },
    {
      key: 'bumen',
      type: 'Input',
      name: '密码',
      data: ''
    },
    {
      key: 'bumen',
      type: 'Input',
      name: '昵称',
      data: ''
    },
    {
      key: 'bumen',
      type: 'Input',
      name: '手机',
      data: ''
    },
    {
      key: 'bumen',
      type: 'Input',
      name: '邮箱',
      data: ''
    },
    {
      key: 'father',
      type: 'upload',
      name: '头像',
      data: ''
    },
    {
      key: 'paixu',
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
      }]
    },
    {
      key: 'paixu',
      type: 'Radio',
      name: '性别',
      data: '',
      label: ['男','女']
    },
    {
      key: 'paixu',
      type: 'Input',
      name: '城市',
      data: ''
    },
    {
      key: 'paixu',
      type: 'Input',
      name: '职业',
      data: ''
    },
    {
      key: 'beizhu',
      type: 'Textarea',
      name: '备注',
      data: ''
    }
  ]
  showData: any[] = [
    {
      key: 'bumen',
      type: 'Select',
      name: '选择系统',
      data: ''
    },
    {
      key: 'shouquan',
      type: 'transfer',
      name: '角色授权',
      data: [
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
      choosedata: []
    }
  ]
  changeGoldDialog = false
  handleTableButton(val: any, item: any){
    console.log('handleTableButton---', val)
    console.log('index---', item)

    this.chooseTableButton = item

    this.changeGoldDialog = true
  }

  buttonClick(index: any) {
    console.log('tijiao---', index)
    this.changeGoldDialog = false
  }

  close () {
    this.changeGoldDialog = false
  }

  // 监听form值变化
  @Watch('formData',{immediate: true, deep: true})
  onChangeFormData(newVal: string[], oldVal: string){
    // this.formData = Object.assign({},newVal)
    console.log(newVal)
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
