<template>
  <ul class="flightBox" v-if="roundInfo">
    <li v-for="(leg, index) in SegmentsList"
      :key="leg.Id"
    >
      <div>
        <div class="flightHead">
          <div>
            <strong>{{ index === 0 ? '출국편 항공권' : '귀국편 항공권' }}</strong> |
            {{ leg.departureTime.split('-')[0] }}년 {{ format.dateFormat(leg.departureTime) }} {{ format.getDayOfWeek(leg.departureTime) }}요일</div>
          <div>총 소요시간 : {{ format.getDurationString(leg.duration) }}</div>
        </div>
        <Segment
          :leg="leg"
          :hotelCityInfo="hotelCityInfo"
        ></Segment>
      </div>
    </li>
  </ul>
  <div
    v-else
    v-swiper:mySwiper="swiperOption"
    style="width: 100%;"
    ref="swiper"
  >
    <ul class="swiper-wrapper flightBox">
      <li v-for="(leg, index) in SegmentsList"
        class="swiper-slide"
        :key="index"
      >
        <div
          @click="moveSlide(index)"
        >
          <div class="flightHead">
            <div>
              <strong>{{ SegmentsList.length }}개중 {{ index + 1 }}번째 항공권</strong> |
              {{ leg.departureTime.split('-')[0] }}년 {{ format.dateFormat(leg.departureTime) }} {{ format.getDayOfWeek(leg.departureTime) }}요일</div>
            <div>총 소요시간 : {{ format.getDurationString(leg.duration) }}</div>
          </div>
          <Segment
            :leg="leg"
            :hotelCityInfo="hotelCityInfo"
          ></Segment>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
import Api from '~/utils/api'; // eslint-disable-line
import Segment from './segment.vue';

export default {
  components: {
    Segment,
  },
  props: ['inputData', 'multiInfo', 'roundInfo', 'session', 'legs'],
  data() {
    const SegmentsList = [];
    // console.log(this.legs);
    for (let x = 0; x < this.legs.length; x += 1) {
      let flightInfo = this.roundInfo;
      if (!flightInfo) {
        const schedule = this.multiInfo.scheduleList[this.multiInfo.selectedIndex];
        const key = `${schedule.FlightInfo[`Flight${x}`].OriginPlace}|${schedule.FlightInfo[`Flight${x}`].DestinationPlace}|${schedule.FlightInfo[`Flight${x}`].OutboundDate}`;
        flightInfo = this.multiInfo.liveList[key].data;
      }
      const legInfo = flightInfo.Legs[this.legs[x]];
      // console.log(legInfo);
      const seg = [];
      for (let y = 0; y < legInfo.SegmentIds.length; y += 1) {
        const segInfo = flightInfo.Segments[legInfo.SegmentIds[y]];
        const obj = {
          originStation: flightInfo.Places[segInfo.OriginStation],
          originCity: this.getCityName(flightInfo.Places[segInfo.OriginStation], flightInfo.Places),
          destinationStation: flightInfo.Places[segInfo.DestinationStation],
          destinationCity: this.getCityName(flightInfo.Places[segInfo.DestinationStation], flightInfo.Places),
          departure: segInfo.DepartureDateTime,
          arrival: segInfo.ArrivalDateTime,
          duration: segInfo.Duration,
        };
        const carrierCode = segInfo.Carrier;
        obj.flightCode = `${flightInfo.Carriers[carrierCode].Code}${segInfo.FlightNumber}`;
        obj.carrier = flightInfo.Carriers[carrierCode].Name;
        obj.carrierImg = flightInfo.Carriers[segInfo.Carrier].ImageUrl;
        obj.operatingCarrier = segInfo.OperatingCarrier !== carrierCode ? flightInfo.Carriers[segInfo.OperatingCarrier].Name : '';
        seg.push(obj);
      }
      // console.log(seg);
      SegmentsList.push({
        departureTime: legInfo.Departure,
        arrivalTime: seg[seg.length - 1].arrival,
        duration: legInfo.Duration,
        carrier: flightInfo.Carriers[legInfo.Carriers[0]].Name,
        seg,
        originStationCode: flightInfo.Places[legInfo.OriginStation].Code,
        destinationStationCode: flightInfo.Places[legInfo.DestinationStation].Code,
      });
    }
    return {
      format: Format,
      SegmentsList,
      swiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 10,
      },
      hotelCityInfo: {
        status: 0,
      },
    };
  },
  methods: {
    moveSlide(index) {
      const offsetLeft = this.$refs.swiper.swiper.slides[index].offsetLeft;
      const gap = (this.$refs.swiper.swiper.width / 2) - (this.$refs.swiper.swiper.slides[index].clientWidth / 2);
      let left = (offsetLeft - gap) + 20;
      if (left < 0) {
        left = 0;
      }
      const max = this.$refs.swiper.swiper.virtualSize - this.$refs.swiper.swiper.width;
      if (max < left) {
        left = max;
      }
      this.$refs.swiper.swiper.$wrapperEl[0].style.transitionDuration = '200ms';
      this.$refs.swiper.swiper.$wrapperEl[0].style.transform = `translate3d(-${left}px, 0px, 0px)`;
      // this.$refs.swiper.swiper.slideTo(index - 1, 200);
    },
    getCityName(airport, list) {
      let name = airport;
      if (airport.Type === 'Airport') {
        name = list[airport.ParentId];
      }
      return name;
    },
    hotelAutoComplete(arr, index) {
      if (!this.hotelCityInfo[arr[index]]) {
        Api.hotelAutoComplete(arr[index]).then((resp) => {
          if (resp.data[0]) {
            this.hotelCityInfo[arr[index]] = resp.data[0];
            this.hotelCityInfo.status += 1;
          }
          if (arr[index + 1]) {
            this.hotelAutoComplete(arr, index + 1);
          }
        });
      } else if (arr[index + 1]) {
        this.hotelAutoComplete(arr, index + 1);
      }
    },
  },
  mounted() {
    const arr = [];
    for (let y = 0; y < this.SegmentsList.length; y += 1) {
      for (let x = 0; x < this.SegmentsList[y].seg.length; x += 1) {
        if (x !== 0 && this.format.getDateGapInfo(this.SegmentsList[y].seg[x - 1].arrival, this.SegmentsList[y].seg[x].departure) > 480) {
          arr.push(this.SegmentsList[y].seg[x].originCity.Code);
        }
      }
    }
    if (arr.length > 0) {
      this.hotelAutoComplete(arr, 0);
    }
  },
};
</script>

<style lang="scss" scoped>
  .flightBox{
    // padding: 0 10px 0 20px;
    width: 100%;
    &:not(.swiper-wrapper) {
      padding: 0 20px;
      > li:first-of-type{
        padding-right: 5px;
      }
      > li:nth-of-type(2){
        padding-left: 5px;
      }
    }
    > li{
      width: 50%;
      float: left;
      border-radius: 2px;
      &.swiper-slide{
        transform: translateX(20px);
      }
      &.swiper-slide:last-of-type{
        padding-right: 40px;
      }
      &.swiper-slide{
        width: 45%;
        &:last-of-type{
          width: calc(45% + 40px);
        }
      }
      > div {
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
        border: 1px solid #e9e9e9;
        .flightHead{
          background-color: #f8f8f8;
          padding: 15px 20px;
          border-bottom: 1px solid #e9e9e9;
          > div:first-of-type{
            line-height: 24px;
            font-size: 16px;
          }
          > div:last-of-type{
            font-size: 14px;
            color: #9b9b9b;
            line-height: 20px;
            margin-top: 2px;
          }
        }
        &:last-of-type{
          margin-bottom: 20px;
        }
      }
    }
  }
</style>
