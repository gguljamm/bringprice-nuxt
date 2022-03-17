<template>
  <div class="changeTimeMulti" v-if="init">
    <div
      class="tab"
      ref="tab"
    >
      <button
        v-for="(key, index) in Object.keys(this.slider)"
        @click="changeTab(index)"
        :key="index"
      >{{index + 1}}</button>
      <div class="tab-bottom">
        <div
          :style="{ width: `${(100 / Object.keys(this.slider).length)}%`, transform: `translateX(${tabVal}%)` }"
          class="tab-bottom-line"/>
      </div>
    </div>
    <div class="swiper-wrap">
      <div
        v-for="(val, index) in localData"
        :key="index"
        :class="tabFlag === index ? 'selected' : 'no-sel'"
        class="items-wrap">
        <div class="cityInfo">
          <p class="title">{{ tabFlag === 0 ? filterData.inputData.startCity.PlaceName : cityData[tabFlag - 1] }}(<span class="iataCode" v-for="code in airportCode[index]" :key="code">{{code}}</span>)
            출발</p>
          <p class="sub">{{ !cityData[tabFlag] ? filterData.inputData.startCity.PlaceName : cityData[tabFlag] }} 도착</p>
        </div>
        <div
          class="slider-wrap">
          <div
            class="times"
          >
            <div class="timesInfo">
              <div>
                <span v-if="index === 0">출발</span>
                <span v-if="index === 1">도착</span>
                <div>
                  <span class="min">{{ getTime(slider[index].value[0]) }}</span> - <span class="max">{{ getTime(slider[index].value[1]) }}</span>
                </div>
              </div>
              <span @click="reset(index)" class="reset">초기화</span>
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
  props: ['filterData', 'multiInfo'],
  data() {
    const localData = [...this.filterData.times];
    const airportCode = [];
    for (let x = 0; x < this.multiInfo.stopLength; x += 1) {
      const label = this.multiInfo.scheduleList[this.multiInfo.selectedIndex].FlightInfo[`Flight${x}`];
      const key = `${label.OriginPlace}|${label.DestinationPlace}|${label.OutboundDate}`;
      const data = this.multiInfo.liveList[key].data;
      let cityId = data.Query.OriginPlace;
      for (;;) {
        if (data.Places[cityId].Type === 'City' || !data.Places[cityId].ParentId) {
          break;
        }
        cityId = data.Places[cityId].ParentId;
      }
      const cityCode = data.Places[cityId].Code;
      airportCode.push(this.filterData.airports[cityCode] ? this.filterData.airports[cityCode].list.map(item => item.code) : []);
    }
    return {
      format: Format,
      init: false,
      tabFlag: 0,
      localData,
      slider: [],
      cityData: [],
      swiperTabOption: {
        autoHeight: true,
      },
      ArrRavelCities: this.multiInfo.scheduleList[this.multiInfo.selectedIndex].ArrRavelCities,
      airportCode,
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
      // console.log(this.localData);
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
  },
  mounted() {
    for (let x = 0; x < this.filterData.inputData.wishCities.length; x += 1) {
      this.cityData.push(this.filterData.inputData.wishCities[this.ArrRavelCities[x].City].PlaceName);
    }
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
  .changeTimeMulti {
    overflow-x: hidden;
    margin-top: 0;

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
          height: 2px;
          background-color: $dodger-blue;
          transition: transform 0.3s ease;

          &.left {
            transform: translateX(0);
          }

          &.right {
            transform: translateX(100%);
          }
        }
      }
    }

    .swiper-wrap {
      font-size: 0;
      white-space: nowrap;
      padding-bottom: 40px;
      .items-wrap {
        transition: .3s ease;
        width: 100%;
        display: inline-block;
        padding: 0 20px;
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
            margi-top: 10px;

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
