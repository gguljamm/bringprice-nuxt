<template>
  <div>
    <div class="pricePrediction"
      v-if="pricePredictionInfo"
      :class="pricePredictionInfo.decision==='wait'?'wait':'buy'"
    >
      <div>가격예측 서비스</div>
      <div>{{ pricePredictionInfo.decision === 'wait' ? '7일 이내에 가격이 하락할 것으로 예상됩니다.' : '7일 이내에 가격이 상승할 것으로 예상됩니다.' }}</div>
      <button @click="pricePredictionInfo = null"></button>
    </div>
    <ul class="flights">
      <flight-list
        v-if="sortFlights[0]"
        :key="`0|${sortState}|${JSON.stringify(filter)}`"
        :flights="legList(sortFlights[0])"
        :price="format.numberFormat(getTotalInfo(sortFlights[0], 'Price'))"
        :priceCount="''"
        :filter="filter"
        :inputData="inputData"
        :multiInfo="multiInfo"
      ></flight-list>
      <div class="priceAlert">
        <div>항공권 가격추적 알림</div>
        <div>검색한 일정의 항공권 가격 변동을 추적하여 이메일로 알려드립니다.</div>
        <button
          @click="priceAlert"
        >{{ priceAlertFlag ? '이메일 받기 해제' : '이메일 받기' }}</button>
      </div>
      <flight-list
        v-for="(x, index) in sortFlights"
        v-if="index >= 1 && x"
        :key="`${index}|${sortState}|${JSON.stringify(filter)}`"
        :flights="legList(x)"
        :price="format.numberFormat(getTotalInfo(x, 'Price'))"
        :priceCount="''"
        :filter="filter"
        :inputData="inputData"
        :multiInfo="multiInfo"
      ></flight-list>
    </ul>
    <div v-if="sortFlights.length > 0" class="lastSearch">
      <strong>검색 결과 끝</strong>
      <div>원하는 결과가 없으면 필터기능을 활용해 주세요.</div>
    </div>
    <div v-if="sortFlights.length === 0">검색 결과가 없습니다.<br>더 많은 검색 결과를 원하시면 날짜를 바꾸거나 필터를 변경해보세요.</div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
import Api from '~/utils/api'; // eslint-disable-line
import EventBus from '~/utils/eventBus'; // eslint-disable-line
import FlightList from './flightList.vue';
import timeFilter from '~/utils/timeRangeCheck' // eslint-disable-line

export default {
  components: {
    FlightList,
  },
  props: ['inputData', 'multiInfo', 'filter', 'sortState', 'priceAlertFlag', 'multiRequestNum'],
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
        // arrIndex 값에서 항공정보 불러와서 arrIndex 각각의 stopTime 값 더해서 filter.maxStopTime 값보다 크면 flag=false를 해준다.
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
    // joinLegId(indexList, requestNum) {
    //   const arr = [];
    //   for (let x = 0; x < indexList.length; x += 1) {
    //     arr.push(this.itineraries(this.computedList[x][indexList[x]], indexList[x], x).legId);
    //   }
    //   return `${arr.join()}${requestNum}`;
    // },
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
    priceAlert() {
      if (this.$cookies.get('bpUser')) {
        if (!this.priceAlertFlag) {
          const obj = {
            WishCities: '',
            WishCitiesInLanguage: '',
            LowestPrice: parseInt(this.getTotalInfo(this.sortFlights[0], 'Price'), 10),
            StartDate: this.inputData.startDate,
            StartCity: this.inputData.startCity.PlaceId,
            StartCityInLanguage: this.inputData.startCity.PlaceName,
            User: this.$cookies.get('bpUser').data.userID,
            Email: this.$cookies.get('bpUser').data.userEmail,
            Locale: 'ko-KR',
            Currency: 'KRW',
          };
          for (let x = 0; x < this.multiInfo.stopLength; x += 1) {
            const index = this.multiInfo.scheduleList[this.multiInfo.selectedIndex].FlightInfo;
            obj.WishCities += `${index[`Flight${x}`].DestinationPlace}(${index[`Flight${x}`].OutboundDate});`;
            let flag = false;
            for (let y = 0; y < this.inputData.wishCities.length; y += 1) {
              if (this.inputData.wishCities[y].PlaceId === index[`Flight${x}`].DestinationPlace) {
                obj.WishCitiesInLanguage += `${this.inputData.wishCities[y].PlaceName},`;
                flag = true;
                break;
              }
            }
            if (!flag) {
              obj.WishCitiesInLanguage += `${this.inputData.startCity.PlaceName},`;
            }
          }
          obj.WishCitiesInLanguage = obj.WishCitiesInLanguage.slice(0, -1);
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
        // console.log(flights.Legs);
        if (!outboundLeg) {
          isFiltered = true;
        }
        // console.log(outboundLeg);
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
            return true;
          }
          if (stops.includes(2) && leg.Stops.length > 2) {
            return true;
          }
          return false;
        };
        if (isValidStopLength(outboundLeg, this.filter.stops)) {
          isFiltered = true;
        }
        if (this.filter.sameAirportAtTransfer && this.isAirportDifferent(outboundLeg, flights)) {
          isFiltered = true;
        }
        if (this.filter.flightDuration < outboundLeg.Duration) {
          isFiltered = true;
        }
        if (!timeFilter.isIncludeTimeFilter(outboundLeg.Departure, this.filter.times[order])) {
          isFiltered = true;
        }
        if (outboundLeg.SegmentIds.length > 1 && this.isLayoverTimeFiltered(outboundLeg, flights)) {
          isFiltered = true;
        }
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
    isAirportDifferent(leg, flight) {
      if (leg.SegmentIds.length > 1) {
        for (let y = 0; y < leg.SegmentIds.length - 1; y += 1) {
          if (flight.Segments[leg.SegmentIds[y]].DestinationStation !== flight.Segments[leg.SegmentIds[y + 1]].OriginStation) {
            return true;
          }
        }
      }
      return false;
    },
    itineraries(selectedItinerary, index, order) {
      const temp = this.multiInfo.scheduleList[this.multiInfo.selectedIndex].FlightInfo;
      const key = `${temp[`Flight${order}`].OriginPlace}|${temp[`Flight${order}`].DestinationPlace}|${temp[`Flight${order}`].OutboundDate}`;
      const legId = selectedItinerary.OutboundLegId;
      const flight = this.multiInfo.liveList[key].data;
      const outboundLeg = flight.Legs[legId];
      const outbound = {
        originPlace: {
          code: flight.Places[outboundLeg.OriginStation].Code,
          name: flight.Places[outboundLeg.OriginStation].Name,
        },
        destinationPlace: {
          code: flight.Places[outboundLeg.DestinationStation].Code,
          name: flight.Places[outboundLeg.DestinationStation].Name,
        },
        carriers: outboundLeg.Carriers.map(carrier => flight.Carriers[carrier].Name),
        carrierImages: outboundLeg.Carriers
          .map(carrier => flight.Carriers[carrier].ImageUrl),
        departureTime: outboundLeg.Departure,
        arrivalTime: outboundLeg.Arrival,
        stops: [],
        stopsTime: 0,
        duration: outboundLeg.Duration,
        legId,
      };
      for (let x = 0; x < outboundLeg.SegmentIds.length - 1; x += 1) {
        const stopId = flight.Segments[outboundLeg.SegmentIds[x]].DestinationStation;
        outbound.stops.push({
          code: flight.Places[stopId].Code,
          name: flight.Places[stopId].Name,
        });
        outbound.stopsTime += (new Date(flight.Segments[outboundLeg.SegmentIds[x + 1]].DepartureDateTime) - new Date(flight.Segments[outboundLeg.SegmentIds[x]].ArrivalDateTime)) / 60 / 1000;
      }
      if (outbound.stopsTime === 0) {
        outbound.stopsTime = '';
      } else {
        outbound.stopsTime = this.format.getDurationString(outbound.stopsTime);
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
    Api.pricePredictionMulti(this.inputData, this.multiInfo.scheduleList[this.multiInfo.selectedIndex].FlightInfo, this.multiInfo.stopLength).then((resp) => {
      this.pricePredictionInfo = resp.data;
    });
    window.addEventListener('scroll', this.bodyScroll);
  },
  beforeDestroy() {
    this.$emit('reset-filter');
    window.removeEventListener('scroll', this.bodyScroll);
  },
};
</script>

<style lang="scss" scoped>
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
  .lastSearch{
    padding: 20px 0;
    strong{
      font-size: 20px;
      line-height: 30px;
    }
    div{
      line-height: 24px;
    }
  }
</style>
