<template>
  <div>
    <div v-if="inputData.wishCities === 'loading'">
      <div class="loading"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>
    </div>
    <div v-else>
      <Search
        @click.stop
        class="listSearch"
        :autoPop="autoPop"
        :wishCities="wishCities"
        :orderFix="orderFix"
        :progress="progress"
        :searchTypePop="searchTypePop"
        @open-search-type-pop="searchTypePop = true, openPopFlag = false, ratingListOpen = false"
        @close-search-type-pop="searchTypePop = false"
        @auto-pop-on="autoPop=true, searchTypePop = false, openPopFlag = false, ratingListOpen = false"
        @close-pop="autoPop=false"
      ></Search>
      <filter-button
        :inputData="inputData"
        :filter="filter"
        :orderFix="orderFix"
        :sortState="sortState"
        :openPopFlag="openPopFlag"
        :allList="allList"
        :progress="progress"
        :multiInfo="multiInfo"
        @open-filter="openFilter"
        @close-filter="openPopFlag = false"
        @submit-filter="submitFilter"
        @change-filter-info="changeFilterInfo"
        @change-order-fix="$emit('change-order-fix')"
      ></filter-button>
      <!--{{roundFlights && roundFlights.Itineraries.length}}-->
      <!--{{multiInfo.scheduleList}}-->
      <div v-if="$store.state.covid && wishCountries.find((v) => covidCountry(v))">
        <div class="covidInfo" v-if="wishCountries.filter((v) => covidCountry(v)).length > 1"
          v-swiper:index="swiperOption"
          ref="swiper"
        >
          <ul class="swiper-wrapper">
            <li class="swiper-slide" v-for="x in wishCountries"
              v-if="covidCountry(x)"
              :key="x"
            >
              <div><strong>{{ inputData.wishCities.find(v => v.CountryId.split('-')[0] === x).CountryName }}</strong> 코로나19 현황 |</div>
              <div>총 확진자: <span>{{ Format.numberFormat(covidCountry(x).TotalConfirmed) }}</span>(+{{ Format.numberFormat(covidCountry(x).NewConfirmed) }})</div>
              <div>총 격리해제: <span>{{ Format.numberFormat(covidCountry(x).TotalRecovered) }}</span>(+{{ Format.numberFormat(covidCountry(x).NewRecovered) }})</div>
              <div>총 사망자: <span>{{ Format.numberFormat(covidCountry(x).TotalDeaths) }}</span>(+{{ Format.numberFormat(covidCountry(x).NewDeaths) }})</div>
              <div>치사율: <span>{{ parseInt(covidCountry(x).TotalDeaths / covidCountry(x).TotalConfirmed * 1000) / 10 }}%</span></div>
            </li>
          </ul>
        </div>
        <div class="covidInfo" v-else>
          <ul class="swiper-wrapper">
            <li class="swiper-slide" v-for="x in wishCountries"
              v-if="covidCountry(x)"
              :key="x"
            >
              <div><strong>{{ inputData.wishCities.find(v => v.CountryId.split('-')[0] === x).CountryName }}</strong> 코로나19 현황 |</div>
              <div>총 확진자: <span>{{ Format.numberFormat(covidCountry(x).TotalConfirmed) }}</span>(+{{ Format.numberFormat(covidCountry(x).NewConfirmed) }})</div>
              <div>총 격리해제: <span>{{ Format.numberFormat(covidCountry(x).TotalRecovered) }}</span>(+{{ Format.numberFormat(covidCountry(x).NewRecovered) }})</div>
              <div>총 사망자: <span>{{ Format.numberFormat(covidCountry(x).TotalDeaths) }}</span>(+{{ Format.numberFormat(covidCountry(x).NewDeaths) }})</div>
              <div>치사율: <span>{{ parseInt(covidCountry(x).TotalDeaths / covidCountry(x).TotalConfirmed * 1000) / 10 }}%</span></div>
            </li>
          </ul>
        </div>
      </div>
      <div class="flightSearchList">
        <div class="list-info-wrap">
          <div class="list-info">
            <p class="title">추천하는 항공권</p>
            <p class="subTitle">브링프라이스가 추천하는 항공권입니다.</p>
          </div>
          <div
            @click.stop
            class="ratingBtn-wrap">
            <div
              @click="ratingListOpen = true, autoPop = false, searchTypePop = false, openPopFlag = false"
              class="ratingBtn">{{ orderByText(sortState) }}</div>
            <div
              v-if="ratingListOpen"
              class="ratingList">
              <ul>
                <li class="list-top">정렬기준</li>
                <li @click="submitSort('curation')" :class="sortState === 'curation' ? 'active' : ''">추천순</li>
                <li @click="submitSort('price')" :class="sortState === 'price' ? 'active' : ''">가격순</li>
                <li @click="submitSort('duration')" :class="sortState === 'duration' ? 'active' : ''">총 비행시간 순</li>
              </ul>
            </div>
          </div>
        </div>
        <open-search
          v-if="inputData.wishCities.length === 0"
          :inputData="inputData"
          :cityList="cityList"
          :filter="filter"
          :progress="progress"
          @get-city-sub-list="getCitySubList"
        ></open-search>
        <round-search
          v-if="inputData.wishCities.length === 1"
          :inputData="inputData"
          :filter="filter"
          :sortState="sortState"
          :roundFlights="roundFlights"
          :progress="progress"
          :priceAlertFlag="priceAlertFlag"
          @set-stops-filter="setStopsFilter"
        ></round-search>
        <multi-search
          v-if="inputData.wishCities.length > 1"
          :inputData="inputData"
          :filter="filter"
          :sortState="sortState"
          :multiInfo="multiInfo"
          :progress="progress"
          :multiRequestNum="multiRequestNum"
          :priceAlertFlag="priceAlertFlag"
          @reset-filter="$emit('reset-filter')"
          @multi-submit="multiSubmit"
        ></multi-search>
      </div>
    </div>
    <div class="bpPop" v-if="$route.params.popFlag === 'book' || $route.params.popFlag === 'self'"
      @click="$router.back()"
    >
      <web-book
        v-if="$route.params.popFlag === 'book' && legs.length > 0"
        :inputData="inputData"
        :multiInfo="multiInfo"
        :session="session"
        :legs="legs"
        :price="price"
      ></web-book>
      <self-trans
        v-if="$route.params.popFlag === 'self' && selfInfo"
        :selfInfo="selfInfo"
      ></self-trans>
    </div>
  </div>
</template>

<script>
import OpenSearch from './openSearch.vue';
import MultiSearch from './multiWrapper.vue';
import RoundSearch from './roundWrapper.vue';
import FilterButton from './filters/filterButton.vue';
import Search from '~/components/search/web/search.vue'; // eslint-disable-line
import Api from '~/utils/api'; // eslint-disable-line
import User from '~/utils/user'; // eslint-disable-line
import EventBus from '~/utils/eventBus'; // eslint-disable-line
import WebBook from './list-sub/multiBook.vue';
import SelfTrans from './list-sub/selfTransfer.vue';
import Format from '~/utils/format.js'; //eslint-disable-line

export default {
  components: {
    OpenSearch,
    Search,
    MultiSearch,
    RoundSearch,
    FilterButton,
    WebBook,
    SelfTrans,
  },
  props: ['inputData', 'filter', 'sortState', 'cityList', 'roundFlights', 'multiInfo', 'legs', 'price', 'session', 'orderFix', 'allList', 'progress', 'multiRequestNum'],
  data() {
    // console.log(this.multiInfo.scheduleList);
    return {
      autoPop: false,
      priceAlertId: null,
      selfInfo: null,
      searchTypePop: false,
      openPopFlag: false,
      filterSortState: this.sortState,
      ratingListOpen: false,
      Format,
      swiperOption: {
        direction: 'vertical',
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
    wishCities() {
      if (this.inputData.wishCities === 'loading') {
        return [];
      }
      const arr = [];
      for (let x = 0; x < this.inputData.wishCities.length; x += 1) {
        arr.push(this.inputData.wishCities[x]);
      }
      return arr;
    },
    priceAlertFlag() {
      const arrWishText = [];
      for (let x = 0; x < this.inputData.wishCities.length; x += 1) {
        arrWishText.push(this.inputData.wishCities[x].PlaceName);
      }
      return this.$store.state.mailingList.some((val) => { // eslint-disable-line
        if (val.start_city === this.inputData.startCity.PlaceName &&
          val.start_date === this.inputData.startDate &&
          val.return_date === this.inputData.returnDate
        ) {
          return !val.wish_cities.some(wish => arrWishText.indexOf(wish) < 0);
        }
      });
    },
  },
  methods: {
    // listSize(index) {
    //   const sizeArr = [];
    //   let size = 0;
    //   for (let x = 0; x < this.multiInfo.stopLength; x += 1) {
    //     const label = this.multiInfo.scheduleList[index].FlightInfo[`Flight${x}`];
    //     const key = `${label.OriginPlace}|${label.DestinationPlace}|${label.OutboundDate}`;
    //     const data = this.multiInfo.liveList[key].data;
    //     sizeArr.push(data.Itineraries.length);
    //     console.log(data);
    //   }
    //   size = sizeArr.reduce((val, v) => val * v, 1);
    //   console.log(size);
    // },
    covidCountry(code) {
      const r = code === 'UK' ? 'GB' : code;
      return this.$store.state.covid.Countries.find(v => v.CountryCode === r);
    },
    submitSort(val) {
      this.filterSortState = val;
      this.$emit('sort-submit', this.filterSortState);
      this.ratingListOpen = false;
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
    setStopsFilter(max) {
      this.$emit('set-stops-filter', max);
    },
    openFilter(type) {
      this.ratingListOpen = false;
      this.autoPop = false;
      this.searchTypePop = false;
      this.openPopFlag = type;
    },
    multiSubmit(index) {
      // this.listSize(index);
      this.$emit('multi-submit', index);
    },
    getCitySubList(index) {
      this.$emit('get-city-sub-list', index);
    },
    changeFilterInfo(key, value) {
      this.$emit('change-filter-info', key, value);
    },
    submitFilter(localFilter, localSortState, key) {
      this.$emit('submit-filter', localFilter, localSortState, key);
    },
    closeAutoPop() {
      this.autoPop = false;
      this.openPopFlag = false;
      this.searchTypePop = false;
      this.ratingListOpen = false;
    },
  },
  mounted() {
    window.addEventListener('click', this.closeAutoPop);
    if (this.$route.params.popFlag === 'book' || this.$route.params.popFlag === 'book2') {
      if (this.$route.params.step === 'select' && this.multiInfo.selectedIndex === -1) {
        this.$router.replace({
          params: {
            step: 'list',
            popFlag: undefined,
          },
        });
      } else {
        this.$router.replace({
          params: {
            popFlag: undefined,
          },
        });
      }
    }
    EventBus.$off('addMailing');
    EventBus.$on('addMailing', (obj) => {
      if (!this.$cookies.get('bpUser').data.userEmail) {
        this.$router.push({
          query: {
            popFlag: 'alert',
            alertId: 16,
          },
        });
        return;
      }
      Api.setPriceAlert(obj).then(() => {
        User.getMailingInfo(this.$cookies.get('bpUser').data.userID).then((resp) => {
          this.$store.state.mailingList = resp.data.Result;
        });
        this.$router.push({
          query: {
            popFlag: 'alert',
            alertId: 3,
          },
        });
      });
    });
    EventBus.$off('unFollowing');
    EventBus.$on('unFollowing', () => {
      const arrWishText = [];
      for (let x = 0; x < this.inputData.wishCities.length; x += 1) {
        arrWishText.push(this.inputData.wishCities[x].PlaceName);
      }
      const arrId = [];
      for (let x = 0; x < this.$store.state.mailingList.length; x += 1) {
        const val = this.$store.state.mailingList[x];
        if (val.start_city === this.inputData.startCity.PlaceName &&
          val.start_date === this.inputData.startDate &&
          val.return_date === this.inputData.returnDate
        ) {
          if (!val.wish_cities.some(wish => arrWishText.indexOf(wish) < 0)) {
            arrId.push(val.id);
          }
        }
      }
      User.arrDeleteMailing(arrId).then(() => {
        this.$router.push({ query: { popFlag: 'alert', alertId: 12 } });
        User.getMailingInfo(this.$cookies.get('bpUser').data.userID).then((resp) => {
          this.$store.state.mailingList = resp.data.Result;
        });
      });
    });
    EventBus.$off('selfTransfer');
    EventBus.$on('selfTransfer', (info) => {
      this.selfInfo = info;
      this.$router.push({
        params: {
          popFlag: 'self',
        },
        query: this.$route.query,
      });
    });
    if (this.inputData.wishCities.length > 1) {
      const interval = setInterval(() => {
        if (this.$refs.swiper) {
          // this.$refs.swiper.swiper.autoplay.start();
          clearInterval(interval);
        }
      }, 100);
    }
  },
};
</script>

<style lang="scss" scoped>
  .flightSearchList{
    max-width: 1230px;
    margin: 0 auto;
    padding: 30px 60px 20px 60px;
    min-height: calc(100vh - 300px);
    .list-info-wrap {
      position: relative;
      transition: .3s ease;
      margin-bottom: 12px;
      &::after {
        content: '';
        clear: both;
        display: block;
      }

      > div {
        &::after {
          content: '';
          clear: both;
          display: block;
        }
      }

      .list-info {
        float: left;

        .title {
          font-size: 22px;
          color: #000;
        }

        .subTitle {
          padding-top: 8px;
          font-size: 14px;
          line-height: 17px;
          color: #7f7f7f;
        }
      }

      .ratingBtn-wrap {
        float: right;
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 2;
        cursor: pointer;

        .ratingBtn {
          color: #585858;
          padding: 8px 32px 8px 14px;
          border-radius: 16.5px;
          font-size: 14px;
          transition: .3s ease;
          margin-bottom: -8px;
          &::after {
            right: 12px;
          }
        }
      }
    }
    .ratingList {
      width: 136px;
      border-radius: 10px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
      border: solid 1px #cdcdcd;
      background-color: #fff;
      position: absolute;
      left: calc(50% - 68px);
      top: -33px;
      li{
        position: relative;
        transition: 0.3s ease;
        width: 100%;
        text-align: center;
        line-height: 38px;
        font-size: 16px;
        font-weight: 500;
        color: #000;
        background-color: #fff;
        cursor: pointer;
        &.list-top{
          cursor: default;
        }
        &:not(&:first-of-type) {
          border: 1px solid #f2f2f2;
        }
        &:first-of-type{
          text-align: left;
          padding-left: 28px;
          height: 41px;
          line-height: 41px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          &::after {
            right: 23px;
          }
        }
        &:last-of-type{
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
        }
        &:not(.list-top):hover{
          background-color: #f2f2f2;
        }
      }
    }
    .ratingList li:first-of-type, .ratingBtn {
      &::after {
        transition: .3s ease;
        position: absolute;
        top: 50%;
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
  }
  .bpPop{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 11;
    background-color: rgba(0, 0, 0, .3);
  }
  .bpWebPop{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 11;
    background-color: rgba(255, 255, 255, 0.7);
    > .bpWebInner{
      width: 800px;
      position: absolute;
      top: 100px;
      bottom: 100px;
      left: 50%;
      margin-left: -400px;
      background-color: #FFF;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid #f1f1f1;
    }
  }
  .covidInfo{
    background-color: #F2F2EE;
    font-size: 14px;
    width: 100%;
    height: 30px;
    > ul{
      margin: 0 auto;
      height: 30px;
      max-width: 1110px;
      padding: 0 60px;
      > li{
        width: 100%;
        height: 30px;
        display: flex;
        > div{
          line-height: 30px;
          flex: 0 0 auto;
          padding-right: 10px;
          > span{
            text-decoration: underline;
          }
        }
      }
    }
  }
</style>
