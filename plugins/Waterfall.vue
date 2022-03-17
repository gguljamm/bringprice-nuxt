<template>
  <div class="vue-waterfall" :style="outerStyle">
    <template  v-if="isShow">
      <waterfall-slot
        v-for="(item, index) in displayItems"
        :state="state"
        :isWholeGrid="item.isWholeGrid"
        :key="start + index"
        :order="start + index"
        @reflow="reflow"
      >
        <slot name="cell" :order="start + index" :item="item" :itemWidth="itemWidth" :index="start + index"></slot>
      </waterfall-slot>
    </template>
  </div>
</template>

<script>/* eslint-disable */
  import SectionManager from "./SectionManager"
  export default {
    props: {
      containerWidth: {
        required: true
      },
      containerHeight: {
        required: true,
        validator: (val) => val >= 0
      },
      defaultOffsetTop: {
        default: 0
      },
      waterfallState: {
        default: null
      },
      startGrid: {
        default: 1
      },
      scrollTop: {
        required: true
      },
      list: {
        required: true
      },
      itemPadding: {
        default: 0,
        validator: (val) => val >= 0
      }
    },
    data () {
      return {
        isShow: false,
        itemWidth: 0,
        createdSlots: [],
        start: 0,
        test: null,
        offsetTop: 0,
        end: 2,
        height: 0,
        state: this.waterfallState,
        scrollBuffer: 0, // scrollTop buffer
        scrollBufferRange: 100 // scrollTop buffer range
      }
    },
    beforeMount () {
    },
    mounted () {
      this.init(this.state)
      this.$nextTick(() => {
        if (this.state.tops !== null) {
          window.scrollTo(0, this.state.scrollPosition)
          this.updateStartEnd(false, this.state.scrollPosition, this.list.length)
        }
        this.isShow = true
      })
    },
    methods: {
      init () {
        this.offsetTop = this.$el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop)
        // console.log('init::::::::::::::: ', this.offsetTop, this.$el.offsetTop, window.scrollY)
        this._sectionManager = new SectionManager({
          state: this.waterfallState,
          offsetTop: this.offsetTop,
          containerWidth: this.containerWidth,
          containerHeight: this.containerHeight,
          scrollPosition: (window.pageYOffset || document.documentElement.scrollTop),
          itemPadding: this.itemPadding,
          startGrid: this.startGrid
        })
        this.$set(this, 'state', this._sectionManager.state)
        this.itemWidth = this._sectionManager.itemWidth
      },
      initFlushDisplayItems () {
        let _state = this._sectionManager.state
        if (this.list && this.list.length > 0) {
          if (this._sectionManager.isFirst) {
            if (parseInt(_state.style.height) >= this.containerHeight * 1.5 || this.list.length === _state.delta.viewPort.end) {
              this._sectionManager.isFirst = false
            } else {
              this.end++
              // this._sectionManager.viewPortEed = this.end
            }
          }
        }

      },
      reflow (meta) {
        this.createdSlots.push(meta)
        const $items = this.createdSlots
        let metas = $items.map((slot) => slot.getMeta())
        metas.sort((a, b) => a.order - b.order)
        this._sectionManager.calculate(metas)
        this.createdSlots = []
        if (this._sectionManager.state.isFirst) {
          this.initFlushDisplayItems()
        }
        if (this.end === this.list.length -1) {
          this.$emit('reflowed', this)
        }
      },
      flushDisplayItems (scrollTop) {
        this.state.scrollPosition = scrollTop
        let yVal = this.scrollBuffer - scrollTop
        let isToTop
        if (this.state.beforeScrollTop > scrollTop || scrollTop <= 0 ) {
          isToTop = true
        } else {
          isToTop = false
        }
        this.state.beforeScrollTop = scrollTop
        if (Math.abs(yVal) < this.scrollBufferRange) {
          return
        }
        this.scrollBuffer = scrollTop
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(() => {
            this.updateStartEnd(isToTop, scrollTop, this.list.length)
          })
        }
      },
      updateStartEnd (isToTop, scrollTop, total) {
        let res = this._sectionManager.viewPortFromTo(isToTop, scrollTop, total)
        if (res) {
          this.start = res.start
          this.end = res.end
        }
      }
    },
    computed: {
      displayItems () {
        return this.list.filter((item, index) => {
          return index >= this.start && index <= this.end
        })
      },
      outerStyle () {
        if (!this.state) {
          return {
            width: 0,
            height: 0
          }
        } else {
          return {
            height: this.state.style.height + "px",
            width: this.containerWidth + "px"
          }
        }

      },
    },
    watch: {
      list (pList) {
        this.updateStartEnd(false, this.scrollTop, pList.length)
      },
      scrollTop (scrollTop) {
        this.flushDisplayItems(scrollTop)
      }
    }
  }
</script>
<style scoped="scoped" lang="scss">
  .vue-waterfall {
    position: relative;
  }
</style>
