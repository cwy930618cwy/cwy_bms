<template>
  <div>
    <el-pagination
      background
      layout="prev, pager, next"
      @size-change="$emit('size-change', $event)"
      @current-change="$emit('current-change', $event)"
      @prev-click="$emit('prev-click', $event)"
      @next-click	="$emit('next-click', $event)"
      :total="1000">
    </el-pagination>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class Pagination extends Vue {
  

}
</script>
<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

</style>
