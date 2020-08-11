<template>
  <div>
    <el-tree :data="data" :props="defaultProps" @node-click="$emit('handle-navmenu',$event)"></el-tree>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class NavMenu extends Vue {
  @Prop({ default: () => [] }) data!: any
  @Prop({ default: () => [] }) defaultProps!: any
}
</script>
<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

</style>
