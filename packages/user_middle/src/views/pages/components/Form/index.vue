<template>
  <div class="tableList">
    <el-form ref="form" label-width="80px">
      <el-form-item v-for="(item, index) in formData" :key="index" :label="item.name">
        <!-- input输入框 -->
        <el-input v-if="item.type === 'Input'" v-model="item.data"></el-input>
        <!-- 单选框 -->
        <el-select v-if="item.type === 'Select'" v-model="item.data" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
        <!-- 多行输入框 -->
        <el-input v-if="item.type === 'Textarea'" type="textarea" v-model="item.data"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component
export default class Form extends Vue {
  @Prop({ default: () => [] }) formData!: string[]

  s = ''

}
</script>
<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

.tableList{
  width: 100%;
  .el-form{
    margin: dim(20) dim(20) 0 dim(20);
  }
  .el-select{
    width: 100%;
  }
}
</style>
