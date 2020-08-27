<template>
    <div class="components_search">
      <el-input
        v-for="(item, index) in searchList"
        :key="index"
        :placeholder="item.placeholder"
        v-model="item.name"
        clearable>
      </el-input>
      <el-button @click="$emit('handle-search', searchList)">搜索</el-button>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class AppMain extends Vue {
  @Prop({ default: () => [] }) searchList!: string[]

}
</script>
<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

.components_search{
  display: flex;
  margin-bottom: dim(10);
  .el-input{
    width: dim(140);
    margin-right: dim(10);
    display: flex;
    align-items: center;
    /deep/.el-input__inner{
      height: dim(30) !important;
    }
    /deep/.el-input__suffix{
      display: flex;
      align-items: center;
    }
  }
  .el-button{
    height: 30px;
    line-height: 30px;
    padding: 0 30px;
  }
}
</style>
