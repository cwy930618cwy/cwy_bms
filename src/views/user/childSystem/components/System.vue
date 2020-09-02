<template>
  <div class="system">
    <div class="components_search">
      <el-input placeholder="id" v-model="systemList.id" clearable></el-input>
      <el-input
        placeholder="用户名"
        v-model="systemList.username"
        clearable
      ></el-input>
      <el-input
        placeholder="手机"
        v-model="systemList.phone"
        clearable
      ></el-input>
      <el-button @click="handleSearch">搜索</el-button>
    </div>

    <div class="components_handleList">
      <el-button type="primary" size="mini" @click="setAdmin()"
        >设置管理员</el-button
      >
    </div>

    <div class="contain">
      <div class="left">
        <el-tree
          :data="navMenuData"
          highlight-current
          :props="navMenuProp"
          @node-click="handleNavMenu"
        ></el-tree>
      </div>
      <div class="right">
        <el-table
          :data="tableData.content"
          tooltip-effect="dark"
          style="width: 100%"
          row-key="id"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
          @selection-change="handleSelectionChanges"
        >
          <el-table-column align="center" type="selection"></el-table-column>
          <el-table-column
            prop="id"
            align="center"
            label="ID"
          ></el-table-column>
          <el-table-column
            prop="username"
            align="center"
            label="用户名"
          ></el-table-column>
          <el-table-column
            prop="nickname"
            align="center"
            label="昵称"
          ></el-table-column>
          <el-table-column
            prop="phone"
            align="center"
            label="手机"
          ></el-table-column>
          <el-table-column
            prop="email"
            align="center"
            label="邮箱"
          ></el-table-column>
          <el-table-column
            prop="gender"
            align="center"
            label="性别"
          ></el-table-column>
        </el-table>
      </div>
    </div>

    <div class="pagination-container">
      <el-pagination
        background
        @current-change="currentChange"
        :page-sizes="[10, 20, 30, 50]"
        layout="sizes, prev, pager, next, jumper"
        :total="tableData.total"
      ></el-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { postUserList } from "@/api/department";
import { getDeptTree } from "@/api/department";
import { postAllocationSysAdmin } from "@/api/childSystem";
@Component
export default class system extends Vue {
  @Prop({ default: () => [] }) parentId!: any;

  // 部门树侧边栏
  navMenuData = [];
  navMenuProp = {
    children: "deptVOS",
    label: "deptName"
  };
  // table列表
  systemList: any = {
    pageIndex: 1,
    length: 1000,
    id: null,
    deptId: null
  };

  selectList = [];
  tableData: any = {};

  // form列表
  systemFormList: any = {
    id: null,
    systemName: []
  };
  defaultSystemData: any = [];

  rules = {
    systemName: [{ required: true, message: "请选择所属系统", trigger: "blur" }]
  };

  // 弹窗显示
  editSystemDialog = false;

  mounted() {
    this.getDeptTree();
  }

  // 左边系统展示
  handleNavMenu(data: any) {
    this.systemList.deptId = data.id;
    this.postUserList();
  }

  // 搜索框
  handleSearch() {
    this.postUserList();
  }

  // 分页选择当前页
  handleSelectionChanges(val: []) {
    this.selectList = val;
  }

  // 分页选择
  currentChange(index: number) {
    this.systemList.pageIndex = index;
    this.postUserList();
  }

  setAdmin(id: number) {
    if (this.selectList.length === 0) {
      this.$message({
        message: "请选择至少一名用户",
        type: "warning"
      });
      return;
    }
    this.$confirm("确定设置管理员, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.postAllocationSysAdmin();
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消设置管理员"
        });
      });
  }

  // 接口调取
  // 分页查询部门树
  getDeptTree() {
    const params = {
      pageNum: 1,
      pageSize: 1000
    };
    getDeptTree(params).then((response: any) => {
      const content = response.data.content;
      this.navMenuData = content;
      this.systemList.deptId = content[0].id;
      this.postUserList();
    });
  }
  // 分页查询用户第三方信息
  postUserList() {
    postUserList(this.systemList).then((response: any) => {
      this.tableData = response.data;
    });
  }
  // 确认分配系统管理员
  postAllocationSysAdmin() {
    let idArr: any = [];
    this.selectList.forEach((item: any) => {
      idArr.push(item.id);
    });
    const params = {
      systemIdList: [this.systemList.deptId],
      userIdList: idArr
    };

    postAllocationSysAdmin(params).then((response: any) => {
      this.postUserList();
      this.$message({
        type: "info",
        message: "已成功设置管理员"
      });
    });
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/functions.scss";
@import "@/styles/mixins.scss";

.system {
  background: white;
  padding: dim(30) dim(20);
  position: relative;
  margin: dim(20);
  .contain {
    width: 100%;
    display: flex;
    margin-bottom: dim(40);
    .left {
      width: dim(200);
      border: dim(1) solid #eee;
    }
    .right {
      padding: 0 dim(20);
      flex: 1;
      height: 100%;
    }
  }
  .showList {
    text-align: left;
    margin-top: dim(20);
    font-size: dim(20);
    color: #606266;
    .item {
      margin-right: dim(10);
    }
  }
}
.company-content__dialog__center {
  height: 100%;
  width: 100%;
}

.components_search {
  display: flex;
  margin-bottom: dim(10);
  .el-input {
    width: dim(140);
    margin-right: dim(10);
    display: flex;
    align-items: center;
    ::v-deep .el-input__inner {
      height: dim(30) !important;
    }
    ::v-deep .el-input__suffix {
      display: flex;
      align-items: center;
    }
  }
  .el-select {
    margin-right: dim(10);
    ::v-deep .el-input__inner {
      height: dim(30) !important;
    }
    ::v-deep .el-input__suffix {
      display: flex;
      align-items: center;
    }
  }
  .el-button {
    height: 30px;
    line-height: 30px;
    padding: 0 30px;
  }
}

.components_handleList {
  display: flex;
  height: dim(36);
  margin-bottom: dim(20);
}

.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
