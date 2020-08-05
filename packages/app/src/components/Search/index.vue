<template>
    <div class="components_search">
      <el-input
        placeholder="id"
        v-model="input"
        clearable>
      </el-input>
      <el-input
        placeholder="部门名称"
        v-model="input2"
        clearable>
      </el-input>
      <el-button>搜索</el-button>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class AppMain extends Vue {
  input = ''
  input2 = ''

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
  }
  .el-button{
    height: 30px;
    line-height: 30px;
    padding: 0 30px;

  }
}
</style>
