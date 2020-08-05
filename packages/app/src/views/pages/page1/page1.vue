<template>
  <div class="page1">
    <Search/>
    <HandleList/>
    <div class="contain">
      <div class="left">
        <NavMenu/>
      </div>
      <div class="right">
        <Table :formData="formData" @buttonClick="buttonClick"/>
      </div>
    </div>
    <div class="footer">
      <Pagination/>
    </div>
    <Dialog v-if="changeGoldDialog" :buttons="['取消', '好的']" class="company-content__dialog" title="添加部门" @close="close" @button-click="buttonClick">
      <div class="company-content__dialog__center">
        <Form :formData="formData"/>
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import Search from '@/components/Search/index.vue'
import HandleList from '@/components/HandleList/index.vue'
import NavMenu from '@/components/NavMenu/index.vue'
import Table from '@/components/Table/index.vue'
import Pagination from '@/components/Pagination/index.vue'

@Component({
    components: { Search, HandleList, NavMenu, Table, Pagination }
})
export default class Page1 extends Vue {
  formData: any[] = [
    {
      key: 'bumen',
      type: 'Input',
      name: '部门名称',
      data: '22'
    },
    {
      key: 'father',
      type: 'Select',
      name: '父名称',
      data: '22'
    },
    {
      key: 'paixu',
      type: 'Input',
      name: '排序',
      data: '22'
    },
    {
      key: 'beizhu',
      type: 'Textarea',
      name: '备注',
      data: '22'
    }
  ]


  // 弹窗
  changeGoldDialog = false
  handleClick(){
    this.changeGoldDialog = true
  }

  buttonClick(index: any) {
    console.log('tijiao---', index)
    this.$emit('buttonClick', index)
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
  .footer{
    position: absolute;
    bottom: 20px;
    left: 20px;
  }
}
</style>
