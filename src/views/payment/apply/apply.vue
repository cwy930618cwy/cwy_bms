<template>
  <div class="content">
    <div class="components_search">
      <el-input
        placeholder="应用名称"
        v-model="applyList.applyName"
        clearable
      ></el-input>
      <el-button @click="handleSearch">搜索</el-button>
    </div>
    <div class="components_handleList">
      <el-button type="primary" @click="addApply">添加</el-button>
      <el-button type="danger" @click="deleteCharacter()">删除</el-button>
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
      <el-table-column
        prop="applyName"
        align="center"
        label="应用名称"
      ></el-table-column>
      <el-table-column
        prop="applyDetail"
        align="center"
        label="应用描述"
      ></el-table-column>
      <el-table-column prop="applyPublich" align="center" label="应用公钥">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleKey('公钥', scope.row.applyPublich)"
            >查看</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="applyPrivate" align="center" label="应用私钥">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleKey('私钥', scope.row.applyPrivate)"
            >查看</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="applyCreateTime"
        align="center"
        label="创建时间"
      ></el-table-column>
      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="getApplyDetail(scope.row.id)"
            >详情</el-button
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
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>

    <el-dialog
      title="添加应用"
      center
      :visible.sync="showAddDialog"
      @close="closeAddForm"
      width="30%"
    >
      <div class="tableList">
        <el-form
          ref="addForm"
          :model="applyFormList"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="应用名称" prop="applyName">
            <el-input
              placeholder="请输入应用名称"
              v-model="applyFormList.applyName"
            ></el-input>
          </el-form-item>
          <el-form-item label="应用描述" prop="applyDetail">
            <el-input
              placeholder="请输入应用描述"
              v-model="applyFormList.applyDetail"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddForm">取 消</el-button>
        <el-button type="primary" @click="validApply">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="应用详情"
      center
      :visible.sync="showDetailDialog"
      @close="closeApplyForm"
      width="30%"
    >
      <el-form
        ref="detailForm"
        :model="applyDatailFormList"
        :rules="detailRules"
        label-width="80px"
      >
        <el-form-item label="应用名称" prop="applyName">
          <el-input
            placeholder="请输入应用名称"
            v-model="applyDatailFormList.applyName"
          ></el-input>
        </el-form-item>
        <el-form-item label="应用描述" prop="applyDetail">
          <el-input
            placeholder="请输入应用描述"
            v-model="applyDatailFormList.applyDetail"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <span>{{ applyDatailFormList.createTime }}</span>
        </el-form-item>
        <el-form-item label="修改时间" prop="modifyTime">
          <span>{{ applyDatailFormList.modifyTime }}</span>
        </el-form-item>
        <el-form-item label="公钥" prop="publicKey">
          <el-input
            type="textarea"
            placeholder="请输入公钥"
            v-model="applyDatailFormList.publicKey"
          ></el-input>
        </el-form-item>
        <el-form-item label="私钥" prop="publicKey">
          <el-input
            type="textarea"
            placeholder="请输入私钥"
            v-model="applyDatailFormList.praviteKey"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeApplyForm">取 消</el-button>
        <el-button type="primary" @click="closeApplyForm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="keyFormList.title"
      center
      :visible.sync="showKeyDialog"
      width="30%"
    >
      <el-input disabled type="textarea" :value="keyFormList.data"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCopy">复 制</el-button>
        <el-button type="primary" @click="showKeyDialog = false"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
// import {
//   getApplyList,
//   getApplyDetail,
//   postApplyAdd,
//   postApplyUpdate,
//   postApplyDelete,
//   postDoEnable,
//   postDoDeactivate,
// } from '@/api/childApply'

@Component({
  components: {}
})
export default class apply extends Vue {
  // table列表
  applyList = {
    pageIndex: 1,
    length: 10,
    applyName: "",
    id: null
  };

  tableData: any = {};

  selectList = [];

  // 公钥私钥
  keyFormList = {
    title: "公钥",
    data: ""
  };

  // form列表
  applyFormList: any = {
    id: -1,
    applyName: "",
    applyDetail: ""
  };
  defaultForm: any = {};

  rules = {
    applyName: [{ required: true, message: "请输入应用名称", trigger: "blur" }],
    applyDetail: [
      { required: true, message: "请输入应用描述", trigger: "blur" }
    ]
  };

  applyDatailFormList: any = {
    id: -1,
    applyName: "",
    applyDetail: "",
    createTime: "1022",
    modifyTime: "011",
    publicKey: "111",
    praviteKey: "222"
  };
  defaultDetailForm: any = {};

  detailRules = {
    applyName: [{ required: true, message: "请输入应用名称", trigger: "blur" }],
    applyDetail: [
      { required: true, message: "请输入应用描述", trigger: "blur" }
    ],
    publicKey: [{ required: true, message: "请输入公钥", trigger: "blur" }],
    praviteKey: [{ required: true, message: "请输入私钥", trigger: "blur" }]
  };

  // 弹窗显示
  showAddDialog = false;
  showDetailDialog = false;
  showKeyDialog = false;

  mounted() {
    this.getApplyList();
    this.defaultForm = JSON.parse(JSON.stringify(this.applyFormList));
    this.defaultDetailForm = JSON.parse(
      JSON.stringify(this.applyDatailFormList)
    );
  }

  // 搜索框
  handleSearch() {
    this.getApplyList();
  }

  // 添加按钮点击显示弹窗
  addApply() {
    this.showAddDialog = !this.showAddDialog;
  }

  // 查看公钥私钥
  handleKey(title: string, data: any) {
    this.keyFormList.title = title;
    this.keyFormList.data = data;
    this.showKeyDialog = true;
  }

  // 分页选择当前页
  handleSelectionChange(val: []) {
    this.selectList = val;
  }

  // 每页显示多少
  handleSizeChange(val: any) {
    this.applyList.length = val;
  }

  // 分页选择
  currentChange(index: number) {
    this.applyList.pageIndex = index;
    this.getApplyList();
  }

  // 关闭添加窗口
  closeAddForm() {
    this.applyFormList = JSON.parse(JSON.stringify(this.defaultForm));
    this.showAddDialog = false;
  }

  // 编辑按钮 关闭弹窗
  closeApplyForm() {
    console.log("编辑关闭--");
    this.applyDatailFormList = JSON.parse(
      JSON.stringify(this.defaultDetailForm)
    );
    this.showDetailDialog = false;
  }

  // 复制按钮
  handleCopy() {
    this.$copyText(this.keyFormList.data).then(
      e => {
        this.$message({
          message: "复制成功",
          type: "warning"
        });
      },
      e => {
        this.$message({
          message: "复制失败",
          type: "warning"
        });
      }
    );
    this.showKeyDialog = false;
  }

  // 添加/编辑系统验证
  validApply() {
    (this.$refs.addForm as any).validate((valid: any) => {
      if (valid) {
        if (this.applyFormList.id >= 0) {
          this.postApplyUpdate();
        } else {
          this.postApplyAdd();
        }
      } else {
        return false;
      }
    });
  }

  // 删除按钮点击显示弹窗
  deleteCharacter(arrId?: string[]) {
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
        this.postApplyDelete(id);
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

  // 接口调取
  // 分页查询部门
  getApplyList() {
    const params = JSON.parse(JSON.stringify(this.applyList));
    params.id = Number(params.id);
    console.log("分页查询部门----");

    this.tableData = {
      content: [
        {
          applyName: "111",
          applyPublich: "siyao",
          applyPrivate: "gpngyap"
        }
      ],
      total: 100
    };

    // getApplyList(params).then((response: any) => {
    //   const tableData = response.data
    //   tableData.content.forEach((element: any) => {
    //     element.enabled = !!element.enabled
    //   })
    //   this.tableData = tableData
    // })
  }

  // 编辑按钮 回显
  getApplyDetail(id: number) {
    this.applyFormList.id = id;
    console.log("编辑按钮 回显----");

    this.showDetailDialog = true;
    // getApplyDetail({ id: id }).then((response: any) => {
    //   Object.keys(this.applyFormList).forEach((key) => {
    //     this.applyFormList[key] = response.data[key]
    //   })
    //   this.showAddDialog = true
    // })
  }

  // 添加部门提交
  postApplyAdd() {
    console.log("添加部门提交---");

    // postApplyAdd(this.applyFormList).then((response: any) => {
    //   this.getApplyList()
    //   this.closeApplyForm()
    // })
  }

  // 编辑提交
  postApplyUpdate() {
    console.log("编辑提交--");

    // postApplyUpdate(this.applyFormList).then((response: any) => {
    //   this.getApplyList()
    //   this.closeApplyForm()
    // })
  }

  // 删除列表
  postApplyDelete(arrId: string[]) {
    const id = arrId ? arrId : this.selectList;
    console.log("删除列表---");

    // postRoleDelete(id).then((response: any) => {
    //   this.$message({
    //     type: 'success',
    //     message: '删除成功!',
    //   })
    //   this.getRoleList()
    // })
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
