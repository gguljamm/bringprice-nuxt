/* eslint-disable */
import Vue from 'vue';
import Vuex from 'vuex';

const store = () => new Vuex.Store({
  state: {
    isMobile: true,
    isLogin: false,
    flightPlaceInfo: {
      SELA: {
        CountryName: '대한민국',
        CountryId: "KR-sky",
        PlaceId: 'SELA-sky',
        PlaceName: '서울',
        id: 'SELA-sky',
      },
    },
    recommendList: null,
    hotelListObj: {
      list: [],
      geoValue: {
        center: {},
        markers: [],
      },
      requireParam: '',
      categories: [],
    },
    hotelDetailObj: {},
    waterfallState: null,
    mailingList: [],
    bookCache: {},
    flightHotelList: {
      city: {},
      list: [],
    },
    covid: null,
  },
  mutations: {
    saveHotelCategories(state, arr) {
      state.hotelListObj.categories = arr;
    },
    setBookCache(state, obj) {
      state.bookCache[obj.key] = obj.value;
    },
    changeMobileFlag(state) {
      state.isMobile = !state.isMobile;
    },
    appendFlightPlaceInfo(state, data) {
      if (!state.flightPlaceInfo[data.PlaceId.split('-')[0]]) {
        state.flightPlaceInfo[data.PlaceId.split('-')[0]] = data;
      }
    },
    appendRecommendList(state, data) {
      state.recommendList = data;
    },
    clearHotelList(state) {
      state.hotelListObj.list = [];
      // state.hotelListObj.geoValue.markers = [];
    },
    saveHotelList(state, hotelList) {
      state.hotelListObj.geoValue = hotelList.geoValue;
      // console.log(state.hotelListObj.geoValue);
      state.hotelListObj.list = hotelList.list;
      state.hotelListObj.requireParam = hotelList.requireParam;
      // console.log(state.hotelListObj);
    },
    saveHotelDetail(state, hotelDetail) {
      state.hotelDetailObj.list = hotelDetail;
      // console.log(state.hotelDetailObj);
    },
    saveWaterfallState(state, waterfallState) {
      //state.waterfallState = waterfallState;
      Vue.set(state, 'waterfallState', waterfallState);
    },
    addHotelList(state, hotelList) {
      state.hotelListObj.list = state.hotelListObj.list.concat(hotelList.list);
      // state.hotelListObj.list = hotelList.list;
      // console.log(state.hotelListObj.list);
      state.hotelListObj.requireParam = hotelList.requireParam;
    },
    clearHotel(state) {
      state.hotelListObj.list = [];
      state.hotelListObj.geoValue = {
        center: {},
        markers: [],
      }
      Vue.set(state, 'waterfallState', null);
    },
    clearHotelDetail(state) {
      state.clearHotelDetail = {};
    },
    setCovid(state, v) {
      state.covid = v;
    }
  },
})

export default store;
