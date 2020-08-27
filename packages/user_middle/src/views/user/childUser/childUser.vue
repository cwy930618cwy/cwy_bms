<template>
  <div class="page1">
    <Search :searchList="searchList" @handle-search="handleSearch" />
    <Button :buttonList="buttonList" @handle-button="handleButton" />
    <div class="contain">
      <div class="left">
        <NavMenu :data="navMenuData" :defaultProps="navMenuProp" @handle-navmenu="handleNavMenu" />
      </div>
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
        <div v-if="chooseTableButton.type === 'password'">新手机号为后6位</div>
        <Form
          v-if="chooseTableButton.type === 'accredit'"
          @handle-select="getSelectRoleListByUserIdAndSysId"
          :formData="showData"
        />
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { getDeptTree, postUserList } from "@/api/department";

import {
  Search,
  Button,
  NavMenu,
  Table,
  Pagination,
  Dialog,
  Form,
} from "components";
import {
  getUserDetail,
  postResetPassword,
  postUserAdd,
  putUserUpdate,
  deleteUserBatch,
  postUserRoles,
  getSelectRoleListByUserIdAndSysId,
  getSelectDeptSysAdminListByCurrentUser,
} from "@/api/childUser";

@Component
export default class Page1 extends Vue {
  // table列表
  deptList = {
    pageIndex: 1,
    length: 1000,
    deptId: 0,
  };
  fields = [
    {
      prop: "id",
      label: "id",
    },
    {
      prop: "username",
      label: "用户名",
    },
    {
      prop: "nickname",
      label: "昵称",
    },
    {
      prop: "phone",
      label: "手机",
    },
    {
      prop: "email",
      label: "邮箱",
    },
    {
      prop: "gender",
      label: "性别",
    },
  ];
  tableData: any = {};
  tableButton = [
    {
      type: "accredit",
      name: "授权角色",
      title: "授权角色",
      buttonType: "info",
      dialogButton: [
        {
          type: "primary",
          value: "确认",
        },
      ],
    },
    {
      type: "edit",
      name: "编辑",
      title: "编辑部门",
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
      key: "username",
      name: "",
      placeholder: "用户名",
    },
    {
      type: "Input",
      key: "phone",
      name: "",
      placeholder: "手机",
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
      key: "password",
      name: "重置密码",
    },
  ];

  // 部门树侧边栏
  navMenuData = [];
  navMenuProp = {
    children: "deptVOS",
    label: "deptName",
  };

  // 弹窗
  chooseTableButton: any = {};
  formData: any = {
    formList: [
      {
        key: "username",
        type: "Input",
        name: "用户名",
        data: "",
        placeholder: "请输入用户名",
        rules: [{ required: true, message: "请输入用户名", trigger: "blur" }],
      },
      {
        key: "password",
        type: "Input",
        name: "密码",
        data: "",
        placeholder: "请输入密码",
        rules: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      {
        key: "nickname",
        type: "Input",
        name: "昵称",
        data: "",
        placeholder: "请输入昵称",
        rules: [{ required: true, message: "请输入昵称", trigger: "blur" }],
      },
      {
        key: "phone",
        type: "Input",
        name: "手机",
        data: "",
        placeholder: "请输入手机",
        rules: [{ required: true, message: "请输入手机", trigger: "blur" }],
      },
      {
        key: "email",
        type: "Input",
        name: "邮箱",
        data: "",
        placeholder: "请输入邮箱",
        rules: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
      },
      // {
      //   key: 'avatar',
      //   type: 'upload',
      //   name: '头像',
      //   data: ''
      // },
      {
        key: "gender",
        type: "Radio",
        name: "性别",
        data: 1,
        label: [
          {
            value: 1,
            label: "男",
          },
          {
            value: 2,
            label: "女",
          },
        ],
        rules: [{ required: true, message: "请输入性别", trigger: "blur" }],
      },
      {
        key: "city",
        type: "Input",
        name: "城市",
        data: "",
        placeholder: "请输入城市",
        rules: [{ required: true, message: "请输入城市", trigger: "blur" }],
      },
      {
        key: "job",
        type: "Input",
        name: "职业",
        data: "",
        placeholder: "请输入职业",
        rules: [{ required: true, message: "请输入职业", trigger: "blur" }],
      },
      {
        key: "personalizedSignature",
        type: "Textarea",
        name: "个性签名",
        data: "",
        placeholder: "请输入个性签名",
        rules: [{ required: true, message: "请输入个性签名", trigger: "blur" }],
      },
    ],
  };
  showData: any = {
    formList: [
      {
        key: "userId",
        type: "Select",
        name: "选择系统",
        data: "",
        label: [],
      },
      {
        key: "roleIds",
        type: "transfer",
        name: "角色授权",
        defaultdata: [],
        data: [],
      },
    ],
  };
  newFormData: any = {};
  changeGoldDialog = false;

  mounted() {
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
    this.postUserList();
  }

  // 左边系统展示
  handleNavMenu(data: any) {
    this.deptList.deptId = data.id;
    this.postUserList();
  }

  // 分页选择
  currentChange(index: { page: number; limit: number }) {
    this.deptList.pageIndex = index.page;
    this.deptList.length = index.limit;
    this.postUserList();
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
        title: "添加用户",
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
    // 重置密码
    if (type === "password") {
      if (this.selectList.length === 0) {
        this.$message({
          message: "请选择至少一名用户",
          type: "warning",
        });
        return;
      }
      this.chooseTableButton = {
        type: "password",
        title: "重置密码",
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

    if (item.type === "accredit") {
      this.getSelectDeptSysAdminListByCurrentUser();
    } else if (item.type === "edit") {
      this.getUserDetail(val.id);
    } else {
      this.changeGoldDialog = true;
    }
  }

  // 弹窗按钮点击
  handleDialogButton(index: any) {
    const type = this.chooseTableButton.type;
    switch (type) {
      case "accredit":
        this.handleAccredit();
        break;
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
      case "password":
        this.handlePassword(index);
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
      this.deleteUserBatch(idArr);
    }
  }

  // 编辑/添加提交操作
  handleValidate(arrId?: number) {
    let submitData: any = {};
    this.updateData.formList.forEach((item: any) => {
      submitData[item.key] = item.data;
    });
    submitData.deptId = this.deptList.deptId;
    submitData.avatar = "";
    if (this.chooseTableButton.id) {
      submitData.id = this.chooseTableButton.id;
      this.putUserUpdate(submitData);
    } else {
      this.postUserAdd(submitData);
    }
  }

  // 重置密码
  handlePassword(index: any) {
    if (index === 0) {
      this.postResetPassword();
    } else {
      this.changeGoldDialog = false;
    }
  }

  // 授权角色
  handleAccredit() {
    let submitData: any = {};
    this.updateShowData.formList.forEach((item: any) => {
      submitData[item.key] = item.data;
    });
    this.postUserRoles(submitData);
  }

  // table删除单个角色
  handleDelete(index: number) {
    if (index === 0) {
      this.deleteUserBatch();
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

  updateShowData: any = {};
  @Watch("showData", { immediate: true, deep: true })
  onChangeFormShowData(newVal: string[], oldVal: string) {
    this.updateShowData = newVal;
  }

  // 接口调取
  // 分页查询部门树
  getDeptTree() {
    const params = {
      pageNum: 1,
      pageSize: 1000,
    };
    getDeptTree(params).then((response: any) => {
      const content = this.treeData(response.data.content);
      this.navMenuData = content;
      this.deptList.deptId = content[0].id;
      this.postUserList();
    });
  }
  treeData(data: any) {
    data.forEach((element: any) => {
      if (element.deptVOS.length === 0) {
        element.deptVOS = undefined;
      } else {
        this.treeData(element.deptVOS);
      }
    });
    return data;
  }

  // 分页查询用户
  postUserList() {
    const params = this.deptList;
    postUserList(params).then((response: any) => {
      this.tableData = response.data;
    });
  }

  // 授权角色
  getSelectDeptSysAdminListByCurrentUser() {
    getSelectDeptSysAdminListByCurrentUser().then((response: any) => {
      response.data.forEach((item: any) => {
        this.showData.formList[0].label.push({
          value: item.id,
          label: item.systemName,
        });
      });
      this.showData.formList[0].data = response.data[0].id;
      this.getSelectRoleListByUserIdAndSysId(response.data[0].id);
      this.changeGoldDialog = true;
    });
  }

  // 授权角色 选择部门
  getSelectRoleListByUserIdAndSysId(index: any) {
    const params = {
      sysId: index,
      userId: this.chooseTableButton.id,
    };
    getSelectRoleListByUserIdAndSysId(params).then((response: any) => {
      const data = response.data;
      data.haveList.forEach((item: any) => {
        this.showData.formList[1].data.push({
          key: item.id,
          label: item.roleName,
        });
      });

      data.noHaveList.forEach((item: any) => {
        this.showData.formList[1].defaultdata.push({
          key: item.id,
          label: item.roleName,
        });
      });
    });
  }

  // 编辑按钮 回显
  getUserDetail(id: number) {
    getUserDetail(id).then((response: any) => {
      this.newFormData = JSON.parse(JSON.stringify(this.formData));
      this.newFormData.formList.forEach((element: any) => {
        element.data = response.data[element.key];
      });
      this.changeGoldDialog = true;
    });
  }

  // 添加用户提交
  postUserAdd(data: any) {
    postUserAdd(data).then((response: any) => {
      this.postUserList();
      this.changeGoldDialog = false;
    });
  }

  // 编辑提交
  putUserUpdate(data: any) {
    putUserUpdate(data).then((response: any) => {
      this.postUserList();
      this.changeGoldDialog = false;
    });
  }

  // 删除列表
  deleteUserBatch(arrId?: string[]) {
    const id = arrId ? arrId : [this.chooseTableButton.id];
    deleteUserBatch(id).then((response: any) => {
      this.postUserList();
      this.changeGoldDialog = false;
    });
  }

  // 重置密码
  postResetPassword() {
    const id: any = [];
    this.selectList.forEach((item: any) => {
      id.push(item.id);
    });
    postResetPassword(id).then((response: any) => {
      this.postUserList();
      this.changeGoldDialog = false;
    });
  }

  // 授权提交
  postUserRoles(data: any) {
    postUserRoles(data).then((response: any) => {
      this.postUserList();
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
