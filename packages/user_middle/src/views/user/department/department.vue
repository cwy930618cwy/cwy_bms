<template>
  <div class="department">
    部门管理
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
  components: {}
})
export default class department extends Vue {}
</script>
<style lang="scss" scoped>
@import "@/styles/functions.scss";
@import "@/styles/mixins.scss";

.department {
  background: white;
  padding: dim(30) dim(20);
  position: relative;
  margin: dim(20);
}
</style>
