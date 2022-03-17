<template>
  <div class="flightTopInfoWrap">
    <div class="title">
      <div class="title-wrap">
        <button @click="historyBack()"></button>
        <div>{{ topCode }}</div>
      </div>
      <span
        v-if="(inputData.wishCities.length === 1 || $route.params.step === 'select')"
        @click="clickFilter()"
        :class="isFiltered ? 'active' : ''"
      >필터</span>
    </div>
    <div>
      <div :key="orderFix">{{ topName }}</div>
      <div>{{ topDescription }}</div>
    </div>
    <div class="top-filter">
      <transition-group name="fade" tag="ul" class="flightBtns" mode="out-in">
        <!--<button class="active" @click="$router.push({params: {popFlag: 'date'}, query: $route.query})">-->
        <li
          class="filters date swiper-slide mobile" @click.stop="$router.push({params: {popFlag: 'date'}, query: $route.query})" :key="99"
        >
          <span>{{ dateFormat }}</span>
        </li
        >
        <li
          class="filters option swiper-slide mobile" @click.stop="$router.push({params: {popFlag: 'option'}, query: $route.query})" :key="98">
          <span>{{ passengerNum }}</span>
        </li
        >
        <li class="filters swiper-slide mobile quick active"
          v-for="(x, index) in arrAppliedFilter"
          :key="index"
          @click="x.callback()"
        >
          <span>{{ x.name }}<span class="x_button"></span></span>
        </li>
        <li
          v-if="$route.params.step === 'list' && inputData.wishCities.length >= 2"
          class="filters swiper-slide mobile quick"
          :class="orderFix?'active':''"
          @click="changeOrderFix"
          :key="97"
        >
          <span><span class="point">#</span>여행순서 고정</span>
        </li
        >
        <li
          @click="isOnlyNonstop ? changeFilterInfo('stops',[]) : changeFilterInfo('stops', [1,2])"
          class="filters swiper-slide quick mobile"
          :class="isOnlyNonstop ? 'active' : ''"
          :key="96"
        >
          <span><span class="point">#</span>직항만</span>
        </li
        >
        <li
          v-if="inputData.wishCities.length === 1 || $route.params.step === 'select'"
          class="filters swiper-slide quick mobile"
          :class="filter.times.length > 0 && filter.times[0].end <= 720 && filter.times[0].start >= 0 ? 'active' : ''"
          @click="filter.times.length > 0 && filter.times[0].end <= 720 && filter.times[0].start >= 0 ? changeFilterInfo('startTimeAM', {start: 0, end: 1440}) : changeFilterInfo('startTimeAM', {start: 0, end: 720})"
          :key="95"
        >
          <span><span class="point">#</span>{{ inputData.startCity.PlaceName }}에서 오전출발</span>
        </li>
      </transition-group>
      <div class="progressBar" v-if="progress < 1" :style="{width: `${100 * progress}%`}"></div>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
import '~/assets/scss/filterButtons.scss'; // eslint-disable-line

export default {
  props: ['inputData', 'filter', 'orderFix', 'progress', 'sortState', 'allList'],
  data() {
    return {
      format: Format,
    };
  },
  computed: {
    arrAppliedFilter() {
      const arr = [];
      if (this.filter.maxStopsTime !== this.filter.maximumMaxStopsTime) {
        arr.push({
          name: `공항체류시간 ${this.format.getDurationString(this.filter.maxStopsTime)} 미만`,
          callback: () => { this.$emit('change-filter-info', 'maxStopsTime', this.filter.maximumMaxStopsTime); },
        });
      }
      if (this.filter.flightDuration !== this.filter.maxFlightDuration) {
        arr.push({
          name: `소요시간 ${this.format.getDurationString(this.filter.flightDuration)} 미만`,
          callback: () => { this.$emit('change-filter-info', 'flightDuration', this.filter.maxFlightDuration); },
        });
      }
      if (this.filter.airlines.length > 0) {
        arr.push({
          name: `${this.allList.airline.find(x => x.code === this.filter.airlines[0]).name} 제외${this.filter.airlines.length > 1 ? `(+${this.filter.airlines.length - 1})` : ''}`,
          callback: () => { this.$emit('change-filter-info', 'airlines', []); },
        });
      }
      if (this.filter.stops.length > 0 && !this.isOnlyNonstop) {
        arr.push({
          name: '경유 필터',
          callback: () => { this.$emit('change-filter-info', 'stops', []); },
        });
      }
      if (this.filter.airports.length > 0) {
        arr.push({
          name: `${this.findAirportName(this.filter.airports[0])} 제외${this.filter.airports.length > 1 ? `(+${this.filter.airports.length - 1})` : ''}`,
          callback: () => { this.$emit('change-filter-info', 'airports', []); },
        });
      }
      if (this.filter.times.some(x => x.start !== 0 || x.end !== 1440)) {
        arr.push({
          name: '출도착 시간 필터',
          callback: () => { this.$emit('change-filter-info', 'times', this.filter.times.map(() => ({ start: 0, end: 1440 }))); },
        });
      }
      return arr;
    },
    isOnlyNonstop() {
      return this.filter.stops.indexOf(1) >= 0 && this.filter.stops.indexOf(2) >= 0 && this.filter.stops.indexOf(0) === -1;
    },
    isFiltered() {
      return this.filter.airports.length > 0 || this.filter.airlines.length > 0 || this.filter.stops.length > 0 ||
        !this.filter.sameAirportAtTransfer ||
        this.filter.sameAirportAtInOut ||
        this.filter.maxStopsTime !== this.filter.maximumMaxStopsTime ||
        this.filter.flightDuration !== this.filter.maxFlightDuration ||
        this.filter.times.some(val => val.start !== 0 || val.end !== 1440);
    },
    topName() {
      if (this.inputData.wishCities.length === 0) {
        return 'EVERYWHERE,';
      }
      const arr = [];
      for (let x = 0; x < this.inputData.wishCities.length; x += 1) {
        arr.push(this.inputData.wishCities[x].PlaceName);
      }
      if (this.orderFix) {
        return `${arr.join('→')},`;
      }
      return `${arr.join('⋅')},`;
    },
    topCode() {
      if (this.inputData.wishCities.length === 0) {
        return 'EVERYWHERE';
      }
      const arr = [];
      for (let x = 0; x < this.inputData.wishCities.length; x += 1) {
        arr.push(this.inputData.wishCities[x].PlaceId.substr(0, 3));
      }
      if (arr.length === 1) {
        return this.inputData.wishCities[0].PlaceName;
      }
      if (this.orderFix) {
        return `${arr.join('→')}`;
      }
      return `${arr.join('⋅')}`;
    },
    topDescription() {
      if (this.inputData.wishCities.length === 0) {
        return '어디든';
      }
      const arr = [];
      for (let x = 0; x < this.inputData.wishCities.length; x += 1) {
        arr.push(this.inputData.wishCities[x].PlaceName);
      }
      return '떠나볼까요?';
    },
    dateFormat() {
      return `${this.format.dateDotFormat(this.inputData.startDate)} - ${this.format.dateDotFormat(this.inputData.returnDate)}`;
    },
    passengerNum() {
      const arr = [];
      let cabinClass = '';
      switch (this.inputData.cabinClass) {
        case 'Economy' :
          cabinClass = '일반석';
          break;
        case 'PremiumEconomy' :
          cabinClass = '프리미엄 일반석';
          break;
        case 'Business' :
          cabinClass = '비즈니스석';
          break;
        case 'First' :
          cabinClass = '퍼스트 클래스';
          break;
        default :
          break;
      }
      arr.push(`성인 ${this.inputData.adults}명`);
      if (this.inputData.children > 0) {
        arr.push(`소아 ${this.inputData.children}명`);
      }
      if (this.inputData.infants > 0) {
        arr.push(`유아 ${this.inputData.infants}명`);
      }
      arr.push(`${cabinClass}`);
      return arr.join(', ');
    },
  },
  methods: {
    findAirportName(code) {
      let name = '';
      Object.values(this.allList.airport).some(x => x.list.some((y) => {
        if (y.code === code) {
          name = y.name;
          return true;
        }
        return false;
      }));
      return name;
    },
    clickFilter() {
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'clickFilterMenu',
        eventAction: 'mobile',
      });
      this.$router.push({ params: { popFlag: 'filter' }, query: this.$route.query });
    },
    changeOrderFix() {
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'orderFix',
        eventAction: 'mobile',
      });
      this.$emit('change-order-fix');
    },
    changeFilterInfo(key, value) {
      if (key === 'stops' && value.length === 2) {
        let label = 'MultiSchedule';
        if (this.$route.params.step === 'list' && this.inputData.wishCities.length === 1) {
          label = 'SearchResultRound';
        } else if (this.$route.params.step === 'select' && this.inputData.wishCities.length !== 1) {
          label = 'SearchResultMulti';
        }
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'directFlight',
          eventAction: 'mobile',
          eventLabel: label,
        });
      }
      this.$emit('change-filter-info', key, value);
    },
    historyBack() {
      history.back();
    },
  },
};
</script>

<style lang="scss" scoped>
  .flightTopInfoWrap{
    position: fixed;
    top: 0;
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
    left: 0;
    width: 100%;
    z-index: 1;
    .title{
      height: 48px;
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title-wrap {
        > button {
          left: 4px;
          top: 4px;
          width: 40px;
          height: 40px;
          background-image: url(~assets/img/common/chevron-left.svg);
          background-size: 21px;
          background-position: center center;
          background-repeat: no-repeat;
          border: 0;
          background-color: transparent;
          position: absolute;
          cursor: pointer;
          z-index: 1;
        }

        > div {
          line-height: 50px;
          text-align: left;
          padding-left: 48px;
          font-size: 14px;
          opacity: 0;
          transition: opacity .3s ease;

          .scrollDownTop & {
            opacity: 1;
          }
        }
      }
      > span{
        font-size: 14px;
        color: #000;
        padding-right: 10px;
        &.active{
          color: #305bf0;
        }
      }
    }
    > div:nth-of-type(2){
      font-size: 16px;
      line-height: 22px;
      padding-left: 20px;
      transition: .3s ease;
      /*height: 56px;*/
      position: relative;
      pointer-events: none;
      z-index: 1;
      > div:first-of-type{
        color: #4a4a4a;
      }
      > div:nth-of-type(2){
        color: #9b9b9b;
      }
      .scrollDownTop &{
        opacity: 0;
      }
    }
    .top-filter{
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      padding-top: 104px;
      padding-top: calc(constant(safe-area-inset-top) + 104px);
      padding-top: calc(env(safe-area-inset-top) + 104px);
      border-top: none;
      background-color: #fff;
      font-size: 0;
      > .flightBtns{
        overflow-x: scroll;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 10px;
        li{
          margin-left: 6px;
          &:first-of-type{
            margin-left: 20px;
          }
          &:last-of-type{
            margin-right: 20px;
          }
        }
      }
      .scrollDownTop &{
        transform: translateY(-56px);
      }
    }
  }
  .progressBar{
    position: absolute;
    bottom: -2px;
    left: 0;
    height: 2px;
    transition: 3s ease;
    background-color: $dodger-blue;
  }
</style>
