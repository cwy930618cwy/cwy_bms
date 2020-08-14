<template>
  <div class="components_search">
    <div v-for="(item, index) in searchList" :key="index">
      <!-- 输入框 -->
      <el-input
        v-if="item.type === 'Input'"
        :placeholder="item.placeholder"
        v-model="item.name"
        clearable
      ></el-input>
      <!-- 下拉框 -->
      <el-select v-if="item.type === 'Select'" v-model="item.name" :placeholder="item.placeholder">
        <el-option
          v-for="(selectItem, selectIndex) in item.label"
          :key="selectIndex"
          :label="selectItem.label"
          :value="selectItem.value"
        ></el-option>
      </el-select>
    </div>
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

.components_search {
  display: flex;
  margin-bottom: dim(10);
  .el-input {
    width: dim(140);
    margin-right: dim(10);
    display: flex;
    align-items: center;
    ::v-deep .el-input__inner {
      height: dim(30) !important;
    }
    ::v-deep .el-input__suffix {
      display: flex;
      align-items: center;
    }
  }
  .el-select {
    margin-right: dim(10);
    ::v-deep .el-input__inner {
      height: dim(30) !important;
    }
    ::v-deep .el-input__suffix {
      display: flex;
      align-items: center;
    }
  }
  .el-button {
    height: 30px;
    line-height: 30px;
    padding: 0 30px;
  }
}
</style>
