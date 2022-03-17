<template>
  <section id="bpListWrapper" class="mobile"
    v-if="$store.state.isMobile"
    :style="{
      'min-height': minHeight,
    }"
  >
    <mobile-home
      :inputData="inputData"
      :filter="filter"
      :sortState="sortState"
      :cityList="cityList"
      :roundFlights="roundFlights"
      :multiInfo="multiInfo"
      :legs="legs"
      :price="selectedPrice"
      :session="session"
      :orderFix="orderFix"
      :allList="allList"
      :progress="progress"
      :multiRequestNum="multiRequestNum"
      @sort-submit="changeSortState"
      @get-city-sub-list="getCitySubList"
      @multi-submit="multiSubmit"
      @change-filter-info="changeFilterInfo"
      @change-order-fix="changeOrderFix"
      @submit-filter="submitFilter"
    ></mobile-home>
  </section>
  <section id="bpListWrapper" class="web" v-else>
    <web-home
      :inputData="inputData"
      :filter="filter"
      :sortState="sortState"
      :cityList="cityList"
      :roundFlights="roundFlights"
      :multiInfo="multiInfo"
      :legs="legs"
      :price="selectedPrice"
      :session="session"
      :orderFix="orderFix"
      :allList="allList"
      :progress="progress"
      :multiRequestNum="multiRequestNum"
      @sort-submit="changeSortState"
      @set-stops-filter="setStopsFilter"
      @get-city-sub-list="getCitySubList"
      @multi-submit="multiSubmit"
      @change-filter-info="changeFilterInfo"
      @change-order-fix="changeOrderFix"
      @reset-filter="resetFilter"
      @submit-filter="submitFilter"
    ></web-home>
  </section>
</template>

<script>
import Api from '~/utils/api'; // eslint-disable-line
import Log from '~/utils/log'; // eslint-disable-line
import Format from '~/utils/format'; // eslint-disable-line
import EventBus from '~/utils/eventBus'; // eslint-disable-line
import WebHome from '~/components/flight/web/home.vue'; // eslint-disable-line
import MobileHome from '~/components/flight/mobile/home.vue'; // eslint-disable-line
import LivePriceHelper from '~/utils/livePriceHelper'; // eslint-disable-line

export default {
  head() {
    return {
      title: `${this.title} 항공권`,
      meta: [
        { hid: 'description', name: 'description', content: `${this.$route.params.startDate}부터 ${this.$route.params.returnDate}까지 여행하는 ${this.title} 항공권 추천리스트` },
        { hid: 'og:image', name: 'og:image', content: 'https://cdn.bringprice.com/shareThumbnailImage/default.png' },
        { hid: 'og:title', name: 'og:title', content: `${this.title} 항공권` },
        { hid: 'og:description', name: 'og:description', content: `${this.$route.params.startDate}부터 ${this.$route.params.returnDate}까지 여행하는 ${this.title} 항공권 추천리스트` },
      ],
    };
  },
  async asyncData({ params, store }) {
    if (params.wishCities !== 'every') {
      const arrWish = params.wishCities.split('&');
      const arrQuery = [];
      const arrResp = [];
      for (let x = 0; x < arrWish.length; x += 1) {
        if (!store.state.flightPlaceInfo[arrWish[x]]) {
          arrQuery.push(`${arrWish[x]}-sky`);
          arrResp[x] = null;
        } else {
          arrResp[x] = store.state.flightPlaceInfo[arrWish[x]].PlaceName;
        }
      }
      const resp = await Api.arrFindCityName(arrQuery);
      for (let x = 0; x < resp.length; x += 1) {
        const obj = resp[x].data.Result;
        for (let y = 0; y < arrResp.length; y += 1) {
          if (arrResp[y] === null) {
            arrResp[y] = obj.PlaceName;
            break;
          }
        }
        if (!store.state.flightPlaceInfo[obj.PlaceId.split('-')[0]]) {
          store.commit('appendFlightPlaceInfo', obj);
        }
      }
      return {
        title: arrResp.length > 0 ? arrResp.join(', ') : arrWish.join(', '),
      };
    }
    return {
      title: params.wishCities,
    };
  },
  validate({ params }) {
    if (params.startDate.split('-').length !== 3 ||
        params.returnDate.split('-').length !== 3
    ) {
      return false;
    }
    const startCityExp = /^['a-zA-Z']{3,4}$/;
    const dayCheck = new Date(params.returnDate) - new Date() > 365 * 24 * 60 * 60 * 1000 || new Date(params.returnDate) < new Date(params.startDate);
    const dayEmptyCheck = params.startDate.indexOf(' ') >= 0 || params.returnDate.indexOf(' ') >= 0;
    const dayNanCheck = isNaN(`${params.startDate.split('-')[0]}${params.startDate.split('-')[1]}${params.startDate.split('-')[2]}`) || isNaN(`${params.returnDate.split('-')[0]}${params.returnDate.split('-')[1]}${params.returnDate.split('-')[2]}`);
    const optionsCheck = isNaN(params.adults) || !Number.isInteger(parseInt(params.adults, 10)) || isNaN(params.children) || !Number.isInteger(parseInt(params.children, 10)) || isNaN(params.infants) || !Number.isInteger(parseInt(params.infants, 10));
    if (
      dayCheck ||
      dayEmptyCheck ||
      dayNanCheck ||
      optionsCheck ||
      !startCityExp.test(params.startCity) ||
      !params.wishCities ||
      (params.cabinClass !== 'Economy' && params.cabinClass !== 'PremiumEconomy' && params.cabinClass !== 'Business' && params.cabinClass !== 'First')) {
      return false;
    }
    return true;
  },
  components: {
    MobileHome,
    WebHome,
  },
  data() {
    const params = this.$route.params;
    const filter = {
      sameAirportAtTransfer: true,
      sameAirportAtInOut: false,
      maxStopsTime: 0, // 경유 대기 필터 값
      maximumMaxStopsTime: 0, // 경유 대기 max 값
      maximumMinStopsTime: 0, // 경유 대기 min 값
      flightDuration: 0, // 총 비행 시간 필터 값
      maxFlightDuration: 0, // 총 비행 시간 값
      minFlightDuration: 0, // 총 비행 시간 값
      airports: [],
      airlines: [],
      stops: [],
      times: [],
    };
    return {
      format: Format,
      inputData: {
        startCity: {},
        wishCities: 'loading',
        startDate: params.startDate,
        returnDate: params.returnDate,
        adults: parseInt(params.adults, 10),
        children: parseInt(params.children, 10),
        infants: parseInt(params.infants, 10),
        cabinClass: params.cabinClass,
      },
      filter,
      minHeight: 0,
      cityList: [],
      roundFlights: false,
      multiInfo: {
        scheduleMin: [],
        scheduleMax: [],
        scheduleList: [],
        scheduleLength: 5,
        liveList: {},
        multiQueryLength: 5,
        stopLength: this.$route.params.wishCities !== 'every' ? this.$route.params.wishCities.split('&').length + 1 : 0,
        selectedIndex: -1,
      },
      sortState: 'curation',
      allList: {
        airport: {},
        airline: [],
      },
      orderFix: false,
      legs: [],
      selectedPrice: '',
      session: [],
      progress: 0,
      multiRequestNum: 0,
      arrTimeout: [],
    };
  },
  methods: {
    changeSortState(sort) {
      this.sortState = sort;
    },
    resetFilter() {
      this.filter.flightDuration = this.filter.maxFlightDuration; // 총 비행 시간 필터 값
      this.filter.maxStopsTime = this.filter.maximumMaxStopsTime;
      this.filter.airlines = [];
      this.filter.stops = [];
      this.filter.airports = [];
      for (let x = 0; x < this.filter.times.length; x += 1) {
        this.filter.times[x].start = 0;
        this.filter.times[x].end = 1440;
      }
    },
    setStopsFilter(max) {
      this.filter.maxStopsTime = max;
    },
    changeOrderFix() {
      this.orderFix = !this.orderFix;
      this.getSchedule(this.$route.params.wishCities.split('&'));
    },
    changeFilterInfo(key, value) {
      if (key === 'startTimeAM') {
        this.filter.times[0].start = value.start;
        this.filter.times[0].end = value.end;
      } else {
        this.filter[key] = value;
      }
      this.updatePrice();
    },
    submitFilter(localFilter, localSortState, filterKey) {
      // console.log(localFilter, localSortState, filterKey);
      if (localSortState !== 'curation') {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'flightSort',
          eventAction: localSortState,
        });
      }
      Object.keys(this.filter).forEach((key) => {
        if (key === 'airlines' || key === 'airports' || key === 'stops') {
          for (let x = 0; x < this.filter[key].length; x += 1) {
            let value = this.filter[key][x];
            // console.log(value);
            if (key === 'airlines' && value) {
              if (this.roundFlights && this.roundFlights.Carriers[value]) {
                value = this.roundFlights.Carriers[value].Name;
              } else if (!this.roundFlights) {
                Object.values(this.multiInfo.liveList).some((live) => {
                  if (live.data.Carriers[value]) {
                    value = live.data.Carriers[value].Name;
                    return true;
                  }
                  return false;
                });
              }
            }
            ga('send', { // eslint-disable-line
              hitType: 'event',
              eventCategory: 'flightFilter',
              eventAction: key,
              eventLabel: value,
            });
          }
        }
        if (key === 'times') {
          for (let x = 0; x < this.filter[key].length; x += 1) {
            if (this.filter[key][x].start !== 0) {
              ga('send', { // eslint-disable-line
                hitType: 'event',
                eventCategory: 'flightFilter',
                eventAction: `${key}-min`,
                eventLabel: `${parseInt(this.filter[key][x].start / 60, 10)}h ${this.filter[key][x].start % 60}m`,
              });
            }
            if (this.filter[key][x].end !== 1440) {
              ga('send', { // eslint-disable-line
                hitType: 'event',
                eventCategory: 'flightFilter',
                eventAction: `${key}-max`,
                eventLabel: `${parseInt(this.filter[key][x].end / 60, 10)}h ${this.filter[key][x].end % 60}m`,
              });
            }
          }
        }
      });
      if (filterKey) {
        if (filterKey === 'maxStopsTime' || filterKey === 'flightDuration') {
          this.filter[filterKey] = localFilter[filterKey];
        }
        if (filterKey === 'sameAirportAtTransfer' || filterKey === 'sameAirportAtInOut') {
          this.filter[filterKey] = localFilter;
          // console.log(this.filter[filterKey], localFilter);
        }
        if (filterKey === 'airlines' || filterKey === 'stops' || filterKey === 'airports') {
          if (this.filter[filterKey].indexOf(localFilter[filterKey]) >= 0) {
            this.filter[filterKey].splice(this.filter[filterKey].indexOf(localFilter[filterKey]), 1);
          } else {
            this.filter[filterKey] = localFilter[filterKey];
          }
        }
        if (filterKey === 'times') {
          this.filter[filterKey] = localFilter;
          // console.log(this.filter[filterKey]);
        }
      } else {
        // sameAirportAtTransfer: true,
        //   sameAirportAtInOut: false,
        //   maxStopsTime: 0, // 경유 대기 필터 값
        //   maximumMaxStopsTime: 0, // 경유 대기 max 값
        //   flightDuration: 0, // 총 비행 시간 필터 값
        //   maxFlightDuration: 0, // 총 비행 시간 값
        //   airports: [],
        //   airlines: [],
        //   stops: [],
        //   times: [],
        // console.log(localFilter);
        Object.keys(localFilter).forEach((key) => {
          this.filter[key] = localFilter[key];
        });
      }
      // console.log(this.filter);
      this.sortState = localSortState;
      this.updatePrice();
    },
    renewFilter(data) {
      if (this.roundFlights) {
        const isStopValueChange = this.filter.maximumMaxStopsTime !== this.filter.maxStopsTime;
        const isDurationValueChange = this.filter.maxFlightDuration !== this.filter.flightDuration;
        let maxTime = this.filter.maximumMaxStopsTime;
        let minTime = this.filter.maximumMinStopsTime;
        let flightDuration = this.filter.maxFlightDuration;
        let flightDurationMin = this.filter.minFlightDuration;
        data.Itineraries.forEach((itinerary) => {
          const legs = [itinerary.OutboundLegId, itinerary.InboundLegId];
          // console.log(legs);
          // const arr = [];
          for (let x = 0; x < legs.length; x += 1) {
            const legInfo = data.Legs.find(v => v.Id === legs[x]);
            const duration = legInfo.Duration;
            if (legInfo.SegmentIds.length > 1) {
              // console.log(itinerary.OutboundLegId, itinerary.InboundLegId);
              for (let y = 0; y < legInfo.SegmentIds.length - 1; y += 1) {
                let stopsTimeSeg = 0;
                const segInfo = data.Segments[legInfo.SegmentIds[y]];
                const segInfo2 = data.Segments[legInfo.SegmentIds[y + 1]];
                stopsTimeSeg = this.format.getDateGapInfo(segInfo.ArrivalDateTime, segInfo2.DepartureDateTime);
                if (stopsTimeSeg > maxTime && stopsTimeSeg + (30 - (stopsTimeSeg % 30)) > maxTime) {
                  maxTime = stopsTimeSeg + (30 - (stopsTimeSeg % 30));
                }
                if (minTime === 0 || (minTime > stopsTimeSeg && minTime > stopsTimeSeg - (stopsTimeSeg % 30))) {
                  minTime = stopsTimeSeg - (stopsTimeSeg % 30);
                }
              }
            }
            if (duration > flightDuration && duration + (30 - (duration % 30)) > flightDuration) {
              flightDuration = duration + (30 - (duration % 30));
            }
            if (flightDurationMin === 0 || (duration < flightDurationMin && duration - (duration % 30) < flightDurationMin)) {
              flightDurationMin = duration - (duration % 30);
            }
            // const legMaxTime = arr.reduce((sum, z) => sum + z, 0);
          }
        });
        if (!isStopValueChange) {
          this.filter.maxStopsTime = maxTime;
        }
        if (!isDurationValueChange) {
          this.filter.flightDuration = flightDuration;
        }
        this.filter.maxFlightDuration = flightDuration;
        this.filter.minFlightDuration = flightDurationMin;
        this.filter.maximumMaxStopsTime = maxTime;
        this.filter.maximumMinStopsTime = minTime;
      } else if (this.multiInfo.selectedIndex >= 0) {
        this.multiInitStopAndDurationTime();
      }
      const allAirline = this.allList.airline;
      Object.keys(data.Carriers).forEach((x) => {
        let flag = false;
        for (let y = 0; y < allAirline.length; y += 1) {
          if (data.Carriers[x].Id === allAirline[y].code) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          allAirline.push({
            code: data.Carriers[x].Id,
            name: data.Carriers[x].Name,
          });
        }
      });
      const allAirport = this.allList.airport;
      let OriginCityId = data.Query.OriginPlace;
      for (;;) {
        if (data.Places[OriginCityId].Type === 'City' || !data.Places[OriginCityId].ParentId) {
          break;
        }
        OriginCityId = data.Places[OriginCityId].ParentId;
      }
      if (!this.allList.airport[data.Places[OriginCityId].Code]) {
        this.allList.airport[data.Places[OriginCityId].Code] = {
          id: parseInt(OriginCityId, 10),
          list: [],
          name: data.Places[OriginCityId].Name,
        };
      }
      let DestinationCityId = data.Query.DestinationPlace;
      for (;;) {
        if (data.Places[DestinationCityId].Type === 'City' || !data.Places[DestinationCityId].ParentId) {
          break;
        }
        DestinationCityId = data.Places[DestinationCityId].ParentId;
      }
      if (!this.allList.airport[data.Places[DestinationCityId].Code]) {
        this.allList.airport[data.Places[DestinationCityId].Code] = {
          id: parseInt(DestinationCityId, 10),
          list: [],
          name: data.Places[DestinationCityId].Name,
        };
      }
      Object.keys(allAirport).forEach((x) => {
        for (let y = 0; y < Object.keys(data.Places).length; y += 1) {
          if (allAirport[x].id && data.Places[Object.keys(data.Places)[y]].ParentId && allAirport[x].id === data.Places[Object.keys(data.Places)[y]].ParentId) {
            let flag = false;
            for (let z = 0; z < allAirport[x].list.length; z += 1) {
              if (allAirport[x].list[z].code === data.Places[Object.keys(data.Places)[y]].Code) {
                flag = true;
                break;
              }
            }
            if (!flag) {
              allAirport[x].list.push({
                name: data.Places[Object.keys(data.Places)[y]].Name,
                code: data.Places[Object.keys(data.Places)[y]].Code,
              });
            }
          }
        }
      });
      // console.log(this.filter);
    },
    multiInitStopAndDurationTime(changeIndexFlag) {
      const isStopValueChange = this.filter.maximumMaxStopsTime !== this.filter.maxStopsTime;
      const isDurationValueChange = this.filter.maxFlightDuration !== this.filter.flightDuration;
      let maxTime = this.filter.maximumMaxStopsTime;
      let minTime = this.filter.maximumMinStopsTime;
      let flightDuration = this.filter.maxFlightDuration;
      let flightDurationMin = this.filter.minFlightDuration;
      for (let x = 0; x < this.multiInfo.stopLength; x += 1) {
        const schedule = this.multiInfo.scheduleList[this.multiInfo.selectedIndex];
        const key = `${schedule.FlightInfo[`Flight${x}`].OriginPlace}|${schedule.FlightInfo[`Flight${x}`].DestinationPlace}|${schedule.FlightInfo[`Flight${x}`].OutboundDate}`;
        if (this.multiInfo.liveList[key] && this.multiInfo.liveList[key].data && this.multiInfo.liveList[key].data.Legs) {
          const multiData = this.multiInfo.liveList[key].data;
          const arrLegValues = Object.values(multiData.Legs);
          for (let y = 0; y < arrLegValues.length; y += 1) {
            const legInfo = arrLegValues[y];
            if (legInfo.SegmentIds.length > 1) {
              for (let z = 0; z < legInfo.SegmentIds.length - 1; z += 1) {
                const segInfo = multiData.Segments[legInfo.SegmentIds[z]];
                const segInfo2 = multiData.Segments[legInfo.SegmentIds[z + 1]];
                const stopsTime = this.format.getDateGapInfo(segInfo.ArrivalDateTime, segInfo2.DepartureDateTime);
                if (stopsTime > maxTime && stopsTime + (30 - (stopsTime % 30)) > maxTime) {
                  maxTime = stopsTime + (30 - (stopsTime % 30));
                }
                if (minTime === 0 || (minTime > stopsTime && minTime > stopsTime - (stopsTime % 30))) {
                  minTime = stopsTime - (stopsTime % 30);
                }
              }
            }
            if (legInfo.Duration > flightDuration && legInfo.Duration + (30 - (legInfo.Duration % 30)) > flightDuration) {
              flightDuration = legInfo.Duration + (30 - (legInfo.Duration % 30));
            }
            if (flightDurationMin === 0 || (legInfo.Duration < flightDurationMin && legInfo.Duration - (legInfo.Duration % 30) < flightDurationMin)) {
              flightDurationMin = legInfo.Duration - (legInfo.Duration % 30);
            }
          }
        }
      }
      // flightDuration = (arrFlightDuration.reduce((sum, x) => sum + x, 0) > flightDuration || changeIndexFlag) ? arrFlightDuration.reduce((sum, x) => sum + x, 0) : flightDuration;
      if (!isDurationValueChange || this.filter.flightDuration > flightDuration || changeIndexFlag) {
        this.filter.flightDuration = flightDuration;
      }
      // maxTime = (arrLegMaxTime.reduce((sum, x) => sum + x, 0) > maxTime || changeIndexFlag) ? arrLegMaxTime.reduce((sum, x) => sum + x, 0) : maxTime;
      if (!isStopValueChange || this.filter.maxStopsTime > maxTime || changeIndexFlag) {
        this.filter.maxStopsTime = maxTime;
      }
      this.filter.maxFlightDuration = flightDuration;
      this.filter.minFlightDuration = flightDurationMin;
      this.filter.maximumMaxStopsTime = maxTime;
      this.filter.maximumMinStopsTime = minTime;
    },
    getOpenSearchList() {
      Api.getOpenSearchList(this.inputData, 'anywhere').then((resp) => {
        for (let x = 0; x < resp.data.length; x += 1) {
          this.cityList.push({
            info: resp.data[x],
            loading: false,
            list: [],
            open: false,
            index: x,
          });
        }
        this.progress = 0.99;
        setTimeout(() => {
          this.progress = 1;
        }, 3000);
      }).catch((error) => {
        if (error.response.status === 578) {
          this.$router.push({
            query: {
              popFlag: 'alert',
              alertId: 20,
            },
          });
        }
        if (!Api.isAxiosCancel(error) && error.message.indexOf('cancel') < 0 && error.response.status !== 578) {
          this.$router.push({
            query: {
              popFlag: 'alert',
              alertId: 10,
            },
          });
        }
      });
    },
    getCitySubList(index) {
      const country = this.cityList.filter(x => x.index === index)[0];
      if (this.isExceptCountry(country.info)) {
        this.$router.push(this.$route.fullPath.replace('every', this.isExceptCountry(country.info)));
        return;
      }
      country.open = !country.open;
      if (country.open && !country.loading) {
        Api.getOpenSearchList(this.inputData, country.info.DestinationPlaceName)
          .then((resp) => {
            country.list = resp.data;
            country.loading = true;
          }).catch((error) => {
            if (!Api.isAxiosCancel(error) && error.message.indexOf('cancel') < 0) {
              this.$router.push({
                query: {
                  popFlag: 'alert',
                  alertId: 10,
                },
              });
            }
          });
      }
    },
    isExceptCountry(list) {
      let code = false;
      if (list.DestinationPlaceName === '홍콩') {
        code = 'HKG';
      } else if (list.DestinationPlaceName === '괌') {
        code = 'GUM';
      } else if (list.DestinationPlaceName === '싱가포르') {
        code = 'SIN';
      } else if (list.DestinationPlaceName === '모리셔스') {
        code = 'MRU';
      }
      return code;
    },
    setLiveList() {
      for (let x = 0; x < this.multiInfo.scheduleLength && x < this.multiInfo.scheduleList.length; x += 1) {
        for (let y = 0; y < this.multiInfo.stopLength; y += 1) {
          const temp = this.multiInfo.scheduleList[x].FlightInfo[`Flight${y}`];
          const key = `${temp.OriginPlace}|${temp.DestinationPlace}|${temp.OutboundDate}`;
          if (!this.multiInfo.liveList[key]) {
            this.multiInfo.liveList[key] = {
              state: 'wait',
              data: null,
            };
          }
        }
      }
      this.updatePrice();
      this.liveListupdate();
    },
    updatePrice() {
      for (let x = 0; x < this.multiInfo.scheduleLength && x < this.multiInfo.scheduleList.length; x += 1) {
        let totalPrice = 0;
        for (let y = 0; y < this.multiInfo.stopLength; y += 1) {
          const temp = this.multiInfo.scheduleList[x].FlightInfo[`Flight${y}`];
          const key = `${temp.OriginPlace}|${temp.DestinationPlace}|${temp.OutboundDate}`;
          if (this.multiInfo.liveList[key] && this.multiInfo.liveList[key].data && this.multiInfo.liveList[key].data.Itineraries.length > 0) {
            totalPrice += this.getPriceFromItineraries(this.multiInfo.liveList[key].data.Itineraries);
          } else {
            totalPrice = 0;
            break;
          }
        }
        let loadingComplete = true;
        for (let y = 0; y < this.multiInfo.stopLength; y += 1) {
          const temp = this.multiInfo.scheduleList[x].FlightInfo[`Flight${y}`];
          const key = `${temp.OriginPlace}|${temp.DestinationPlace}|${temp.OutboundDate}`;
          if (this.multiInfo.liveList[key] && this.multiInfo.liveList[key].state !== 'complete') {
            loadingComplete = false;
            break;
          }
        }
        this.multiInfo.scheduleList[x].totalPrice = totalPrice ? this.format.numberFormat(parseInt(totalPrice, 10)) : 0;
        this.multiInfo.scheduleList[x].loading = loadingComplete;
      }
      this.multiRequestNum += 1;
    },
    liveListupdate() {
      let queryLength = 0;
      const keys = Object.keys(this.multiInfo.liveList);
      for (let x = 0; x < keys.length; x += 1) {
        if (this.multiInfo.liveList[keys[x]].state === 'wait') {
          queryLength += 1;
          this.getFlightList(keys[x]);
        } else if (this.multiInfo.liveList[keys[x]].state === 'pending') {
          queryLength += 1;
        }
        if (queryLength >= this.multiInfo.multiQueryLength) {
          break;
        }
      }
      this.progress = keys.filter(key => this.multiInfo.liveList[key].state === 'complete').length / keys.length;
      if (this.progress < 0.1) {
        this.progress = 0.1;
      } else if (this.progress === 1) {
        this.progress = 0.99;
        setTimeout(() => {
          this.progress = 1;
        }, 3000);
      }
    },
    getSchedule(wishCities) {
      // console.log('getSc');
      this.multiInfo.scheduleList = [];
      Api.getMultiSchedule(this.$route.params.startCity, this.inputData, wishCities, this.multiInfo.scheduleMin, this.multiInfo.scheduleMax, this.orderFix).then((resp) => {
        for (let x = 0; x < resp.data.Result.length; x += 1) {
          const obj = resp.data.Result[x];
          obj.totalPrice = 0;
          obj.loading = true;
          this.multiInfo.scheduleList.push(obj);
          // console.log(this.multiInfo);
        }
        this.setLiveList();
      }).catch((error) => {
        if (error.response.status === 578) {
          this.$router.push({
            query: {
              popFlag: 'alert',
              alertId: 20,
            },
          });
        }
        if (!Api.isAxiosCancel(error) && error.message.indexOf('cancel') < 0 && error.response.status !== 578) {
          this.$router.push({
            query: {
              popFlag: 'alert',
              alertId: 10,
            },
          });
        }
      });
    },
    getRoundFlightList(code) {
      const obj = {
        startCode: `${this.$route.params.startCity}-sky`,
        wishCode: code,
        startDate: this.inputData.startDate,
        returnDate: this.inputData.returnDate,
        cabinClass: this.inputData.cabinClass,
        adults: this.inputData.adults,
        children: this.inputData.children,
        infants: this.inputData.infants,
      };
      Log.saveSearchInfo({
        Country: 'KR',
        Currency: 'KRW',
        Locale: 'ko-KR',
        StartCity: `${this.$route.params.startCity}-sky`,
        WishCity: code,
        StartDate: this.inputData.startDate.replace(/-/g, ''),
        ReturnDate: this.inputData.returnDate.replace(/-/g, ''),
        Adults: this.inputData.adults,
        Children: this.inputData.children,
        Infants: this.inputData.infants,
        CabinClass: this.inputData.cabinClass,
        username: this.$cookies.get('bpUser') ? this.$cookies.get('bpUser').data.userName : '',
      });
      Api.createSession(obj).then((sessionResp) => {
        this.arrTimeout.push(setTimeout(() => {
          this.getRoundPollingResult(sessionResp.headers.location, code);
        }, 1000));
      }).catch((error) => {
        if (error.response.status === 578) {
          this.$router.push({
            query: {
              popFlag: 'alert',
              alertId: 20,
            },
          });
        }
        if (!Api.isAxiosCancel(error) && error.message.indexOf('cancel') < 0 && error.response.status !== 578) {
          this.$router.push({
            query: {
              popFlag: 'alert',
              alertId: 10,
            },
          });
        }
      });
    },
    getRoundPollingResult(location, code) {
      Api.pollingResult(location).then((resp) => {
        console.log(resp.data);
        if (resp.data.Itineraries.length > 0) {
          this.roundFlights = resp.data;
          this.renewFilter(resp.data);
        }
        if (resp.data.Status === 'UpdatesPending') {
          this.arrTimeout.push(setTimeout(() => { this.getRoundPollingResult(location, code); }, 3000));
          if (resp.data.Agents) {
            const agents = Object.values(resp.data.Agents);
            this.progress = agents.filter(agent => !agent.Status || agent.Status === 'UpdatesComplete').length / agents.length;
            if (this.progress < 0.1) {
              this.progress = 0.1;
            }
          }
        } else if (resp.data.Status === 'UpdatesComplete') {
          this.progress = 0.99;
          setTimeout(() => {
            this.progress = 1;
          }, 3000);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    getFlightList(key, retry) {
      const obj = {
        startCode: key.split('|')[0],
        wishCode: key.split('|')[1],
        startDate: key.split('|')[2],
        cabinClass: this.inputData.cabinClass,
        adults: this.inputData.adults,
        children: this.inputData.children,
        infants: this.inputData.infants,
      };
      this.multiInfo.liveList[key].state = 'pending';
      Api.createSession(obj).then((sessionResp) => {
        this.arrTimeout.push(setTimeout(() => {
          this.getPollingResult(sessionResp.headers.location, key);
        }, 1000));
      }).catch((error) => {
        if (error.response.status === 578) {
          this.$router.push({
            query: {
              popFlag: 'alert',
              alertId: 20,
            },
          });
        }
        if (!Api.isAxiosCancel(error) && error.message.indexOf('cancel') < 0 && error.response.status !== 578) {
          if (retry) {
            this.$router.push({
              query: {
                popFlag: 'alert',
                alertId: 10,
              },
            });
          } else {
            this.getFlightList(key, true);
          }
        }
      });
    },
    getPriceFromItineraries(itineraries) {
      if (this.filter.stops.indexOf(1) >= 0 && this.filter.stops.indexOf(2) >= 0) {
        let index = 0;
        for (let x = 0; x < itineraries.length; x += 1) {
          if (itineraries[x].Stops === 0) {
            index = x;
            break;
          }
        }
        return itineraries[index].PricingOptions[0].Price;
      }
      return itineraries[0].PricingOptions[0].Price;
    },
    getPollingResult(location, key, retry) {
      Api.pollingResult(location).then((resp) => {
        if (resp.data.Status === 'UpdatesPending') {
          this.arrTimeout.push(setTimeout(() => { this.getPollingResult(location, key); }, 3000));
        } else if (resp.data.Status === 'UpdatesComplete') {
          this.multiInfo.liveList[key].state = 'complete';
          this.liveListupdate();
          this.renewFilter(resp.data);
        }
        if (resp.data.Itineraries.length > 0) {
          this.multiInfo.liveList[key].data = resp.data;
          this.updatePrice();
        }
      }).catch((error) => {
        if (!Api.isAxiosCancel(error) && error.message.indexOf('cancel') < 0) {
          if (retry) {
            this.$router.push({
              query: {
                popFlag: 'alert',
                alertId: 10,
              },
            });
          } else {
            this.getPollingResult(location, key, true);
          }
        }
      });
    },
    multiSubmit(index) {
      window.scrollTo(0, 0);
      this.multiInfo.selectedIndex = index;
      this.multiInitStopAndDurationTime(true);
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'selectPlan',
        eventAction: this.$store.state.isMobile ? 'mobile' : 'web',
        eventLabel: this.inputData.wishCities.length,
      });
      this.$nextTick(() => {
        this.$router.push({
          params: {
            step: 'select',
          },
          query: this.$route.query,
        });
      });
    },
    initMultiSearch(arrWishCode) {
      const round = this.format.getBetweenDay(this.inputData.startDate, this.inputData.returnDate) / arrWishCode.length;
      // console.log(round);
      const min = (round - 2) <= 2 ? 2 : (round - 2);
      const max = round + 2;
      // console.log(min, max);
      for (let x = 0; x < arrWishCode.length; x += 1) {
        this.multiInfo.scheduleMin.push(`${Math.ceil(min)}`);
        this.multiInfo.scheduleMax.push(`${Math.ceil(max)}`);
      }
      this.getSchedule(arrWishCode);
    },
    findMultiSessionKey() {
      for (let x = 0; x < this.multiInfo.stopLength; x += 1) {
        const schedule = this.multiInfo.scheduleList[this.multiInfo.selectedIndex];
        const key = `${schedule.FlightInfo[`Flight${x}`].OriginPlace}|${schedule.FlightInfo[`Flight${x}`].DestinationPlace}|${schedule.FlightInfo[`Flight${x}`].OutboundDate}`;
        this.session.push(this.multiInfo.liveList[key].data.SessionKey);
      }
    },
    setTimeFilter(arrWishCode) {
      for (let x = 0; x < arrWishCode.length + 1; x += 1) {
        this.filter.times.push({
          start: 0,
          end: 1440,
        });
      }
    },
    initFlightSearch(arrWishCode) {
      this.setTimeFilter(arrWishCode);
      if (this.inputData.adults !== 1) {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'adults',
          eventAction: `${this.inputData.adults}`,
          eventLabel: 'flight',
        });
      }
      if (this.inputData.children !== 0) {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'children',
          eventAction: `${this.inputData.children}`,
          eventLabel: 'flight',
        });
      }
      if (this.inputData.infants !== 0) {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'infants',
          eventAction: `${this.inputData.infants}`,
        });
      }
      if (this.inputData.cabinClass !== 'Economy') {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'cabinClass',
          eventAction: this.inputData.cabinClass,
        });
      }
      if (this.$route.params.startCity !== 'SELA') {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'departure',
          eventAction: `${this.$route.params.startCity}-sky`,
        });
      }
      if (arrWishCode === 'every') {
        this.getOpenSearchList();
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'flightSearch',
          eventAction: this.$store.state.isMobile ? 'mobile-round' : 'web-round',
          eventLabel: 'every',
        });
      } else if (arrWishCode.length === 1) {
        this.getRoundFlightList(`${arrWishCode[0]}-sky`);
        // arrWishCode
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'flightSearch',
          eventAction: this.$store.state.isMobile ? 'mobile-round' : 'web-round',
          eventLabel: `${arrWishCode[0]}-sky`,
        });
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'destination',
          eventAction: `${arrWishCode[0]}-sky`,
          eventLabel: 'round',
        });
      } else {
        this.initMultiSearch(arrWishCode);
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'flightSearch',
          eventAction: this.$store.state.isMobile ? 'mobile-multi' : 'web-multi',
          eventLabel: arrWishCode.length,
        });
        for (let x = 0; x < arrWishCode.length; x += 1) {
          ga('send', { // eslint-disable-line
            hitType: 'event',
            eventCategory: 'destination',
            eventAction: `${arrWishCode[x]}-sky`,
            eventLabel: 'multi',
          });
        }
      }
      if (arrWishCode !== 'every') {
        Log.saveSearchInfoDev({
          startCity: this.inputData.startCity.PlaceId,
          startDate: this.inputData.startDate,
          endDate: this.inputData.returnDate,
          adults: this.inputData.adults,
          children: this.inputData.children,
          infants: this.inputData.infants,
          cabinClass: this.inputData.cabinClass,
          locale: 'ko-KR',
          currency: 'KRW',
          stopsCode: arrWishCode.map(x => `${x}-sky`).join(','),
          userId: this.$cookies.get('bpUser') ? this.$cookies.get('bpUser').data.userID : '',
        });
      }
    },
    appendSchedule() {
      this.multiInfo.scheduleLength += 5;
      for (let x = 0; x < this.multiInfo.scheduleLength && x < this.multiInfo.scheduleList.length; x += 1) {
        for (let y = 0; y < this.multiInfo.stopLength; y += 1) {
          const temp = this.multiInfo.scheduleList[x].FlightInfo[`Flight${y}`];
          const key = `${temp.OriginPlace}|${temp.DestinationPlace}|${temp.OutboundDate}`;
          if (!this.multiInfo.liveList[key]) {
            this.multiInfo.liveList[key] = {
              state: 'wait',
              data: null,
            };
          }
        }
      }
      let pendingLength = 0;
      Object.values(this.multiInfo.liveList).forEach((value) => {
        if (value.state === 'pending') {
          pendingLength += 1;
        }
      });
      if (pendingLength < 5) {
        this.liveListupdate();
      }
    },
  },
  created() {
    Api.abortLivePrice();
    const constToday = new Date();
    constToday.setHours(0, 0, 0, 0);
    if (new Date(this.$route.params.startDate) < new Date(constToday)) {
      let today = new Date();
      today.setDate(today.getDate() + 30);
      const newStartDate = `${today.getFullYear()}-${this.format.zeros(today.getMonth() + 1)}-${this.format.zeros(today.getDate())}`;
      const gap = this.format.getBetweenDay(this.$route.params.startDate, this.$route.params.returnDate);
      today = new Date(newStartDate);
      today.setDate(today.getDate() + gap);
      const newReturnDate = `${today.getFullYear()}-${this.format.zeros(today.getMonth() + 1)}-${this.format.zeros(today.getDate())}`;
      let newPath = this.$route.fullPath;
      newPath = newPath.replace(this.$route.params.startDate, newStartDate);
      newPath = newPath.replace(this.$route.params.returnDate, newReturnDate);
      this.$router.replace(newPath);
      return;
    }
    const params = this.$route.params.wishCities;
    const arrCode = [];
    const arrWishCode = params === 'every' ? 'every' : params.split('&');
    const arrWish = [];
    if (!this.$store.state.flightPlaceInfo[this.$route.params.startCity]) {
      arrCode.push(`${this.$route.params.startCity}-sky`);
    } else {
      this.inputData.startCity = this.$store.state.flightPlaceInfo[this.$route.params.startCity];
    }
    if (arrWishCode !== 'every') {
      for (let x = 0; x < arrWishCode.length; x += 1) {
        if (!this.$store.state.flightPlaceInfo[arrWishCode[x]]) {
          arrCode.push(`${arrWishCode[x]}-sky`);
        } else {
          arrWish[x] = this.$store.state.flightPlaceInfo[arrWishCode[x]];
        }
      }
    }
    if (arrCode.length > 0) {
      Api.arrFindCityName(arrCode).then((resp) => {
        this.inputData.wishCities = [];
        for (let x = 0; x < resp.length; x += 1) {
          const obj = resp[x].data.Result;
          if (!this.$store.state.flightPlaceInfo[obj.PlaceId.split('-')[0]]) {
            this.$store.commit('appendFlightPlaceInfo', obj);
          }
          if (this.$route.params.startCity === obj.PlaceId.split('-')[0]) {
            this.inputData.startCity = obj;
          } else {
            arrWish[arrWishCode.indexOf(obj.PlaceId.split('-')[0])] = obj;
          }
        }
        this.inputData.wishCities = arrWish;
        setTimeout(() => {
          this.progress = 0.1;
        }, 100);
      }).catch((error) => {
        if (error.response.status === 578) {
          this.$router.push({
            query: {
              popFlag: 'alert',
              alertId: 20,
            },
          });
        }
        if (!Api.isAxiosCancel(error) && error.message.indexOf('cancel') < 0 && error.response.status !== 578) {
          this.$router.push({
            query: {
              popFlag: 'alert',
              alertId: 10,
            },
          });
        }
      });
    } else {
      this.inputData.wishCities = arrWish;
      setTimeout(() => {
        this.progress = 0.1;
      }, 100);
    }
  },
  mounted() {
    if (new Date(this.$route.params.startDate) <= new Date(`${new Date().toDateString()}`)) {
      return;
    }
    if (this.$route.params.popFlag) {
      this.$router.replace({ params: { popFlag: undefined } });
    }
    const params = this.$route.params.wishCities;
    const arrWishCode = params === 'every' ? 'every' : params.split('&');
    if (!this.$route.params.step) {
      this.$router.replace(`${this.$route.path}${this.$route.path.slice(-1) === '/' ? 'list' : '/list'}`);
    }
    if (this.$route.params.step === 'list') {
      this.initFlightSearch(arrWishCode);
    } else if (this.multiInfo.selectedIndex === -1) {
      this.$router.replace({
        params: {
          step: 'list',
          popFlag: undefined,
        },
      });
      this.initFlightSearch(arrWishCode);
    }
    this.minHeight = `${window.innerHeight}px`;
    EventBus.$off('outlink');
    EventBus.$on('outlink', (arrLegId, price) => {
      if (this.roundFlights) {
        let index = 0;
        for (let x = 0; x < this.roundFlights.Itineraries.length; x += 1) {
          if (this.roundFlights.Itineraries[x].OutboundLegId === arrLegId[0] && this.roundFlights.Itineraries[x].InboundLegId === arrLegId[1]) {
            index = x;
            break;
          }
        }
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'quickExitFlight',
          eventAction: 'round',
        });
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'exitFlight',
          eventAction: 'web-round',
          eventLabel: this.roundFlights.Agents[this.roundFlights.Itineraries[index].PricingOptions[0].Agents[0]].Name,
        });
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'averageFare',
          eventAction: 'web',
          eventValue: parseInt(this.roundFlights.Itineraries[index].PricingOptions[0].Price, 10),
        });
        window.open(this.roundFlights.Itineraries[index].PricingOptions[0].DeeplinkUrl, '_blank');
        // vue, sessions, legs, multiInfo, roundInfo, bookList, bookInfo, passenger, error, obj
        LivePriceHelper.bookingInit(this, [this.roundFlights.SessionKey], arrLegId, this.multiInfo, this.roundFlights, [], [{
          location: '',
          data: {},
        }], {
          adults: this.$route.params.adults,
          children: this.$route.params.children,
          infants: this.$route.params.infants,
        }, () => {}, { index: 0 });
        // LivePriceHelper.sendLog(index, 0, 0, this.bookInfo, this.multiInfo, this.roundInfo, this.legs, this.$cookies.get('userName'), 'desktop');
      } else {
        this.session = [];
        this.legs = arrLegId;
        this.selectedPrice = price;
        this.findMultiSessionKey();
        this.$router.push({
          params: {
            popFlag: 'book',
          },
          query: this.$route.query,
        });
      }
    });
    EventBus.$off('select-leg');
    EventBus.$on('select-leg', (arrLegId, price) => {
      this.session = [];
      if (this.roundFlights) {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'scheduleSelect',
          eventAction: `${this.$store.state.isMobile ? 'mobile' : 'web'}-round`,
        });
        this.session.push(this.roundFlights.SessionKey);
      } else {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'scheduleSelect',
          eventAction: `${this.$store.state.isMobile ? 'mobile' : 'web'}-multi`,
          eventLabel: arrLegId.length - 1,
        });
        this.findMultiSessionKey();
      }
      this.legs = arrLegId;
      this.selectedPrice = price;
      if (arrLegId.length > 2) {
        const arrCode = [];
        const arrDay = [];
        const arrScheduleInfo = this.multiInfo.scheduleList[this.multiInfo.selectedIndex].ArrRavelCities;
        for (let x = 0; x < arrScheduleInfo.length; x += 1) {
          arrCode.push(this.inputData.wishCities[arrScheduleInfo[x].City].PlaceId);
          arrDay.push(arrScheduleInfo[x].Day);
        }
        const obj = {
          selectedSchedule: {
            price: parseInt(price.replace(/,/g, ''), 10),
            currency: 'KRW',
            locale: 'ko-KR',
            orderKind: 'best',
            rank: this.multiInfo.selectedIndex,
            pricePrediction: null,
          },
          scheduleDetail: {
            cities: arrCode,
            stayDays: arrDay,
            startCity: this.inputData.startCity.PlaceId,
            returnCity: this.inputData.startCity.PlaceId,
            startDate: this.inputData.startDate,
            returnDate: this.inputData.returnDate,
          },
          sessionKeys: this.session,
          itineraryIds: arrLegId,
        };
        Log.sendSelectedSchedule(obj).then((resp) => {
          this.multiInfo.scheduleId = resp.data;
          if (this.$store.state.isMobile) {
            this.$nextTick(() => {
              this.$router.push({
                params: {
                  popFlag: 'book',
                },
                query: this.$route.query,
              });
            });
          }
        }).catch((error) => {
          if (!Api.isAxiosCancel(error) && error.message.indexOf('cancel') < 0) {
            this.multiInfo.scheduleId = undefined;
            if (this.$store.state.isMobile) {
              this.$nextTick(() => {
                this.$router.push({
                  params: {
                    popFlag: 'book',
                  },
                  query: this.$route.query,
                });
              });
            }
          }
        });
      } else if (this.$store.state.isMobile) {
        this.$nextTick(() => {
          this.$router.push({
            params: {
              popFlag: 'book',
            },
            query: this.$route.query,
          });
        });
      }
    });
    EventBus.$off('book');
    EventBus.$on('book', (isWeb) => {
      if (!isWeb) {
        this.$nextTick(() => {
          this.$router.push({
            params: {
              popFlag: 'book2',
            },
            query: this.$route.query,
          });
        });
      }
    });
    EventBus.$off('append-schedule');
    EventBus.$on('append-schedule', () => {
      this.appendSchedule();
    });
  },
  beforeDestroy() {
    Api.abortLivePrice();
    for (let x = 0; x < this.arrTimeout.length; x += 1) {
      clearTimeout(this.arrTimeout[x]);
    }
  },
};
</script>

<style lang="scss" scoped>
  #bpListWrapper.mobile{
    background-color: #f8f8f8;
    min-height: 100%;
  }
</style>
