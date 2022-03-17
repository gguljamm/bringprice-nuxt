<template>
  <div class="rating">
    <vue-slider
      ref="slider"
      class="priceSlider"
      v-bind="ratingSlider"
      v-model="ratingSlider.value"
      @callback="changeSlider"
    />
    <div class="sliderInfo"><span class="sliderValue">{{ ratingSlider.value + '+'}}</span> <span class="ratingText">{{ ratingText(ratingSlider.value) }} 이상</span></div>
    <div class=submitBtn>
      <transition name="fade">
        <span
          v-if="ratingSlider.value > 6"
          @click="resetRating"
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
export default {
  props: ['filterData', 'hotelsCount'],
  data() {
    return {
      timeOut: '',
      ratingSlider: {
        value: 6,
        width: '100%',
        height: 4,
        dotSize: 24,
        interval: 1,
        min: 6,
        max: 9,
        disabled: false,
        show: false,
        tooltip: 'focus',
        // dotStyle: {
        //   backgroundColor: '#000',
        // },
        bgStyle: {
          backgroundColor: '#cdcdcd',
        },
        processStyle: {
          backgroundColor: '#b2bfea',
        },
      },
    };
  },
  methods: {
    resetRating() {
      this.ratingSlider.value = 6;
      this.getHotelsCount();
    },
    ratingText(val) {
      let returnVal = '';
      switch (val) {
        case 6 :
          returnVal = '양호';
          break;
        case 7 :
          returnVal = '좋음';
          break;
        case 8 :
          returnVal = '우수';
          break;
        case 9 :
          returnVal = '최고';
          break;
        default :
          returnVal = '';
          break;
      }
      return returnVal;
    },
    changeSlider() {
      if (this.timeOut) {
        clearTimeout(this.timeOut);
      }
      this.timeOut = setTimeout(() => {
        this.getHotelsCount();
      }, 300);
    },
    getHotelsCount() {
      this.$emit('getHotelsCount', { key: 'filter.rating', val: this.ratingSlider.value });
    },
    submit() {
      this.$emit('apply-filter', { key: 'filter.rating', val: this.ratingSlider.value });
    },
  },
  mounted() {
    if (!Array.isArray(this.filterData)) {
      this.ratingSlider.value = this.filterData;
      setTimeout(() => {
        this.ratingSlider.show = true;
      }, 500);
    }
  },
};
</script>

<style lang="scss" scoped>
  .rating {
    .sliderInfo {
      margin-top: 10px;
      margin-bottom: 10px;
      padding-left: 10px;
      .sliderValue {
        color: #000;
      }
      .ratingText {
        color: #868686;
      }
    }
  }
</style>
