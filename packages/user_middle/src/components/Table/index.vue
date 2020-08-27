<template>
  <el-table
    ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%"
    :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    @selection-change="$emit('handle-selection-change', $event)"
  >
    <el-table-column
      v-if="showSelect"
      align="center"
      type="selection"
    ></el-table-column>
    <el-table-column
      v-for="(item, index) in fields"
      :key="index"
      :prop="item.prop"
      align="center"
      :label="item.label"
    ></el-table-column>
    <el-table-column
      v-if="tableButton.length > 0"
      fixed="right"
      align="center"
      label="操作"
    >
      <template slot-scope="scope">
        <el-button
          v-for="(item, ind) in tableButton"
          :key="ind"
          :type="item.buttonType"
          size="mini"
          @click="$emit('handle-table-button', scope.row, item)"
          >{{ item.name }}</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Table extends Vue {
  @Prop({ default: () => [] }) tableButton!: string[];
  @Prop({ default: () => [] }) fields!: string[];
  @Prop({ default: () => [] }) tableData!: string[];
  @Prop({ default: true }) showSelect!: boolean;
}
</script>
<style lang="scss" scoped>
@import "@/styles/functions.scss";
@import "@/styles/mixins.scss";

.company-content__dialog__center {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: dim(30) 0;
}
.company-content__dialog__input {
  width: dim(300);
  height: dim(40);
  padding: 0 dim(14);
}
</style>
