<template>
  <div class="navbars">
    <breadrumd />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import breadrumd from '@/components/Breadcrumb/index.vue'
@Component({
    components: { breadrumd }
})
export default class Navbars extends Vue {

}
</script>

<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

.navbars{
  height: dim(40);
  background: white;
  line-height: dim(40);
  display: flex;
  align-items: center;
  padding-left: dim(20);
  margin-bottom: dim(20);
}
</style>