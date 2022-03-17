<template>
  <div>
    <top-info
      v-if="inputData.wishCities !== 'loading'"
      :inputData="inputData"
      :filter="filter"
      :orderFix="orderFix"
      :progress="progress"
      :sortState="sortState"
      :allList="allList"
      @change-filter-info="changeFilterInfo"
      @change-order-fix="$emit('change-order-fix')"
    ></top-info>
    <div class="mobileFlightListWrap">
      <div v-if="$store.state.covid && wishCountries.filter(v => covidCountry(v)).length > 0">
        <div class="covidInfo"
          v-if="wishCountries.length > 1 && wishCountries.filter(v => covidCountry(v)).length > 1"
          v-swiper:index="swiperOption"
          ref="swiper"
        >
          <ul class="swiper-wrapper">
            <li class="swiper-slide" v-for="x in wishCountries"
              v-if="covidCountry(x)"
              :key="x"
            >
              <div><strong>{{ inputData.wishCities.find(v => v.CountryId.split('-')[0] === x).CountryName }}</strong> |</div>
              <div>확진자: <span>{{ Format.numberFormat(covidCountry(x).TotalConfirmed) }}</span>(+{{ Format.numberFormat(covidCountry(x).NewConfirmed) }}) |</div>
              <div>격리해제: <span>{{ Format.numberFormat(covidCountry(x).TotalRecovered) }}</span>(+{{ Format.numberFormat(covidCountry(x).NewRecovered) }}) |</div>
              <div>사망자: <span>{{ Format.numberFormat(covidCountry(x).TotalDeaths) }}</span>(+{{ Format.numberFormat(covidCountry(x).NewDeaths) }})</div>
<!--              <div>치사율: <span>{{ parseInt(covidCountry(x).TotalDeaths / covidCountry(x).TotalConfirmed * 100) }}%</span></div>-->
            </li>
          </ul>
        </div>
        <div class="covidInfo" v-else>
          <ul>
            <li v-for="x in wishCountries"
              v-if="covidCountry(x)"
              :key="x"
            >
              <div><strong>{{ inputData.wishCities.find(v => v.CountryId.split('-')[0] === x).CountryName }}</strong> |</div>
              <div>확진자: <span>{{ Format.numberFormat(covidCountry(x).TotalConfirmed) }}</span>(+{{ Format.numberFormat(covidCountry(x).NewConfirmed) }}) |</div>
              <div>격리해제: <span>{{ Format.numberFormat(covidCountry(x).TotalRecovered) }}</span>(+{{ Format.numberFormat(covidCountry(x).NewRecovered) }}) |</div>
              <div>사망자: <span>{{ Format.numberFormat(covidCountry(x).TotalDeaths) }}</span>(+{{ Format.numberFormat(covidCountry(x).NewDeaths) }})</div>
<!--              <div>치사율: <span>{{ parseInt(covidCountry(x).TotalDeaths / covidCountry(x).TotalConfirmed * 100) }}%</span></div>-->
            </li>
          </ul>
        </div>
      </div>
      <div class="info">
        <div class="ratingBtn-wrap">
          <div @click="ratingListOpen = true" class="ratingBtn">{{ orderByText(sortState) }}</div>
        </div>
      </div>
      <div
        v-if="inputData.wishCities === 'loading'"
      ><div class="loading"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div></div>
      <mobile-multi-flight
        v-else-if="inputData.wishCities.length >= 2"
        :inputData="inputData"
        :filter="filter"
        :sortState="sortState"
        :multiInfo="multiInfo"
        :progress="progress"
        :multiRequestNum="multiRequestNum"
        @multi-submit="multiSubmit"
      ></mobile-multi-flight>
      <mobile-round-flight
        v-else-if="inputData.wishCities.length === 1"
        :inputData="inputData"
        :filter="filter"
        :sortState="sortState"
        :roundFlights="roundFlights"
        :progress="progress"
      ></mobile-round-flight>
      <mobile-every
        v-else
        :inputData="inputData"
        :cityList="cityList"
        :filter="filter"
        :progress="progress"
        @get-city-sub-list="getCitySubList"
      >
      </mobile-every>
    </div>
    <div class="bpPop" v-if="$route.params.popFlag === 'book' || $route.params.popFlag === 'book2'">
      <mobile-book
        v-if="legs.length > 0"
        :inputData="inputData"
        :multiInfo="multiInfo"
        :roundInfo="roundFlights"
        :legs="legs"
        :price="price"
        :session="session"
      ></mobile-book>
    </div>
    <div class="bpPop" :style="ratingListOpen ? { display: 'block' } : { display: 'none' }" @click="ratingListOpen = false">
      <transition name="slide-bottom-fade" mode="out-in">
        <div
          v-if="ratingListOpen"
          @click.stop
          class="ratingList">
          <ul>
            <li @click="submitSort('curation')" :class="sortState === 'curation' ? 'active' : ''">추천순</li>
            <li @click="submitSort('price')" :class="sortState === 'price' ? 'active' : ''">가격순</li>
            <li @click="submitSort('duration')" :class="sortState === 'duration' ? 'active' : ''">총 비행시간 순</li>
            <li @click="ratingListOpen = false">취소</li>
          </ul>
        </div>
      </transition>
    </div>
    <transition name="slide-bottom-fade" mode="out-in">
      <div class="bpPop" v-if="$route.params.popFlag === 'date'">
        <calendar></calendar>
      </div>
    </transition>
    <div class="bpPop" v-if="$route.params.popFlag === 'option'">
      <Option></Option>
    </div>
    <div class="bpPop" v-if="$route.params.popFlag === 'filter'">
      <filter-flight
        :progress="progress"
        :allList="allList"
        :filter="filter"
        :sortState="sortState"
        :inputData="inputData"
        :multiInfo="multiInfo"
        @submit-filter="submitFilter"
      ></filter-flight>
    </div>
  </div>
</template>

<script>
import MobileMultiFlight from '~/components/flight/mobile/multiFlight.vue'; // eslint-disable-line
import MobileRoundFlight from '~/components/flight/mobile/roundFlight.vue'; // eslint-disable-line
import Option from '~/components/flight/mobile/option.vue'; // eslint-disable-line
import FilterFlight from '~/components/flight/mobile/filter.vue'; // eslint-disable-line
import MobileEvery from '~/components/flight/mobile/openSearch.vue'; // eslint-disable-line
import MobileBook from '~/components/flight/mobile/list-sub/wrapper.vue'; // eslint-disable-line
import TopInfo from '~/components/flight/mobile/topInfo.vue'; // eslint-disable-line
import Calendar from '~/components/search/mobile/calendar'; // eslint-disable-line
import Format from '~/utils/format.js'; //eslint-disable-line

export default {
  components: {
    MobileMultiFlight,
    MobileRoundFlight,
    Option,
    Calendar,
    FilterFlight,
    MobileEvery,
    MobileBook,
    TopInfo,
  },
  props: ['inputData', 'filter', 'sortState', 'cityList', 'roundFlights', 'multiInfo', 'legs', 'price', 'session', 'orderFix', 'allList', 'progress', 'multiRequestNum'],
  data() {
    return {
      filterSortState: this.sortState,
      ratingListOpen: false,
      Format,
      swiperOption: {
        loop: true,
        slidesPerView: 1,
        autoplay: this.inputData.wishCities.length > 1 ? {
          delay: 5000,
          stopOnLastSlide: false,
          disableOnInteraction: true,
        } : false,
      },
    };
  },
  computed: {
    wishCountries() {
      const arr = [];
      for (let x = 0; x < this.inputData.wishCities.length; x += 1) {
        const cd = this.inputData.wishCities[x].CountryId.split('-')[0];
        if (arr.indexOf(cd) < 0) {
          arr.push(cd);
        }
      }
      return arr;
    },
  },
  methods: {
    covidCountry(code) {
      const r = code === 'UK' ? 'GB' : code;
      return this.$store.state.covid.Countries.find(v => v.CountryCode === r);
    },
    submitSort(val) {
      this.filterSortState = val;
      this.$emit('sort-submit', this.filterSortState);
      this.ratingListOpen = false;
    },
    multiSubmit(index) {
      this.$emit('multi-submit', index);
    },
    getCitySubList(index) {
      this.$emit('get-city-sub-list', index);
    },
    changeFilterInfo(key, value) {
      this.$emit('change-filter-info', key, value);
    },
    submitFilter(localFilter, localSortState) {
      this.$emit('submit-filter', localFilter, localSortState);
    },
    orderByText(text) {
      let returnVal = '';
      switch (text) {
        case 'curation' :
          returnVal = '추천순';
          break;
        case 'price' :
          returnVal = '가격순';
          break;
        case 'duration' :
          returnVal = '총 비행시간 순';
          break;
        default :
          returnVal = '추천순';
          break;
      }
      return returnVal;
    },
  },
  beforeDestroy() {
    // this.$store.state.bookData = [];
  },
};
</script>

<style lang="scss" scoped>
  .mobileFlightListWrap{
    padding-top: 147px;
    padding-bottom: 51px;
    .scrollDownTop &{
    // padding-top: 101px;
    }
    .ratingBtn-wrap {
      padding: 20px 20px 0 20px;
      .ratingBtn {
        float: left;
        height: 33px;
        color: #585858;
        padding: 8px 32px 0 0;
        border-radius: 16.5px;
        line-height: 17px;
        font-size: 16px;
        font-weight: bold;
        transition: .3s ease;
        position: relative;

        &::after {
          right: 12px;
          transition: .3s ease;
          position: absolute;
          top: calc(50% - 2.5px);
          content: '';
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid #000;
          opacity: 0.7;
          clear: both;
        }
      }

      &::after {
        content: '';
        clear: both;
        display: block;
      }
    }
  }
  .ratingList{
    width: 100%;
    position: absolute;
    bottom: 20px;
    padding: 0 10px;
    ul {
      border-radius: 10px;
      overflow: hidden;
      li {
        width: 100%;
        padding: 20px 0 18px 0;
        background-color: #fff;
        text-align: center;
        font-size: 16px;
        border-bottom: 1px solid #e9e9e9;
        cursor: pointer;
        &:nth-child(3){
          border-bottom-right-radius: 10px;
          border-bottom-left-radius: 10px;
        }
        &:last-child {
          border-top-right-radius: 10px;
          border-top-left-radius: 10px;
          margin-top: 10px;
          border-bottom: 0;
          color: #868686;
        }
        &.active{
          color: $dodger-blue;
          font-weight: bold;
        }
      }
    }
  }
  .loading{
    text-align: center;
  }
  .bpPop{
    position: fixed;
    top: 0;
    top: constant(safe-area-inset-top);
    top: env(safe-area-inset-top);
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 11;
    background-color: rgba(0, 0, 0, .3);
  }
  .covidInfo{
    background-color: #F2F2EE;
    font-size: 14px;
    width: 100%;
    height: 48px;
    z-index: 0;
    > ul{
      margin: 0 auto;
      height: 30px;
      max-width: 1110px;
      > li{
        width: 100%;
        height: 30px;
        display: flex;
        flex-wrap: wrap;
        padding: 4px 20px 0;
        > div{
          height: 20px;
          line-height: 20px;
          flex: 0 0 auto;
          padding-right: 4px;
          > span{
            color: #344556;
          }
        }
      }
    }
  }
</style>
