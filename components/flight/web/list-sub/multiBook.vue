<template>
  <transition name="fade" mode="out-in">
    <div class="bookWrap" v-if="init" @click.stop>
      <div class="bookHeader">
        <span>Mix & Match 다구간항공권</span>
        <button
          @click="$router.back()"
        ></button>
      </div>
      <div class="bookContent">
        <div>
          Mix & Match는 브링프라이스에서만 제공하는 다구간 항공권입니다.<br>
          다른 providers의 편도항공권의 조합으로 각 구간별 항공편을 별도로 예약하지만, 더 나은 가격을 제공 받을 수 있습니다.
        </div>
        <div>
          <div><div>1</div>다구간 항공권 상세정보를 확인해주세요.</div>
          <div><div>2</div>각 예약사이트에서 항공권 가격과 일정을 확인후 예약을 진행해주세요.</div>
        </div>
        <ul>
          <li v-for="(x, index) in arr" :key="x.url">
            <div><strong>{{ index + 1 }}번째 항공권</strong> | {{ x.departureDate.split('-')[0] }}년 {{ format.dateFormat(x.departureDate) }} {{ format.getDayOfWeek(x.departureDate) }}요일</div>
            <div>
              <div>
                <div>{{ x.agent.Name }}</div>
                <div
                  :class="x.agent.Type === 'Airline' ? 'airline' : ''"
                >{{ x.agent.Type === 'TravelAgent' ? '여행사' : '항공사' }}</div>
              </div>
              <div :class="totalPassenger > 1 ? 'various' : ''">
                <div><strong>{{ format.numberFormat(parseInt(x.price, 10)) }}</strong>원</div>
                <div v-if="totalPassenger > 1">총 가격 {{ format.numberFormat(parseInt(x.price * totalPassenger, 10)) }}원</div>
              </div>
              <button
                @click="submit(index, x)"
              >사이트로 이동</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
import LivePriceHelper from '~/utils/livePriceHelper'; // eslint-disable-line

export default {
  props: ['inputData', 'multiInfo', 'session', 'legs', 'price'],
  data() {
    const arr = [];
    const schedule = this.multiInfo.scheduleList[this.multiInfo.selectedIndex];
    for (let x = 0; x < this.legs.length; x += 1) {
      const key = `${schedule.FlightInfo[`Flight${x}`].OriginPlace}|${schedule.FlightInfo[`Flight${x}`].DestinationPlace}|${schedule.FlightInfo[`Flight${x}`].OutboundDate}`;
      const flightInfo = this.multiInfo.liveList[key].data;
      let index = 0;
      for (let y = 0; y < flightInfo.Itineraries.length; y += 1) {
        if (this.legs[x] === flightInfo.Itineraries[y].OutboundLegId) {
          index = y;
          break;
        }
      }
      arr.push({
        departureDate: schedule.FlightInfo[`Flight${x}`].OutboundDate,
        price: flightInfo.Itineraries[index].PricingOptions[0].Price,
        agent: flightInfo.Agents[flightInfo.Itineraries[index].PricingOptions[0].Agents[0]],
        url: flightInfo.Itineraries[index].PricingOptions[0].DeeplinkUrl,
      });
    }
    return {
      format: Format,
      init: false,
      arr,
    };
  },
  computed: {
    totalPassenger() {
      return parseInt(this.$route.params.adults, 10) + parseInt(this.$route.params.children, 10) + parseInt(this.$route.params.infants, 10);
    },
  },
  methods: {
    submit(index, option) {
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'quickExitFlight',
        eventAction: 'multi',
      });
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'exitFlight',
        eventAction: 'web-multi',
        eventLabel: option.agent.Name,
      });
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'averageFare',
        eventAction: 'web',
        eventValue: parseInt(option.price, 10),
      });
      const arr = [];
      for (let x = 0; x < this.session.length; x += 1) {
        arr.push({
          location: '',
          data: {},
        });
      }
      LivePriceHelper.bookingInit(this, this.session, this.legs, this.multiInfo, false, [], arr, {
        adults: this.$route.params.adults,
        children: this.$route.params.children,
        infants: this.$route.params.infants,
      }, () => {}, { index });
      window.open(option.url, '_blank');
    },
  },
  created() {
    window.document.body.style.overflowY = 'hidden';
    window.document.documentElement.style.overflowY = 'hidden';
  },
  beforeDestroy() {
    window.document.body.style.overflowY = '';
    window.document.documentElement.style.overflowY = '';
  },
  mounted() {
    this.$nextTick(() => {
      this.init = true;
    });
  },
};
</script>

<style lang="scss" scoped>
  .bookWrap {
    background-color: #fff;
    position: absolute;
    width: 1000px;
    top: 100px;
    left: 50%;
    margin-left: -500px;
    bottom: 100px;
    .bookHeader {
      height: 76px;
      font-size: 22px;
      font-weight: bold;
      padding-left: 20px;
      line-height: 76px;
      button:first-of-type {
        right: 16px;
        top: 16px;
        width: 40px;
        height: 40px;
        background-position: center center;
        background-repeat: no-repeat;
        border: 0;
        background-color: transparent;
        position: absolute;
        cursor: pointer;
        background-image: url(~assets/img/common/x_black.svg);
      }
    }
    .bookContent {
      background-color: #f8f8f8;
      padding: 16px 40px;
      position: absolute;
      left: 0;
      right: 0;
      top: 72px;
      bottom: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      > div:first-of-type{
        color: #9b9b9b;
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 20px;
      }
      > div:nth-of-type(2) {
        > div{
          position: relative;
          padding-left: 46px;
          line-height: 28px;
          margin-bottom: 18px;
          > div {
            width: 28px;
            height: 28px;
            line-height: 28px;
            background-color: #e1e1e1;
            color: #FFF;
            text-align: center;
            position: absolute;
            left: 10px;
            border-radius: 14px;
            font-weight: bold;
          }
        }
      }
      ul {
        padding-top: 12px;
        li {
          > div:first-of-type{
            font-size: 18px;
            line-height: 27px;
            height: 27px;
            margin-bottom: 10px;
          }
          > div:nth-of-type(2){
            border: 1px solid #e9e9e9;
            height: 82px;
            background-color: #FFF;
            margin-bottom: 20px;
            position: relative;
            > div:first-of-type{
              padding-top: 18px;
              padding-left: 20px;
              > div:first-of-type{
                font-size: 16px;
                font-weight: bold;
                line-height: 24px;
              }
              > div:nth-of-type(2){
                margin-top: 2px;
                color: #9b9b9b;
                line-height: 20px;
                font-size: 14px;
                &.airline{
                  color: #33c498;
                }
              }
            }
            > div:nth-of-type(2){
              right: 197px;
              position: absolute;
              top: 28px;
              text-align: right;
              > div:first-of-type{
                line-height: 29px;
                font-size: 14px;
                height: 29px;
                > strong{
                  font-size: 20px;
                }
              }
              > div:nth-of-type(2){
                line-height: 18px;
                font-size: 12px;
                color: #9b9b9b;
              }
              &.various{
                top: 17px;
              }
            }
            > button{
              width: 167px;
              height: 43px;
              border-radius: 2px;
              background-color: #7167ff;
              position: absolute;
              right: 20px;
              top: 21px;
              color: #FFF;
            }
          }
        }
      }
    }
  }
</style>
