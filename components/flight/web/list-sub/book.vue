<template>
  <ul class="flightBox" v-if="roundInfo">
    <li>
      <div>
        <div class="flightHead">
          <div>
            <strong>왕복 항공권</strong> |
            {{ $route.params.startDate.split('-')[0] }}년
            {{ format.dateFormat($route.params.startDate) }} ~
            {{ $route.params.startDate.split('-')[0] !== $route.params.returnDate.split('-')[0] ? `${$route.params.returnDate.split('-')[0]}년 ` : '' }}
            {{ $route.params.startDate.split('-')[0] !== $route.params.returnDate.split('-')[0] || $route.params.startDate.split('-')[1] !== $route.params.returnDate.split('-')[1] ? `${parseInt($route.params.returnDate.split('-')[1], 10)}월` : '' }}
            {{ parseInt($route.params.returnDate.split('-')[2], 10) }}일
          </div>
          <div v-if="bookList[0] && progress(bookList[0]) === 100">
            성인 {{ $route.params.adults }}명,
            {{ $route.params.children > 0 ? `소아 ${$route.params.children}명,` : '' }}
            {{ $route.params.infants > 0 ? `유아 ${$route.params.infants}명,` : '' }}
            {{ cabinName }}
          </div>
          <div class="loading" v-else>가격 및 좌석을 확인중입니다.</div>
          <div class="progress"
            :class="progress(bookList[0]) === 100 ? 'fadeOut' : ''"
            :style="{
              width: !progressInit ? '0%' : `${progress(bookList[0])}%`,
            }"
          ></div>
        </div>
        <web-book-last
          v-if="bookList[0]"
          :bookList="bookList[0]"
          :bookIndex="0"
          @submit="submit"
        ></web-book-last>
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
            <div v-if="bookList[index] && progress(bookList[index]) === 100">
              성인 {{ $route.params.adults }}명,
              {{ $route.params.children > 0 ? `소아 ${$route.params.children}명,` : '' }}
              {{ $route.params.infants > 0 ? `유아 ${$route.params.infants}명,` : '' }}
              {{ cabinName }}
            </div>
            <div class="loading" v-else>가격 및 좌석을 확인중입니다.</div>
            <div class="progress"
              :class="progress(bookList[index]) === 100 ? 'fadeOut' : ''"
              :style="{
                width: !progressInit ? '0%' : `${progress(bookList[index])}%`,
              }"
            ></div>
          </div>
          <web-book-last
            :requestNum="bookList[index].requestNum"
            v-if="bookList[index]"
            :bookList="bookList[index]"
            :bookIndex="index"
            @submit="submit"
          ></web-book-last>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
import WebBookLast from './bookLast.vue'; // eslint-disable-line
import LivePriceHelper from '~/utils/livePriceHelper'; // eslint-disable-line
import EventBus from '~/utils/eventBus'; // eslint-disable-line

export default {
  props: ['inputData', 'multiInfo', 'roundInfo', 'session', 'legs'],
  components: {
    WebBookLast,
  },
  data() {
    let bookInfo = [];
    const SegmentsList = [];
    for (let x = 0; x < this.legs.length; x += 1) {
      let flightInfo = this.roundInfo;
      if (!flightInfo) {
        const schedule = this.multiInfo.scheduleList[this.multiInfo.selectedIndex];
        const key = `${schedule.FlightInfo[`Flight${x}`].OriginPlace}|${schedule.FlightInfo[`Flight${x}`].DestinationPlace}|${schedule.FlightInfo[`Flight${x}`].OutboundDate}`;
        flightInfo = this.multiInfo.liveList[key].data;
      }
      const legInfo = flightInfo.Legs[this.legs[x]];
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
      SegmentsList.push({
        departureTime: legInfo.Departure,
        arrivalTime: seg[seg.length - 1].arrival,
        duration: legInfo.Duration,
        carrier: flightInfo.Carriers[legInfo.Carriers[0]].Name,
        seg,
        originStationCode: flightInfo.Places[legInfo.OriginStation].Code,
        destinationStationCode: flightInfo.Places[legInfo.DestinationStation].Code,
      });
      bookInfo.push({
        location: '',
        data: {},
      });
    }
    if (this.roundInfo) {
      bookInfo = [{
        location: '',
        data: {},
      }];
    }
    return {
      format: Format,
      swiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 10,
      },
      bookList: [],
      SegmentsList,
      bookInfo,
      progressInit: false,
    };
  },
  computed: {
    cabinName() {
      if (this.$route.params.cabinClass === 'PremiumEconomy') {
        return '프리미엄일반석';
      } else if (this.$route.params.cabinClass === 'Business') {
        return '비즈니스석';
      } else if (this.$route.params.cabinClass === 'FirstClass') {
        return '일등석';
      }
      return '일반석';
    },
  },
  methods: {
    progress(book) {
      return LivePriceHelper.progress(book);
    },
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
    },
    getCityName(airport, list) {
      let name = airport.Name;
      if (airport.Type === 'Airport') {
        name = list[airport.ParentId].Name;
      }
      return name;
    },
    submit(book, bookIndex, index) {
      if (book.length === 1) {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'exitFlight',
          eventAction: `web-${this.bookList.length === 1 ? 'round' : 'multi'}`,
          eventLabel: book[0].agentName,
        });
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'averageFare',
          eventAction: 'web',
          eventValue: parseInt(book[0].price, 10),
        });
        window.open(book[0].deeplink, '_blank');
        if (this.bookInfo[bookIndex] && this.bookInfo[bookIndex].data.BookingOptions && this.bookInfo[bookIndex].data.BookingOptions.length > 0) {
          this.sendLog(bookIndex, index, 0);
        } else {
          const interval = setInterval(() => {
            if (this.bookInfo[bookIndex] && this.bookInfo[bookIndex].data.BookingOptions && this.bookInfo[bookIndex].data.BookingOptions.length > 0) {
              clearInterval(interval);
              this.sendLog(bookIndex, index, 0);
            }
          }, 1000);
        }
      } else {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'selfTransfer',
          eventAction: 'web',
          eventValue: book[0].agentName,
        });
        EventBus.$emit('selfTransfer', book);
      }
    },
    sendLog(index, index2, index3) {
      LivePriceHelper.sendLog(index, index2, index3, this.bookInfo, this.multiInfo, this.roundInfo, this.legs, this.$cookies.get('userName'), 'desktop');
    },
  },
  mounted() {
    LivePriceHelper.bookingInit(this, this.session, this.legs, this.multiInfo, this.roundInfo, this.bookList, this.bookInfo, {
      adults: this.$route.params.adults,
      children: this.$route.params.children,
      infants: this.$route.params.infants,
    }, () => {
      this.$router.push({
        query: {
          popFlag: 'alert',
          alertId: 9,
        },
      });
    });
    setTimeout(() => {
      this.progressInit = true;
    }, 10);
  },
};
</script>

<style lang="scss" scoped>
  .flightBox{
    // padding: 0 10px 0 20px;
    width: 100%;
    > li{
      width: 100%;
      float: left;
      border-radius: 2px;
      transform: translateX(20px);
      &:last-of-type{
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
          position: relative;
          > div:first-of-type{
            line-height: 24px;
            font-size: 16px;
          }
          > div:nth-of-type(2){
            font-size: 14px;
            color: #9b9b9b;
            line-height: 20px;
            margin-top: 2px;
            &.loading{
              color: #d0021b;
            }
          }
          > .progress{
            width: 0;
            position: absolute;
            bottom: 0;
            height: 2px;
            left: 0;
            border-radius: 1px;
            background-color: #ff677d;
            transition: 3s ease;
            &.fadeOut{
              animation: fadeOut 3s normal forwards;
            }
          }
        }
        &:last-of-type{
          margin-bottom: 20px;
        }
      }
    }
  }
  @keyframes fadeOut {
    from {
    }
    80%{
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
</style>
