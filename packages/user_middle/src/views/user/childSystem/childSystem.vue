<template>
  <div class="page1">
    <Search :searchList="searchList" @handle-search="handleSearch" />
    <Button :buttonList="buttonList" @handle-button="handleButton" />
    <div class="contain">
      <div class="right">
        <Table
          :fields="fields"
          :tableData="tableData.content"
          :tableButton="tableButton"
          @handle-selection-change="handleSelectionChange"
          @handle-table-button="handleTableButton"
        />
      </div>
    </div>
    <div class="footer">
      <pagination
        :total="tableData.totalPages ? tableData.totalPages : 0"
        @pagination="currentChange"
      />
    </div>

    <Dialog
      :width="chooseTableButton.width"
      v-if="changeGoldDialog"
      :buttons="chooseTableButton.dialogButton"
      class="company-content__dialog"
      :title="chooseTableButton.title"
      @close="close"
      @button-click="handleDialogButton"
    >
      <div class="company-content__dialog__center">
        <Form
          ref="formRefs"
          v-if="
            (chooseTableButton.type === 'edit') |
              (chooseTableButton.type === 'add')
          "
          :formData="newFormData"
          @handle-validate="handleValidate"
        />
        <div
          v-if="
            (chooseTableButton.type === 'delete') |
              (chooseTableButton.type === 'formdelete')
          "
        >是否确认删除</div>
        <System v-if="chooseTableButton.type === 'setAdmin'" />
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import System from "./components/System.vue";

import { Search, Button, Table, Pagination, Dialog, Form } from "components";

import {
  getSystemList,
  getSystemDetail,
  postSystemAdd,
  postSystemUpdate,
  postSystemDelete,
} from "@/api/childSystem";

@Component({
  components: { System },
})
export default class Page1 extends Vue {
  // table列表
  deptList = {
    pageIndex: 1,
    length: 1000,
  };
  fields = [
    {
      prop: "id",
      label: "id",
    },
    {
      prop: "systemCode",
      label: "系统标识",
    },
    {
      prop: "systemName",
      label: "系统名称",
    },
    {
      prop: "loginCallbackUrl",
      label: "回调地址",
    },
    {
      prop: "remark",
      label: "备注",
    },
  ];
  tableData: any = {};
  tableButton = [
    {
      type: "edit",
      name: "编辑",
      title: "编辑子系统",
      buttonType: "primary",
      dialogButton: [
        {
          type: "primary",
          value: "确认",
        },
        {
          type: "info",
          value: "取消",
        },
      ],
    },
    {
      type: "delete",
      name: "删除",
      title: "确认删除",
      buttonType: "danger",
      dialogButton: [
        {
          type: "primary",
          value: "确认",
        },
        {
          type: "info",
          value: "取消",
        },
      ],
    },
  ];
  selectList = [];

  // 搜索框
  searchList = [
    {
      type: "Input",
      key: "systemCode",
      name: "",
      placeholder: "系统标识",
    },
    {
      type: "Input",
      key: "systemName",
      name: "",
      placeholder: "系统名称",
    },
  ];

  // 列表按钮控制
  buttonList = [
    {
      key: "delete",
      name: "删除",
    },
    {
      key: "add",
      name: "添加",
    },
    {
      key: "admin",
      name: "设置管理员",
    },
  ];

  // 弹窗
  chooseTableButton: any = {};
  formData: any = {
    formList: [
      {
        key: "systemCode",
        type: "Input",
        name: "系统标识",
        data: "",
        placeholder: "请输入系统标识",
        rules: [{ required: true, message: "请输入系统标识", trigger: "blur" }],
      },
      {
        key: "systemName",
        type: "Input",
        name: "系统名称",
        data: "",
        placeholder: "请输入系统名称",
        rules: [{ required: true, message: "请输入系统名称", trigger: "blur" }],
      },
      {
        key: "loginCallbackUrl",
        type: "Input",
        name: "回调地址",
        data: "",
        placeholder: "请输入回调地址",
        rules: [{ required: true, message: "请输入回调地址", trigger: "blur" }],
      },
      {
        key: "remark",
        type: "Textarea",
        name: "备注",
        data: "",
        placeholder: "请输入备注",
        rules: [{ required: true, message: "请输入备注", trigger: "blur" }],
      },
    ],
  };
  newFormData: any = {};
  changeGoldDialog = false;

  mounted() {
    this.getSystemList();
  }

  // 分页选择当前页
  handleSelectionChange(val: []) {
    this.selectList = val;
  }

  // 搜索框
  handleSearch(data: []) {
    data.forEach((item: any) => {
      (this.deptList as any)[item.key] = item.name;
    });
    this.getSystemList();
  }

  // 分页选择
  currentChange(index: { page: number; limit: number }) {
    this.deptList.pageIndex = index.page;
    this.deptList.length = index.limit;
    this.getSystemList();
  }

  // 总体按钮点击弹窗
  handleButton(type: string) {
    if (type === "delete") {
      if (this.selectList.length === 0) {
        this.$message({
          message: "请选择至少一名用户",
          type: "warning",
        });
        return;
      }
      (this.chooseTableButton = {
        type: "formdelete",
        name: "删除",
        title: "确认删除",
        dialogButton: [
          {
            type: "primary",
            value: "确认",
          },
          {
            type: "info",
            value: "取消",
          },
        ],
      }),
        (this.changeGoldDialog = true);
    }
    // 添加
    if (type === "add") {
      this.chooseTableButton = {
        type: "add",
        name: "添加",
        title: "添加子系统",
        dialogButton: [
          {
            type: "primary",
            value: "确认",
          },
          {
            type: "info",
            value: "取消",
          },
        ],
      };
      this.newFormData = JSON.parse(JSON.stringify(this.formData));
      this.changeGoldDialog = true;
    }
    // 设置管理员
    if (type === "admin") {
      this.chooseTableButton = {
        type: "setAdmin",
        title: "设置管理员",
        dialogButton: [
          {
            type: "primary",
            value: "确认",
          },
          {
            type: "info",
            value: "取消",
          },
        ],
      };
      this.changeGoldDialog = true;
    }
  }

  // table点击弹窗
  handleTableButton(val: { id: number }, item: any) {
    item.id = val.id;
    this.chooseTableButton = item;
    if (item.type === "edit") {
      this.getSystemDetail(val.id);
    } else {
      this.changeGoldDialog = true;
    }
  }

  // 弹窗按钮点击
  handleDialogButton(index: any) {
    const type = this.chooseTableButton.type;
    switch (type) {
      case "edit":
        (this.$refs.formRefs as any).submitForm();
        break;
      case "delete":
        this.handleDelete(index);
        break;
      case "formdelete":
        this.handleFormdelete(index);
        break;
      case "add":
        (this.$refs.formRefs as any).submitForm();
        break;
      default:
        this.changeGoldDialog = false;
    }
  }

  // 总体删除按钮
  handleFormdelete(index: number) {
    if (index === 0) {
      let idArr: string[] = [];
      this.selectList.forEach((item: any) => {
        idArr.push(item.id);
      });
      this.postSystemDelete(idArr);
    }
  }

  // 编辑/添加提交操作
  handleValidate(arrId?: number) {
    let submitData: any = {};
    this.updateData.formList.forEach((item: any) => {
      submitData[item.key] = item.data;
    });
    if (this.chooseTableButton.id) {
      submitData.id = this.chooseTableButton.id;
      this.postSystemUpdate(submitData);
    } else {
      this.postSystemAdd(submitData);
    }
  }

  // table删除单个角色
  handleDelete(index: number) {
    if (index === 0) {
      this.postSystemDelete();
    } else {
      this.changeGoldDialog = false;
    }
  }

  close() {
    this.changeGoldDialog = false;
  }

  // 监听form值变化
  updateData: any = {};
  @Watch("newFormData", { immediate: true, deep: true })
  onChangeFormData(newVal: string[], oldVal: string) {
    this.updateData = newVal;
  }

  // 接口调取
  // 分页查询子系统
  getSystemList() {
    getSystemList(this.deptList).then((response: any) => {
      this.tableData = response.data;
    });
  }

  // 编辑按钮 回显
  getSystemDetail(data: number) {
    getSystemDetail({ id: data }).then((response: any) => {
      this.newFormData = JSON.parse(JSON.stringify(this.formData));
      this.newFormData.formList.forEach((element: any) => {
        element.data = response.data[element.key];
      });
      this.changeGoldDialog = true;
    });
  }

  // 添加系统提交
  postSystemAdd(data: any) {
    postSystemAdd(data).then((response: any) => {
      this.getSystemList();
      this.changeGoldDialog = false;
    });
  }

  // 编辑提交
  postSystemUpdate(data: any) {
    postSystemUpdate(data).then((response: any) => {
      this.getSystemList();
      this.changeGoldDialog = false;
    });
  }

  // 删除列表
  postSystemDelete(arrId?: string[]) {
    const id = arrId ? arrId : [this.chooseTableButton.id];
    postSystemDelete(id).then((response: any) => {
      this.getSystemList();
      this.changeGoldDialog = false;
    });
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/functions.scss";
@import "@/styles/mixins.scss";

.page1 {
  background: white;
  padding: dim(30) dim(20);
  position: relative;
  .contain {
    width: 100%;
    display: flex;
    margin-bottom: dim(40);
    .left {
      width: dim(160);
      border: dim(1) solid #eee;
    }
    .right {
      padding: 0 dim(20);
      flex: 1;
      height: 100%;
    }
  }
}
</style>
