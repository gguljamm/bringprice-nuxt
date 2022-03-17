<template>
  <transition name="slide-fade" mode="out-in">
    <div class="bookWrap" v-if="init && $route.params.popFlag === 'book'">
      <div class="bookHeader">
        <button
          @click="historyBack()"
        ></button>
        <button
          @click="$router.push({ query: { share: 'flight' } })"
          class="top-control-right top-control-external"
        ></button>
      </div>
      <div class="bookContent">
        <div>
          <h3>항공권 상세정보</h3>
          <p v-if="!roundInfo">각 구간별 항공편을 별도로 예약해야 합니다.</p>
          <p v-else>&nbsp;</p>
          <button class="priceNoti"
            @click="priceAlertFlag ? unfollowing() : priceAlert()"
            :class="priceAlertFlag ? 'active' : ''"
          >
            <div>항공권 가격변동 알림</div>
            <div>검색한 일정의 항공권 가격변동을 이메일로 알려드려요.</div>
            <div></div>
          </button>
        </div>
        <div
          v-swiper:mySwiper="swiperOption"
          style="width: 100%;"
          ref="swiper"
        >
          <ul class="swiper-wrapper flightBox">
            <li class="swiper-slide"
              v-for="(leg, index) in SegmentsList"
              :key="leg.Id"
            >
              <segment
                :leg="leg"
                :index="index"
                :isRound="roundInfo ? true : false"
              >
              </segment>
            </li>
          </ul>
        </div>
      </div>
      <div class="bookButton">
        <div class="agent" :title="getAgentName">{{ getAgentName }}</div>
        <div class="price">총 {{ format.numberFormat(parseInt(price.replace(/,/g,'')) * totalPassenger) }}원</div>
        <button @click="submit()">예약하기</button>
      </div>
      <div
        @click="$router.back()"
        :style="$route.query.share ? { display: 'block' } : { display: 'none' }"
        class="bpPop">
        <share :shareFlag="'flight'"/>
      </div>
    </div>
    <outlink
      v-else-if="$route.params.popFlag === 'book2'"
      :SegmentsList="SegmentsList"
      :bookList="bookList"
      @send-log="sendLog"
    ></outlink>
  </transition>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
import Api from '~/utils/api'; // eslint-disable-line
import User from '~/utils/user'; // eslint-disable-line
import EventBus from '~/utils/eventBus'; // eslint-disable-line
import LivePriceHelper from '~/utils/livePriceHelper'; // eslint-disable-line
import share from '~/components/common/user/mobile/share.vue'; // eslint-disable-line
import segment from './segment.vue';
import outlink from './outlink.vue';

export default {
  props: ['inputData', 'multiInfo', 'roundInfo', 'legs', 'price', 'session'],
  components: {
    share,
    segment,
    outlink,
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
      let lastCarrier = '';
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
        if (lastCarrier !== flightInfo.Carriers[segInfo.Carrier].Name) {
          const carrierCode = segInfo.Carrier;
          obj.carrier = flightInfo.Carriers[carrierCode].Name;
          obj.carrierImg = flightInfo.Carriers[segInfo.Carrier].ImageUrl;
          obj.operatingCarrier = segInfo.OperatingCarrier !== carrierCode ? flightInfo.Carriers[segInfo.OperatingCarrier].Name : '';
          lastCarrier = obj.carrier;
        }
        seg.push(obj);
      }
      SegmentsList.push({
        departureTime: legInfo.Departure.split('T')[0],
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
      init: false,
      SegmentsList,
      priceAlertFlag: false,
      priceAlertId: null,
      swiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 10,
      },
      bookInfo,
      bookList: [],
    };
  },
  computed: {
    getAgentName() {
      if (this.roundInfo) {
        for (let x = 0; x < this.roundInfo.Itineraries.length; x += 1) {
          if (this.roundInfo.Itineraries[x].OutboundLegId === this.legs[0]
            && this.roundInfo.Itineraries[x].InboundLegId === this.legs[1]) {
            return this.roundInfo.Agents[this.roundInfo.Itineraries[x].PricingOptions[0].Agents[0]].Name;
          }
        }
      }
      return '구간별 따로 결제';
    },
    totalPassenger() {
      return parseInt(this.$route.params.adults, 10) + parseInt(this.$route.params.children, 10) + parseInt(this.$route.params.infants, 10);
    },
  },
  methods: {
    sendLog(index, index2, index3) {
      if (this.bookInfo[index] && this.bookInfo[index].data.BookingOptions && this.bookInfo[index].data.BookingOptions.length > 0) {
        LivePriceHelper.sendLog(index, index2, index3, this.bookInfo, this.multiInfo, this.roundInfo, this.legs, this.$cookies.get('userName'), 'mobile');
      } else {
        const interval = setInterval(() => {
          if (this.bookInfo[index] && this.bookInfo[index].data.BookingOptions && this.bookInfo[index].data.BookingOptions.length > 0) {
            clearInterval(interval);
            LivePriceHelper.sendLog(index, index2, index3, this.bookInfo, this.multiInfo, this.roundInfo, this.legs, this.$cookies.get('userName'), 'mobile');
          }
        }, 1000);
      }
    },
    priceAlert() {
      if (this.$cookies.get('bpUser')) {
        if (!this.$cookies.get('bpUser').data.userEmail) {
          this.$router.push({
            query: {
              popFlag: 'alert',
              alertId: 16,
            },
          });
          return;
        }
        const obj = {
          StartDate: this.inputData.startDate,
          StartCity: this.inputData.startCity.PlaceId,
          ReturnDate: this.inputData.returnDate,
          StartCityInLanguage: this.inputData.startCity.PlaceName,
          User: this.$cookies.get('bpUser').data.userID,
          Email: this.$cookies.get('bpUser').data.userEmail,
          Locale: 'ko-KR',
          Currency: 'KRW',
        };
        if (this.roundInfo) {
          obj.ReturnCity = this.inputData.wishCities[0].PlaceId;
          obj.ReturnCityInLanguage = this.inputData.wishCities[0].PlaceName;
          obj.LowestPrice = parseInt(this.roundInfo.Itineraries[0].PricingOptions[0].Price, 10);
        } else {
          obj.WishCities = '';
          obj.WishCitiesInLanguage = '';
          obj.LowestPrice = parseInt(this.price.replace(/,/, ''), 10);
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
        }
        Api.setPriceAlert(obj).then(() => {
          User.getMailingInfo(this.$cookies.get('bpUser').data.userID).then((resp) => {
            this.$store.state.mailingList = resp.data.Result;
            this.checkPriceAlert();
          });
          this.priceAlertFlag = true;
          this.$router.push({
            query: {
              popFlag: 'alert',
              alertId: 3,
            },
          });
        });
      } else {
        this.$router.push('/user');
      }
    },
    historyBack() {
      history.back();
    },
    getCityName(airport, list) {
      let name = airport.Name;
      if (airport.Type === 'Airport') {
        name = list[airport.ParentId].Name;
      }
      return name;
    },
    submit() {
      EventBus.$emit('book');
    },
    unfollowing() {
      const arrWishText = [];
      for (let x = 0; x < this.inputData.wishCities.length; x += 1) {
        arrWishText.push(this.inputData.wishCities[x].PlaceName);
      }
      const arrId = [];
      for (let x = 0; x < this.$store.state.mailingList.length; x += 1) {
        const val = this.$store.state.mailingList[x];
        if (val.start_city === this.inputData.startCity.PlaceName &&
          val.start_date === this.inputData.startDate &&
          val.return_date === this.inputData.returnDate
        ) {
          if (!val.wish_cities.some(wish => arrWishText.indexOf(wish) < 0)) {
            arrId.push(val.id);
          }
        }
      }
      User.arrDeleteMailing(arrId).then(() => {
        this.$router.push({ query: { popFlag: 'alert', alertId: 12 } });
        this.priceAlertFlag = false;
        User.getMailingInfo(this.$cookies.get('bpUser').data.userID).then((resp) => {
          this.$store.state.mailingList = resp.data.Result;
        });
      });
    },
    checkPriceAlert() {
      const arrWishText = [];
      for (let x = 0; x < this.inputData.wishCities.length; x += 1) {
        arrWishText.push(this.inputData.wishCities[x].PlaceName);
      }
      this.priceAlertFlag = this.$store.state.mailingList.some((val) => { // eslint-disable-line
        if (val.start_city === this.inputData.startCity.PlaceName &&
          val.start_date === this.inputData.startDate &&
          val.return_date === this.inputData.returnDate
        ) {
          if (!val.wish_cities.some(wish => arrWishText.indexOf(wish) < 0)) {
            this.priceAlertId = val.id;
            return true;
          }
          return false;
        }
      });
    },
  },
  beforeDestroy() {
    window.document.body.style.overflowY = '';
    window.document.documentElement.style.overflowY = '';
  },
  mounted() {
    this.checkPriceAlert();
    this.$nextTick(() => {
      window.document.body.style.overflowY = 'hidden';
      window.document.documentElement.style.overflowY = 'hidden';
      this.init = true;
    });
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
  },
};
</script>

<style lang="scss" scoped>
  .bookWrap{
    background-color: #f8f8f8;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    .bookHeader {
      height: 46px;
      button:first-of-type {
        left: 4px;
        top: 0;
        width: 40px;
        height: 40px;
        background-size: 21px;
        background-position: center 14px;
        background-repeat: no-repeat;
        border: 0;
        background-color: transparent;
        position: absolute;
        cursor: pointer;
        background-image: url(~assets/img/common/x_black.svg);
      }
      .top-control-external{
        width: 40px;
        height: 40px;
        position: absolute;
        top: 0;
        right: 4px;
        background-size: 21px;
        background-position: center 14px;
        background-repeat: no-repeat;
        background-image: url(~assets/img/hotelDetail/external-link.svg);
      }
    }
    .bookContent{
      position: absolute;
      left: 0;
      right: 0;
      top: 46px;
      bottom: 77px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      > div:first-of-type{
        padding: 0 20px;
      }
      h3{
        font-size: 20px;
      }
      p{
        font-size: 14px;
        color: #9b9b9b;
      }
      .priceNoti{
        margin-top: 10px;
        height: 53px;
        background-color: #FFF;
        width: 100%;
        border-radius: 2px;
        text-align: left;
        padding-left: 10px;
        position: relative;
        > div:first-of-type{
          font-size: 14px;
          line-height: 20px;
        }
        > div:nth-of-type(2){
          font-size: 10px;
          color: #9b9b9b;
          line-height: 15px;
        }
        > div:nth-of-type(3) {
          width: 22px;
          height: 10px;
          background-color: #9e9e9e;
          border-radius: 5px;
          position: absolute;
          right: 12px;
          top: 22px;
          &:before{
            content: '';
            width: 14px;
            height: 14px;
            position: absolute;
            top: -2px;
            left: -2px;
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.24), 0 0 1px 0 rgba(0, 0, 0, 0.12);
            background-color: #fafafa;
            border-radius: 7px;
            transition: .1s ease;
          }
        }
        &.active > div:nth-of-type(3){
          background-color: #ff677d;
        }
        &.active > div:nth-of-type(3):before{
          left: 10px;
        }
      }
    }
    .bookButton{
      height: 77px;
      box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
      width: 100%;
      background-color: #FFF;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1;
      .agent{
        color: #9b9b9b;
        font-size: 12px;
        font-weight: bold;
        position: absolute;
        right: 200px;
        top: 16px;
        line-height: 18px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        left: 10px;
        text-align: right;
      }
      .price{
        font-size: 16px;
        font-weight: bold;
        position: absolute;
        right: 200px;
        top: 34px;
        line-height: 24px;
      }
      button{
        width: 168px;
        height: 53px;
        border-radius: 2px;
        right: 20px;
        top: 10px;
        background-color: $rosy-pink;
        position: absolute;
        color: #FFF;
        font-size: 16px;
        font-weight: bold;
      }
    }
    .flightBox{
      margin-top: 10px;
      border-radius: 2px;
      margin-bottom: 20px;
      > li{
        width: 85%;
        transform: translateX(20px);
        &:first-of-type{
        }
        &:last-of-type{
          width: calc(85% + 40px);
          padding-right: 40px;
        }
      }
    }
    .bpPop{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 11;
      background-color: rgba(0, 0, 0, .3);
    }
  }
</style>
