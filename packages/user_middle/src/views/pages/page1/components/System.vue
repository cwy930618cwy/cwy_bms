<template>
  <div class="system">
    <Search :searchList="searchList" @handle-search="handleSearch"/>
    <Table :fields="fields" :tableData="tableData" :tableButton="tableButton" @handle-table-button="handleTableButton"/>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Search from '@/components/Search/index.vue'
import Table from '@/components/Table/index.vue'
@Component({
  components: { Search, Table }
})
export default class Show extends Vue {
  // table列表
  fields = [
    {
      prop: 'date',
      label: '日期'
    },
    {
      prop: 'name',
      label: '姓名'
    },
    {
      prop: 'address',
      label: '地址'
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
      dialogButton: ['选择子系统']
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

  handleTableButton(){

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
