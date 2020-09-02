<template>
  <div class="content">
    <div class="components_search">
      <el-input placeholder="id" v-model="systemList.id" clearable></el-input>
      <el-input
        placeholder="系统标识"
        v-model="systemList.systemCode"
        clearable
      ></el-input>
      <el-input
        placeholder="系统名称"
        v-model="systemList.systemName"
        clearable
      ></el-input>
      <el-button @click="handleSearch">搜索</el-button>
    </div>
    <div class="components_handleList">
      <el-button type="primary" @click="addSystem">添加</el-button>
      <el-button type="danger" @click="deleteSystem()">删除</el-button>
      <el-button type="primary" @click="adminDepartment">设置管理员</el-button>
    </div>

    <el-table
      :data="tableData.content"
      tooltip-effect="dark"
      style="width: 100%"
      row-key="id"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column prop="id" align="center" label="ID"></el-table-column>
      <el-table-column prop="systemCode" align="center" label="系统标识">
      </el-table-column>
      <el-table-column
        prop="systemName"
        align="center"
        label="系统名称"
      ></el-table-column>
      <el-table-column
        prop="loginCallbackUrl"
        align="center"
        label="回调地址"
      ></el-table-column>
      <el-table-column
        prop="remark"
        align="center"
        label="备注"
      ></el-table-column>
      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="getSystemDetail(scope.row.id)"
            >编辑子系统</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="deleteSystem(scope.row.id)"
            >删除</el-button
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
      :title="systemFormName"
      center
      :visible.sync="showAddDialog"
      @close="closeSystemForm"
      width="30%"
    >
      <div class="tableList">
        <el-form
          ref="addForm"
          :model="systemFormList"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="系统标识" prop="systemCode">
            <el-input
              placeholder="请输入系统标识"
              v-model="systemFormList.systemCode"
            ></el-input>
          </el-form-item>
          <el-form-item label="系统名称" prop="systemName">
            <el-input
              placeholder="请输入系统名称"
              v-model="systemFormList.systemName"
            ></el-input>
          </el-form-item>
          <el-form-item label="回调地址" prop="loginCallbackUrl">
            <el-input
              placeholder="请输入回调地址"
              v-model="systemFormList.loginCallbackUrl"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              placeholder="请输入备注"
              v-model="systemFormList.remark"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSystemForm">取 消</el-button>
        <el-button type="primary" @click="validSystem">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="设置部门系统管理员"
      center
      :visible.sync="showAdminDialog"
      width="80%"
    >
      <div class="show">
        <System />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAdminDialog = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import System from "./components/System.vue";
import {
  getSystemList,
  getSystemDetail,
  postSystemAdd,
  postSystemUpdate,
  postSystemDelete
} from "@/api/childSystem";

@Component({
  components: { System }
})
export default class system extends Vue {
  // table列表
  systemList = {
    pageIndex: 1,
    length: 1000,
    systemCode: "",
    systemName: "",
    id: null
  };

  tableData: any = {};

  selectList = [];
  systemFormName = "添加子系统";

  // form列表
  systemFormList: any = {
    id: -1,
    systemCode: "",
    systemName: "",
    loginCallbackUrl: "",
    remark: ""
  };
  defaultForm: any = {};

  rules = {
    systemCode: [
      { required: true, message: "请输入系统标识", trigger: "blur" }
    ],
    systemName: [
      { required: true, message: "请输入系统名称", trigger: "blur" }
    ],
    loginCallbackUrl: [
      { required: true, message: "请输入回调地址", trigger: "blur" }
    ],
    remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
  };

  // 弹窗显示
  showAddDialog = false;
  showDeleteDialog = false;
  showAdminDialog = false;

  mounted() {
    this.getSystemList();
    this.defaultForm = JSON.parse(JSON.stringify(this.systemFormList));
  }

  // 搜索框
  handleSearch() {
    this.getSystemList();
  }

  // 添加按钮点击显示弹窗
  addSystem() {
    this.systemFormName = "添加子系统";
    this.showAddDialog = !this.showAddDialog;
  }

  // 删除按钮点击显示弹窗
  deleteSystem(arrId?: string[]) {
    let id: any[] = [];
    if (arrId) {
      id = [arrId];
    } else {
      if (this.selectList.length === 0) {
        this.$message({
          message: "请选择至少一名用户",
          type: "warning"
        });
        return;
      }
      this.selectList.forEach((item: any) => {
        id.push(item.id);
      });
    }
    this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.postSystemDelete(id);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }

  // 设置管理员
  adminDepartment() {
    this.showAdminDialog = true;
  }

  // 分页选择当前页
  handleSelectionChange(val: []) {
    this.selectList = val;
  }

  // 分页选择
  currentChange(index: number) {
    this.systemList.pageIndex = index;
    this.getSystemList();
  }

  // 添加/编辑按钮 关闭弹窗
  closeSystemForm() {
    this.systemFormList = JSON.parse(JSON.stringify(this.defaultForm));
    this.showAddDialog = false;
  }

  // 添加/编辑系统验证
  validSystem() {
    (this.$refs.addForm as any).validate((valid: any) => {
      if (valid) {
        if (this.systemFormList.id !== 0) {
          this.postSystemUpdate();
        } else {
          this.postSystemAdd();
        }
      } else {
        return false;
      }
    });
  }

  // 接口调取
  // 分页查询部门
  getSystemList() {
    const params = JSON.parse(JSON.stringify(this.systemList));
    params.id = Number(params.id);
    getSystemList(params).then((response: any) => {
      this.tableData = response.data;
    });
  }

  // 编辑按钮 回显
  getSystemDetail(id: number) {
    this.systemFormList.id = id;
    getSystemDetail({ id: id }).then((response: any) => {
      Object.keys(this.systemFormList).forEach(key => {
        this.systemFormList[key] = response.data[key];
      });
      this.systemFormName = "编辑子系统";
      this.showAddDialog = true;
    });
  }

  // 添加部门提交
  postSystemAdd() {
    postSystemAdd(this.systemFormList).then((response: any) => {
      this.getSystemList();
      this.closeSystemForm();
    });
  }

  // 编辑提交
  postSystemUpdate() {
    postSystemUpdate(this.systemFormList).then((response: any) => {
      this.getSystemList();
      this.closeSystemForm();
    });
  }

  // 删除列表
  postSystemDelete(arrId: string[]) {
    const id = arrId ? arrId : this.selectList;
    postSystemDelete(id).then((response: any) => {
      this.$message({
        type: "success",
        message: "删除成功!"
      });
      this.getSystemList();
    });
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/functions.scss";
@import "@/styles/mixins.scss";

.content {
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
.table {
  &__image {
    height: 100px;
    width: 100px;
    img {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
