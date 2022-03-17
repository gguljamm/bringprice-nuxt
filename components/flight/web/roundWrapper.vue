<template>
  <div>
    <ul v-if="roundFlights" class="flights">
      <div class="pricePrediction"
        v-if="pricePredictionInfo && roundFlights"
        :class="pricePredictionInfo.decision==='wait'?'wait':'buy'"
      >
        <div>가격예측 서비스</div>
        <div>{{ pricePredictionInfo.decision === 'wait' ? '7일 이내에 가격이 하락할 것으로 예상됩니다.' : '7일 이내에 가격이 상승할 것으로 예상됩니다.' }}</div>
        <button @click="pricePredictionInfo = null"></button>
      </div>
      <flight-list
        :key="`${itineraries[0].outbound.legId}${itineraries[0].inbound.legId}`"
        v-if="itineraries[0]"
        :flights="[itineraries[0].outbound, itineraries[0].inbound]"
        :price="itineraries[0].pricingString"
        :priceCount="itineraries[0].pricingOptionCount"
        :filter="filter"
        :inputData="inputData"
        :roundInfo="roundFlights"
      ></flight-list>
      <div class="priceAlert">
        <div>항공권 가격추적 알림</div>
        <div>검색한 일정의 항공권 가격 변동을 추적하여 이메일로 알려드립니다.</div>
        <button
          @click="priceAlert"
        >{{ priceAlertFlag ? '이메일 받기 해제' : '이메일 받기' }}</button>
      </div>
      <flight-list
        v-for="(flight, index) in itineraries"
        v-if="index >= 1"
        :key="`${flight.outbound.legId}${flight.inbound.legId}`"
        :flights="[flight.outbound, flight.inbound]"
        :price="flight.pricingString"
        :priceCount="flight.pricingOptionCount"
        :filter="filter"
        :inputData="inputData"
        :roundInfo="roundFlights"
      ></flight-list>
      <div v-if="progress === 1 && itineraries.length === 0" class="noFlight">
        <h3>검색 결과 없음</h3>
        <div>더 많은 검색 결과를 원하시면 날짜를 바꾸거나 필터를 제거하여 검색 조건을 변경해보세요.</div>
      </div>
      <flight-list-loading
        v-if="progress !== 1 && itineraries.length === 0"
      ></flight-list-loading>
    </ul>
    <flight-list-loading
      v-else-if="progress !== 1"
    ></flight-list-loading>
    <div v-else class="noFlight">
      <h3>검색 결과 없음</h3>
      <div>해당 도시로 가는 항공편이 검색되지 않습니다. 날짜를 변경하거나 다른 도시를 검색해주세요.</div>
    </div>
    <div></div>
  </div>
</template>

<script>
import FlightList from './flightList.vue';
import FlightListLoading from './flightListLoading.vue';
import Format from '~/utils/format' // eslint-disable-line
import Api from '~/utils/api' // eslint-disable-line
import EventBus from '~/utils/eventBus' // eslint-disable-line
import timeFilter from '~/utils/timeRangeCheck' // eslint-disable-line
import sortFunctions from '~/utils/itinerariesSort' // eslint-disable-line

export default {
  components: {
    FlightList,
    FlightListLoading,
  },
  props: ['inputData', 'filter', 'roundFlights', 'sortState', 'progress', 'priceAlertFlag'],
  data() {
    return {
      hotelRequest: false,
      page: 1,
      pageLength: 30,
      filteredLength: 0,
      format: Format,
      timeout: false,
      sortCompare: {
        curation: sortFunctions.curationSort,
        price: sortFunctions.priceSort,
        duration: sortFunctions.durationSort,
      },
      pricePredictionInfo: null,
      sameAirportAtTransfer: this.filter.sameAirportAtTransfer,
    };
  },
  computed: {
    totalPassengerNum() {
      return parseInt(this.inputData.adults, 10) + parseInt(this.inputData.children, 10) + parseInt(this.inputData.infants, 10); // eslint-disable-line
    },
    itineraries() {
      // const filteringFlight = this.exceptFlightWithFilter;

      // console.log(filteringFlight);
      const itineraries = this.filteredItineraries.map((flight) => {
        // console.log(flight.OutboundLegId);
        // console.log(this.roundFlights.Legs[flight.OutboundLegId]);
        const outboundLeg = this.roundFlights.Legs[flight.OutboundLegId];

        const outbound = {
          originPlace: {
            code: this.roundFlights.Places[outboundLeg.OriginStation].Code,
            name: this.roundFlights.Places[outboundLeg.OriginStation].Name,
          },
          destinationPlace: {
            code: this.roundFlights.Places[outboundLeg.DestinationStation].Code,
            name: this.roundFlights.Places[outboundLeg.DestinationStation].Name,
          },
          carriers: outboundLeg.Carriers.map(carrier => this.roundFlights.Carriers[carrier].Name),
          carrierImages: outboundLeg.Carriers
            .map(carrier => this.roundFlights.Carriers[carrier].ImageUrl),
          departureTime: outboundLeg.Departure,
          arrivalTime: outboundLeg.Arrival,
          stops: [],
          stopsTime: 0,
          duration: outboundLeg.Duration,
          legId: flight.OutboundLegId,
        };
        for (let x = 0; x < outboundLeg.SegmentIds.length - 1; x += 1) {
          const stopId = this.roundFlights.Segments[outboundLeg.SegmentIds[x]].DestinationStation;
          outbound.stops.push({
            code: this.roundFlights.Places[stopId].Code,
            name: this.roundFlights.Places[stopId].Name,
          });
          outbound.stopsTime += (new Date(this.roundFlights.Segments[outboundLeg.SegmentIds[x + 1]].DepartureDateTime) - new Date(this.roundFlights.Segments[outboundLeg.SegmentIds[x]].ArrivalDateTime)) / 60 / 1000;
        }
        if (outbound.stopsTime === 0) {
          outbound.stopsTime = '';
        } else {
          outbound.stopsTime = this.format.getDurationString(outbound.stopsTime);
        }

        const inboundLeg = this.roundFlights.Legs[flight.InboundLegId];
        // console.log(inboundLeg);
        const inbound = {
          originPlace: {
            code: this.roundFlights.Places[inboundLeg.OriginStation].Code,
            name: this.roundFlights.Places[inboundLeg.OriginStation].Name,
          },
          destinationPlace: {
            code: this.roundFlights.Places[inboundLeg.DestinationStation].Code,
            name: this.roundFlights.Places[inboundLeg.DestinationStation].Name,
          },
          carriers: inboundLeg.Carriers.map(carrier => this.roundFlights.Carriers[carrier].Name),
          carrierImages: inboundLeg.Carriers
            .map(carrier => this.roundFlights.Carriers[carrier].ImageUrl),
          departureTime: inboundLeg.Departure,
          arrivalTime: inboundLeg.Arrival,
          // '2017-12-31T22:00:00'),
          stops: [],
          stopsTime: 0,
          duration: inboundLeg.Duration,
          legId: flight.InboundLegId,
        };
        for (let x = 0; x < inboundLeg.SegmentIds.length - 1; x += 1) {
          const stopId = this.roundFlights.Segments[inboundLeg.SegmentIds[x]].DestinationStation;
          inbound.stops.push({
            code: this.roundFlights.Places[stopId].Code,
            name: this.roundFlights.Places[stopId].Name,
          });
          inbound.stopsTime += (new Date(this.roundFlights.Segments[inboundLeg.SegmentIds[x + 1]].DepartureDateTime) - new Date(this.roundFlights.Segments[inboundLeg.SegmentIds[x]].ArrivalDateTime)) / 60 / 1000;
        }
        if (inbound.stopsTime === 0) {
          inbound.stopsTime = '';
        } else {
          inbound.stopsTime = this.format.getDurationString(inbound.stopsTime);
        }

        const pricingString = this.format.numberFormat(parseInt(flight.PricingOptions[0].Price, 10));
        const pricingOptionCount = flight.PricingOptions.length === 1 ?
          this.roundFlights.Agents[flight.PricingOptions[0].Agents[0]].Name :
          `${this.roundFlights.Agents[flight.PricingOptions[0].Agents[0]].Name} 외 ${flight.PricingOptions.length - 1}곳`;
        const price = flight.PricingOptions[0].Price;

        return {
          outbound,
          inbound,
          pricingString,
          pricingOptionCount,
          price,
          bookingDetailsLink: flight.BookingDetailsLink,
          score: flight.Score,
        };
      });
      return itineraries.slice(0, this.pageLength * this.page);
    },
    filteredItineraries() {
      // console.log('exceptFlightWithFilter');
      const filteredItineraries = this.sortedItineraries.filter(
        (itinerary) => {
          const outboundLeg = this.roundFlights.Legs[itinerary.OutboundLegId];
          const inboundLeg = this.roundFlights.Legs[itinerary.InboundLegId];
          if (!outboundLeg || !inboundLeg) {
            return false;
          }
          if (outboundLeg.Carriers.some(carrier => this.filter.airlines.includes(carrier))) {
            return false;
          }
          if (inboundLeg.Carriers.some(carrier => this.filter.airlines.includes(carrier))) {
            return false;
          }
          if (this.roundFlights.Places[outboundLeg.OriginStation].Code !== this.roundFlights.Places[inboundLeg.DestinationStation].Code && this.filter.sameAirportAtInOut) {
            return false;
          }
          if (this.filter.airports.includes(
            this.roundFlights.Places[outboundLeg.DestinationStation].Code)
          ) {
            return false;
          }
          if (this.filter.airports.includes(this.roundFlights.Places[outboundLeg.OriginStation].Code)) {
            return false;
          }
          if (this.isOverMaxFlightDuration([outboundLeg, inboundLeg])) {
            return false;
          }
          if (this.filter.airports.includes(
            this.roundFlights.Places[inboundLeg.DestinationStation].Code)
          ) {
            return false;
          }
          if (this.filter.airports.includes(this.roundFlights.Places[inboundLeg.OriginStation].Code)) {
            return false;
          }
          if (this.filter.sameAirportAtTransfer && this.isAirportDifferent([outboundLeg, inboundLeg])) {
            return false;
          }
          if (outboundLeg.SegmentIds.length > 1 && inboundLeg.SegmentIds.length > 1 && this.filter.maxStopsTime && this.isLayoverTimeFiltered([outboundLeg, inboundLeg])) {
            return false;
          }
          const isValidStopLength = (leg, stops) => {
            if (stops.includes(leg.Stops.length)) {
              return false;
            }
            if (stops.includes(2) && leg.Stops.length > 2) {
              return false;
            }
            return true;
          };
          if (!isValidStopLength(outboundLeg, this.filter.stops)) {
            return false;
          }
          if (!isValidStopLength(inboundLeg, this.filter.stops)) {
            return false;
          }
          if (!timeFilter.isIncludeTimeFilter(inboundLeg.Departure, this.filter.times[1])) {
            return false;
          }
          if (!timeFilter.isIncludeTimeFilter(outboundLeg.Departure, this.filter.times[0])) {
            return false;
          }

          // if (!timeFilter.isIncludeTimeFilter(
          //   inboundLeg.Departure, this.filter.returnTime)
          // ) {
          //   return false;
          // }
          //
          // if (!timeFilter.isIncludeTimeFilter(
          //   outboundLeg.Departure, this.filter.departureTime)
          // ) {
          //   return false;
          // }

          return true;
        },
      );
      this.filteredLength = filteredItineraries.length; // eslint-disable-line
      return filteredItineraries;
    },
    sortedItineraries() {
      // console.log(this.sortCompare);
      if (this.roundFlights.Itineraries && this.roundFlights.Itineraries.length > 0) {
        return this.roundFlights.Itineraries.sort(this.sortCompare[this.sortState]); // eslint-disable-line
      }
      return [];
    },
  },
  // watch: {
  //   roundFlights: function (newVal, oldVal) { // eslint-disable-line
  //     console.log(newVal);
  //     if (!oldVal) {
  //       let DestinationCityId = newVal.Query.DestinationPlace;
  //       for (;;) {
  //         if (newVal.Places[DestinationCityId].Type === 'City' || !newVal.Places[DestinationCityId].ParentId) {
  //           break;
  //         }
  //         DestinationCityId = newVal.Places[DestinationCityId].ParentId;
  //       }
  //       this.recommendHotelList(newVal.Places[DestinationCityId].Code);
  //     }
  //   },
  // },
  methods: {
    isAirportDifferent(arrLeg) {
      for (let x = 0; x < arrLeg.length; x += 1) {
        if (arrLeg[x].SegmentIds.length > 1) {
          for (let y = 0; y < arrLeg[x].SegmentIds.length - 1; y += 1) {
            if (this.roundFlights.Segments[arrLeg[x].SegmentIds[y]].DestinationStation !== this.roundFlights.Segments[arrLeg[x].SegmentIds[y + 1]].OriginStation) {
              return true;
            }
          }
        }
      }
      return false;
    },
    isOverMaxFlightDuration(arrLeg) {
      let duration = 0;
      for (let x = 0; x < arrLeg.length; x += 1) {
        if (duration < arrLeg[x].Duration) {
          duration = arrLeg[x].Duration;
        }
      }
      return duration > this.filter.flightDuration;
    },
    isLayoverTimeFiltered(arrLeg) {
      const arrLayoverTime = [];
      for (let x = 0; x < arrLeg.length; x += 1) {
        let sum = 0;
        if (arrLeg[x].SegmentIds.length > 1) {
          for (let y = 0; y < arrLeg[x].SegmentIds.length - 1; y += 1) {
            sum += this.format.getDateGapInfo(this.roundFlights.Segments[arrLeg[x].SegmentIds[y]].ArrivalDateTime, this.roundFlights.Segments[arrLeg[x].SegmentIds[y + 1]].DepartureDateTime);
          }
        }
        arrLayoverTime.push(sum);
      }
      return arrLayoverTime.some(x => x > this.filter.maxStopsTime);
    },
    priceAlert() {
      if (this.$cookies.get('bpUser')) {
        if (!this.priceAlertFlag) {
          const obj = {
            StartDate: this.inputData.startDate,
            StartCity: this.inputData.startCity.PlaceId,
            ReturnDate: this.inputData.returnDate,
            ReturnCity: this.inputData.wishCities[0].PlaceId,
            StartCityInLanguage: this.inputData.startCity.PlaceName,
            ReturnCityInLanguage: this.inputData.wishCities[0].PlaceName,
            LowestPrice: parseInt(this.roundFlights.Itineraries[0].PricingOptions[0].Price, 10),
            User: this.$cookies.get('bpUser').data.userID,
            Email: this.$cookies.get('bpUser').data.userEmail,
            Locale: 'ko-KR',
            Currency: 'KRW',
          };
          EventBus.$emit('addMailing', obj);
        } else {
          EventBus.$emit('unFollowing');
        }
      } else {
        this.$router.push({
          query: {
            popFlag: 'signIn',
          },
        });
      }
    },
    bodyScroll() {
      const documentHeight = document.body.scrollHeight;
      if (documentHeight <= ((window.pageYOffset || document.documentElement.scrollTop) + window.innerHeight) + 100 && this.filteredItineraries.length > this.page * this.pageLength) {
        this.page += 1;
      }
    },
    recommendHotelList(cityCode) {
      if (this.$store.state.flightHotelList.list.length === 0 && !this.hotelRequest) {
        this.hotelRequest = true;
        Api.hotelAutoComplete(cityCode).then((resp) => {
          if (resp.data[0]) {
            this.$store.state.flightHotelList.city = resp.data[0];
            const param = {
              'place.placeName': resp.data[0].name,
              checkIn: this.inputData.startDate,
              checkOut: this.inputData.returnDate,
              numberOfAdults: 2,
              numberOfRooms: 1,
              'page.page': 1,
              'page.size': 3,
              'filter.categories': '',
              'filter.facilities': '',
              'filter.maxPrice': '',
              'filter.minPrice': '',
              'filter.rating': '',
              'filter.star': '',
              orderBy: 'WEIGHT_DESC',
            };
            let sendParam = '';
            Object.keys(param).forEach((key) => {
              sendParam += `${key}=${param[key]}&`;
            });
            Api.getHotelList(encodeURI(sendParam), true).then((hotelResp) => {
              if (hotelResp.data.hotels) {
                this.$store.state.flightHotelList.list = hotelResp.data.hotels;
                if (hotelResp.data.hotels.length < 3) {
                  param['page.page'] = 2;
                  sendParam = '';
                  Object.keys(param).forEach((key) => {
                    sendParam += `${key}=${param[key]}&`;
                  });
                  Api.getHotelList(encodeURI(sendParam), true).then((hotelResp2) => {
                    for (let x = 0; x < hotelResp2.data.hotels.length; x += 1) {
                      this.$store.state.flightHotelList.list.push(hotelResp2.data.hotels[x]);
                    }
                  });
                }
              }
            });
          }
        });
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.bodyScroll);
    Api.pricePrediction(this.inputData).then((resp) => {
      this.pricePredictionInfo = resp.data;
    });
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.bodyScroll);
  },
};
</script>

<style scoped lang="scss">
  .noFlight{
    padding: 20px 10px;
    background-color: #FFF;
    border-radius: 4px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
    font-size: 14px;
    > h3{
      font-size: 16px;
    }
    > div{
      margin-top: 8px;
      color: #9b9b9b;
    }
  }
  .priceAlert{
    height: 74px;
    border-radius: 2px;
    background-color: #FFF;
    width: 100%;
    margin-bottom: 10px;
    position: relative;
    padding: 16px 20px;
    > div:first-of-type{
      line-height: 24px;
    }
    > div:nth-of-type(2) {
      font-size: 14px;
      color: #9b9b9b;
    }
    > button{
      padding: 0 40px;
      height: 42px;
      border-radius: 2px;
      background-color: #FFF;
      border: 1px solid #8095ff;
      color: #8095ff;
      right: 20px;
      top: 16px;
      position: absolute;
      transition: .1s ease;
      &:hover{
        background-color: #8095ff;
        color: #FFF;
      }
    }
  }
  .pricePrediction{
    height: 74px;
    width: 100%;
    background-color: #FFF;
    padding: 15px 15px 15px 78px;
    border-top: 1px solid #f1f1f1;
    margin-bottom: 10px;
    position: relative;
    &:before{
      content: '';
      left: 22px;
      top: 19px;
      height: 36px;
      width: 36px;
      background-size: 24px;
      background-repeat: no-repeat;
      position: absolute;
      background-position: center center;
      background-color: #f8f8f8;
      border-radius: 100%;
    }
    &.buy:before{
      background-image: url(~assets/img/flight/price_up.svg);
    }
    &.wait:before{
      background-image: url(~assets/img/flight/price_down.svg);
    }
    > div:first-of-type{
      line-height: 24px;
      font-size: 16px;
      font-weight: bold;
    }
    > div:nth-of-type(2) {
      line-height: 20px;
      font-size: 14px;
      color: #9b9b9b;
    }
    > button{
      width: 24px;
      height: 24px;
      background-image: url(~assets/img/common/x_black.svg);
      background-repeat: no-repeat;
      background-size: cover;
      position: absolute;
      right: 20px;
      top: 25px;
    }
  }
</style>
