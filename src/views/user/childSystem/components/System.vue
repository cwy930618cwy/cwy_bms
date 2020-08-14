<template>
  <div class="system">
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
          @handle-selection-change="handleSelectionChange"
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
      v-if="changeGold"
      :buttons="chooseTableButton.dialogButton"
      class="company-content__dialog"
      :title="chooseTableButton.title"
      @close="close"
      @button-click="handleDialogButton"
    >
      <div class="company-content__dialog__center">
        <div>确定设置管理员</div>
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import Search from '@/views/user/components/Search/index.vue'
import Button from '@/views/user/components/Button/index.vue'
import Table from '@/views/user/components/Table/index.vue'
import Dialog from '@/views/user/components/dialog/Dialog.vue'
import NavMenu from '@/views/user/components/NavMenu/index.vue'
import Form from '@/views/user/components/Form/index.vue'
import Pagination from '@/components/Pagination/index.vue'
import { postUserList } from '@/api/department'
import { getDeptTree } from '@/api/department'
import { postAllocationSysAdmin } from '@/api/childSystem'

@Component({
  components: { Search, Table, Dialog, Form, Pagination, NavMenu, Button },
})
export default class Show extends Vue {
  @Prop({ default: () => [] }) parentId!: any

  // table列表
  userList = {
    pageIndex: 1,
    length: 1000,
    deptId: 0,
  }
  fields = [
    {
      prop: 'id',
      label: 'id',
    },
    {
      prop: 'username',
      label: '用户名',
    },
    {
      prop: 'nickname',
      label: '昵称',
    },
    {
      prop: 'phone',
      label: '手机',
    },
    {
      prop: 'email',
      label: '邮箱',
    },
    {
      prop: 'gender',
      label: '性别',
    },
  ]
  tableData: any = []
  selectList = []

  // 列表按钮控制
  buttonList = [
    {
      key: 'admin',
      name: '设置管理员',
    },
  ]

  // 部门树侧边栏
  navMenuData = []
  navMenuProp = {
    children: 'deptVOS',
    label: 'deptName',
  }

  // 搜索框
  searchList = [
    {
      type: 'Input',
      key: 'username',
      name: '',
      placeholder: '用户名',
    },
    {
      type: 'Input',
      key: 'phone',
      name: '',
      placeholder: '手机',
    },
  ]

  // 弹窗
  chooseTableButton: any = {}
  formSystemData: any = {
    formList: [
      {
        key: 'bumen',
        type: 'Checkbox',
        name: '所属系统',
        data: [],
        rules: [],
        defaultdata: [],
      },
    ],
  }

  changeGold = false

  mounted() {
    this.getUcDeptTree()
  }

  // 分页选择当前页
  handleSelectionChange(val: any) {
    this.selectList = val
  }

  // 搜索框
  handleSearch(data: any) {
    data.forEach((item: any) => {
      ;(this.userList as any)[item.key] = item.name
    })
    this.postUserList()
  }

  // 左边系统展示
  handleNavMenu(data: any) {
    this.userList.deptId = data.id
    this.postUserList()
  }

  // 分页选择
  currentChange(index: any) {
    this.userList.pageIndex = index.page
    this.userList.length = index.limit
    this.postUserList()
  }

  // 总体按钮点击弹窗
  handleButton(index: any) {
    if (this.selectList.length === 0) {
      this.$message({
        message: '请选择至少一名用户',
        type: 'warning',
      })
      return
    }
    ;(this.chooseTableButton = {
      type: 'edit',
      name: '设置管理员',
      title: '设置管理员',
      buttonType: 'primary',
      dialogButton: [
        {
          type: 'primary',
          value: '确认',
        },
        {
          type: 'info',
          value: '取消',
        },
      ],
    }),
      (this.changeGold = true)
  }

  // 弹窗按钮点击
  handleDialogButton(index: any) {
    if (index === 0) {
      this.postAllocationSysAdmin()
    } else {
      this.changeGold = false
    }
  }

  close() {
    this.changeGold = false
  }

  // 监听form值变化
  updateSystemData: any = {}
  @Watch('formSystemData', { immediate: true, deep: true })
  onChangeFormData(newVal: string[], oldVal: string) {
    this.updateSystemData = newVal
  }

  // 接口调取
  // 分页查询部门树
  getUcDeptTree() {
    const params = {
      pageNum: 1,
      pageSize: 1000,
    }
    getDeptTree(params).then((response: any) => {
      const content = response.data.content
      this.navMenuData = content
      this.userList.deptId = content[0].id
      this.postUserList()
    })
  }
  // 分页查询用户第三方信息
  postUserList() {
    postUserList(this.userList).then((response: any) => {
      this.tableData = response.data
    })
  }

  // 确认分配系统管理员
  postAllocationSysAdmin() {
    let idArr: any = []
    this.selectList.forEach((item: any) => {
      idArr.push(item.id)
    })
    const params = {
      systemIdList: [this.userList.deptId],
      userIdList: idArr,
    }
    console.log('sss', params)

    postAllocationSysAdmin(params).then((response: any) => {
      this.postUserList()
      this.changeGold = false
    })
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

.system {
  width: dim(900);
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
  .footer {
    display: flex;
  }
  ::v-deep .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
