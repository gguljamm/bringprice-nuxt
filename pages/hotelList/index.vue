<template>
  <div
    v-if="init"
    class="type-wrap">
    <listWrapperMobile
      v-if="$store.state.isMobile"
      :inputData="inputData"
      :listLoading="listLoading"
      :hotelList="hotelList"
      :mapReSearchLoading="mapReSearchLoading"
      :selectedIndex="selectedIndex"
      :filterData="filterData"
      :filterActive="isFilterActive"
      :noListData="noListData"
      :lastPage="lastPage"
      :addListLoading="addListLoading"
      :progress="progress"
      :totalSize="totalSize"
      @mountListWrapper="mountListWrapper"
      @reset-filter="resetFilter"
      @change-selected-index="changeSelectedIndex"
      @add-hotel-list="addHotelList"
      @change-last-center="changeLastCenter"
      @research-from-map="mapReSearch"
      @apply-filter="applyFilter"
    />
    <listWrapperPc
      v-else
      :inputData="inputData"
      :listLoading="listLoading"
      :hotelList="hotelList"
      :mapReSearchLoading="mapReSearchLoading"
      :selectedIndex="selectedIndex"
      :filterData="filterData"
      :filterActive="isFilterActive"
      :noListData="noListData"
      :lastPage="lastPage"
      :addListLoading="addListLoading"
      :progress="progress"
      :totalSize="totalSize"
      :page="getPageNum"
      :remainingPercent="remainingPercent"
      @getHotelCount="getHotelCount"
      @setHotelList="setHotelList(true)"
      @reset-filter="resetFilter"
      @change-selected-index="changeSelectedIndex"
      @add-hotel-list="addHotelList"
      @previous-hotel-list="previousHotelList"
      @change-last-center="changeLastCenter"
      @research-from-map="mapReSearch"
      @mountListWrapper="mountListWrapper"
      @apply-filter="applyFilter"
    />
  </div>
</template>

<script>
import listWrapperMobile from '../../components/hotel/mobile/list/listWrapper.vue';
import listWrapperPc from '../../components/hotel/pc/list/listWrapper.vue';
import Api from '~/utils/api'; // eslint-disable-line
import Format from '~/utils/format'; // eslint-disable-line

export default {
  components: {
    listWrapperMobile,
    listWrapperPc,
  },
  head() {
    return {
      title: `${this.inputData.city.city_name || this.inputData.city.region || this.inputData.city.country_name}의 호텔`,
      meta: [
        { hid: 'description', name: 'description', content: `${this.$route.params.checkin}부터 ${this.$route.params.checkout}까지 머무는 ${this.inputData.city.city_name || this.inputData.city.region || this.inputData.city.country_name}의 호텔 추천 리스트` },
        { hid: 'og:image', name: 'og:image', content: 'https://cdn.bringprice.com/shareThumbnailImage/default.png' },
        { hid: 'og:title', name: 'og:title', content: `${this.inputData.city.city_name || this.inputData.city.region || this.inputData.city.country_name}의 호텔 - 브링프라이스` },
        { hid: 'og:description', name: 'og:description', content: `${this.$route.params.checkin}부터 ${this.$route.params.checkout}까지 머무는 ${this.inputData.city.city_name || this.inputData.city.region || this.inputData.city.country_name}의 호텔 추천 리스트` },
      ],
      // script: [
      //   { src: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDCnnPFWN6CZe3NLlBc_aJI90RZyfltxrg', async: true, defer: true },
      // ],
    };
  },
  validate({ params }) {
    // console.log(params);
    if (params.destination === 'every') {
      return true;
    }
    try {
      const city = JSON.parse(params.destination);
      if (!city.latitude || Number.isNaN(city.latitude) || !city.longitude || Number.isNaN(city.longitude)) {
        return false;
      }
    } catch (e) {
      return false;
    }
    /* eslint-disable */
    if (new Date(params.checkin) === 'Invalid Date' ||
      new Date(params.checkout) === 'Invalid Date' ||
      !Number.isInteger(parseInt(params.adults)) ||
      !Number.isInteger(parseInt(params.rooms))
    ) {
      return false;
    }
    if (params.children !== 'null') {
      const arr = params.children.split('&');
      for (let x = 0; x < arr.length; x += 1) {
        if (arr[x] != 0 && !Number.isInteger(parseInt(arr[x]))) {
          return false;
        }
      }
    }
    /* eslint-enable */
    return true; // params가 유효할 경우.
  },
  data() {
    const searchInfo = this.$route.params;
    const inputData = {
      city: searchInfo.destination === 'every' ? {} : JSON.parse(searchInfo.destination),
      checkinDate: searchInfo.checkin,
      checkoutDate: searchInfo.checkout,
      adults: parseInt(searchInfo.adults, 10),
      children: searchInfo.children !== 'null' ? searchInfo.children.split('&') : [],
      rooms: parseInt(searchInfo.rooms, 10),
    };
    return {
      init: false,
      inputData,
      format: Format,
      listLoading: true,
      hotelList: [],
      selectedIndex: -1,
      addListLoading: false,
      mapReSearchLoading: false,
      totalSize: 0,
      filterData: {
        'filter.categories': [],
        'filter.facilities': [],
        'filter.freeFacilities': [],
        'filter.maxPrice': undefined,
        'filter.minPrice': undefined,
        'filter.rating': '',
        'filter.star': [],
        orderBy: 'WEIGHT_DESC',
      },
      noListData: false,
      lastPage: false,
      progress: 0,
      remainingPercent: 0,
    };
  },
  computed: {
    getPageNum() {
      return this.$store.state.hotelListObj.requireParam ? JSON.parse(this.$store.state.hotelListObj.requireParam)['page.page'] : this.getDefaultParam;
    },
    isFilterActive() {
      return (this.filterData['filter.categories'].length > 0 ||
        this.filterData['filter.facilities'].length > 0 ||
        this.filterData['filter.freeFacilities'].length > 0 ||
        this.filterData['filter.maxPrice'] ||
        this.filterData['filter.minPrice'] ||
        this.filterData['filter.rating'] > 6 ||
        this.filterData['filter.star'].length > 0 ||
        this.filterData['filter.isBookableHotel'] ||
        this.filterData['filter.isBookNowPayLater']
      );
    },
    getDefaultParam() {
      const param = {
        'place.cityName': this.inputData.city.city_name,
        'place.countryCode': this.inputData.city.country,
        'place.countryName': this.inputData.city.country_name,
        'place.latitude': this.inputData.city.latitude,
        'place.longitude': this.inputData.city.longitude,
        'place.placeName': this.inputData.city.name,
        'place.type': this.inputData.city.type === 'city' || this.inputData.city.type === 'country' || this.inputData.city.type === 'region' || this.inputData.city.type === 'hotel' ? this.inputData.city.type.toUpperCase() : 'CITY',
        checkIn: this.inputData.checkinDate,
        checkOut: this.inputData.checkoutDate,
        numberOfAdults: this.inputData.adults,
        numberOfRooms: this.inputData.rooms,
        'page.page': 1,
        'filter.categories': '',
        'filter.facilities': [],
        'filter.freeFacilities': [],
        'filter.maxPrice': '',
        'filter.minPrice': '',
        'filter.rating': '',
        'filter.star': [],
        'filter.isBookableHotel': false,
        'filter.isBookNowPayLater': false,
        orderBy: 'WEIGHT_DESC',
      };
      if (this.inputData.children.length > 0) {
        const arr = this.inputData.children;
        param.numberOfChildren = arr.length;
        param.ageOfChildren = arr.join(',');
      }
      return param;
    },
  },
  methods: {
    getHotelCount(sendParam) {
      Api.getHotelsCount(encodeURI(sendParam)).then((hotelsCount) => {
        this.totalSize = hotelsCount.data;
      });
    },
    getHotelList(add = false, geoVal = false, filter = false) {
      const storeListObj = this.$store.state.hotelListObj;
      let param = {};
      if (add) {
        param = JSON.parse(storeListObj.requireParam);
        if (add !== 'previous') { // maxPage 이상일 때
          param['page.page'] += 1;
        } else {
          param['page.page'] -= 1;
        }
      } else if (geoVal) {
        param = JSON.parse(storeListObj.requireParam);
        param['place.latitude'] = geoVal.center.lat;
        param['place.longitude'] = geoVal.center.lng;
        param['place.cityName'] = '';
        param['place.countryCode'] = '';
        param['place.countryName'] = '';
        param['place.placeName'] = '';
        param['place.type'] = '';
        param['page.page'] = 1;
      } else {
        param = this.getDefaultParam;
      }
      if (filter) {
        Object.keys(filter).forEach((x) => {
          if (!filter[x] || (Array.isArray(filter[x]) && filter[x].length === 0)) {
            param[x] = '';
          } else {
            if (x !== 'page.page') {
              param[x] = filter[x];
            }
            if (x === 'filter.rating') {
              param[x] = filter[x];
            }
          }
        });
      } else {
        Object.keys(this.filterData).forEach((x) => {
          if (!this.filterData[x] || (Array.isArray(this.filterData[x]) && this.filterData[x].length === 0)) {
            param[x] = '';
          } else {
            param[x] = this.filterData[x];
            if (x === 'filter.rating') {
              param[x] = this.filterData[x];
            }
          }
        });
      }
      let sendParam = '';
      Object.keys(param).forEach((key) => {
        sendParam += `${key}=${param[key]}&`;
      });
      sendParam = sendParam.slice(0, -1);
      let setProgressVal = 0;
      const interval = setInterval(() => {
        this.progress += 5;
        if (this.progress >= 30) {
          clearInterval(interval);
        }
        setProgressVal += 200;
      }, setProgressVal);
      this.$store.commit('saveHotelCategories', []);
      this.$store.commit('saveHotelList', {
        list: [],
        requireParam: JSON.stringify(param),
      });
      Api.getHotelList(encodeURI(sendParam)).then((res) => {
        this.totalSize = res.data.totalCount;
        Api.gethotelRemainingPercent(encodeURI(sendParam)).then((remainingPercent) => {
          this.remainingPercent = remainingPercent.data;
        });
        if (res.data && res.data.hotels.length > 0) {
          const hotelObj = [];
          const geoMarkers = [];
          const price = {
            minPrice: res.data.minPrice, // eslint-disable-line
            maxPrice: res.data.maxPrice, // eslint-disable-line
            fMax: res.data.maxPrice,
          };
          let hotel = [];
          for (let x = 0; x < res.data.hotels.length; x += 1) {
            hotel = res.data.hotels[x];
            const roomOptions = [];
            if (hotel.rooms && hotel.rooms.length > 0) {
              for (let roomIndex = 0; roomIndex < hotel.rooms.length; roomIndex += 1) {
                const arr = [
                  { val: hotel.rooms[roomIndex].bookNowPayLater, name: '선예약 후 결제' },
                  { val: hotel.rooms[roomIndex].breakfastIncluded, name: '조식 포함' },
                  { val: hotel.rooms[roomIndex].freeWifi, name: '무료 와이파이' },
                  { val: hotel.rooms[roomIndex].isFreeCancelable, name: '무료 취소' },
                ];
                arr.forEach((roomOption) => {
                  if (roomOption.val !== null && roomOption.val && !roomOptions.includes(roomOption.name)) {
                    roomOptions.push(roomOption.name);
                  }
                });
              }
              hotel.roomOptions = roomOptions;
              hotel.rooms.sort((a, b) => a.totalPrice - b.totalPrice);
            } else {
              hotel.rooms = false;
            }
            geoMarkers.push({
              position: {
                lat: Number(hotel.latitude), // eslint-disable-line
                lng: Number(hotel.longitude), // eslint-disable-line
              },
              active: false,
              price: hotel.rooms, // eslint-disable-line
            });
            hotelObj.push(hotel);
          }
          this.$store.commit('saveHotelCategories', res.data.categoryTypes);
          if (add && this.$store.state.isMobile) {
            const addHotelVuex = {
              list: hotelObj,
              requireParam: JSON.stringify(param),
              listPrice: price,
            };
            this.$store.commit('addHotelList', addHotelVuex);
          } else if ((add && !this.$store.state.isMobile) || filter || (this.$store.state.isMobile || !add)) {
            const saveHotelVuex = {
              list: hotelObj,
              requireParam: JSON.stringify(param),
              geoValue: {
                center: {
                  lat: param['place.latitude'],
                  lng: param['place.longitude'],
                },
                markers: geoMarkers,
              },
            };
            this.$store.commit('saveHotelList', saveHotelVuex);
          }
          this.hotelList = this.$store.state.hotelListObj.list;
          this.noListData = false;
          this.listLoading = false;
          this.addListLoading = false;
          this.mapReSearchLoading = false;
        } else if (((res.data && res.data.hotels.length === 0) || !res.data) && add) {
          this.lastPage = true;
          this.addListLoading = false;
        } else {
          this.$store.state.hotelListObj.requireParam = JSON.stringify(param);
          this.hotelList = this.$store.state.hotelListObj.list;
          this.listLoading = false;
          this.addListLoading = false;
          this.noListData = true;
          this.mapReSearchLoading = false;
        }
      }).then(() => {
        this.finishProgress();
      }).catch((error) => {
        if (error.message !== 'cancel') {
          this.$router.push({
            query: {
              popFlag: 'alert',
              alertId: 10,
            },
          });
          this.$store.state.hotelListObj.requireParam = JSON.stringify(param);
          this.listLoading = false;
          this.addListLoading = false;
          this.noListData = true;
          this.mapReSearchLoading = false;
          this.clearGeoVal();
          this.finishProgress();
        }
      });
    },
    finishProgress() {
      this.progress = 98;
      setTimeout(() => {
        this.progress = 0;
      }, 500);
    },
    applyFilter(filter) {
      this.clearFilter();
      this.mapReSearchLoading = true;
      this.lastPage = false;
      this.listLoading = true;
      // console.log(filter);
      Object.keys(filter).forEach((key) => {
        this.filterData[key] = filter[key];
        if (key === 'filter.categories' || key === 'filter.facilities' || key === 'filter.freeFacilities') {
          for (let x = 0; x < filter[key].length; x += 1) {
            ga('send', { // eslint-disable-line
              hitType: 'event',
              eventCategory: 'hotelFilter',
              eventAction: key,
              eventLabel: filter[key][x],
            });
          }
        } else if (filter[key] && ((key !== 'orderBy' || filter[key] !== 'WEIGHT_DESC'))) {
          ga('send', { // eslint-disable-line
            hitType: 'event',
            eventCategory: 'hotelFilter',
            eventAction: key,
            eventLabel: `${filter[key]}`,
          });
        }
      });
      this.clearWaterfall(this.filterData, 'filter');
    },
    clearFilter() { // 초기 filter 값 설정
      this.filterData = {
        'filter.categories': [],
        'filter.facilities': [],
        'filter.freeFacilities': [],
        'filter.maxPrice': undefined,
        'filter.minPrice': undefined,
        'filter.rating': '',
        'filter.star': [],
        'filter.isBookNowPayLater': false,
        'filter.isBookableHotel': false,
        orderBy: 'WEIGHT_DESC',
      };
    },
    clearGeoVal() {
      this.$store.state.hotelListObj.geoValue = {
        center: {},
        markers: [],
      };
    },
    resetFilter() {
      this.$store.state.hotelListObj.requireParam = '';
      this.clearFilter();
      this.listLoading = true;
      this.setHotelList(true);
    },
    setHotelList(flag) {
      if (flag) {
        this.$store.commit('clearHotel');
        this.clearFilter();
        this.getHotelList();
        window.scrollTo(0, 0);
      } else {
        this.hotelList = this.$store.state.hotelListObj.list;
        this.listLoading = false;
      }
    },
    previousHotelList() {
      this.addListLoading = true;
      this.getHotelList('previous');
    },
    addHotelList() {
      this.addListLoading = true;
      this.getHotelList(true);
    },
    changeSelectedIndex(index) {
      this.selectedIndex = index;
    },
    changeLastCenter(lat, lng) {
      this.$store.state.hotelListObj.geoValue.center.lat = lat;
      this.$store.state.hotelListObj.geoValue.center.lng = lng;
    },
    mapReSearch(geoVal, loading) {
      this.mapReSearchLoading = loading;
      this.listLoading = loading;
      if (this.isFilterActive) {
        this.clearWaterfall(geoVal, 'geoFilter');
      } else {
        this.clearWaterfall(geoVal, 'geo');
      }
    },
    clearWaterfall(val, type) {
      this.lastPage = false;
      window.scrollTo(0, 0);
      this.clearHotelList();
      this.$nextTick(() => {
        this.$store.commit('saveWaterfallState', null);
        if (type === 'geo') {
          this.getHotelList(false, val);
        } else if (type === 'filter') {
          this.listLoading = true;
          this.getHotelList(false, false, val);
        } else if (type === 'geoFilter') {
          this.getHotelList(false, val, this.filterData);
        }
      });
    },
    clearHotelList() {
      this.hotelList = [];
      this.$store.commit('clearHotelList');
    },
    isSameParam(originPath, savePath) {
      const flag = Object.keys(originPath).some(x => !(x === 'page.page' || originPath[x] === savePath[x]));
      return !flag;
    },
    initHotelSearch() {
      if (this.inputData.adults !== 2) {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'adults',
          eventAction: `${this.inputData.adults}`,
          eventLabel: 'hotel',
        });
      }
      if (this.inputData.children.length !== 0) {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'children',
          eventAction: `${this.inputData.children.length}`,
          eventLabel: 'hotel',
        });
      }
      if (this.inputData.rooms !== 1) {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'rooms',
          eventAction: `${this.inputData.rooms}`,
        });
      }
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'hotelSearch',
        eventAction: this.inputData.city.name,
      });
    },
    mountListWrapper() {
      const param = this.getDefaultParam;
      if (this.$store.state.hotelListObj.requireParam && this.isSameParam(param, JSON.parse(this.$store.state.hotelListObj.requireParam)) && this.$store.state.hotelListObj.list.length > 0) {
        this.setHotelList(false);
      } else {
        this.setHotelList(true);
      }
      this.initHotelSearch();
    },
  },
  created() {
    const constToday = new Date();
    constToday.setHours(0, 0, 0, 0);
    if (new Date(this.$route.params.checkin) < new Date(constToday)) {
      let today = new Date();
      today.setDate(today.getDate() + 30);
      const newStartDate = `${today.getFullYear()}-${this.format.zeros(today.getMonth() + 1)}-${this.format.zeros(today.getDate())}`;
      const gap = this.format.getBetweenDay(this.$route.params.checkin, this.$route.params.checkout);
      today = new Date(newStartDate);
      today.setDate(today.getDate() + gap);
      const newReturnDate = `${today.getFullYear()}-${this.format.zeros(today.getMonth() + 1)}-${this.format.zeros(today.getDate())}`;
      let newPath = this.$route.fullPath;
      newPath = newPath.replace(this.$route.params.checkin, newStartDate);
      newPath = newPath.replace(this.$route.params.checkout, newReturnDate);
      this.$router.replace(newPath);
    }
  },
  mounted() {
    let timeout = '';
    if (this.$store.state.isMobile) {
      if (this.$route.path.indexOf('/hotelList') === 0 && !this.$route.params.popFlag) {
        this.$router.replace({
          params: {
            popFlag: 'list',
          },
        });
      }
      // console.log(this.$route.params.popFlag2 === 'detail', this.$route.params.hotelId);
      if (this.$route.params.popFlag2 === 'detail' && this.$route.params.hotelId) {
        const hotelId = this.$route.params.hotelId;
        this.$router.replace({
          params: {
            popFlag: 'list',
            popFlag2: undefined,
            filter: undefined,
            hotelId: undefined,
          },
        });
        timeout = setTimeout(() => {
          this.$router.push({
            params: {
              popFlag2: 'detail',
              hotelId,
            },
            query: this.$route.query,
          });
          this.init = true;
        }, 500);
      } else {
        this.$router.replace({
          params: {
            popFlag: 'list',
            popFlag2: undefined,
            filter: undefined,
            hotelId: undefined,
          },
        });
      }
    }
    if (!timeout) {
      this.init = true;
    }
    if (new Date(this.$route.params.checkin) <= new Date(`${new Date().toDateString()}`)) {
      return;
    }
    if (this.$route.params.popFlag2 !== 'detail' || !this.$route.params.hotelId) {
      this.$router.replace({
        params: {
          filter: undefined,
          hotelId: undefined,
        },
      });
    }
  },
};
</script>
<style lang="scss" scoped>
  .type-wrap{
    width: 100%;
    height: 100%;
  }
</style>
