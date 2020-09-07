<template>
  <div class="content">
    <div class="components_search">
      <el-input placeholder="商品名称" v-model="orderList.productName" clearable></el-input>
      <el-input placeholder="订单编号" v-model="orderList.orderNumber" clearable></el-input>
      <el-select v-model="orderList.orderStatus" placeholder="请选择订单状态">
        <el-option
          v-for="(item, index) in statusList"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button @click="handleSearch">搜索</el-button>
    </div>
    <div class="components_handleList">
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
      <el-table-column prop="platformOrderName" align="center" label="平台订单号"></el-table-column>
      <el-table-column prop="productrName" align="center" label="商品名称"></el-table-column>
      <el-table-column prop="orderPrice" align="center" label="订单金额"></el-table-column>
      <el-table-column prop="tradeStatus" align="center" label="交易状态"></el-table-column>
      <el-table-column prop="orderName" align="center" label="订单编号"></el-table-column>
      <el-table-column prop="serviceId" align="center" label="业务标识"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="getOrderDetail(scope.row.id)">详情</el-button>
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
      title="订单详情"
      center
      :visible.sync="showAddDialog"
      @close="closeOrderForm"
      width="70%"
    >
      <div class="formList">
        <span class="formList__title">基本信息</span>
        <el-table class="formList__detail" :data="orderFormList.basicData" style="width: 100%">
          <el-table-column prop="orderName" label="订单号"></el-table-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column prop="userName" label="用户名"></el-table-column>
          <el-table-column prop="orderPrice" label="订单金额"></el-table-column>
          <el-table-column prop="orderStatus" label="订单状态"></el-table-column>
          <el-table-column prop="paymentMode" label="支付方式"></el-table-column>
        </el-table>
        <span class="formList__title">业务信息</span>
        <el-table class="formList__detail" :data="orderFormList.businessData" style="width: 100%">
          <el-table-column prop="platformId" label="平台ID"></el-table-column>
          <el-table-column prop="platformOrderName" label="支付订单编号"></el-table-column>
          <el-table-column prop="businessNumber" label="业务号"></el-table-column>
          <el-table-column prop="paymentId" label="支付ID"></el-table-column>
          <el-table-column prop="orderId" label="订单ID"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOrderForm">取 消</el-button>
        <el-button type="primary" @click="validOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class order extends Vue {
  // 搜索
  statusList = [
    {
      label: '待支付',
      value: 0,
    },
    {
      label: '已支付',
      value: 1,
    },
    {
      label: '已完成',
      value: 2,
    },
    {
      label: '已取消',
      value: 3,
    },
  ]
  // table列表
  orderList = {
    pageIndex: 1,
    length: 10,
    orderNumber: '',
    productName: '',
    orderStatus: null,
    id: null,
  }

  tableData: any = {}

  selectList = []

  // form列表
  orderFormList: any = {
    id: -1,
    platformOrderName: '',
    productrName: '',
    orderPrice: '',
    tradeStatus: '',
    orderName: '',
    serviceId: '',
  }
  defaultForm: any = {}

  rules = {
    platformOrderName: [
      { required: true, message: '请输入平台订单号', trigger: 'blur' },
    ],
    productrName: [
      { required: true, message: '请输入商品名称', trigger: 'blur' },
    ],
    orderPrice: [
      { required: true, message: '请输入订单金额', trigger: 'blur' },
    ],
    tradeStatus: [
      { required: true, message: '请输入交易状态', trigger: 'blur' },
    ],
    orderName: [{ required: true, message: '请输入订单编号', trigger: 'blur' }],
    serviceId: [{ required: true, message: '请输入业务标识', trigger: 'blur' }],
  }

  // 弹窗显示
  showAddDialog = false
  showDeleteDialog = false

  mounted() {
    this.getOrderList()
    this.defaultForm = JSON.parse(JSON.stringify(this.orderFormList))
  }

  // 搜索框
  handleSearch() {
    this.getOrderList()
  }

  // 分页选择当前页
  handleSelectionChange(val: []) {
    this.selectList = val
  }

  // 每页显示多少
  handleSizeChange(val: any) {
    this.orderList.length = val
  }

  // 分页选择
  currentChange(index: number) {
    this.orderList.pageIndex = index
    this.getOrderList()
  }

  // 删除按钮点击显示弹窗
  deleteCharacter(arrId?: string[]) {
    let id: any[] = []
    if (arrId) {
      id = [arrId]
    } else {
      if (this.selectList.length === 0) {
        this.$message({
          message: '请选择至少一名用户',
          type: 'warning',
        })
        return
      }
      this.selectList.forEach((item: any) => {
        id.push(item.id)
      })
    }
    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        this.postOrderDelete(id)
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        })
      })
  }

  // 添加/编辑按钮 关闭弹窗
  closeOrderForm() {
    this.orderFormList = JSON.parse(JSON.stringify(this.defaultForm))
    this.showAddDialog = false
  }

  // 添加/编辑系统验证
  validOrder() {
    ;(this.$refs.addForm as any).validate((valid: any) => {
      if (valid) {
        if (this.orderFormList.id >= 0) {
          this.postOrderUpdate()
        } else {
          this.postOrderAdd()
        }
      } else {
        return false
      }
    })
  }

  // 接口调取
  // 分页查询部门
  getOrderList() {
    const params = JSON.parse(JSON.stringify(this.orderList))
    params.id = Number(params.id)
    console.log('getOrderList')

    const tableData = {
      content: [
        {
          platformOrderName: '1',
        },
      ],
      total: 100,
    }

    this.tableData = tableData

    // getOrderList(params).then((response: any) => {
    //   const tableData = response.data
    //   tableData.content.forEach((element: any) => {
    //     element.enabled = !!element.enabled
    //   })
    //   this.tableData = tableData
    // })
  }

  // 编辑按钮 回显
  getOrderDetail(id: number) {
    this.orderFormList.id = id
    console.log('getOrderDetail---')
    this.showAddDialog = true

    const response = {
      basicData: [
        {
          orderName: '81479768242',
          productName: 'Java零基础从入门到就业',
          userName: '程序员的春天',
          orderPrice: 9980.0,
          orderStatus: '已付款',
          paymentMode: '支付宝',
        },
      ],
      businessData: [
        {
          platformId: 'ZFB-2233',
          platformOrderName: 'ZFB-2020827144800',
          businessNumber: 'ZFBA',
          paymentId: 'ZFBA1',
          orderId: '74002071414',
        },
      ],
    }

    this.orderFormList = response

    // getOrderDetail({ id: id }).then((response: any) => {
    //   Object.keys(this.orderFormList).forEach((key) => {
    //     this.orderFormList[key] = response.data[key]
    //   })
    //   this.showAddDialog = true
    // })
  }

  // 添加部门提交
  postOrderAdd() {
    console.log('添加部门提交---')
    // postOrderAdd(this.orderFormList).then((response: any) => {
    //   this.getOrderList()
    //   this.closeOrderForm()
    // })
  }

  // 编辑提交
  postOrderUpdate() {
    console.log('编辑提交----')
    // postOrderUpdate(this.orderFormList).then((response: any) => {
    //   this.getOrderList()
    //   this.closeOrderForm()
    // })
  }

  // 删除列表
  postOrderDelete(arrId: string[]) {
    const id = arrId ? arrId : this.selectList
    console.log('删除列表---')

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
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

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
  .formList {
    &__title {
      font-size: 22px;
    }
    &__detail {
      margin: 30px 0;
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
