<template>
  <div>
    <div class="pricePrediction"
      v-if="pricePredictionInfo && roundFlights"
      :class="pricePredictionInfo.decision==='wait'?'wait':'buy'"
    >
      <div>가격예측 서비스</div>
      <div>{{ pricePredictionInfo.decision === 'wait' ? '7일 이내에 가격이 내릴 것 같습니다.' : '7일 이내에 가격이 오를 것 같습니다.' }}</div>
      <button @click="pricePredictionInfo = null"></button>
    </div>
    <ul v-if="roundFlights" class="flights" ref="flightList">
      <flight-list
        v-for="(flight, index) in itineraries"
        :key="index"
        :flights="[flight.outbound, flight.inbound]"
        :price="flight.pricingString"
        :priceCount="flight.pricingOptionCount"
        :links="flight.bookingDetailsLink"
        :filter="filter"
      ></flight-list>
      <div v-if="progress === 1 && itineraries.length === 0" class="noFlight">
        <h3>검색 결과 없음</h3>
        <div>더 많은 검색 결과를 원하시면 날짜를 바꾸거나 필터를 제거하여 검색 조건을 변경해보세요.</div>
      </div>
      <flight-list-loading v-if="progress !== 1 && itineraries.length === 0"></flight-list-loading>
    </ul>
    <flight-list-loading v-else-if="progress !== 1" class="flights"></flight-list-loading>
    <div v-else class="noFlight">
      <h3>검색 결과 없음</h3>
      <div>해당 도시로 가는 항공편이 검색되지 않습니다.<br>날짜를 변경하거나 다른 도시를 검색해주세요.</div>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format' // eslint-disable-line
import Api from '~/utils/api' // eslint-disable-line
import timeFilter from '~/utils/timeRangeCheck' // eslint-disable-line
import sortFunctions from '~/utils/itinerariesSort' // eslint-disable-line
import FlightList from './flightList.vue';
import FlightListLoading from './flightListLoading.vue';

export default {
  props: ['inputData', 'filter', 'roundFlights', 'sortState', 'progress'],
  components: {
    FlightList,
    FlightListLoading,
  },
  data() {
    return {
      page: 1,
      pageLength: 30,
      filteredLength: 0,
      format: Format,
      sortCompare: {
        curation: sortFunctions.curationSort,
        price: sortFunctions.priceSort,
        duration: sortFunctions.durationSort,
      },
      pricePredictionInfo: null,
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
        // console.log(flight);
        // console.log(flight.OutboundLegId);
        // console.log(this.roundFlights.Legs[flight.OutboundLegId]);
        const outboundLeg = this.roundFlights.Legs[flight.OutboundLegId];

        const outbound = {
          originPlace: this.roundFlights.Places[outboundLeg.OriginStation].Code,
          destinationPlace: this.roundFlights.Places[outboundLeg.DestinationStation].Code,
          carriers: outboundLeg.Carriers.map(carrier => this.roundFlights.Carriers[carrier].Name),
          carrierImages: outboundLeg.Carriers
            .map(carrier => this.roundFlights.Carriers[carrier].ImageUrl),
          departureTime: outboundLeg.Departure,
          arrivalTime: outboundLeg.Arrival,
          stops: [],
          duration: outboundLeg.Duration,
          legId: flight.OutboundLegId,
        };
        for (let x = 0; x < outboundLeg.SegmentIds.length - 1; x += 1) {
          const stopId = this.roundFlights.Segments[outboundLeg.SegmentIds[x]].DestinationStation;
          outbound.stops.push(this.roundFlights.Places[stopId] ? this.roundFlights.Places[stopId].Code : '　');
        }

        const inboundLeg = this.roundFlights.Legs[flight.InboundLegId];
        // console.log(inboundLeg);
        const inbound = {
          originPlace: this.roundFlights.Places[inboundLeg.OriginStation].Code,
          destinationPlace: this.roundFlights.Places[inboundLeg.DestinationStation].Code,
          carriers: inboundLeg.Carriers.map(carrier => this.roundFlights.Carriers[carrier].Name),
          carrierImages: inboundLeg.Carriers
            .map(carrier => this.roundFlights.Carriers[carrier].ImageUrl),
          departureTime: inboundLeg.Departure,
          arrivalTime: inboundLeg.Arrival,
          // '2017-12-31T22:00:00'),
          stops: [],
          duration: inboundLeg.Duration,
          legId: flight.InboundLegId,
        };
        for (let x = 0; x < inboundLeg.SegmentIds.length - 1; x += 1) {
          const stopId = this.roundFlights.Segments[inboundLeg.SegmentIds[x]].DestinationStation;
          inbound.stops.push(this.roundFlights.Places[stopId] ? this.roundFlights.Places[stopId].Code : '　');
        }

        const pricingString = this.format.numberFormat(parseInt(flight.PricingOptions[0].Price, 10));
        const pricingOptionCount = flight.PricingOptions.length;
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
          // console.log('aa');
          const outboundLeg = this.roundFlights.Legs[itinerary.OutboundLegId];
          const inboundLeg = this.roundFlights.Legs[itinerary.InboundLegId];
          // console.log(outboundLeg, inboundLeg);
          // console.log(this.roundFlights.Places[outboundLeg.OriginStation], this.roundFlights.Places[inboundLeg.OriginStation]);
          if (!outboundLeg || !inboundLeg) {
            return false;
          }
          // console.log(this.filter);
          if (outboundLeg.Carriers.some(carrier => this.filter.airlines.includes(carrier))) {
            return false;
          }
          if (inboundLeg.Carriers.some(carrier => this.filter.airlines.includes(carrier))) {
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
          if (this.filter.airports.includes(
            this.roundFlights.Places[inboundLeg.DestinationStation].Code)
          ) {
            return false;
          }
          if (this.filter.airports.includes(this.roundFlights.Places[inboundLeg.OriginStation].Code)) {
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
          if (this.filter.sameAirportAtTransfer && this.isAirportDifferent([outboundLeg, inboundLeg])) {
            return false;
          }
          if (outboundLeg.SegmentIds.length > 1 && inboundLeg.SegmentIds.length > 1 && this.filter.maxStopsTime && this.isLayoverTimeFiltered([outboundLeg, inboundLeg])) {
            return false;
          }
          if (this.isOverMaxFlightDuration([outboundLeg, inboundLeg])) {
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
    bodyScroll() {
      const scrollY = (window.pageYOffset || document.documentElement.scrollTop);
      const documentHeight = document.body.scrollHeight;
      if (documentHeight <= (scrollY + window.innerHeight) + 100 && this.filteredItineraries.length > this.page * this.pageLength) {
        this.page += 1;
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

<style lang="scss" scoped>
  .flights{
    padding: 10px 20px 20px 20px;
  }
  .pricePrediction{
    height: 64px;
    width: 100%;
    background-color: #FFF;
    z-index: 11;
    position: fixed;
    bottom: 0;
    padding: 12px 12px 12px 68px;
    transform: translateY(-51px);
    transition: .3s ease;
    border-top: 1px solid #f1f1f1;
    &:before{
      content: '';
      left: 22px;
      top: 16px;
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
    .scrollDown &{
      transform: translateY(0);
    }
    > div:first-of-type{
      line-height: 20px;
      font-size: 14px;
    }
    > div:nth-of-type(2) {
      line-height: 18px;
      font-size: 12px;
      color: #9b9b9b;
    }
    > button{
      width: 20px;
      height: 20px;
      background-image: url(~assets/img/common/x_black.svg);
      background-repeat: no-repeat;
      background-size: cover;
      position: absolute;
      right: 12px;
      top: 22px;
    }
  }
  .noFlight{
    margin: 16px 10px;
    padding: 10px;
    background-color: #FFF;
    border-radius: 4px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
    font-size: 14px;
    > h3{
      font-size: 14px;
    }
    > div{
      margin-top: 8px;
      color: #9b9b9b;
    }
    .flights &{
      margin: 0;
    }
  }
</style>
