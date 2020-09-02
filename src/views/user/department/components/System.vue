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

    <el-table
      :data="tableData.content"
      tooltip-effect="dark"
      style="width: 100%"
      row-key="id"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
    >
      <el-table-column prop="id" align="center" label="ID"></el-table-column>
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
      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="getSelectSysAdminListByCurrentUser(scope.row.id)"
            >选择子系统</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        background
        @current-change="currentChange"
        :page-sizes="[10, 20, 30, 50]"
        layout="sizes, prev, pager, next, jumper"
        :total="tableData.total"
      ></el-pagination>
    </div>

    <el-dialog
      title="选择子系统"
      center
      :visible.sync="editSystemDialog"
      :append-to-body="true"
      @close="closeSystemForm"
      width="50%"
    >
      <div class="tableList">
        <el-form
          ref="systemForm"
          :model="systemFormList"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="所属系统" prop="deptName">
            <el-checkbox-group v-model="systemFormList.systemName">
              <el-checkbox
                v-for="(childItem, childIndex) in defaultSystemData"
                :key="childIndex"
                :label="childItem.value"
                >{{ childItem.label }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSystemForm">取 消</el-button>
        <el-button type="primary" @click="getAllocationDeptSysAdmin"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import {
  postUserList,
  getSelectSysAdminListByCurrentUser,
  getAllocationDeptSysAdmin
} from "@/api/department";
@Component
export default class system extends Vue {
  @Prop({ default: () => [] }) parentId!: any;

  // table列表
  systemList: any = {
    pageIndex: 1,
    length: 1000,
    id: null,
    deptId: null
  };

  tableData: any = {};

  // form列表
  systemFormList: any = {
    id: null,
    systemName: []
  };
  defaultForm: any = {};
  defaultSystemData: any = [];

  rules = {
    systemName: [{ required: true, message: "请选择所属系统", trigger: "blur" }]
  };

  // 弹窗显示
  editSystemDialog = false;

  mounted() {
    this.defaultForm = JSON.parse(JSON.stringify(this.systemFormList));
    this.postUserList();
  }

  // 搜索框
  handleSearch() {
    this.postUserList();
  }

  // 分页选择
  currentChange(index: number) {
    this.systemList.pageIndex = index;
    this.postUserList();
  }

  // 添加/编辑按钮 关闭弹窗
  closeSystemForm() {
    this.systemFormList = JSON.parse(JSON.stringify(this.defaultForm));
    this.editSystemDialog = false;
  }

  // 接口调取
  // 分页查询用户第三方信息
  postUserList() {
    this.systemList.deptId = this.parentId;
    postUserList(this.systemList).then((response: any) => {
      this.tableData = response.data;
    });
  }

  // 选择子系统
  getSelectSysAdminListByCurrentUser(id: Number) {
    this.systemFormList.id = id;
    getSelectSysAdminListByCurrentUser().then((response: any) => {
      this.defaultSystemData = [];
      response.data.forEach((element: any) => {
        this.defaultSystemData.push({
          value: element.id,
          label: element.systemName
        });
      });
      this.editSystemDialog = true;
    });
  }

  // 选择子系统确认
  getAllocationDeptSysAdmin() {
    const data = {
      userIdList: [this.systemFormList.id],
      systemIdList: this.systemFormList.systemName
    };
    getAllocationDeptSysAdmin(data).then((response: any) => {
      this.closeSystemForm();
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
