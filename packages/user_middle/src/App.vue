<template>
  <div id="app" class="app">
    nima
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Input } from "components";

@Component({
  components: { Input },
})
export default class App extends Vue {
  ppp = "sss";
}
</script>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
  height: 100vh;
  min-width: 1186px;
  font-size: 20px;
}

* {
  box-sizing: border-box;
}
.app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  background: #f7f7fa;
  overflow: scroll;
}
</style>
