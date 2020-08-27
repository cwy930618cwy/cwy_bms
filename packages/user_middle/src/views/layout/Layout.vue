<template>
    <div class="app-wrapper">
        <!-- menu -->
        <Sidebar class="slidebar-container" :SlideData="SlideData"/>
        <div class="main-container">
            <Navbars/>
            <AppMain/>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Sidebar from './components/Sidebar/index.vue'
import Navbars from './components/Navbars.vue'
import AppMain from './components/AppMain.vue'
import SlideData from '../../api/get-sidebar/index'

@Component({
  components: { Sidebar, Navbars, AppMain }
})
export default class Layout extends Vue {
  SlideData: any[] = []

  mounted() {
    console.log('SlideData-',SlideData)
    this.SlideData = SlideData
  }
}

</script>

<style lang="scss" scoped>
@import '@/styles/functions.scss';
@import '@/styles/mixins.scss';

.app-wrapper{
  height: 100%;
  width: 100%;
}

.slidebar-container{
  height: 100%;
  width: dim(200);
  background: #304156;
  position: fixed;
  top: 0;
  left: 0;
}

.main-container{
  margin-left: dim(200);
  padding: dim(20);
  height: 100%;
}
</style>