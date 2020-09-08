<template>
  <div class="tableList">
    <el-form ref="formName" :model="componentForm" label-width="80px">
      <div v-for="(item, index) in componentForm.formList" :key="index">
        <el-form-item :label="item.name" :rules="item.rules" :prop="'formList.' + index + '.data'">
          <!-- input输入框 -->
          <el-input
            v-if="item.type === 'Input'"
            :placeholder="item.placeholder"
            v-model="item.data"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import Upload from "../Upload/Upload.vue";
@Component({
  components: { Upload },
})
export default class Form extends Vue {
  // @Prop({ default: () => [] }) formData!: any;
  formData = {
    formList: {},
  };
  componentForm: any = {};

  mounted() {
    this.componentForm = JSON.parse(JSON.stringify(this.formData));
  }

  nodeClick(index: any) {
    this.$emit("node-click", index);
  }

  getCheckedKeys() {
    const treeKeys = (this.$refs.tree as any)[0].getCheckedKeys();
    this.$emit("getCheckedKeys", treeKeys);
  }

  setCheckedKeys(index: any) {
    (this.$refs.tree as any)[0].setCheckedKeys(index);
  }

  setCurrentKey(index: any) {
    (this.$refs.tree as any)[0].setCurrentKey(index);
  }

  submitForm() {
    (this.$refs.formName as any).validate((valid: any) => {
      if (valid) {
        this.$emit("handle-validate", this.componentForm);
      } else {
        return false;
      }
    });
  }
}
</script>
<style lang="scss" scoped>
@import "../common/functions.scss";
@import "../common/mixins.scss";

.tableList {
  width: 100%;
  .el-form {
    margin: dim(20) dim(20) 0 dim(20);
  }
  .el-select {
    width: 100%;
  }
  ::v-deep .el-transfer {
    text-align: left;
    .el-transfer-panel {
      width: 160px;
    }
    .el-transfer__button {
      padding: 10px;
    }
  }
}
</style>
