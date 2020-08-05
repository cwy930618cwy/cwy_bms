<template>
  <div class="tableList">
    <el-form ref="form" label-width="80px">
      <div class="tableList__content" v-for="(item, index) in formData" :key="index">
        <div v-if="item.type === 'Input'">
          <el-input v-model="item.data"></el-input>
        </div>
      </div>
    </el-form>
    <!-- <div class="tableList__content" v-for="(item, index) in dialogData" :key="index">
      <span>{{item.name}}</span>
      <div>input</div>
    </div> -->
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component
export default class Form extends Vue {
  @Prop({ default: () => [] }) formData!: string[]

}
</script>
<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

.tableList{
  width: 100%;
  &__content{
    display: flex;
    width: 100%;
  }
}
</style>
