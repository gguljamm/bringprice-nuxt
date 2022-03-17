<template>
  <div
    class="top-filter flightBtns">
    <div class="all-wrap">
      <ul
        class="swiper-wrapper">
        <li
          class="filters date swiper-slide" @click.stop="openPopFlag === 'date' ? openFilter('') : openFilter('date')"
          :class="openPopFlag === 'date' ? 'popOn' : ''"
        >
          <span>{{ dateFormat }}</span>
          <filterPopWrapper
            v-if="openPopFlag === 'date'"
            :type="'date'"
            @close-filter="$emit('close-filter')"
          />
        </li
        ><li
          class="filters option swiper-slide" @click.stop="openPopFlag === 'option' ? openFilter('') : openFilter('option')"
          :class="openPopFlag === 'option' ? 'popOn' : ''"
        >
          <span>{{ passengerNum }}</span>
          <filterPopWrapper
            v-if="openPopFlag === 'option'"
            :title="'승객 및 좌석 등급'"
            :type="'option'"
            @close-filter="$emit('close-filter')"
          />
        </li
        ><li
          v-if="(inputData.wishCities.length === 1 || $route.params.step === 'select')"
          class="filters swiper-slide"
          :class="[openPopFlag === 'changeTime' ? 'popOn' : '', isTimeFilter ? 'active' : '']"
          @click.stop="openPopFlag === 'changeTime' ? openFilter('') : openFilter('changeTime')"
        >
          <span>시간대</span>
          <span v-if="isTimeFilter" @click.stop="resetFilter('times')" class="resetFilter"></span>
          <span v-else class="filterPoint"></span>
          <filterPopWrapper
            v-if="openPopFlag === 'changeTime'"
            :title="'시간대'"
            :type="inputData.wishCities.length === 1 ? 'changeTime' : 'changeTimeMulti'"
            :filterData="{times: filter.times, inputData: inputData, sortState: sortState, airports: allList.airport }"
            :multiInfo="multiInfo && multiInfo.scheduleList && multiInfo.scheduleList[multiInfo.selectedIndex] ? multiInfo : ''"
            @submit-filter="submitFilter"
            @close-filter="$emit('close-filter')"
          />
        </li
        ><li
          v-if="(inputData.wishCities.length === 1 || $route.params.step === 'select')"
          class="filters swiper-slide"
          :class="[openPopFlag === 'carriers' ? 'popOn' : '', isAliance ? 'active' : '']"
          @click.stop="openPopFlag === 'carriers' ? openFilter('') : openFilter('carriers')"
        >
          <span>항공사</span>
          <span v-if="isAliance" @click.stop="resetFilter('airlines')" class="resetFilter"></span>
          <span v-else class="filterPoint"></span>
          <filterPopWrapper
            v-if="openPopFlag === 'carriers'"
            :title="'항공사'"
            :type="'carriers'"
            :key="progress"
            :filterData="{filter: filter.airlines, allList: allList.airline, sortState: sortState}"
            @close-filter="$emit('close-filter')"
            @submit-filter="submitFilter"
          />
        </li
        ><li
          v-if="(inputData.wishCities.length === 1 || $route.params.step === 'select')"
          class="filters swiper-slide"
          :class="[openPopFlag === 'transferCount' ? 'popOn' : '', isStops ? 'active' : '']"
          @click.stop="openPopFlag === 'transferCount' ? openFilter('') : openFilter('transferCount')"
        >
          <span>경유횟수</span>
          <span v-if="isStops" @click.stop="resetFilter('stops')" class="resetFilter"></span>
          <span v-else class="filterPoint"></span>
          <filterPopWrapper
            v-if="openPopFlag === 'transferCount'"
            :title="'경유횟수'"
            :type="'transferCount'"
            :filterData="{filter: filter.stops, sortState: sortState}"
            @close-filter="$emit('close-filter')"
            @submit-filter="submitFilter"
          />
        </li
        ><li
          v-if="(inputData.wishCities.length === 1 || $route.params.step === 'select')"
          class="filters swiper-slide"
          :class="[openPopFlag === 'etc' ? 'popOn' : '', isEtc ? 'active' : '']"
          @click.stop="openPopFlag === 'etc' ? openFilter('') : openFilter('etc')"
        >
          <span>더보기</span>
          <span v-if="isEtc" @click.stop="resetFilter('etc')" class="resetFilter"></span>
          <span v-else class="filterPoint"></span>
          <filterPopWrapper
            v-if="openPopFlag === 'etc'"
            :title="'더보기'"
            :key="progress"
            :filterData="{
              flightDuration: filter.flightDuration,
              maxFlightDuration: filter.maxFlightDuration,
              minFlightDuration: filter.minFlightDuration,
              maxStopsTime: filter.maxStopsTime,
              maximumMaxStopsTime: filter.maximumMaxStopsTime,
              maximumMinStopsTime: filter.maximumMinStopsTime,
              airports: filter.airports,
              allList: allList,
              sortState: sortState,
              airportsFlag: {sameAirportAtTransfer: filter.sameAirportAtTransfer, sameAirportAtInOut: filter.sameAirportAtInOut},
              stops: filter.stops,
             }"
            :type="'etc'"
            @submit-filter="submitFilter"
            @close-filter="$emit('close-filter')"
          />
        </li
        ><li
          v-if="($route.params.step === 'list' && inputData.wishCities.length >= 2)"
          class="filters swiper-slide quick"
          :class="orderFix?'active':''"
          @click="changeOrderFix"
        >
          <span><span class="point">#</span>여행순서 고정</span>
        </li
        ><li
          v-if="progress === 1"
          @click="filter.stops.indexOf(1)>=0&&filter.stops.indexOf(2)>=0&&filter.stops.indexOf(0) === -1?changeFilterInfo('stops',[]):changeFilterInfo('stops', [1,2])"
          class="filters swiper-slide quick"
          :class="filter.stops.indexOf(1)>=0&&filter.stops.indexOf(2)>=0&&filter.stops.indexOf(0) === -1?'active':''"
        >
          <span><span class="point">#</span>직항만</span>
        </li
        ><li
          v-if="(inputData.wishCities.length === 1 || $route.params.step === 'select')"
          class="filters swiper-slide quick"
          :class="filter.times.length > 0 && filter.times[0].end <= 720 && filter.times[0].start >= 0 ? 'active' : ''"
          @click="filter.times.length > 0 && filter.times[0].end <= 720 && filter.times[0].start >= 0 ? changeFilterInfo('startTimeAM', {start: 0, end: 1440}) : changeFilterInfo('startTimeAM', {start: 0, end: 720})"
        >
          <span><span class="point">#</span>{{ inputData.startCity.PlaceName }}에서 오전출발</span>
        </li>
      </ul>
    </div>
    <div class="progressBar" v-if="progress < 1" :style="{width: `${100 * progress}%`}"></div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
import filterPopWrapper from './filterPopWrapper.vue';
import '~/assets/scss/filterButtons.scss'; // eslint-disable-line

export default {
  props: ['inputData', 'filter', 'orderFix', 'sortState', 'openPopFlag', 'allList', 'progress', 'multiInfo'],
  components: {
    filterPopWrapper,
  },
  data() {
    return {
      format: Format,
    };
  },
  computed: {
    isEtc() {
      return !this.filter.sameAirportAtTransfer ||
        this.filter.sameAirportAtInOut ||
        this.filter.maxStopsTime !== this.filter.maximumMaxStopsTime ||
        this.filter.flightDuration !== this.filter.maxFlightDuration ||
        this.filter.airports.length > 0;
    },
    isStops() {
      return this.filter.stops.length > 0;
    },
    isAliance() {
      return this.filter.airlines.length > 0;
    },
    isTimeFilter() {
      return this.filter.times.some(val => val.start !== 0 || val.end !== 1440);
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
    resetFilter(key) {
      this.$emit('close-filter');
      if (key === 'times') {
        this.filter[key].forEach((val) => {
          const temp = val;
          temp.start = 0;
          temp.end = 1440;
        });
      }
      if (key === 'airlines') {
        this.filter.airlines = [];
      }
      if (key === 'stops') {
        this.filter.stops = [];
      }
      if (key === 'etc') {
        this.filter.airports = [];
        this.filter.flightDuration = this.filter.maxFlightDuration;
        this.filter.maxStopsTime = this.filter.maximumMaxStopsTime;
        this.filter.sameAirportAtTransfer = true;
        this.filter.sameAirportAtInOut = false;
      }
    },
    openFilter(type) {
      this.$emit('open-filter', type);
    },
    submitFilter(submit, sortState, key) {
      this.$emit('submit-filter', submit, sortState, key);
    },
    clickFilter() {
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'clickFilterMenu',
        eventAction: 'web',
      });
      this.$router.push({ params: { popFlag: 'filter' }, query: this.$route.query });
    },
    changeOrderFix() {
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'orderFix',
        eventAction: 'web',
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
          eventAction: 'web',
          eventLabel: label,
        });
      } else if (key === 'departureTime' && value.max === 720) {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'departureMorning',
          eventAction: `web-${this.inputData.wishCities.length === 1 ? 'round' : 'multi'}`,
          eventLabel: `${this.format.getBetweenDay(this.inputData.startDate, this.inputData.returnDate)}박`,
        });
      }
      this.$emit('change-filter-info', key, value);
    },
    historyBack() {
      history.back();
    },
  },
  mounted() {
    // console.log(this.multiInfo);
  },
};
</script>

<style lang="scss" scoped>
  .flightBtns{
    border-top: 1px solid #f2f2f2;
    position: relative;
    padding-top: 10px;
    padding-bottom: 10px;
    margin: 0px auto 0;
    width: 100%;
    z-index: 3;
    background-color: #fff;
    .all-wrap{
      padding-left: 60px;
      padding-right: 60px;
      min-height: 33px;
    }
    .progressBar{
      position: absolute;
      background-color: $dodger-blue;
      height: 2px;
      left: 0;
      margin-top: 10px;
      transition: 3s ease;
    }
  }
</style>

