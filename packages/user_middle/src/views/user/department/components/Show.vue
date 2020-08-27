<template>
  <div class="show">
    <div
      class="showList"
      v-for="(item, index) in formData.formList"
      :key="index"
    >
      <span class="item">{{ item.name }}:</span>
      <span>{{ item.data }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component
export default class Show extends Vue {
  @Prop({ default: () => [] }) formData!: any;
}
</script>
<style lang="scss" scoped>
@import "@/styles/functions.scss";
@import "@/styles/mixins.scss";

.showList {
  text-align: left;
  margin-top: dim(20);
  font-size: dim(20);
  color: #606266;
  .item {
    margin-right: dim(10);
  }
}
</style>
