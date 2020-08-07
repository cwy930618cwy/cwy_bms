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
        <Form v-if="chooseTableButton.type === 'edit'" :formData="formData"/>
        <div v-if="chooseTableButton.type === 'delete'">是否确认删除</div>
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
      type: 'edit',
      name: '编辑',
      title: '编辑子系统',
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
      placeholder: '系统名称'
    },
    {
      key: 'biaoshi',
      name: '',
      placeholder: '设置标识'
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
  buttonList = ['删除', '添加', '设置管理员']
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
        title: '添加子系统',
        buttonType: 'primary',
        dialogButton: ['取消', '好的']
      }
      this.changeGoldDialog = true
    }
    // 设置管理员
    if(index === 2){
      this.chooseTableButton = {
        type: 'system',
        title: '设置管理员',
        dialogButton: ['关闭']
      }
      this.changeGoldDialog = true
    }
  }

  // 弹窗
  chooseTableButton = {}
  formData: any[] = [
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
