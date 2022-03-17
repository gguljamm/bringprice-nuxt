<template>
  <div class="vue-waterfall-slot" :style="[style ? style : {'width': width + 'px'}]">
    <slot></slot>
  </div>
</template>
<style>
  .vue-waterfall-slot {
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    opacity: 0;
    box-sizing: border-box;
    transform: translate(0, 0);
    transition: opacity 500ms;
  }
</style>

<script>/* eslint-disable */
  export default {
    data: () => ({
      imageInfo: {},
      width: 0,
      height: 0,
      rect: {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      },
      style: null
    }),
    props: {
      state: {
        required: true
      },
      isWholeGrid: {
        type: Boolean,
        default: false
      },
      order: {
        default: 0
      }
    },
    methods: {
      notify () {
        this.$emit('reflow', this)
      },
      getMeta () {
        return {
          vm: this,
          node: this.$el,
          order: this.order,
          width: this.width,
          isWholeGrid: this.isWholeGrid,
          height: this.height,
          moveClass: this.moveClass
        }
      }
    },
    created () {
      let state = this.state
      if (state.delta.keeper.length - 1 > this.order) {
        this.notify()
        return
      }

      this.width = this.isWholeGrid ?  window.innerWidth : state.itemWidth
      this.$nextTick(() => {
        this.height = this.$el.clientHeight
        this.notify()
      })
    }
  }
</script>

