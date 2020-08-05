<template>
    <el-scrollbar wrap-class="scrollbar-wrapper" class="sidebar">
        <!--
            show-timeout 展开延时
            collapse: 是否水平折叠收起菜单
        -->
        <div class="contain" @click="$router.push('/page1')">用户</div>
        <el-menu
          class="menu"
          :show-timeout="200"
          :default-active="$router.path"
          mode="vertical"
          :collapse="isCollpse"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          router
        >
            <!-- ！！！bug -->
            <sidebar-item v-for="route in SlideData" :item="route" :key="route.path"/>
            <!-- <div class="menu-wrapper" v-for="route in routes" :key="route.path">
              <el-menu-item :index="route">{{route.path}}</el-menu-item>
            </div> -->
        </el-menu>
    </el-scrollbar>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import SidebarItem from './sidebarItem.vue'

@Component({
  components: { SidebarItem }
})
export default class Sidebar extends Vue {
  permission_routes = ['/page1','/page2']
  isCollpse = true

  @Prop({
    default:{}
  })
  SlideData!: any

  handleOpen(){
    console.log('handleOpen')
  }

  handleClose(){
    console.log('handleClose-')
  }

}
</script>

<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

.sidebar{
  .contain{
    text-align: center;
    line-height: dim(100);
    font-size: dim(40);
    height: dim(100);
    background: rgb(48, 65, 86);
    color: white;
  }
  .menu{
    width: 100%;
    border: none;
  }
}
</style>


