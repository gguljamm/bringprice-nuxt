<template>
  <div class="etcFilter">
    <div class="timeFilter">
      <div class="airportWrap"
        v-if="filterData.maxFlightDuration !== 0"
      >
        <div
          class="times">
          <div class="timesInfo">
            <div>
              <p class="airport-title">구간별 소요시간</p>
              <div>
                <div
                  :class="maxFlightDurationSlider.value !== filterData.maxFlightDuration ? 'active' : ''"
                >
                  <span class="min">{{ format.getDurationString(filterData.minFlightDuration) }}</span> - <span class="max">{{ format.getDurationString(maxFlightDurationSlider.value) }}</span>
                </div>
                <transition name="fade">
                  <span v-if="maxFlightDurationSlider.value !== filterData.maxFlightDuration" @click="reset('durationSliderVal', filterData.maxFlightDuration)" class="reset">초기화</span>
                </transition>
              </div>
            </div>
          </div>
          <vue-slider @drag-end="changeDurationSlider" v-bind="maxFlightDurationSlider" v-model="maxFlightDurationSlider.value"></vue-slider>
        </div>
      </div>
      <div v-else class="centerSpinner"><div class="spinner"></div></div>
      <div
        v-if="!(localData.stops.indexOf(1) >= 0 && localData.stops.indexOf(2) >= 0) && filterData.maximumMaxStopsTime > 0"
        class="airportWrap">
        <div class="times">
          <div class="timesInfo">
            <div>
              <p class="airport-title">구간별 공항 체류시간</p>
              <div>
                <div
                  :class="stopsSlider.value !== filterData.maximumMaxStopsTime ? 'active' : ''"
                >
                  <span class="min">{{ format.getDurationString(filterData.maximumMinStopsTime) }}</span> - <span class="max">{{ format.getDurationString(stopsSlider.value) }}</span>
                </div>
                <span v-if="stopsSlider.value !== filterData.maximumMaxStopsTime" @click="reset('stopsSliderVal', filterData.maximumMaxStopsTime)" class="reset">초기화</span>
              </div>
            </div>
          </div>
          <vue-slider @drag-end="changeStopsSlider" v-bind="stopsSlider" v-model="stopsSlider.value"></vue-slider>
        </div>
      </div>
    </div>
    <div class="airportWrap">
      <p class="airport-title">공항</p>
      <div>
        <ul class="check-list">
          <li
            v-for="(x, index) in Object.keys(localData.airportsFlag)"
            :key="index"
            @click.stop.prevent="setAirportsFlag(x)"
          >
            <div>
              <label :for="`${x}${index}`" class="check">
                <div>
                  <div class="check-wrap">
                    <input type="checkbox" :id="`${x}${index}`" class="inputCheck">
                    <span class="checked" :style="localData.airportsFlag[x] ? { backgroundColor: '#537aff' } : { backgroundColor: '#fff' }" :class="localData.airportsFlag[x] ? 'active' : ''">
                    <transition name="fade">
                      <div class="checkSvg"  v-if="localData.airportsFlag[x]">
                        <svg viewBox="0 0 52 52" fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-width="3" focusable="false" aria-hidden="true" role="presentation" stroke-linecap="round" stroke-linejoin="round" style="height: 1em; width: 1em; display: block; overflow: visible;"><path d="m19.1 25.2 4.7 6.2 12.1-11.2"></path></svg>
                      </div>
                    </transition>
                  </span>
                    <span class="title" v-if="x === 'sameAirportAtTransfer'">경유 시, 공항 변경 없음</span>
                    <span class="title" v-if="x === 'sameAirportAtInOut'">출/도착 공항 동일</span>
                  </div>
                </div>
              </label>
            </div>
          </li>
        </ul>
      </div>
      <div
        v-for="x in Object.keys(filterData.allList.airport)"
        :key="Object.keys(filterData.allList.airport)[x]"
        class="airportListWrap"
      >
        <div class="title-wrap">
          <div
            @click="filterData.allList.airport[x].list.length > 1 ? setAllList(filterData.allList.airport[x].list) : ''"
            class="type-check">
            <p class="name">
              {{ filterData.allList.airport[x].name }}
<!--              <transition name="fade">-->
<!--                <span v-if="filterData.allList.airport[x].list.every(v2 => localData.airports.indexOf(v2.code) === -1)" class="sub"> 모든공항</span>-->
<!--              </transition>-->
            </p>
<!--            <transition name="fade">-->
<!--              <div v-if="filterData.allList.airport[x].list.every(v2 => localData.airports.indexOf(v2.code) === -1)" class="checkIcon"></div>-->
<!--            </transition>-->
          </div>
        </div>
        <div class="airportList">
          <ul
            class="check-list">
            <li
              v-for="(y, index) in filterData.allList.airport[x].list"
              :key="index"
            >
              <div>
                <label :for="Object.keys(filterData.allList.airport)[x]" class="check">
                  <div>
                    <div class="check-wrap">
                      <input
                        type="checkbox"
                        :id="Object.keys(filterData.allList.airport)[x]"
                        class="inputCheck" @click.stop.prevent="filterData.allList.airport[x].list.length > 1 ? setLocalData(y.code) : ''"
                      >
                      <span class="checked" :class="{
                        disable: filterData.allList.airport[x].list.length <= 1 || (localData.airports.indexOf(y.code) < 0 && filterData.allList.airport[x].list.filter(z => localData.airports.indexOf(z.code) < 0).length === 1),
                        active: localData.airports.indexOf(y.code) < 0
                      }">
                        <transition name="fade">
                          <div class="checkSvg"  v-if="localData.airports.indexOf(y.code) < 0">
                            <svg viewBox="0 0 52 52" fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-width="3" focusable="false" aria-hidden="true" role="presentation" stroke-linecap="round" stroke-linejoin="round" style="height: 1em; width: 1em; display: block; overflow: visible;"><path d="m19.1 25.2 4.7 6.2 12.1-11.2"></path></svg>
                          </div>
                        </transition>
                      </span>
                      <span class="title">{{ y.name }}</span>
                      <span class="nameCode">{{ y.code }}</span>
                    </div>
                  </div>
                </label>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '~/assets/scss/flip.scss'; // eslint-disable-line
import '~/assets/scss/spinner.scss'; // eslint-disable-line
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['filterData'],
  data() {
    const localData = {};
    localData.airports = [...this.filterData.airports];
    localData.airportsFlag = this.filterData.airportsFlag;
    localData.maxStopsTime = this.filterData.maxStopsTime;
    localData.flightDuration = this.filterData.flightDuration;
    localData.stops = [...this.filterData.stops];
    const stopsSlider = {
      value: localData.maxStopsTime,
      width: '100%',
      height: 4,
      dotSize: 24,
      interval: 30,
      min: this.filterData.maximumMinStopsTime,
      max: this.filterData.maximumMaxStopsTime,
      disabled: this.filterData.maximumMaxStopsTime === 0 || (localData.stops.indexOf(1) >= 0 && localData.stops.indexOf(2) >= 0),
      show: false,
      tooltip: 'none',
      bgStyle: {
        backgroundColor: '#cdcdcd',
      },
      processStyle: {
        backgroundColor: '#b2bfea',
      },
    };
    const maxFlightDurationSlider = {
      value: localData.flightDuration,
      width: '100%',
      height: 4,
      dotSize: 24,
      interval: 30,
      min: this.filterData.minFlightDuration,
      max: this.filterData.maxFlightDuration,
      disabled: false,
      show: false,
      tooltip: 'none',
      bgStyle: {
        backgroundColor: '#cdcdcd',
      },
      processStyle: {
        backgroundColor: '#b2bfea',
      },
    };
    return {
      stopsSlider,
      maxFlightDurationSlider,
      format: Format,
      localData,
      stopsSliderVal: localData.maxStopsTime,
      durationSliderVal: localData.flightDuration,
    };
  },
  methods: {
    reset(key) {
      let sendKey = '';
      if (key === 'durationSliderVal') {
        sendKey = 'flightDuration';
        this.maxFlightDurationSlider.value = this.filterData.maxFlightDuration;
        this.durationSliderVal = this.filterData.maxFlightDuration;
      } else {
        sendKey = 'maxStopsTime';
        this.stopsSlider.value = this.filterData.maximumMaxStopsTime;
        this.stopsSliderVal = this.filterData.maximumMaxStopsTime;
      }
      const obj = sendKey === 'flightDuration' ? { flightDuration: this.durationSliderVal } : { maxStopsTime: this.stopsSliderVal };
      this.$emit('submit-filter', obj, this.filterData.sortState, sendKey);
    },
    changeDurationSlider() {
      this.durationSliderVal = this.maxFlightDurationSlider.value;
      this.$emit('submit-filter', { flightDuration: this.durationSliderVal }, this.filterData.sortState, 'flightDuration');
    },
    changeStopsSlider() {
      this.stopsSliderVal = this.stopsSlider.value;
      // console.log(this.stopsSlider[0], this.stopsSlider[1]);
      this.$emit('submit-filter', { maxStopsTime: this.stopsSliderVal }, this.filterData.sortState, 'maxStopsTime');
    },
    setAirportsFlag(key) {
      this.localData.airportsFlag[key] = !this.localData.airportsFlag[key];
      this.$emit('submit-filter', this.localData.airportsFlag[key], this.filterData.sortState, key);
    },
    setAllList(data) {
      data.forEach((item) => {
        const flag = this.localData.airports.indexOf(item.code);
        if (flag < 0) {
          this.localData.airports.push(item.code);
        } else {
          this.localData.airports.splice(flag, 1);
        }
      });
    },
    setLocalData(code) {
      const arr = Object.values(this.filterData.allList.airport).find(x => x.list.find(y => y.code === code)).list;
      if (this.localData.airports.indexOf(code) < 0 && arr.filter(x => this.localData.airports.indexOf(x.code) < 0).length === 1) {
        return;
      }
      const flag = this.localData.airports.indexOf(code);
      if (flag < 0) {
        this.localData.airports.push(code);
      } else {
        this.localData.airports.splice(flag, 1);
      }
      this.$emit('submit-filter', { airports: this.localData.airports }, this.filterData.sortState, 'airports');
    },
  },
  mounted() {
    // console.log(this.filterData);
    this.$nextTick(() => {
      this.stopsSlider.show = true;
      this.maxFlightDurationSlider.show = true;
    });
  },
};
</script>

<style lang="scss" scoped>
  .etcFilter {
    padding-bottom: 30px;
    .timeFilter{
      &::after{
        margin-top: 30px;
        margin-bottom: 20px;
        content: '';
        display: block;
        height: 1px;
        margin-left: -14px;
        margin-right: -12px;
        background-color: #f2f2f2;
      }
    }
    .airportWrap {
      margin-top: 20px;
      .times{
        .timesInfo {
          margin-bottom: 5px;
          > div {
            > div{
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              color: #000;
              > div {
                &.active{
                  color: $dodger-blue;
                }
              }
            }
          }
          .reset {
            cursor: pointer;
            color: #868686;
          }
        }
      }
      .airport-title{
        font-size: 14px;
        color: #000;
      }
      .check-list{
        margin-top: 0;
        li {
          margin-top: 16px;
          &:first-of-type{
            margin-top: 16px;
          }
        }
      }
      .airportListWrap{
        margin-top: 30px;
        .name{
          color: #000;
          font-size: 12px;
          font-weight: bold;
          .sub{
            font-weight: normal;
            font-size: 12px;
            color: #868686;
          }
        }
        .title-wrap{
          .type-check{
            display: flex;
            justify-content: space-between;
            .checkIcon{
              width: 15px;
              height: 12px;
              background-size: cover;
              background-image: url(~assets/img/flight/ic-check.svg);
              background-repeat: no-repeat;
            }
          }
        }
        .airportList{
          .check-list{
            margin-top: 0;
            font-size: 14px;
            .title{
              color: #000;
            }
            .nameCode{
              font-size: 14px;
              margin-left: 10px;
              color: #868686;
            }
          }
        }
      }
    }
  }
  .centerSpinner{
    margin-top: 20px;
    .spinner {
      margin: 0 auto;
    }
  }
</style>
