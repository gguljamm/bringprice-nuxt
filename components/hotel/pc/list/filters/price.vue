<template>
  <div class="priceRating">
    <div class="info-title">
      <div>
        <p class="info-1">1박 당 기본 금액</p>
        <p class="info-2">지방세 수수료 포함</p>
      </div>
    </div>
    <vue-slider
      ref="slider1"
      class="priceSlider"
      v-bind="priceSlider"
      v-model="priceSlider.value"
      @callback="priceSliderChange"
    />
    <div class="info-slider">
      <div>
        <input
          ref="minPrice"
          @paste.prevent
          type="text"
          class="slider-val"
          v-on:input="onlyNumber($event, 'min')"
          :placeholder="format.priceFormat(price.min)"
        >원
      </div>
      <span style="color: #000;font-size: 14px">~</span>
      <div>
        <input
          ref="maxPrice"
          @paste.prevent
          type="text"
          class="slider-val"
          v-on:input="onlyNumber($event, 'max')"
          :placeholder="format.priceFormat(price.max)"
        >원
      </div>
    </div>
    <div class=submitBtn>
      <transition name="fade">
        <span
          v-if="price.min > 0 || price.max < 2000000"
          @click="reset"
          class="reset">초기화</span>
      </transition>
      <div class="btnWrap">
        <transition name="fade">
          <span
            v-if="hotelsCount"
            class="count">{{ hotelsCount >= 300 ? '300+' : `${hotelsCount}개` }}</span>
        </transition>
        <button
          @click="submit"
          class="submit">적용</button>
      </div>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['filterData', 'hotelsCount'],
  data() {
    return {
      format: Format,
      price: {
        min: this.filterData['filter.minPrice'] || 0,
        max: this.filterData['filter.maxPrice'] || 2000000,
      },
      priceSlider: {
        value: [
          this.filterData['filter.minPrice'] || 0,
          this.filterData['filter.maxPrice'] || 2000000,
        ],
        width: '100%',
        height: 4,
        dotSize: 24,
        interval: 1000,
        min: 0,
        max: 2000000,
        disabled: false,
        show: false,
        tooltip: 'none',
        enableCross: false,
        bgStyle: {
          backgroundColor: '#cdcdcd',
        },
        processStyle: {
          backgroundColor: '#b2bfea',
        },
      },
      timeOut: '',
      minPlaceholder: '',
    };
  },
  methods: {
    onlyNumber(ev, type) {
      const event = ev;
      const val = this.format.priceReFormat(ev.target.value);
      const flag = isNaN(val * 1);
      if (!flag) {
        if (((type === 'max' && (val * 1) <= 2000000) || (type === 'min' && (val * 1) >= 0 && (val * 1) < 2000000)) && val) {
          const arr = [type === 'min' ? val : this.priceSlider.value[0], type === 'max' ? val : this.priceSlider.value[1]];
          this.priceSlider.value = arr;
          this.price[type] = this.priceSlider.value[type === 'min' ? 0 : 1];
          event.target.value = this.format.priceFormat(val);
          this.getHotelsCount();
        }
      } else {
        event.target.value = this.format.priceFormat(this.priceSlider.value[type === 'min' ? 0 : 1]);
      }
    },
    priceSliderChange(val) {
      this.$refs.minPrice.value = this.format.priceFormat(val[0]);
      this.$refs.maxPrice.value = this.format.priceFormat(val[1]);
      this.price.min = val[0];
      this.price.max = val[1];
      this.getHotelsCount();
    },
    reset() {
      this.$refs.minPrice.value = this.format.priceFormat(0);
      this.$refs.maxPrice.value = this.format.priceFormat(2000000);
      this.price.min = 0;
      this.price.max = 2000000;
      this.priceSlider.value = [0, 2000000];
      this.getHotelsCount();
    },
    getHotelsCount() {
      const obj = [
        {
          key: 'filter.minPrice',
          val: this.price.min !== 0 ? this.price.min : 0,
        },
        {
          key: 'filter.maxPrice',
          val: this.price.max !== 0 ? this.price.max : 0,
        },
      ];
      if (this.timeOut) {
        clearTimeout(this.timeOut);
      }
      this.timeOut = setTimeout(() => {
        this.$emit('getHotelsCount', obj);
      }, 300);
    },
    submit() {
      const obj = [
        {
          key: 'filter.minPrice',
          val: this.price.min !== 0 ? this.price.min : 0,
        },
        {
          key: 'filter.maxPrice',
          val: this.price.max !== 2000000 ? this.price.max : 0,
        },
      ];
      this.$emit('apply-filter', obj);
    },
  },
  mounted() {
    if (!Array.isArray(this.filterData)) {
      setTimeout(() => {
        this.priceSlider.show = true;
      }, 500);
    }
  },
};
</script>

<style lang="scss" scoped>
  .priceRating{
    .info-title{
      margin-bottom: 20px;
      .info-1{
        font-size: 14px;
        line-height: 20px;
        color: #000;
      }
      .info-2{
        font-size: 12px;
        line-height: 16px;
        color: #868686;
      }
    }
    .info-slider{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      color: #000;
      .slider-val{
        margin-right: 5px;
        font-size: 14px;
        text-align: right;
        width: 106px;
        height: 30px;
        border-radius: 2px;
        border: solid 1px #cdcdcd;
        background-color: #f9f9f9;
        padding-right: 5px;
        transition: .3s ease;
        &:focus{
          border: 1px solid $dodger-blue;
          background-color: #e9eeff;
        }
      }
    }
  }
</style>
