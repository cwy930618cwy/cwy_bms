<template>
  <div class="system">
    <Search :searchList="searchList" @handle-search="handleSearch"/>
    <Table :showSelect="false" :fields="fields" :tableData="tableData" :tableButton="tableButton" @handle-table-button="handleTableButton"/>
    <Dialog :width="chooseTableButton.width" v-if="changeGold" :buttons="chooseTableButton.dialogButton" class="company-content__dialog" :title="chooseTableButton.title" @close="close" @button-click="buttonClick">
      <div class="company-content__dialog__center">
        <Form :formData="formData"/>
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Search from '@/views/user/components/Search/index.vue'
import Table from '@/views/user/components/Table/index.vue'
import Dialog from '@/views/user/components/dialog/Dialog.vue'
import Form from '@/views/user/components/Form/index.vue'
@Component({
  components: { Search, Table, Dialog, Form }
})
export default class Show extends Vue {
  // table列表
  fields = [
    {
      prop: 'date',
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
      prop: 'shouji',
      label: '手机'
    },
    {
      prop: 'youxiang',
      label: '邮箱'
    },
    {
      prop: 'xingbie',
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
  }]
  tableButton = [
    {
      type: 'edit',
      name: '选择子系统',
      title: '选择子系统',
      buttonType: 'primary',
      dialogButton: ['确认']
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
      key: 'yonghuming',
      name: '',
      placeholder: '用户名'
    },
    {
      key: 'shouji',
      name: '',
      placeholder: '手机'
    }
  ]

  handleSearch() {

  }


  // 弹窗
  chooseTableButton = {}
  formData: any[] = [
    {
      key: 'bumen',
      type: 'Checkbox',
      name: '所属系统',
      data: ['复选框 A']
    }
  ]
  changeGold = false
  handleTableButton(val: any, item: any){
    this.chooseTableButton = item
    this.changeGold = true
  }

  buttonClick(index: any) {
    this.changeGold = false
  }

  close () {
    this.changeGold = false
  }

}
</script>
<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

.system{
  width: dim(900);
}

</style>
