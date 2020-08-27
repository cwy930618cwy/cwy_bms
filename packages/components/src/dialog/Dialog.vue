<template>
  <div class="dialog">
    <div class="dialog__contain">
      <div class="dialog__content">
        <div class="dialog__title" v-if="title !== ''">{{ title }}</div>
        <div class="dialog__close" @click="$emit('close')"></div>
        <div class="dialog__content">
          <slot />
        </div>
        <div class="dialog__buttons">
          <el-button
            size="medium"
            v-for="(button, index) in buttons"
            :key="index"
            :type="button.type"
            @click="$emit('button-click', index)"
            >{{ button.value }}</el-button
          >
        </div>
      </div>
    </div>
    <div class="dialog__hidden" @click.stop="$emit('close')"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide } from "vue-property-decorator";

@Component({
  components: {},
})
export default class Dialog extends Vue {
  @Prop({ default: "" }) title!: string;
  @Prop({ default: () => [] }) buttons!: string[];
  @Prop({ default: () => [] }) width!: number;
  @Provide() close() {
    this.$emit("close");
  }
}
</script>

<style lang="scss">
@import "../common/functions.scss";
@import "../common/mixins.scss";

.dialog {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 10;
  &__contain {
    max-height: dim(700);
    overflow: scroll;
    position: absolute;
    border-radius: dim(20);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    background: white;
    opacity: 1;
    z-index: 12;
  }
  &__contain::-webkit-scrollbar {
    display: none;
  }
  &__content {
    // width: dim(420);
    min-width: dim(300);
    min-height: dim(160);
    display: flex;
    flex-direction: column;
    // align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    border-radius: dim(4);
    background-color: white;
    padding: dim(10);
  }
  &__title {
    width: 100%;
    height: dim(42);
    border-top-left-radius: dim(4);
    border-top-right-radius: dim(4);
    line-height: dim(42);
    color: black;
    text-align: center;
    @include font-medium;
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
    padding: dim(20);
  }

  &__button {
    display: inline-block;
    width: dim(144);
    margin-bottom: dim(30);
    &:not(:last-of-type) {
      margin-right: dim(12);
    }
  }
  &__hidden {
    position: absolute;
    background: rgba(0, 0, 0, 0.2);
    top: 0;
    left: 0;
    height: 100%;
    z-index: 11;
    width: 100%;
  }
}
</style>
