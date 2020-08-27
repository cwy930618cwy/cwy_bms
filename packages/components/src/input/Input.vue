<template>
  <div>
    <el-input :value="value" type="text" />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
@Component
export default class HsInput extends Vue {
  @Prop({ type: [Number, String, Object] })
  value!: number | string | object;
}
</script>
<style lang="scss">
@import "../common/functions.scss";
@import "../common/mixins.scss";
</style>
