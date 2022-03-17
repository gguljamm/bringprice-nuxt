<template>
  <div class="searchInputBox" :class="[$route.path !== '/' ? 'list' : '', autoPop ? 'on' : '']">
    <div>
      <div
        v-if="searchTypePop"
        class="searchTypePop">
        <div>
          <div
            class="type"
            :class="flag === 'flight' ? 'active' : ''"
            @click="selectedFlagChange('flight')"
          >항공권</div>
          <div
            class="type"
            :class="flag === 'hotel' ? 'active' : ''"
            @click="selectedFlagChange('hotel')"
          >호텔</div>
        </div>
      </div>
      <div class="searchIcon"
        v-if="$route.path === '/'"
        :class="{
          flight: !isFirst && flag === 'flight' && wishCities.length <= 1,
          hotel: !isFirst && flag === 'hotel',
          flightMulti: !isFirst && flag === 'flight' && wishCities.length > 1,
        }"
      ></div>
      <div
        @click.stop="$emit('open-search-type-pop')"
        class="searchType"
        v-if="!autoPop && $route.path !== '/'"><div><span>{{isSearchFlag}}</span></div></div>
      <div class="searchFlag"></div>
      <div v-if="flag === 'flight'" class="placeholder" v-show="!autoPop" :class="orderFix ? 'orderFix' : ''">
        <span v-if="wishCities.length === 0" :class="wishCities.length === 0 ? 'default' : ''">EVERYWHERE</span>
        <span
          v-for="x in wishCities"
          :key="x.PlaceId"
        >{{ x.PlaceName }}</span>
      </div>
      <div v-else v-show="!autoPop" class="placeholder">
        <span :class="!destination ? 'default' : ''">{{ destination ? destination.name : '도시, 지역, 숙소명, 관광 명소 등으로 검색' }}</span>
      </div>
      <div class="lineSolid" v-if="!autoPop && ($route.path.indexOf('/hotelList/') >= 0 || $route.path.indexOf('/flight/') >= 0)"></div>
      <input
        @click.stop="!autoPop ? activeSearch() : ''"
        ref="searchInput"
        @keyup="keyup"
        :placeholder="isDept?'출발지 입력':''"
        :class="autoPop ? 'on' : ''"
      >
      <div
        v-if="$route.path !== '/'"
        @click="isActive || listSearchIconHover ? submit() : ''"
        class="listSearchBtn"
        @mouseover="autoPop ? listSearchIconHover = true : listSearchIconHover = false"
        @mouseleave="autoPop ? listSearchIconHover = false : listSearchIconHover = false"
        :class="(autoPop && $refs.searchInput.value) || listSearchIconHover? 'active' : ''"
      ></div>
      <button
        v-if="$route.path === '/'"
        :class="[isActive ? '' : 'disable', (flag === 'flight' && (wishCities.length <= 0 || !startCity.PlaceId)) || (flag === 'hotel' && Object.keys(destination).length <= 0) ? 'disable' : '']"
        @click="isActive ? submit() : ''"
      >검색</button>
    </div>
    <div class="webAutoWrap"
      v-if="autoPop"
      @click.stop
    >
      <button
        class="btnReset"
        v-if="wishCities.length > 0 && !isDept && $route.path === '/'"
        @click="resetWish"
      >모두삭제</button>
      <div v-if="wishCities.length === 0 && $route.path === '/'">
        <button
          :class="flag === 'flight' ? 'active' : ''"
          @click.stop="selectedFlagChange('flight')"
        >항공권</button>
        <button
          :class="flag === 'hotel' ? 'active' : ''"
          @click.stop="selectedFlagChange('hotel')"
        >호텔</button>
      </div>
      <div
        v-if="flag === 'flight' && wishCities.length > 0"
      >
        <div
          v-if="wishCities.length > 0"
          @click="changeDeptFlag()"
          :class="isDept ? 'active' : ''"
          class="startChangeBtn"
        >
          <span>{{ startCity.PlaceName === '서울' ? '인천/김포' : startCity.PlaceName }} 출발{{ !startCity.PlaceId ? '지 입력' : '' }}</span>
          <span v-if="isDept" @click.stop="isDept=false" class="startChange xBtn"></span>
          <span v-else class="startChange">변경</span></div>
        <button
          v-if="isDept && $route.path === '/'"
          @click="isDept=false"
        >여행지 변경</button>
        <button class="wish active"
          v-if="!isDept"
          v-for="(x, index) in wishCities"
          :key="x.CityId"
          @click="popWish(index)"
        >{{ x.PlaceName }}<div></div></button>
      </div>
      <div v-if="flag === 'flight' && wishCities.length > 0" class="bubbleWrap">
          <span class="inVisible">
          {{ startCity.PlaceName === '서울' ? '인천/김포' : startCity.PlaceName }} 출발{{ !startCity.PlaceId ? '지 입력' : '' }} {{ isDept ? '' : '변경' }}
          </span>
        <div class="bubble">출발지는 여기서 변경 가능합니다.</div>
      </div>
      <div class="searchListWrapper">
        <div>
          <transition name="swiper-left" mode="out-in">
            <place-list
              v-if="flag === 'flight'"
              :flag="'flight'"
              :placeList="flightPlaceList"
              :loading="autoCompleteLoading"
              :wishCities="wishCities"
              :recommendList="recommendList"
              :startCity="startCity"
              :isDept="isDept"
              @add-wish="addWish"
              @change-loading="changeLoading"
              @init-recommend="initRecommend"
              @clear-wish="clearWish"
              @init-first="initFirst"
              @swipe-wish="swipeWish"
            />
          </transition>
          <transition name="swiper-right" mode="out-in">
            <place-list
              v-if="flag === 'hotel'"
              :flag="'hotel'"
              :placeList="hotelPlaceList"
              :loading="autoCompleteLoading"
              :destination="destination"
              @change-destination="changeDestination"
              @init-first="initFirst"
            />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '~/utils/api'; // eslint-disable-line
import PlaceList from './placeList.vue';

export default {
  props: ['autoPop', 'wishCities', 'orderFix', 'searchTypePop'],
  components: {
    PlaceList,
  },
  data() {
    return {
      isActive: !(this.$route.path.indexOf('/hotelList') === 0 || this.$route.path.indexOf('/flightList') === 0),
      // flag: this.$route.path.indexOf('/hotelList') === 0 ? 'hotel' : 'flight',
      flag: this.$route.path.indexOf('/hotelList') === 0 ? 'hotel' : 'flight',
      hotelPlaceList: [],
      flightPlaceList: [],
      startDate: this.$route.params.checkin || this.$route.params.startDate || '',
      endDate: this.$route.params.checkout || this.$route.params.returnDate || '',
      autoCompleteLoading: false,
      delay: 300,
      timeout: '',
      recommendList: [],
      startCity: {
        PlaceName: this.$store.state.flightPlaceInfo[this.$route.params.startCity] ? this.$store.state.flightPlaceInfo[this.$route.params.startCity].PlaceName : '인천/김포',
        PlaceId: this.$route.params.startCity || 'SELA-sky',
        CityId: this.$route.params.startCity || 'SELA-sky',
      },
      destination: this.$route.params.destination ? JSON.parse(this.$route.params.destination) : '',
      isDept: false,
      isFirst: !(this.$route.path.indexOf('/hotelList') === 0 || this.$route.path.indexOf('/flightList') === 0),
      listSearchIconHover: false,
    };
  },
  computed: {
    isSearchFlag() {
      let returnFlag = '';
      if (!this.isFirst && this.flag === 'flight') {
        returnFlag = '항공권';
      }
      if (!this.isFirst && this.flag === 'hotel') {
        returnFlag = '호텔';
      }
      return returnFlag;
    },
  },
  methods: {
    initFirst() {
      this.isFirst = false;
    },
    submit() {
      if (this.flag === 'flight') {
        if (this.wishCities.length === 0) {
          ga('send', { // eslint-disable-line
            hitType: 'event',
            eventCategory: 'clickFlightSearch',
            eventAction: 'web-round',
            eventLabel: 'every',
          });
          this.$router.push('/date/flight/SELA&every');
        } else {
          if (!this.startCity.PlaceId) {
            this.$router.push({
              query: {
                popFlag: 'alert',
                alertId: 18,
              },
            });
            return;
          }
          const arr = [];
          for (let x = 0; x < this.wishCities.length; x += 1) {
            arr.push(this.wishCities[x].PlaceId.split('-')[0]);
          }
          ga('send', { // eslint-disable-line
            hitType: 'event',
            eventCategory: 'clickFlightSearch',
            eventAction: arr.length === 1 ? 'web-round' : 'web-multi',
            eventLabel: arr.length === 1 ? arr[0] : arr.length,
          });
          this.$router.push(
            `/date/flight/${this.startCity.PlaceId.split('-')[0]}&${arr.join('&')}`,
          );
        }
      } else if (this.flag === 'hotel' && this.destination) {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'clickHotelSearch',
          eventAction: this.destination.name,
        });
        this.$router.push(`/date/hotel/${JSON.stringify(this.destination)}`);
      } else {
        this.$router.push({
          query: {
            popFlag: 'alert',
            alertId: 8,
          },
        });
      }
    },
    changeDestination(data, close) {
      this.isActive = true;
      if (this.flag === 'hotel' && this.$refs.searchInput) {
        this.$refs.searchInput.value = '';
      }
      if (data) {
        this.destination = data;
        if (this.$route.path !== '/') {
          this.submit();
        }
      }
      if (this.$refs.searchInput) {
        this.$refs.searchInput.value = '';
      }
      if (!close) {
        this.$emit('close-pop');
      }
    },
    resetWish() {
      this.isActive = true;
      const leng = this.wishCities.length;
      for (let x = 0; x < leng; x += 1) {
        this.wishCities.splice(0, 1);
      }
      this.recommendCityList();
    },
    addWish(data) {
      this.isActive = true;
      this.$refs.searchInput.value = '';
      this.$refs.searchInput.focus();
      this.flightPlaceList = [];
      if (this.isDept) {
        this.startCity = data;
        this.isDept = false;
      } else if (this.wishCities.length < 6) {
        this.wishCities.push(data);
        this.recommendCityList();
      } else {
        this.$router.push({
          query: {
            popFlag: 'alert',
            alertId: 1,
          },
        });
      }
    },
    swipeWish(data) {
      this.startCity = {};
      this.addWish(data);
    },
    clearWish() {
      this.isActive = true;
      this.$emit('clear-wish');
      this.$emit('close-pop');
    },
    popWish(index) {
      this.isActive = true;
      this.wishCities.splice(index, 1);
      this.recommendCityList();
    },
    changeLoading(value) {
      this.autoCompleteLoading = value;
    },
    activeSearch() {
      this.$refs.searchInput.value = '';
      this.keyup();
      this.$emit('auto-pop-on');
    },
    selectedFlagChange(flag) {
      if (flag === 'flight') {
        this.destination = this.$route.params.destination ? JSON.parse(this.$route.params.destination) : '';
      }
      if (flag === 'hotel') {
        // console.log(this.wishCities);
        this.$emit('clear-wish');
      }
      this.flag = flag;
      if (this.$route.path === '/') {
        this.$nextTick(() => {
          this.$refs.searchInput.focus();
          this.keyup();
        });
      }
    },
    keyup() {
      const query = this.$refs.searchInput.value;
      if (query.length === 0) {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.autoCompleteLoading = false;
        this.flightPlaceList = [];
        this.hotelPlaceList = [];
        return;
      }
      if (this.flag === 'hotel') {
        this.hotelAutoComplete(query);
      } else {
        this.flightAutoComplete(query);
      }
    },
    hotelAutoComplete(query) {
      this.autoCompleteLoading = true;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        Api.hotelAutoComplete(encodeURIComponent(query)).then((resp) => {
          this.hotelPlaceList = resp.data;
          this.autoCompleteLoading = false;
        }).catch((error) => {
          if (error.message !== 'cancel') {
            this.hotelPlaceList = [];
            this.autoCompleteLoading = false;
          }
        });
      }, this.delay);
    },
    flightAutoComplete(query) {
      this.autoCompleteLoading = true;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        Api.flightAutoComplete(encodeURIComponent(query)).then((resp) => {
          this.autoCompleteLoading = false;
          this.flightPlaceList = resp.data.Result.Places;
        }).catch((error) => {
          if (error.message !== 'cancel') {
            this.flightPlaceList = [];
            this.autoCompleteLoading = false;
          }
        });
      }, this.delay);
    },
    recommendCityList() {
      this.recommendList = [];
      if (this.wishCities.length >= 6) {
        return;
      }
      this.autoCompleteLoading = true;
      Api.recommendCityList(this.startCity.PlaceId, this.wishCities)
        .then((resp) => {
          this.autoCompleteLoading = false;
          if (resp.data.Status === 'Success') {
            this.recommendList = resp.data.Result.Places;
          }
        })
        .catch((error) => {
          this.autoCompleteLoading = false;
          console.log(error);
        });
    },
    initRecommend() {
      if (!this.$store.state.recommendList) {
        Api.recommendCityList('SELA-sky', []).then((resp) => {
          this.$store.commit('appendRecommendList', resp.data.Result.Places);
          this.recommendList = resp.data.Result.Places;
        });
      } else {
        this.recommendList = this.$store.state.recommendList;
      }
    },
    changeDeptFlag() {
      this.isDept = true;
      this.$refs.searchInput.focus();
    },
    clearInput() {
      this.$refs.searchInput.value = '';
      this.$refs.searchInput.blur();
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.document.addEventListener('click', this.clearInput);
    });
  },
  beforeDestroy() {
    window.document.removeEventListener('click', this.clearInput);
  },
};
</script>

<style scoped lang="scss">
  .webAutoWrap{
    position: relative;
    .bubbleWrap{
      animation: toast 3s 1 ease;
      animation-fill-mode: forwards;
      position: absolute;
      padding: 0 16px;
      margin-left: 20px;
      font-size: 14px;
      border: 1px solid transparent;
      .inVisible{
        visibility: hidden;
      }
        .bubble{
          height: 34px;
          border-radius: 14px;
          box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
          background-color: #000000;
          white-space: nowrap;
          position: absolute;
          top: 0;
          left: 0;
          padding: 0 16px;
          color: #fff;
          text-align: center;
          font-size: 14px;
          display: flex;
          align-items: center;
          &:before {
            content: '';
            position: absolute;
            top: -5px;
            left: 20%;
            margin-left: -4px;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 5px solid #4a4a4a;
          }
        }
      }
    }
    .searchInputBox.list {
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      &.on {
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        overflow: hidden;
        > div:first-of-type {
          height: 55px;
          input{
            height: 55px;
          }
        }
        .webAutoWrap{
          /*border-bottom-left-radius: 10px;*/
        /*border-bottom-right-radius: 10px;*/
      }
    }
    > div:first-of-type {
      height: 44px;
      .listSearchBtn {
        background-image: url('~assets/img/common/search_list.svg');
        position: absolute;
        background-repeat: no-repeat;
        background-position: center center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: #f9f9f9;
        top: calc(50% - 18px);
        right: 16px;
        cursor: pointer;
        transition: .3s ease;
        &.active{
          background-color: $dodger-blue;
          background-image: url('~assets/img/common/search_list_white.svg');
        }
      }
      .searchTypePop{
        width: 107px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
        position: absolute;
        z-index: 1;
        border: 1px solid #cdcdcd;
        .type{
          transition: 0.3s ease;
          width: 100%;
          height: 50%;
          text-align: center;
          line-height: 55px;
          font-size: 16px;
          font-weight: 500;
          color: #000;
          background-color: #fff;
          cursor: pointer;
          &:hover{
            background-color: #f9f9f9;
          }
          &:first-of-type{
            border-radius: 10px 10px;
            border-bottom: 1px solid #f2f2f2;
          }
          &:nth-child(2){
            border-radius: 0 0 10px 10px;
          }
        }
      }
      .searchType{
        width: 100px;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        cursor: pointer;
        > div {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          padding-left: 20px;
          > span{
            max-height: 20px;
            color: #868686;
            font-size: 16px;
            line-height: 1;
          }
          &::after{
            content: '';
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid #000;
            opacity: 0.7;
            clear: both;
            position: absolute;
            right: 16px;
          }
        }
      }
      .searchIcon{
        top: 8px;
      }
      .placeholder {
        .default{
          font-size: 16px;
          font-weight: normal;
          color: #868686;
        }
        line-height: 44px;
        font-size: 16px;
        background-color: transparent;
        left: 120px;
        right: 52px;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #000;
        font-weight: bold;
      }
      .lineSolid{
        width: 1px;
        height: 24px;
        position: absolute;
        top: calc(50% - 12px);
        left: 100px;
        background-color: #cacaca;
      }
      input {
        height: 44px;
        border-radius: 22px;
        font-size: 16px;
        background-color: #f9f9f9;
        padding-left: 100px;
        box-shadow: unset;
        border: none;
        &.on{
          border: solid 1px #cdcdcd;
          background-color: #fff;
          padding-left: 15px;
          border-top-right-radius: 10px;
          border-top-left-radius: 10px;
          border-bottom-right-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }
    .webAutoWrap{
      width: 100%;
      position: static;
      > div:first-of-type{
        white-space: unset;
        height: auto;
        margin-right: 0;
        button, .startChangeBtn{
          display: inline-block;
          padding: 0 14px;
          height: 33px;
          line-height: 33px;
          border: 1px solid #cdcdcd;
          border-radius: 16.5px;
          margin-right: 8px;
          font-size: 14px;
          color: #4a4a4a;
          transition: .3s ease;
          position: relative;
          .startChange {
            cursor: pointer;
            padding: 0;
            color: $dodger-blue;
            font-size: 10px;
            margin-left: 6px;
            &.xBtn{
              width: 17px;
              height: 17px;
              position: absolute;
              right: 10px;
              top: 7.5px;
              background-image: url('~assets/img/common/x-blue.svg');
              background-repeat: no-repeat;
              background-position: center center;
            }
          }
          &.active{
            border: none;
            color: $dodger-blue;
            background-color: #e9eeff;
            box-shadow: unset;
            padding-right: 33px;
          }
          &.wish{
            padding-right: 36px;
          }
          > div{
            width: 17px;
            height: 17px;
            position: absolute;
            right: 10px;
            top: 7.5px;
            background-image: url('~assets/img/common/x-blue.svg');
            background-repeat: no-repeat;
            background-position: center center;
          }
        }
        button.wish{
          margin-top: 5px;
        }
      }
      .searchListWrapper{
        padding: 0;
        margin: 0;
        height: auto;
      }
    }
  }
  .searchInputBox{
    > div:first-of-type{
      height: 76px;
      position: relative;
      display: flex;
      .searchIcon{
        position: absolute;
        background-image: url('~assets/img/common/search_purple.svg');
        background-repeat: no-repeat;
        background-position: center center;
        width: 28px;
        height: 28px;
        top: 23px;
        left: 24px;
        &.flight{
          background-image: url('~assets/img/common/ic-flight.svg');
        }
        &.hotel{
          background-image: url('~assets/img/common/ic-hotel.svg');
        }
        &.flightMulti{
          background-image: url('~assets/img/common/ic-flight-multi.svg');
        }
      }
      .placeholder{
        position: absolute;
        font-size: 20px;
        left: 73px;
        color: #9b9b9b;
        top: 1px;
        line-height: 74px;
        right: 235px;
        background-color: #FFF;
        pointer-events: none;
        overflow: hidden;
        white-space: nowrap;
        > span:after{
          content: ' · ';
        }
        > span:last-of-type:after{
          content: '';
        }
        &.orderFix > span:after{
          content: ' → ';
        }
        &.orderFix > span:last-of-type:after{
          content: '';
        }
      }
      input{
        flex: auto;
        width: 876px;
        height: 76px;
        border-radius: 2px;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
        background-color: #FFF;
        border: 1px solid #e5e5e5;
        font-size: 20px;
        padding-left: 72px;
      }
      button{
        flex: 0 0 226px;
        margin-left: 8px;
        height: 76px;
        border-radius: 2px;
        background-color: $cornflower;
        font-size: 20px;
        font-weight: bold;
        color: #FFF;
        transition: .3s ease;
        &.disable{
          background-color: #e9e9e9;
        }
      }
    }
    .webAutoWrap{
      background-color: #FFF;
      position: absolute;
      z-index: 5;
      width: 876px;
      height: auto;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e5e5;
      margin-top: -1px;
      > .btnReset{
        position: absolute;
        right: 20px;
        top: 20px;
        font-size: 14px;
        color: #8095ff;
      }
      > div:first-of-type{
        position: relative;
        height: 60px;
        padding: 10px 20px;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        margin-right: 70px;
        > button, .startChangeBtn{
          cursor: pointer;
          display: inline-block;
          line-height: 40px;
          padding: 0 16px;
          height: 40px;
          border-radius: 2px;
          background-color: #fFF;
          border: 1px solid #e1e1e1;
          margin-right: 8px;
          font-size: 14px;
          color: #4a4a4a;
          transition: .3s ease;
          position: relative;
          &.active{
            font-weight: bold;
            color: #fff;
            border-color: $cornflower;
            background-color: $cornflower;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
          }
          &.wish{
            padding-right: 36px;
          }
          > div:not(.bubble){
            width: 16px;
            height: 16px;
            position: absolute;
            right: 10px;
            top: 12px;
            background-image: url('~assets/img/common/x-white.svg');
            background-repeat: no-repeat;
            background-position: center center;
          }
        }
      }
    }
  }
  .searchListWrapper > div{
    overflow: hidden;
  }
  /* transition event */
  .swiper-left-enter-active, .swiper-left-leave-active,
  .swiper-right-enter-active, .swiper-right-leave-active {
    transition: .3s ease;
    transform: translateX(0);
  }
  .swiper-left-enter, .swiper-left-leave-to {
    transform: translateX(-100%);
  }
  .swiper-right-enter, .swiper-right-leave-to {
    transform: translateX(100%);
  }
  @media (max-width: 1110px) {
    .searchInputBox.list > div:first-of-type .placeholder{
      width: calc(100vw - 652px)
    }
    .searchInputBox.list > div:first-of-type input{
      width: calc(100vw - 480px)
    }
  }
</style>
