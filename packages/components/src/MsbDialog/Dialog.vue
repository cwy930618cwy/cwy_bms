<template>
  <div class="dialog">llll</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide } from "vue-property-decorator";
import Button from "./Button/Button.vue";

@Component({
  components: { Button },
})
export default class Dialog extends Vue {
  @Prop({ default: "" }) title!: string;
  @Prop({ default: () => [] }) buttons!: (
    | string
    | { text: string; isSecondary: boolean }
  )[];
  @Provide() close() {
    this.$emit("close");
  }

  get sanitizedButtons() {
    return this.buttons.map((b) => {
      if (typeof b === "string") return { theme: "light-blue", text: b };
      return { theme: b.isSecondary ? "white" : "light-blue", text: b.text };
    });
  }
}
</script>

<style lang="scss">
@import "../common/functions.scss";
@import "../common/mixins.scss";
.dialog {
  width: dim(420);
  position: relative;
  overflow: hidden;
  border-radius: dim(4);
  background-color: white;
  box-shadow: dim(0) dim(2) dim(17) dim(0) rgba(0, 0, 0, 0.1);

  &__title {
    width: 100%;
    height: dim(42);
    border-top-left-radius: dim(4);
    border-top-right-radius: dim(4);
    line-height: dim(42);
    color: black;
    text-align: center;
    @include font-medium;
    background: #f7f7fa;
  }

  &__close {
    width: dim(20);
    height: dim(20);
    position: absolute;
    top: dim(10);
    right: dim(12);
    background-image: url("./cross.svg");
    background-repeat: no-repeat;
    background-position: center;
  }

  &__buttons {
    text-align: center;
  }

  &__button {
    display: inline-block;
    width: dim(144);
    margin-bottom: dim(30);
    &:not(:last-of-type) {
      margin-right: dim(12);
    }
  }
}
</style>