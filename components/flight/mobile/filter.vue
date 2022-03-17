<template>
  <transition name="slide-bottom-fade" mode="out-in">
    <div class="filterWrap" v-if="init" @click.stop>
      <div class="filterHeader">
        <button
          @click="filterReset"
        >재설정</button>
        <span class="title">필터</span>
        <button
          @click="historyBack"
        ></button>
      </div>
      <div class="filterContent">
        <div class="filter-list-wrap">
          <div class="item-wrap">
            <div class="filter-list row">
              <div
                @click="onlyOneStops"
              >
                <span>직항만 보기</span>
                <div
                  class="type-check">
                  <button class="flip">
                    <div
                      :class="localFilter.stops.indexOf(1)>=0&&localFilter.stops.indexOf(2)>=0&&localFilter.stops.indexOf(0) === -1? 'on' : ''"
                      class="switch"
                    >
                      <span class="slider round"></span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div class="filter-list row">
              <div @click="groupFilterPop = inputData.wishCities.length === 1 ? 'changeTime' : 'changeTimeMulti'">
                <div class="info">
                  <p class="title-info">시간대</p>
                  <div v-if="localFilter.times.length > 0" class="val">
                    <div>
                    <span v-for="(val, index) in isFilteredCityData.length > 3 ? isFilteredCityData.slice(0, 3) : isFilteredCityData"
                          :key="index" class="vals">{{val}}</span>
                    </div>
                    <span v-if="isFilteredCityData.length > 3"
                          class="etc"
                    >외 {{isFilteredCityData.length - 3}}개</span>
                  </div>
                </div>
                <div class="right-icon"></div>
              </div>
            </div>
            <div class="filter-list row">
              <div
                @click="groupFilterPop = 'carriers'"
              >
                <div class="info">
                  <p class="title-info">항공사</p>
                  <div v-if="localFilter.airlines.length > 0" class="val">
                    <div>
                    <span v-for="(val, index) in allList.airline.filter(v => localFilter.airlines.some(v2 => v.code === v2)).slice(0, 3)"
                          :key="index" class="vals">{{val.name}}</span>
                    </div>
                    <span v-if="localFilter.airlines.length > 3"
                          class="etc"
                    >외 {{localFilter.airlines.length - 3}}개</span>
                  </div>
                </div>
                <div class="right-icon"></div>
              </div>
            </div>
            <div class="filter-list">
              <div class="airportWrap">
                <p class="airport-title">공항</p>
                <div>
                  <ul class="check-list">
                    <li
                      v-for="(x, index) in Object.keys(localFilter.airportsFlag)"
                      :key="index"
                    >
                      <div
                        @click.stop.prevent="setAirportsFlag(x)"
                      >
                        <label :for="`${x}${index}`" class="check">
                          <div>
                            <div class="check-wrap">
                              <div>
                                <span class="title" v-if="x === 'sameAirportAtTransfer'">경유 시, 공항 변경 없음</span>
                                <span class="title" v-if="x === 'sameAirportAtInOut'">출/도착 공항 동일</span>
                              </div>
                              <div class="box">
                                <input type="checkbox" :id="`${x}${index}`" class="inputCheck">
                                <div class="checked" :style="localFilter.airportsFlag[x] ? { backgroundColor: '#537aff' } : { backgroundColor: '#fff' }" :class="localFilter.airportsFlag[x] ? 'active' : ''">
                                  <transition name="fade">
                                    <div class="checkSvg" v-if="localFilter.airportsFlag[x]">
                                      <svg viewBox="0 0 52 52" fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-width="3" focusable="false" aria-hidden="true" role="presentation" stroke-linecap="round" stroke-linejoin="round" style="height: 1em; width: 1em; display: block; overflow: visible;"><path d="m19.1 25.2 4.7 6.2 12.1-11.2"></path></svg>
                                    </div>
                                  </transition>
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
                <div
                  v-for="x in Object.keys(allList.airport)"
                  :key="Object.keys(allList.airport)[x]"
                  class="airportListWrap"
                >
                  <div class="title-wrap">
                    <!--@click="allList.airport[x].list.length > 1 ? setAllList(allList.airport[x].list) : ''"-->
                    <div
                      class="type-check">
                      <p class="name">{{ allList.airport[x].name }}
<!--                        <transition name="fade">-->
<!--                          <span v-if="allList.airport[x].list.every(v2 => localFilter.airports.indexOf(v2.code) === -1)" class="sub"> 모든공항</span>-->
<!--                        </transition>-->
                      </p>
<!--                      <transition name="fade">-->
<!--                        <div v-if="allList.airport[x].list.every(v2 => localFilter.airports.indexOf(v2.code) === -1)" class="checkIcon"></div>-->
<!--                      </transition>-->
                    </div>
                  </div>
                  <div class="airportList">
                    <ul
                      :class="allList.airport[x].list.every(v2 => localFilter.airports.indexOf(v2.code) >= 0) ? 'allListSel' : ''"
                      class="check-list">
                      <li
                        v-for="(y, index) in allList.airport[x].list"
                        :key="index"
                      >
                        <div>
                          <label :for="Object.keys(allList.airport)[x]" class="check">
                            <div>
                              <div class="check-wrap">
                                <div>
                                  <span class="title">{{ y.name }}</span>
                                  <span class="nameCode">{{ y.code }}</span>
                                </div>
                                <div class="box">
                                  <input
                                    type="checkbox"
                                    :id="Object.keys(allList.airport)[x]"
                                    class="inputCheck"
                                    @click.stop.prevent="allList.airport[x].list.length > 1 ? setLocalData(y.code, 'airports') : ''"
                                  >
                                  <div class="checked" :class="{
                                    active: localFilter.airports.indexOf(y.code) === -1,
                                    disable: allList.airport[x].list.length <= 1 || (localFilter.airports.indexOf(y.code) < 0 && allList.airport[x].list.filter(z => localFilter.airports.indexOf(z.code) < 0).length === 1),
                                  }">
                                    <transition name="fade">
                                      <div class="checkSvg" v-if="localFilter.airports.indexOf(y.code) === -1 || allList.airport[x].list.length === 1">
                                        <svg viewBox="0 0 52 52" fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-width="3" focusable="false" aria-hidden="true" role="presentation" stroke-linecap="round" stroke-linejoin="round" style="height: 1em; width: 1em; display: block; overflow: visible;"><path d="m19.1 25.2 4.7 6.2 12.1-11.2"></path></svg>
                                      </div>
                                    </transition>
                                  </div>
                                </div>
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
            <div class="filter-list">
              <p class="filter-title">소요시간</p>
              <div class="airportWrap"
                v-if="render && filter.maxFlightDuration > 0"
                :key="filter.maxFlightDuration"
              >
                <div class="times">
                  <div class="timesInfo">
                    <div>
                      <p class="airport-title">구간별 소요시간</p>
                      <div>
                        <div
                          :class="maxFlightDurationSlider.value !== filter.maxFlightDuration ? 'active' : ''"
                        >
                          <span class="min">{{ format.getDurationString(filter.minFlightDuration) }}</span> - <span class="max">{{ format.getDurationString(maxFlightDurationSlider.value) }}</span>
                        </div>
                        <span v-if="maxFlightDurationSlider.value !== filter.maxFlightDuration" @click="resetTime('durationSliderVal', filter.maxFlightDuration)" class="reset">초기화</span>
                      </div>
                    </div>
                  </div>
                  <vue-slider @drag-end="changeFlightTimeSlider" v-bind="maxFlightDurationSlider" v-model="maxFlightDurationSlider.value"></vue-slider>
                </div>
              </div>
              <div v-else class="centerSpinner"><div class="spinner"></div></div>
            </div>
            <div class="filter-list">
              <p class="filter-title">경유</p>
              <ul class="check-list">
                <li
                  v-for="(val, index) in 2"
                  :key="val+index"
                >
                  <div>
                    <label :for="'check' + index" class="check">
                      <div>
                        <div class="check-wrap">
                          <div>
                            <span class="title" v-if="index === 0">경유 1회</span>
                            <span class="title" v-if="index === 1">경유 2회 이상</span>
                          </div>
                          <div class="box">
                            <input type="checkbox" :id="'check' + index" class="inputCheck" @click="setLocalData(index + 1, 'stops')">
                            <div class="checked" :style="localFilter.stops.indexOf(index + 1) === -1 ? { backgroundColor: '#537aff' } : { backgroundColor: '#fff' }" :class="localFilter.stops.indexOf(index + 1) === -1 ? 'active' : ''">
                              <transition name="fade">
                                <div class="checkSvg" v-if="localFilter.stops.indexOf(index + 1) === -1">
                                  <svg viewBox="0 0 52 52" fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-width="3" focusable="false" aria-hidden="true" role="presentation" stroke-linecap="round" stroke-linejoin="round" style="height: 1em; width: 1em; display: block; overflow: visible;"><path d="m19.1 25.2 4.7 6.2 12.1-11.2"></path></svg>
                                </div>
                              </transition>
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </li>
              </ul>
              <transition name="fade">
                <div
                  v-if="render && !(localFilter.stops.indexOf(1) >= 0 && localFilter.stops.indexOf(2) >= 0) && filter.maximumMaxStopsTime > 0 && stopsSlider.max > 0"
                  :key="filter.maximumMaxStopsTime"
                  class="airportWrap">
                  <div class="times">
                    <div class="timesInfo">
                      <div>
                        <p class="airport-title">구간별 공항 체류시간</p>
                        <div>
                          <div
                            :class="stopsSlider.value !== filter.maximumMaxStopsTime ? 'active' : ''"
                          >
                            <span class="min">{{ format.getDurationString(filter.maximumMinStopsTime) }}</span> - <span class="max">{{ format.getDurationString(stopsSlider.value) }}</span>
                          </div>
                          <span v-if="stopsSlider.value !== filter.maximumMaxStopsTime" @click="resetTime('stopsSliderVal', filter.maximumMaxStopsTime)" class="reset">초기화</span>
                        </div>
                      </div>
                    </div>
                    <vue-slider @drag-end="changeStopsSlider" v-bind="stopsSlider" v-model="stopsSlider.value"></vue-slider>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
      <div class="btnWrap">
        <button
          @click="submit"
        >적용</button>
      </div>
      <transition-group name="slide-right-fade" mode="out-in">
        <carriers
          v-if="groupFilterPop === 'carriers'"
          :key="groupFilterPop"
          :filterData="{filter: localFilter.airlines, allList: allList.airline, sortState: sortState}"
          @close-pop="groupFilterPop = ''"
          @backFilter="historyBack"
          @submit-filter="mergeData"
        />
        <changeTime
          v-if="groupFilterPop === 'changeTime'"
          :key="groupFilterPop"
          :filterData="{times: localFilter.times, inputData: inputData, sortState: sortState, airports: allList.airport }"
          @close-pop="groupFilterPop = ''"
          @backFilter="historyBack"
          @submit-filter="mergeData"
        />
        <changeTimeMulti
          v-if="groupFilterPop === 'changeTimeMulti'"
          :key="groupFilterPop"
          :filterData="{times: localFilter.times, inputData: inputData, sortState: sortState, airports: allList.airport }"
          :multiInfo="multiInfo && multiInfo.scheduleList && multiInfo.scheduleList[multiInfo.selectedIndex] ? multiInfo : ''"
          @close-pop="groupFilterPop = ''"
          @backFilter="historyBack"
          @submit-filter="mergeData"
        />
      </transition-group>
    </div>
  </transition>
</template>

<script>
import '~/assets/scss/flip.scss'; // eslint-disable-line
import '~/assets/scss/spinner.scss'; // eslint-disable-line
import Format from '~/utils/format'; // eslint-disable-line
import carriers from './carriersFilter.vue';
import changeTime from './changeTime.vue';
import changeTimeMulti from './changeTimeMulti.vue';

export default {
  props: ['progress', 'allList', 'filter', 'sortState', 'inputData', 'multiInfo'],
  components: {
    carriers,
    changeTime,
    changeTimeMulti,
  },
  watch: {
    progress(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.render = false;
        this.setLocalFilter('refresh');
        this.$nextTick().then(() => {
          this.render = true;
          this.stopsSlider.show = true;
          this.maxFlightDurationSlider.show = true;
        });
      }
    },
  },
  computed: {
    isFilteredCityData() {
      const data = [];
      for (let x = 0; x < this.cityData.length; x += 1) {
        if (this.localFilter.times[x].start !== 0 || this.localFilter.times[x].end !== 1440) {
          data.push(this.cityData[x]);
        }
      }
      return data;
    },
  },
  data() {
    // console.log(this.filter);
    const cityData = [this.inputData.startCity.PlaceName];
    this.inputData.wishCities.forEach((val) => {
      cityData.push(val.PlaceName);
    });
    /* eslint-disable */
    return {
      render: true,
      cityData,
      groupFilterPop: '',
      searchValue: '',
      localSortState: this.sortState,
      localFilter: {},
      format: Format,
      init: false,
      stopsSlider: {},
      maxFlightDurationSlider: {},
    };
  },
  beforeDestroy() {
    window.document.body.style.overflowY = '';
    window.document.documentElement.style.overflowY = '';
  },
  mounted() {
    this.setLocalFilter();
    window.document.body.style.overflowY = 'hidden';
    window.document.documentElement.style.overflowY = 'hidden';
    this.$nextTick(() => {
      this.init = true;
      this.stopsSlider.show = true;
      this.maxFlightDurationSlider.show = true;
    });
  },
  methods: {
    setLocalFilter(isRefresh) {
      let localFilter = {};
      if (isRefresh) {
        localFilter = this.localFilter;
        if (this.stopsSlider.value === this.stopsSlider.max) {
          localFilter.maxStopsTime = this.filter.maxStopsTime;
        }
        if (this.maxFlightDurationSlider.value === this.maxFlightDurationSlider.max) {
          localFilter.flightDuration = this.filter.flightDuration;
        }
      } else {
        localFilter = {
          airportsFlag: { sameAirportAtTransfer: this.filter.sameAirportAtTransfer, sameAirportAtInOut: this.filter.sameAirportAtInOut },
          maxStopsTime: this.filter.maxStopsTime, // 경유 대기 필터 값
          // maximumMaxStopsTime: this.filter.maximumMaxStopsTime, // 경유 대기 max 값
          flightDuration: this.filter.flightDuration, // 총 비행 시간 필터 값
          // maxFlightDuration: this.filter.maxFlightDuration, // 총 비행 시간 값
          airports: [],
          airlines: [],
          stops: [],
          times: [],
        };
        for (let x = 0; x < this.filter.times.length; x += 1) {
          localFilter.times.push(
            {start: this.filter.times[x].start, end: this.filter.times[x].end},
          );
        }
        // localFilter.times.push(...this.filter.times);
        localFilter.stops.push(...this.filter.stops);
        localFilter.airlines.push(...this.filter.airlines);
        localFilter.airports.push(...this.filter.airports);
        this.localFilter = localFilter;
      }
      // console.log(localFilter);
      const stopsSlider = {
        value: localFilter.maxStopsTime,
        width: '100%',
        height: 4,
        dotSize: 24,
        interval: 30,
        min: this.filter.maximumMinStopsTime,
        max: this.filter.maximumMaxStopsTime,
        show: false,
        tooltip: 'none',
        bgStyle: {
          backgroundColor: '#cdcdcd',
        },
        processStyle: {
          backgroundColor: '#b2bfea',
        },
      };
      this.stopsSlider = stopsSlider;
      const maxFlightDurationSlider = {
        value: localFilter.flightDuration,
        width: '100%',
        height: 4,
        dotSize: 24,
        interval: 30,
        min: this.filter.minFlightDuration,
        max: this.filter.maxFlightDuration,
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
      this.maxFlightDurationSlider = maxFlightDurationSlider;
    },
    mergeData(val, key) {
      // console.log(val, key);
      this.localFilter[key] = val;
      this.groupFilterPop = '';
    },
    onlyOneStops() {
      if (this.localFilter.stops.indexOf(0) === -1 && this.localFilter.stops.length === 2) {
        this.localFilter.stops = [];
      } else {
        this.localFilter.stops = [1, 2];
      }
    },
    resetTime(key) {
      let sendKey = '';
      if (key === 'durationSliderVal') {
        sendKey = 'flightDuration';
        this.maxFlightDurationSlider.value = this.filter.maxFlightDuration;
        this.localFilter.flightDuration = this.filter.maxFlightDuration;
      } else if (key === 'stopsSliderVal') {
        sendKey = 'maxStopsTime';
        this.stopsSlider.value = this.filter.maximumMaxStopsTime;
        this.localFilter.maxStopsTime = this.filter.maximumMaxStopsTime;
      }
      // const obj = sendKey === 'flightDuration' ? { flightDuration: this.durationSliderVal } : { maxStopsTime: this.stopsSliderVal };
      // this.$emit('submit-filter', obj, this.filter.sortState, sendKey);
    },
    changeStopsSlider() {
      this.localFilter.maxStopsTime = this.stopsSlider.value;
    },
    changeFlightTimeSlider() {
      this.localFilter.flightDuration = this.maxFlightDurationSlider.value;
    },
    setAirportsFlag(key) {
      this.localFilter.airportsFlag[key] = !this.localFilter.airportsFlag[key];
      // this.$emit('submit-filter', this.localFilter.airportsFlag[key], this.filter.sortState, key);
    },
    setLocalData(code, key) {
      if (key === 'airports') {
        const arr = Object.values(this.allList.airport).find(x => x.list.find(y => y.code === code)).list;
        if (this.localFilter.airports.indexOf(code) < 0 && arr.filter(x => this.localFilter.airports.indexOf(x.code) < 0).length === 1) {
          return;
        }
      }
      const flag = this.localFilter[key].indexOf(code);
      if (flag < 0) {
        this.localFilter[key].push(code);
      } else {
        this.localFilter[key].splice(flag, 1);
      }
      // 정리 필요 으악
      // const checkAllAirport = Object.keys(this.allList.airport).some((key) => {
      //   return this.allList.airport[key].list.every(v => this.localFilter.airports.indexOf(v.code) >= 0);
      // });
      // if (checkAllAirport) {
      //   // console.log(this.localFilter.airports);
      //   Object.keys(this.allList.airport).forEach((key) => {
      //     if (this.allList.airport[key].list.every(v => this.localFilter.airports.indexOf(v.code) >= 0)) {
      //       this.allList.airport[key].list.map(v => this.localFilter.airports.splice(this.localFilter.airports.indexOf(v.code), 1));
      //     }
      //   });
      //   // this.localFilter.airports = [];
      // }
    },
    airlineAddAll(clear) {
      if (clear) {
        this.localFilter.airlines = [];
      } else {
        for (let x = 0; x < this.allList.airline.length; x += 1) {
          this.localFilter.airlines.push(this.allList.airline[x].code);
        }
      }
    },
    // getAirportFilter() {
    //   const arr = [];
    //   Object.values(this.allList.airport).forEach(x => {
    //     if (x.list.length > 1 && x.list.some(y => this.localFilter.airports.indexOf(y.code) >= 0)) {
    //       for (let z = 0; z < x.list.length; z += 1) {
    //         if (this.localFilter.airports.indexOf(x.list[z].code) < 0) {
    //           arr.push(x.list[z].code);
    //         }
    //       }
    //     }
    //   });
    //   return arr;
    // },
    submit() {
      const submit = {
        airlines: this.localFilter.airlines,
        airports: this.localFilter.airports,
        sameAirportAtTransfer: this.localFilter.airportsFlag.sameAirportAtTransfer,
        sameAirportAtInOut: this.localFilter.airportsFlag.sameAirportAtInOut,
        maxStopsTime: this.localFilter.maxStopsTime,
        flightDuration: this.maxFlightDurationSlider.value,
        stops: this.localFilter.stops,
        times: this.localFilter.times,
      };
      // console.log(submitAirport);
      this.$emit('submit-filter', submit, this.localSortState);
      history.back();
    },
    historyBack() {
      history.back();
    },
    filterReset() {
      this.localFilter.airlines = [];
      this.localFilter.stops = [];
      this.localFilter.airports = [];
      for (let x = 0; x < this.localFilter.times.length; x += 1) {
        this.localFilter.times[x].start = 0;
        this.localFilter.times[x].end = 1440;
      }
      this.localFilter.airportsFlag = { sameAirportAtTransfer: true, sameAirportAtInOut: this.filter.sameAirportAtInOut };
      this.localFilter.flightDuration = this.filter.maxFlightDuration; // 총 비행 시간 필터 값
      this.localFilter.maxStopsTime = this.filter.maximumMaxStopsTime;
      this.stopsSlider.value = this.filter.maximumMaxStopsTime;
      this.maxFlightDurationSlider.value = this.filter.maxFlightDuration;
      // console.log(this.localFilter);
    },
    getTime(time) {
      if (time === 1440) {
        return '오후 11시 59분';
      }
      const hour = parseInt(time / 60, 10);

      return `${hour < 12 ? '오전' : '오후'} ${hour > 12 ? hour - 12 : hour}시 ${this.format.zeros((time % 60))}분`;
    },
  },
};
</script>

<style lang="scss">
  .filterWrap{
    .filterHeader{
      height: 70px;
      text-align: center;
      line-height: 70px;
      border-bottom: 1px solid #f2f2f2;
      .title{
        font-size: 16px;
        color: #000;
      }
      button:first-of-type{
        top: 15px;
        width: 40px;
        left: 16px;
        position: absolute;
        color: $brown-grey;
        height: 40px;
        line-height: 41px;
        font-size: 12px;
        font-weight: bold;
        border: 0;
        background-color: transparent;
      }
      button:nth-of-type(2){
        top: 10px;
        width: 40px;
        height: 40px;
        right: 4px;
        background-size: 21px;
        background-position: center 14px;
        background-repeat: no-repeat;
        border: 0;
        background-color: transparent;
        position: absolute;
        cursor: pointer;
        background-image: url(~assets/img/common/x_black.svg);
      }
    }
    .filter-list.rating .vue-slider-component .vue-slider{
      margin-top: 32px;
      margin-bottom: 20px;
    }
    .vue-slider-component .vue-slider{
      border-radius: 0;
      &::after, &::before{
        content: '';
        width: 10px;
        height: 4px;
        background-color: rgb(178, 191, 234);
        position: absolute;
      }
      &::after{
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
        left: 100%;
        background-color: rgb(205, 205, 205);
      }
      &::before{
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
        left: -10px;
      }
    }
    .vue-slider-component .vue-slider-dot{
      background-color: #fff;
      border-radius: 20px;
      border: 1px solid #fff;
      display: flex;
      justify-content: center;
      align-self: center;
    }
    .vue-slider-component .vue-slider-dot .vue-slider-dot-handle{
      width: 20px;
      height: 20px;
      background-color: $dodger-blue;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.24), 0 0 1px 0 rgba(0, 0, 0, 0.12);
    }
  }
</style>

<style scoped lang="scss">
  .check-list{
    margin-top: 20px;
    li{
      margin-top: 20px;
    }
    li, div {
      &:first-of-type{
        margin-top: 0;
      }
      label{
        display: block;
        cursor: pointer;
      }
      .check-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .box{
          width: 18px;
          height: 18px;
          .inputCheck {
            display: none;
          }
          .checked {
            transition: .3s ease;
            width: 18px;
            height: 18px;
            border-radius: 2px;
            border: 1.5px solid #cdcdcd;
            background-color: #fff;
            position: relative;
            &.active{
              border: 1.5px solid $dodger-blue;
              background-color: $dodger-blue;
            }
            &.disable{
              border-color: #868686;
              background-color: #868686;
            }
            .checkSvg{
              position: absolute;
              font-size: 29px;
              margin: -8px;
              color: #fff;
            }
          }
        }
        .title{
          font-size: 14px;
          color: #000;
        }
        .info{
          font-size: 14px;
          color: #868686;
        }
      }
    }
  }
  .vue-slider-component{
    margin: 8px 0;
  }
  .filterWrap{
    background-color: #FFF;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    .filterContent{
      position: absolute;
      top: 70px;
      left: 0;
      bottom: 78px;
      right: 0;
      overflow-y: auto;
      padding: 0 10px;
      -webkit-overflow-scrolling: touch;
      .filter-list-wrap {
        width: 100%;

        .item-wrap {
          padding: 0 10px;
        }

        .filter-list:not(.row) {
          padding-top: 30px;
          padding-bottom: 30px;
        }

        .filter-list {
          border-bottom: 1px solid #efefef;

          &:first-of-type {
            padding-top: 0;
          }

          .filter-title {
            font-weight: bold;
            font-size: 16px;
            color: #585858;
          }
          &.row{
            > div {
              width: 100%;
              height: 60px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .info{
                .title-info{
                  font-size: 16px;
                  color: #000;
                  line-height: 19px;
                }
                .val{
                  line-height: 12px;
                  font-size: 10px;
                  color: $dodger-blue;
                  display: flex;
                  margin-top: 2px;
                  .vals {
                    &:last-of-type::after{
                      content: '';
                    }
                    &::after{
                      content: ', ';
                    }
                  }
                  .etc{
                    margin-left: 4px;
                  }
                }
              }
            }
          }
          .right-icon{
            width: 23px;
            height: 23px;
            background-size: 23px 23px;
            background-repeat: no-repeat;
            background-image: url(~assets/img/hotelList/ic-chevron-right.svg);
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
                        font-weight: bold;
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
      }
/*      > p{
        font-size: 20px;
        font-weight: bold;
      }
      > div{
        > div:first-of-type{
          color: #9b9b9b;
          font-size: 14px;
          margin-top: 30px;
          line-height: 20px;
          height: 20px;
          margin-bottom: 10px;
          > button{
            line-height: 20px;
            float: right;
            color: #9b9b9b;
            font-size: 12px;
            font-weight: bold;
          }
        }
        p{
          color: #9b9b9b;
          font-size: 12px;
          margin-bottom: 10px;
          margin-top: 2px;
        }
        .times{
          font-size: 18px;
        }
        .filterInputBox{
          .searchIcon{
            background-image: url(~assets/img/common/search_grey.svg);
            background-size: cover;
            width: 16px;
            height: 16px;
            position: absolute;
            pointer-events: none;
            margin-top: 12px;
            margin-left: 14px;
            opacity: .5;
          }
          input{
            height: 40px;
            border-radius: 4px;
            background-color: #f8f8f8;
            width: 100%;
            border: 0;
            margin-bottom: 10px;
            padding-left: 40px;
          }
        }
      }
      .filterBtnWrap{
        overflow: auto;
        margin-right: -8px;
        > div{
          float: left;
          width: 50%;
          height: 53px;
          padding-right: 8px;
          margin-bottom: 8px;
          > button{
            border-radius: 2px;
            background-color: #FFF;
            border: 1px solid #e1e1e1;
            color: #9b9b9b;
            width: 100%;
            height: 53px;
            font-size: 14px;
            transition: .3s ease;
            &.selected{
              border-color: $cornflower;
              color: #FFF;
              background-color: $cornflower;
            }
            &.disable{
              cursor: default;
            }
          }
        }
      }*/
    }
    .btnWrap{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 78px;
      padding: 12px 20px;
      box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
      > button{
        width: 100%;
        height: 54px;
        background-color: $cornflower;
        color: #FFF;
        font-size: 16px;
        font-weight: bold;
      }
    }
    .flip {
      .switch{
        .slider.round{
          background-color: #868686;
        }
      }
      .switch.on{
        .slider.round{
          background-color: #b2bfea;
        }
        .slider.round::before{
          background-color: $dodger-blue;
        }
      }
    }
  }
  .centerSpinner{
    margin-top: 20px;
    .spinner{
      margin: 0 auto;
    }
  }
</style>
