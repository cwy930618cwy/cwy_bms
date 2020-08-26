<template>
    <div class="components_handleList">
      <el-button v-for="(item, index) in buttonList" :key="index" @click="$emit('handle-button', index)">{{item}}</el-button>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class Button extends Vue {
  @Prop({ default: () => [] }) buttonList!: string[]

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
