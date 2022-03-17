<template>
  <div class="changeTime" v-if="init">
    <div
      class="tab"
      ref="tab"
    >
      <button
        @click="changeTab(0)"
        :class="tabFlag === 0 ? 'selected' : ''"
      >가는 편</button>
      <button
        @click="changeTab(1)"
        :class="tabFlag === 1 ? 'selected' : ''"
      >오는 편</button>
      <div class="tab-bottom">
        <div
          :style="{ width: `${(100 / Object.keys(this.slider).length)}%`, transform: `translateX(${tabVal}%)` }"
          :class="tabFlag === 'start' ? 'left' : 'right'"
          class="tab-bottom-line"/>
      </div>
    </div>
    <div class="swiper-wrap">
      <div
        v-for="(val, index) in localData"
        :key="index"
        :class="tabFlag === 0 ? 'selected' : 'no-sel'"
        class="items-wrap">
        <div class="cityInfo">
          <p class="title">
            {{ tabFlag === 0 ? filterData.inputData.startCity.PlaceName : filterData.inputData.wishCities[0].PlaceName }}(<span class="iataCode" v-for="(code, index) in getIataCode(tabFlag)" :key="(index)">{{code}}</span>)
            출발
          </p>
          <p class="sub">{{ tabFlag === 0 ? filterData.inputData.wishCities[0].PlaceName : filterData.inputData.startCity.PlaceName }} 도착</p>
        </div>
        <div
          class="slider-wrap">
          <div
            class="times"
          >
            <div class="timesInfo">
              <div>
                <span>출발</span>
                <div>
                  <span class="min">{{ getTime(slider[index].value[0]) }}</span> - <span class="max">{{ getTime(slider[index].value[1]) }}</span>
                </div>
              </div>
              <transition name="fade">
                <span v-if="localData[index].start !==0 || localData[index].end !== 1440" @click="reset(index)" class="reset">초기화</span>
              </transition>
            </div>
            <vue-slider @drag-end="changeSlider(index)" v-bind="slider[index]" v-model="slider[index].value"></vue-slider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
export default {
  props: ['filterData'],
  data() {
    const localData = [{}, {}];
    for (let x = 0; x < this.filterData.times.length; x += 1) {
      Object.keys(this.filterData.times[x]).forEach((key) => {
        localData[x][key] = this.filterData.times[x][key];
      });
    }
    return {
      format: Format,
      init: false,
      tabFlag: 0,
      localData,
      cityData: [],
      slider: [],
      swiperTabOption: {
        autoHeight: true,
      },
      iataCode: [],
    };
  },
  computed: {
    tabVal() {
      let returnVal = 0;
      if (this.tabFlag !== 0) {
        for (let x = 0; x < this.localData.length; x += 1) {
          if (this.tabFlag === x && this.tabFlag !== 0) {
            returnVal = this.tabFlag;
            break;
          }
        }
        return returnVal * 100;
      }
      return returnVal;
    },
  },
  methods: {
    reset(index) {
      this.localData[index].start = 0;
      this.localData[index].end = 1440;
      this.slider[index].value = [0, 1440];
      this.submitData();
    },
    getTime(time) {
      if (time === 1440) {
        return '오후 11시 59분';
      }
      const hour = parseInt(time / 60, 10);

      return `${hour < 12 ? '오전' : '오후'} ${hour > 12 ? hour - 12 : hour}시 ${this.format.zeros((time % 60))}분`;
    },
    changeSlider(index) {
      this.localData[index].start = this.slider[index].value[0];
      this.localData[index].end = this.slider[index].value[1];
      this.submitData();
    },
    submitData() {
      this.$emit('submit-filter', this.localData, this.filterData.sortState, 'times');
    },
    changeTab(index) {
      this.tabFlag = index;
      const items = window.document.querySelectorAll('.items-wrap');
      items[0].style.marginLeft = `-${this.tabFlag * 100}%`;
      setTimeout(() => {
        this.slider[this.tabFlag].show = true;
      }, 300);
    },
    getIataCode(index) {
      if (Object.keys(this.filterData.airports).length > 0) {
        const key = Object.keys(this.filterData.airports)[index];
        return this.filterData.airports[key].list.map(item => item.code);
      }
      return '';
    },
  },
  mounted() {
    for (let x = 0; x < this.localData.length; x += 1) {
      this.slider.push({
        value: [this.localData && this.localData[x] ? this.localData[x].start : 0, this.localData && this.localData[x] ? this.localData[x].end : 1440],
        width: '100%',
        height: 4,
        dotSize: 24,
        interval: 30,
        min: 0,
        max: 1440,
        disabled: false,
        show: false,
        tooltip: 'none',
        bgStyle: {
          backgroundColor: '#cdcdcd',
        },
        processStyle: {
          backgroundColor: '#b2bfea',
        },
      });
    }
    this.$nextTick(() => {
      this.init = true;
      setTimeout(() => {
        this.slider[0].show = true;
      }, 500);
    });
  },
};
</script>

<style lang="scss" scoped>
  .changeTime{
    overflow-x: hidden;
    .tab {
      display: flex;
      flex-wrap: wrap;
      background-color: #fff;
      transition: all 0.3s ease;
      > button {
        transition: all 0.3s ease;
        flex: auto;
        padding: 0;
        border: 0;
        background-color: transparent;
        height: 40px;
        font-size: 14px;
        font-weight: 600;
        color: #585858;
        &.selected {
          color: $dodger-blue;
        }
      }
      .tab-bottom {
        transition: transform 0.3s ease;
        width: 100%;
        height: 2px;
        background-color: $very-light-pink;
        position: relative;

        .tab-bottom-line {
          position: absolute;
          width: 50%;
          height: 2px;
          background-color: $dodger-blue;
          transition: transform 0.3s ease;
        }
      }
    }
    .swiper-wrap {
      font-size: 0;
      white-space: nowrap;
      padding-bottom: 40px;
      .items-wrap {
        width: 100%;
        display: inline-block;
        transition: .3s ease;
        padding-right: 20px;
        padding-left: 20px;
        .cityInfo {
          margin-top: 20px;

          .title {
            font-size: 14px;
            color: #000;
            .iataCode{
              &::after{
                content: ', ';
              }
              &:last-of-type::after{
                content: '';
              }
            }
          }

          .sub {
            font-size: 12px;
            color: #868686;
          }
        }

        .slider-wrap {
          margin-top: 10px;

          .times {
            margin-top: 10px;

            > .timesInfo {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              margin-top: 10px;
              margin-bottom: 10px;

              > div {
                display: flex;
                justify-content: space-between;
                align-items: center;

                > span {
                  color: #000;
                }

                > div {
                  font-weight: bold;
                  margin-left: 5px;
                  color: $dodger-blue;
                }
              }

              .reset {
                font-size: 12px;
                color: #868686;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
</style>
