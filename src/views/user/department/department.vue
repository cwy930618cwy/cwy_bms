<template>
  <div class="department">
    <div class="components_search">
      <el-input
        placeholder="id"
        v-model="departmentList.id"
        clearable
      ></el-input>
      <el-input
        placeholder="部门名称"
        v-model="departmentList.departmentType"
        clearable
      ></el-input>
      <el-button @click="handleSearch">搜索</el-button>
    </div>
    <div class="components_handleList">
      <el-button type="primary" @click="addDepartment">添加</el-button>
      <el-button type="danger" @click="deleteDepartment()">删除</el-button>
      <el-button type="primary" @click="adminDepartment"
        >设置部门系统管理员</el-button
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
          @selection-change="handleSelectionChange"
        >
          >
          <el-table-column align="center" type="selection"></el-table-column>
          <el-table-column
            prop="id"
            align="center"
            label="ID"
          ></el-table-column>
          <el-table-column
            prop="deptName"
            align="center"
            label="部门名称"
          ></el-table-column>
          <el-table-column
            prop="tag"
            align="center"
            label="备注"
          ></el-table-column>
          <el-table-column fixed="right" align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="getDepartmentDetail(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="mini"
                @click="deleteDepartment(scope.row.id)"
                >删除</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="getShowDepartmentDetail(scope.row.id)"
                >显示</el-button
              >
            </template>
          </el-table-column>
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

    <el-dialog
      :title="departmentFormName"
      center
      :visible.sync="editDepartmentDialog"
      @close="closeDepartmentForm"
      width="30%"
    >
      <div class="tableList">
        <el-form
          ref="departmentForm"
          :model="departmentFormList"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="部门名称" prop="deptName">
            <el-input
              placeholder="请输入部门名称"
              v-model="departmentFormList.deptName"
            ></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input
              placeholder="请输入排序"
              v-model="departmentFormList.sort"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="tag">
            <el-input
              placeholder="请输入备注"
              v-model="departmentFormList.tag"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDepartmentForm">取 消</el-button>
        <el-button type="primary" @click="validDepartment">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title=""
      center
      :visible.sync="showDepartmentDialog"
      @close="closeShowForm"
      width="30%"
    >
      <div class="show">
        <div class="showList">
          <span class="item">部门名称:</span>
          <span>{{ departmentFormList.deptName }}</span>
        </div>
        <div class="showList">
          <span class="item">排序:</span>
          <span>{{ departmentFormList.sort }}</span>
        </div>
        <div class="showList">
          <span class="item">备注:</span>
          <span>{{ departmentFormList.tag }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeShowForm">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="设置部门系统管理员"
      center
      :visible.sync="showAdminDialog"
      width="80%"
    >
      <div class="show">
        <System :parentId="departmentList.parentId" />
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
  getDeptTree,
  postDeptList,
  getDeptDetail,
  postDeptUpdate,
  postDeptAdd,
  postDeptDelete
} from "@/api/department";

@Component({
  components: { System }
})
export default class department extends Vue {
  // 部门树侧边栏
  navMenuData = [];
  navMenuProp = {
    children: "deptVOS",
    label: "deptName"
  };
  // table列表
  departmentList: any = {
    pageIndex: 1,
    length: 1000,
    departmentType: "",
    parentId: null,
    id: null
  };

  tableData: any = {};

  selectList = [];
  departmentFormName = "添加部门";

  // form列表
  departmentFormList: any = {
    id: 0,
    deptName: "",
    sort: "",
    tag: ""
  };
  defaultForm: any = {};

  rules = {
    deptName: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
    sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
    tag: [{ required: true, message: "请输入备注", trigger: "blur" }]
  };

  // 弹窗显示
  editDepartmentDialog = false;
  showDeleteDialog = false;
  showDepartmentDialog = false;
  showAdminDialog = false;

  mounted() {
    this.getDeptTree();
    this.defaultForm = JSON.parse(JSON.stringify(this.departmentFormList));
  }

  // 左边系统展示
  handleNavMenu(data: any) {
    this.departmentList.parentId = data.id;
    this.postDepartmentList();
  }

  // 搜索框
  handleSearch() {
    this.postDepartmentList();
  }

  // 添加按钮点击显示弹窗
  addDepartment() {
    this.departmentFormName = "添加部门";
    this.editDepartmentDialog = !this.editDepartmentDialog;
  }

  // 删除按钮点击显示弹窗
  deleteDepartment(arrId?: string[]) {
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
        this.postDepartmentDelete(id);
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
    this.departmentList.pageIndex = index;
    this.postDepartmentList();
  }

  // 添加/编辑按钮 关闭弹窗
  closeDepartmentForm() {
    this.departmentFormList = JSON.parse(JSON.stringify(this.defaultForm));
    this.editDepartmentDialog = false;
  }

  // 显示按钮 关闭弹窗
  closeShowForm() {
    this.departmentFormList = JSON.parse(JSON.stringify(this.defaultForm));
    this.showDepartmentDialog = false;
  }

  // 添加/编辑部门验证
  validDepartment() {
    (this.$refs.departmentForm as any).validate((valid: any) => {
      if (valid) {
        if (this.departmentFormList.id !== 0) {
          this.postDepartmentUpdate();
        } else {
          this.postDepartmentAdd();
        }
      } else {
        return false;
      }
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
      this.departmentList.parentId = content[0].id;
      this.postDepartmentList();
    });
  }
  // 分页查询部门
  postDepartmentList() {
    const params = JSON.parse(JSON.stringify(this.departmentList));
    params.id = Number(params.id);
    postDeptList(params).then((response: any) => {
      this.tableData = response.data;
    });
  }

  // 编辑按钮 回显
  getDepartmentDetail(id: number) {
    this.departmentFormList.id = id;
    getDeptDetail(id).then((response: any) => {
      Object.keys(this.departmentFormList).forEach(key => {
        this.departmentFormList[key] = response.data[key];
      });
      this.departmentFormName = "编辑部门";
      this.editDepartmentDialog = true;
    });
  }

  // 显示按钮 回显
  getShowDepartmentDetail(id: number) {
    this.departmentFormList.id = id;
    getDeptDetail(id).then((response: any) => {
      Object.keys(this.departmentFormList).forEach(key => {
        this.departmentFormList[key] = response.data[key];
      });
      this.showDepartmentDialog = true;
    });
  }

  // 添加部门提交
  postDepartmentAdd() {
    postDeptAdd(this.departmentFormList).then((response: any) => {
      this.postDepartmentList();
      this.closeDepartmentForm();
    });
  }

  // 编辑提交
  postDepartmentUpdate() {
    postDeptUpdate(this.departmentFormList).then((response: any) => {
      this.postDepartmentList();
      this.closeDepartmentForm();
    });
  }

  // 删除列表
  postDepartmentDelete(arrId: string[]) {
    const id = arrId ? arrId : this.selectList;
    postDeptDelete(id).then((response: any) => {
      this.$message({
        type: "success",
        message: "删除成功!"
      });
      this.postDepartmentList();
    });
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/functions.scss";
@import "@/styles/mixins.scss";

.department {
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
