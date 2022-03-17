<template>
  <transition name="fade" mode="out-in">
    <div class="bookWrap" v-if="init" @click.stop>
      <div class="bookHeader">
        <span>보호되지 않는 자가환승</span>
        <button
          @click="$router.back()"
        ></button>
      </div>
      <div class="bookContent">
        <div>
          보호되지 않는 자가환승편은 티케팅 계약 조건을 공유하지 않는 두 항공사에서 따로따로 예약한 항공편 일정을 말하며,<br>
          항공사에서 항공편이 지연되어 환승편을 놓치더라도 다음 항공권을 마련해줄 의무가 없다는 뜻입니다.
        </div>
        <div>
          <div><div>1</div>이 항공편을 이용하면 환승 항공편을 갈아탈 때마다 부친 수하물을 찾아 별도로 다음 항공편에 다시 체크인해야할 수 있습니다.</div>
          <div><div>2</div>연결 항공편을 갈아탈 때 세관과 출입국 관리 사무소를 통과할 수 있으며, 환승 비자가 필요할 수 있습니다.</div>
        </div>
        <ul>
          <li v-for="(x, index) in selfInfo" :key="x.url">
            <div><strong>{{ index + 1 }}번째 항공권</strong></div>
            <div>
              <div>
                <div>{{ x.agentName }}</div>
                <div
                  :class="x.agentType === 'Airline' ? 'airline' : ''"
                >{{ x.agentType === 'TravelAgent' ? '여행사' : '항공사' }}</div>
              </div>
              <div :class="totalPassenger > 1 ? 'various' : ''">
                <div><strong>{{ format.numberFormat(parseInt(x.price, 10)) }}</strong>원</div>
                <div v-if="totalPassenger > 1">총 가격 {{ format.numberFormat(parseInt(x.price * totalPassenger, 10)) }}원</div>
              </div>
              <button
                @click="submit(x)"
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

export default {
  props: ['selfInfo'],
  computed: {
    totalPassenger() {
      return parseInt(this.$route.params.adults, 10) + parseInt(this.$route.params.children, 10) + parseInt(this.$route.params.infants, 10);
    },
    wishLength() {
      return this.$route.params.wishCities.split('&').length;
    },
  },
  data() {
    return {
      format: Format,
      init: false,
    };
  },
  methods: {
    submit(x) {
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'exitFlight',
        eventAction: `web-${this.wishLength === 1 ? 'round' : 'multi'}`,
        eventLabel: x.agentName,
      });
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'averageFare',
        eventAction: 'web',
        eventValue: parseInt(x.price, 10),
      });
      window.open(x.deeplink, '_blank');
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
