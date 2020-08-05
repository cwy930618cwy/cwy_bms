<template>
    <div class="components_handleList">
      <el-button>删除</el-button>
      <el-button>添加</el-button>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class HandleList extends Vue {
  

}
</script>
<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

.components_handleList{
  display: flex;
  height: dim(36);
  margin-bottom: dim(20);
}
</style>
