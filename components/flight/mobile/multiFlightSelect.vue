<template>
  <div>
    <ul class="flights" :key="multiRequestNum">
      <flight-list
        v-for="(x, index) in sortFlights"
        v-if="x"
        :key="`${index}|${sortState}|${JSON.stringify(filter)}`"
        :flights="legList(x)"
        :price="format.numberFormat(getTotalInfo(sortFlights[index], 'Price'))"
        :priceCount="''"
        :links="''"
        :filter="filter"
      ></flight-list>
      <div v-if="sortFlights.length > 0">원하는 결과가 없으면 필터기능을 활용해 주세요.</div>
      <div v-if="sortFlights.length === 0">검색 결과가 없습니다.<br>더 많은 검색 결과를 원하시면 날짜를 바꾸거나 필터를 변경해보세요.</div>
    </ul>
    <div class="pricePrediction" v-if="pricePredictionInfo" :class="pricePredictionInfo.decision==='wait'?'wait':'buy'">
      <div>가격예측 서비스</div>
      <div>{{ pricePredictionInfo.decision === 'wait' ? '7일 이내에 가격이 내릴 것 같습니다.' : '7일 이내에 가격이 오를 것 같습니다.' }}</div>
      <button @click="pricePredictionInfo = null"></button>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
import Api from '~/utils/api'; // eslint-disable-line
import FlightList from './flightList.vue';
import timeFilter from '~/utils/timeRangeCheck' // eslint-disable-line

export default {
  components: {
    FlightList,
  },
  props: ['inputData', 'multiInfo', 'filter', 'sortState', 'multiRequestNum'],
  data() {
    let multiNumber = 5;
    if (this.multiInfo.stopLength === 4) {
      multiNumber = 4;
    } else if (this.multiInfo.stopLength === 5) {
      multiNumber = 3;
    } else if (this.multiInfo.stopLength === 6) {
      multiNumber = 3;
    } else if (this.multiInfo.stopLength === 7) {
      multiNumber = 2;
    }
    return {
      arrIndex: [],
      format: Format,
      page: 1,
      pageLength: 30,
      multiNumber,
      pricePredictionInfo: null,
    };
  },
  computed: {
    computedList() {
      const arr = [];
      for (let x = 0; x < this.multiInfo.stopLength; x += 1) {
        const index = this.multiInfo.scheduleList[this.multiInfo.selectedIndex].FlightInfo;
        const key = `${index[`Flight${x}`].OriginPlace}|${index[`Flight${x}`].DestinationPlace}|${index[`Flight${x}`].OutboundDate}`;
        arr.push(this.filteredItineraries(this.multiInfo.liveList[key].data, x));
      }
      return arr;
    },
    sortFlights() {
      const arr = [];
      for (let x = 0; x < this.arrIndex.length; x += 1) {
        let flag = true;
        for (let y = 0; y < this.arrIndex[x].length; y += 1) {
          if (!this.computedList[y][this.arrIndex[x][y]]) {
            flag = false;
            break;
          }
        }
        if (flag) {
          arr.push(this.arrIndex[x]);
        }
      }
      if (this.sortState === 'curation') {
        arr.sort((x, y) => this.getTotalInfo(y, 'Score') - this.getTotalInfo(x, 'Score'));
      } else if (this.sortState === 'price') {
        arr.sort((x, y) => this.getTotalInfo(x, 'Price') - this.getTotalInfo(y, 'Price'));
      } else if (this.sortState === 'duration') {
        arr.sort((x, y) => this.getTotalInfo(x, 'Duration') - this.getTotalInfo(y, 'Duration'));
      }
      return arr.slice(0, this.page * this.pageLength);
    },
  },
  methods: {
    isLayoverTimeFiltered(leg, flights) {
      let sumLayoverTime = 0;
      if (leg.SegmentIds.length > 1) {
        for (let y = 0; y < leg.SegmentIds.length - 1; y += 1) {
          sumLayoverTime += this.format.getDateGapInfo(flights.Segments[leg.SegmentIds[y]].ArrivalDateTime, flights.Segments[leg.SegmentIds[y + 1]].DepartureDateTime);
        }
      }
      return sumLayoverTime > this.filter.maxStopsTime;
    },
    getTotalInfo(indexList, flag) {
      let totalValue = 0;
      for (let x = 0; x < indexList.length; x += 1) {
        if (flag === 'Price') {
          totalValue += this.computedList[x][indexList[x]].PricingOptions[0].Price;
        } else {
          totalValue += this.computedList[x][indexList[x]][flag];
        }
      }
      return parseInt(totalValue, 10);
    },
    legList(indexList) {
      const arr = [];
      for (let x = 0; x < indexList.length; x += 1) {
        arr.push(this.itineraries(this.computedList[x][indexList[x]], indexList[x], x));
      }
      return arr;
    },
    filteredItineraries(flights, order) {
      const itineraries = flights.Itineraries;
      if (this.sortState === 'curation') {
        itineraries.sort((x, y) => y.Score - x.Score);
      } else if (this.sortState === 'price') {
        itineraries.sort((x, y) => x.PricingOptions[0].Price - y.PricingOptions[0].Price);
      } else if (this.sortState === 'duration') {
        itineraries.sort((x, y) => x.Duration - y.Duration);
      }
      const newItinerary = [];
      for (let x = 0; x < itineraries.length; x += 1) {
        let isFiltered = false;
        const outboundLeg = flights.Legs[itineraries[x].OutboundLegId];
        if (!outboundLeg) {
          isFiltered = true;
        }
        if (outboundLeg.Carriers.some(carrier => this.filter.airlines.includes(carrier))) {
          isFiltered = true;
        }

        if (this.filter.airports.includes(
          flights.Places[outboundLeg.DestinationStation].Code)
        ) {
          isFiltered = true;
        }
        if (this.filter.airports.includes(flights.Places[outboundLeg.OriginStation].Code)) {
          isFiltered = true;
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
          isFiltered = true;
        }
        if (!timeFilter.isIncludeTimeFilter(outboundLeg.Departure, this.filter.times[order])) {
          isFiltered = true;
        }
        if (outboundLeg.SegmentIds.length > 1 && this.isLayoverTimeFiltered(outboundLeg, flights)) {
          isFiltered = true;
        }
        if (this.filter.flightDuration < outboundLeg.Duration) {
          isFiltered = true;
        }
        // if (order === 0) {
        //   if (!timeFilter.isIncludeTimeFilter(
        //     outboundLeg.Departure, this.filter.departureTime)
        //   ) {
        //     isFiltered = true;
        //   }
        // }
        // if (order === this.multiInfo.stopLength - 1) {
        //   if (!timeFilter.isIncludeTimeFilter(
        //     outboundLeg.Departure, this.filter.returnTime)
        //   ) {
        //     isFiltered = true;
        //   }
        // }
        if (!isFiltered) {
          newItinerary.push(itineraries[x]);
        }
        if (newItinerary.length >= 5) {
          break;
        }
      }
      if (newItinerary.length === 0) {
        for (let x = 0; x < itineraries.length && x < 5; x += 1) {
          newItinerary.push(itineraries[x]);
        }
      }
      return newItinerary;
    },
    itineraries(selectedItinerary, index, order) {
      const temp = this.multiInfo.scheduleList[this.multiInfo.selectedIndex].FlightInfo;
      const key = `${temp[`Flight${order}`].OriginPlace}|${temp[`Flight${order}`].DestinationPlace}|${temp[`Flight${order}`].OutboundDate}`;
      const legId = selectedItinerary.OutboundLegId;
      const flight = this.multiInfo.liveList[key].data;
      const outboundLeg = flight.Legs[legId];
      const outbound = {
        originPlace: flight.Places[outboundLeg.OriginStation].Code,
        destinationPlace: flight.Places[outboundLeg.DestinationStation].Code,
        carriers: outboundLeg.Carriers.map(carrier => flight.Carriers[carrier].Name),
        carrierImages: outboundLeg.Carriers
          .map(carrier => flight.Carriers[carrier].ImageUrl),
        departureTime: outboundLeg.Departure,
        arrivalTime: outboundLeg.Arrival,
        stops: [],
        duration: outboundLeg.Duration,
        legId,
      };
      for (let x = 0; x < outboundLeg.SegmentIds.length - 1; x += 1) {
        const stopId = flight.Segments[outboundLeg.SegmentIds[x]].DestinationStation;
        outbound.stops.push(flight.Places[stopId] ? flight.Places[stopId].Code : '　');
      }

      return outbound;
    },
    bodyScroll() {
      const documentHeight = document.body.scrollHeight;
      if (documentHeight <= ((window.pageYOffset || document.documentElement.scrollTop) + window.innerHeight) + 100 && this.arrIndex.length > this.page * this.pageLength) {
        this.page += 1;
      }
    },
  },
  mounted() {
    function addIndex(value, multiNumber, stopLength, arrIndex) {
      const newVal = value;
      const arr = newVal.split(',');
      if (arr.length === stopLength) {
        arrIndex.push(arr);
        return true;
      }
      for (let x = 0; x < multiNumber; x += 1) {
        ((val) => {
          let newnewVal = val;
          newnewVal += `,${x}`;
          addIndex(newnewVal, multiNumber, stopLength, arrIndex);
        })(newVal);
      }
      return true;
    }
    for (let x = 0; x < this.multiNumber; x += 1) {
      addIndex(`${x}`, this.multiNumber, this.multiInfo.stopLength, this.arrIndex);
    }
    window.addEventListener('scroll', this.bodyScroll);
    Api.pricePredictionMulti(this.inputData, this.multiInfo.scheduleList[this.multiInfo.selectedIndex].FlightInfo, this.multiInfo.stopLength).then((resp) => {
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
</style>
