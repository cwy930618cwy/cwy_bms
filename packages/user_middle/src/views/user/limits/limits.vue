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
          @node-click="handleNodeClick"
        />
        <div
          v-if="
            (chooseTableButton.type === 'delete') |
              (chooseTableButton.type === 'formdelete')
          "
        >是否确认删除</div>
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { getDeptTree } from "@/api/department";
import {
  getPermissionList,
  getPermissionDetail,
  postPermissionAdd,
  postPermissionUpdate,
  postPermissionDelete,
} from "@/api/limit";
import { getSelectSysAdminListByCurrentUser } from "@/api/character";

import { Search, Button, Table, Pagination, Dialog, Form } from "components";

@Component
export default class limits extends Vue {
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
      prop: "name",
      label: "权限名称",
    },
    {
      prop: "value",
      label: "权限值",
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
      title: "编辑权限",
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
  searchList: any = [
    {
      type: "Input",
      key: "name",
      name: "",
      placeholder: "权限名称",
    },
    {
      type: "Input",
      key: "value",
      name: "",
      placeholder: "权限标识",
    },
    {
      key: "relSystemId",
      type: "Select",
      name: "",
      placeholder: "请选择所属系统",
      label: [],
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
  ];

  // 弹窗
  chooseTableButton: any = {};
  formData: any = {
    formList: [
      {
        key: "relSystemId",
        type: "Select",
        name: "所属系统",
        data: "",
        label: [],
      },
      {
        key: "name",
        type: "Input",
        name: "权限名称",
        data: "",
        placeholder: "请输入权限名称",
        rules: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
      },
      {
        key: "value",
        type: "Input",
        name: "权限值",
        data: "",
        placeholder: "请输入权限值",
        rules: [{ required: true, message: "请输入权限值", trigger: "blur" }],
      },
      {
        key: "parentId",
        type: "tree",
        name: "父级权限",
        showCheckBox: false,
        data: [],
        defaultExpandKeys: [0],
        defaultProps: {
          children: "deptVOS",
          label: "deptName",
        },
      },
      {
        key: "type",
        type: "Radio",
        name: "权限类型",
        data: 0,
        label: [
          {
            value: 0,
            label: "目录",
          },
          {
            value: 1,
            label: "菜单",
          },
          {
            value: 2,
            label: "按钮",
          },
        ],
      },
      {
        key: "uri",
        type: "Input",
        name: "前端路径",
        data: "",
        placeholder: "请输入前端路径",
        rules: [{ required: true, message: "请输入前端路径", trigger: "blur" }],
      },
      {
        key: "icon",
        type: "Input",
        name: "图标",
        data: "",
        placeholder: "请输入图标",
        rules: [{ required: true, message: "请输入图标", trigger: "blur" }],
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
    this.getSelectSysAdminListByCurrentUser();
    this.getDeptTree();
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
    this.getPermissionList();
  }

  // 分页选择
  currentChange(index: { page: number; limit: number }) {
    this.deptList.pageIndex = index.page;
    this.deptList.length = index.limit;
    this.getPermissionList();
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
        title: "添加权限",
        dialogButton: [
          {
            type: "primary",
            value: "确认",
          },
        ],
      };
      this.newFormData = JSON.parse(JSON.stringify(this.formData));
      this.changeGoldDialog = true;
    }
  }

  // table点击弹窗
  handleTableButton(val: { id: number }, item: any) {
    item.id = val.id;
    this.chooseTableButton = item;

    if (item.type === "edit") {
      this.getPermissionDetail(val.id);
    } else {
      this.changeGoldDialog = true;
    }
  }

  // 弹窗按钮点击
  handleDialogButton(index: number) {
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
      this.postPermissionDelete(idArr);
    }
  }

  // 编辑/添加提交操作
  handleValidate(arrId?: number) {
    let submitData: any = {};
    this.updateData.formList.forEach((item: any) => {
      if (item.key == "parentId") {
        submitData.parentId = item.defaultExpandKeys;
      } else {
        submitData[item.key] = item.data;
      }
    });
    if (this.chooseTableButton.id) {
      submitData.id = this.chooseTableButton.id;
      this.postPermissionUpdate(submitData);
    } else {
      this.postPermissionAdd(submitData);
    }
  }

  // table删除单个角色
  handleDelete(index: number) {
    if (index === 0) {
      this.postPermissionDelete();
    } else {
      this.changeGoldDialog = false;
    }
  }

  // 树组件回调
  handleNodeClick(index: { id: any }) {
    this.updateData.formList[3].defaultExpandKeys = index.id;
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
  // 获取权限列表
  getSelectSysAdminListByCurrentUser() {
    getSelectSysAdminListByCurrentUser().then((response: any) => {
      this.searchList[2].name = response.data[0].id;
      response.data.forEach((item: any) => {
        this.searchList[2].label.push({
          value: item.id,
          label: item.systemName,
        });
      });
      this.formData.formList[0].data = response.data[0].id;
      this.formData.formList[0].label = this.searchList[2].label;
    });
  }
  // 分页查询权限
  getPermissionList() {
    getPermissionList(this.deptList).then((response: any) => {
      this.tableData = response.data;
    });
  }

  // 编辑按钮 回显
  getPermissionDetail(data: number) {
    getPermissionDetail({ id: data }).then((response: any) => {
      let defaultExpandKeys = 0;
      this.newFormData = JSON.parse(JSON.stringify(this.formData));
      this.newFormData.formList.forEach((element: any) => {
        if (element.key === "parentId") {
          defaultExpandKeys = response.data[element.key];
        } else {
          element.data = response.data[element.key];
        }
      });
      this.changeGoldDialog = true;
      if (!!response.data.parentId) {
        this.$nextTick(() => {
          (this.$refs.formRefs as any).setCurrentKey(defaultExpandKeys);
        });
      }
    });
  }

  // 添加权限提交
  postPermissionAdd(data: any) {
    postPermissionAdd(data).then((response: any) => {
      this.getPermissionList();
      this.changeGoldDialog = false;
    });
  }

  // 编辑提交
  postPermissionUpdate(data: any) {
    postPermissionUpdate(data).then((response: any) => {
      this.getPermissionList();
      this.changeGoldDialog = false;
    });
  }

  // 删除列表
  postPermissionDelete(arrId?: string[]) {
    const id = arrId ? arrId : [this.chooseTableButton.id];
    postPermissionDelete(id).then((response: any) => {
      this.getPermissionList();
      this.changeGoldDialog = false;
    });
  }

  // 分页查询部门树
  getDeptTree() {
    const params = {
      pageNum: 1,
      pageSize: 1000,
    };
    getDeptTree(params).then((response: any) => {
      const content = response.data.content;
      this.formData.formList[3].data = content;
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
