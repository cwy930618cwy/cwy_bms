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
        <Form v-if="chooseTableButton.type === 'show'" :formData="showData"/>
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

@Component({
    components: { Search, Button, Table, Pagination, Dialog, Form }
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
      label: '角色名称'
    },
    {
      prop: 'name',
      label: '所属系统'
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
      type: 'show',
      name: '分配权限',
      title: '分配权限',
      buttonType: 'primary',
      dialogButton: ['取消', '好的']
    },
    {
      type: 'edit',
      name: '编辑',
      title: '编辑角色',
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
      placeholder: '角色名称'
    },
    {
      key: 'biaoshi',
      name: '',
      placeholder: '所属系统'
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
  buttonList = ['删除', '添加']
  handleButton(index: any) {
    console.log('handleButton---', index)
    if(index === 0){
      this.chooseTableButton = this.tableButton[2]
      this.changeGoldDialog = true
    }
    // 添加
    if(index === 1){
      this.chooseTableButton = {
        type: 'edit',
        name: '编辑',
        title: '添加角色',
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
      type: 'Select',
      name: '所属系统',
      data: ''
    },
    {
      key: 'name',
      type: 'Input',
      name: '角色名称',
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
      type: 'tree',
      showCheckBox: true,
      name: '分配权限',
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultData: {
        children: 'children',
        label: 'label'
      }
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
