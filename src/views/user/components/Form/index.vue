<template>
  <div class="tableList">
    <el-form ref="formName" :model="formData" label-width="80px">
      <div v-for="(item, index) in formData.formList" :key="index">
        <el-form-item 
          :label="item.name"
          :rules="item.rules" 
          :prop="'formList.' + index + '.data'" 
        >
          <!-- input输入框 -->
          <el-input v-if="item.type === 'Input'" v-model="item.data"></el-input>
          <!-- 下拉框 -->
          <el-select v-if="item.type === 'Select'" v-model="item.data" placeholder="请选择活动区域">
            <el-option v-for="(selectItem, selectIndex) in item.label" :key="selectIndex" :label="selectItem.label" :value="selectItem.value"></el-option>
          </el-select>
          <!-- 多行输入框 -->
          <el-input v-if="item.type === 'Textarea'" type="textarea" v-model="item.data"></el-input>
          <!-- 单选 -->
          <div :style="{ textAlign: 'left' }" v-if="item.type === 'Radio'">
            <el-radio v-for="(childItem, childIndex) in item.label" :key="childIndex" v-model="item.data" :label="childItem">{{childItem}}</el-radio>
          </div>
          <!-- 多选 -->
          <el-checkbox-group v-if="item.type === 'Checkbox'" v-model="item.data">
            <el-checkbox v-for="(item, index) in item.defaultdata" :key="index" :label="item.label"></el-checkbox>
          </el-checkbox-group>
          <!-- 穿梭框 -->
          <el-transfer v-if="item.type === 'transfer'" v-model="item.data" :data="item.defaultdata"></el-transfer>
          <!-- 树状图 -->
          <el-tree
            v-if="item.type === 'tree'"
            :data="item.data"
            :show-checkbox="item.showCheckBox"
            node-key="id"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="item.defaultProps">
          </el-tree>
          <!-- 图片上传 -->
          <Upload :style="{ textAlign: 'left' }" v-if="item.type === 'upload'" v-model="item.data" />
          <!-- 级联 -->
          <el-cascader
            v-if="item.type === 'cascader'"
            v-model="item.data"
            :options="item.options"
          ></el-cascader>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Upload from '@/views/user/components/Upload/index.vue'
@Component({
  components: { Upload }
})
export default class Form extends Vue {
  @Prop({ default: () => [] }) formData!: any
  
  submitForm() {
    (this.$refs.formName as any).validate((valid: any) => {
      if (valid) {
        this.$emit('handle-validate')
      } else {
        console.log('false')
        return false;
      }
    });
  }

}
</script>
<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

.tableList{
  width: 100%;
  .el-form{
    margin: dim(20) dim(20) 0 dim(20);
  }
  .el-select{
    width: 100%;
  }
  ::v-deep .el-transfer{
    text-align: left;
    .el-transfer-panel{
      width: 160px;
    }
    .el-transfer__button{
      padding: 10px;
    }
  }
}
</style>
