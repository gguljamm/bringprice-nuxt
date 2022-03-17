/* eslint-disable */
import Vue from 'vue'
import Waterfall from './Waterfall.vue'
import WaterfallSlot from './WaterfallSlot.vue'

const plugin = {
  install(Vue, options) {
    Vue.component('Waterfall', Waterfall)
    Vue.component('WaterfallSlot', WaterfallSlot)
  }
}

Vue.use(plugin)
