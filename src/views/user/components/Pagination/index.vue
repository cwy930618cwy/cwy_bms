<template>
  <div>
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="$emit('current-change', $event)"
      :total="1000"
    ></el-pagination>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class Pagination extends Vue {}
</script>
<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';
</style>
