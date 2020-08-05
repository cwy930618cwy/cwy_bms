<template>
    <!-- hidden:true 在导航菜单显示-->
    <div class="menu-wrapper">
        <el-menu-item :index="item.path">{{item.name}}</el-menu-item>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class SidebarItem extends Vue {
  @Prop({ default: null }) item!: Object

}
</script>