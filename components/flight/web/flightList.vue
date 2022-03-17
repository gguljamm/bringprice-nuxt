<template>
  <li class="flightList">
    <div
      @click="clickOpen()"
    >
      <div class="legs">
        <div
          v-for="(leg, index) in flights"
          :key="index"
        >
          <div>
            <div class="bubbleWrap"
              :style="{backgroundImage: 'url('+leg.carrierImages[0]+')'}"
            ><Bubble :text="leg.carriers[0]" :position="[10, 24]"></Bubble></div>
            <div class="flightInfoLeft">
              <div><span>{{ getTime(leg.departureTime) }}</span> - <span>{{ getTime(leg.arrivalTime, leg.departureTime) }}</span></div>
              <div>{{ format.dateFormat(leg.departureTime) }}</div>
            </div>
            <div class="flightInfoCenter">
              <div><span class="bubbleWrap">
                <Bubble v-if="leg.stops.length > 0" :text="leg.stopsTime" :position="[0, 28]"></Bubble>
                <span :class="filter.stops.includes(1) && filter.stops.includes(2) && leg.stops.length !== 0 ? 'highlight' : ''">{{ leg.stops.length === 0 ? '직항' : `경유 ${leg.stops.length}회` }}</span>
              </span></div>
              <div v-if="leg.stops.length > 0">
                <span
                  class="bubbleWrap"
                  v-for="x in leg.stops"
                  :key="x.code"
                ><Bubble :text="x.name" :position="[0, 10]"></Bubble>{{ x.code }}</span>
              </div>
            </div>
            <div class="flightInfoRight">
              <div>총 {{ format.getDurationString(leg.duration) }}</div>
              <div>
                <span class="bubbleWrap"><Bubble :text="leg.originPlace.name" :position="[0, 10]"></Bubble>{{ leg.originPlace.code }}</span> -
                <span class="bubbleWrap"><Bubble :text="leg.destinationPlace.name" :position="[0, 10]"></Bubble>{{ leg.destinationPlace.code }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="price">
        <div>
          <div
            :class="priceCount ? 'round' : ''"
            @click.stop
            @click="clickOpen('book')"
          >{{ priceCount ? priceCount : `항공권 ${flights.length}개 따로 예약시` }}</div>
          <div>{{ totalPassenger > 1 ? '1인 평균 ' : '' }}<span>{{ price }}</span>원 부터</div>
          <button
            @click.stop
            @click="roundInfo ? clickOpen('book') : outlink()"
          >{{ '최저가 예약하기' }}</button>
        </div>
      </div>
    </div>
    <list-sub
      v-if="open"
      ref="listSub"
      :style="{
        height: subHeight,
        display: subDisplay,
      }"
      :legs="legs"
      :inputData="inputData"
      :roundInfo="roundInfo"
      :multiInfo="multiInfo"
      :flag="flag"
      @change-tab="changeTab"
      @close-tab="clickOpen"
    ></list-sub>
  </li>
</template>

<script>
import format from '~/utils/format'; // eslint-disable-line
import EventBus from '~/utils/eventBus'; // eslint-disable-line
import Bubble from '~/components/common/bubble.vue'; // eslint-disable-line
import ListSub from './list-sub/wrapper.vue';

export default {
  props: ['flights', 'price', 'priceCount', 'filter', 'inputData', 'roundInfo', 'multiInfo'],
  components: {
    ListSub,
    Bubble,
  },
  data() {
    return {
      format,
      open: false,
      subDisplay: 'none',
      subHeight: '0px',
      flag: 'detail',
      timeout: null,
    };
  },
  computed: {
    totalPassenger() {
      return parseInt(this.$route.params.adults, 10) + parseInt(this.$route.params.children, 10) + parseInt(this.$route.params.infants, 10);
    },
    legs() {
      const arr = [];
      for (let x = 0; x < this.flights.length; x += 1) {
        arr.push(this.flights[x].legId);
      }
      return arr;
    },
  },
  methods: {
    changeTab(tab) {
      this.flag = tab;
    },
    clickOpen(flag) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      if (!this.open || flag) {
        EventBus.$emit('select-leg', this.legs, this.price);
        this.open = true;
        if (flag) {
          this.flag = flag;
        } else {
          this.flag = 'detail';
        }
        this.subDisplay = 'block';
        this.subHeight = 'auto';
        this.$nextTick(() => {
          const height = this.$refs.listSub.$el.clientHeight;
          this.subHeight = '0px';
          setTimeout(() => {
            this.subHeight = `${height}px`;
            this.timeout = setTimeout(() => {
              this.subHeight = 'auto';
              this.timeout = null;
            }, 200);
          }, 1);
        });
      } else {
        const height = this.$refs.listSub.$el.clientHeight;
        this.subHeight = `${height}px`;
        setTimeout(() => {
          this.subHeight = '0px';
          this.timeout = setTimeout(() => {
            this.subDisplay = 'none';
            this.timeout = null;
            this.open = false;
          }, 200);
        }, 1);
      }
    },
    outlink() {
      EventBus.$emit('outlink', this.legs, this.price);
    },
    getCarrierName(carriers) {
      const arr = [];
      for (let x = 0; x < carriers.length; x += 1) {
        if (arr.indexOf(carriers[x]) < 0) {
          arr.push(carriers[x]);
        }
      }
      if (arr.length === 1) {
        return arr[0];
      }
      return '여러 항공사';
    },
    getTime(time, arrivalDate) {
      const arrTime = time.split('T')[1].split(':');
      const hour = parseInt(arrTime[0], 10);
      let diff = '';
      if (arrivalDate && arrivalDate.split('T')[0] !== time.split('T')[0]) {
        diff = ` (+${this.format.getBetweenDay(arrivalDate, time)})`;
      }
      return `${hour < 12 ? '오전' : '오후'} ${hour > 12 ? hour - 12 : hour}:${arrTime[1]}${diff}`;
    },
  },
};
</script>

<style lang="scss" scoped>
  .flightList{
    margin-bottom: 10px;
    background-color: #FFF;
    > div:first-of-type{
      position: relative;
      z-index: 1;
      cursor: default;
      border-radius: 2px;
      display: flex;
      width: 100%;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      &:hover{
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
        .legs{
          border-color: #9b9b9b;
        }
        .price{
          border-color: #9b9b9b;
          border-left-color: #e9e9e9;
        }
      }
      .legs{
        border: 1px solid #e9e9e9;
        border-right: 0;
        flex: auto;
        padding-bottom: 20px;
        > div{
          padding: 20px 20px 0;
          > div{
            padding-left: 72px;
            position: relative;
            display: flex;
            > div:first-of-type{
              left: 0;
              width: 48px;
              height: 48px;
              position: absolute;
              top: 50%;
              margin-top: -30px;
              background-position: center center;
              background-repeat: no-repeat;
              background-size: contain;
            }
            div.flightInfoCenter{
              .highlight{
                color: #d0021b;
              }
              > div:nth-of-type(2){
                > span{
                  &:after{
                    content: ', ';
                  }
                  &:last-of-type:after{
                    content: '';
                  }
                }
              }
            }
            div.flightInfoLeft, div.flightInfoRight, div.flightInfoCenter{
              font-size: 16px;
              > div:first-of-type{
                line-height: 24px;
              }
              > div:nth-of-type(2){
                color: #9b9b9b;
                line-height: 20px;
                font-size: 14px;
              }
              &.flightInfoLeft {
                flex: 0 0 40%;
              }
              &.flightInfoCenter{
                flex: 0 0 30%;
              }
              &.flightInfoRight{
                flex: 0 0 30%;
                position: relative;
              }
            }
          }
          &:last-of-type > div{
            border-bottom: 0;
          }
        }
      }
      .price{
        border: 1px solid #e9e9e9;
        border-left: 1px solid #e9e9e9;
        flex: 0 0 258px;
        padding: 14px 20px 14px 0;
        position: relative;
        text-align: right;
        > div{
          position: absolute;
          bottom: 15px;
          right: 20px;
          > div:first-of-type{
            font-size: 12px;
            line-height: 18px;
            color: #9b9b9b;
            font-weight: bold;
            padding-right: 22px;
            position: relative;
            &:after{
              position: absolute;
              right: 0;
              top: 50%;
              margin-top: -9px;
              background-image: url(~assets/img/common/chevron-left.svg);
              width: 18px;
              height: 18px;
              content: '';
              background-size: contain;
              transform: rotate(270deg);
              opacity: .3;
            }
          }
          > div:nth-of-type(2){
            font-size: 16px;
            line-height: 33px;
            height: 33px;
            > span{
              font-size: 22px;
              font-weight: bold;
            }
          }
          > button{
            margin-top: 9px;
            height: 42px;
            border-radius: 2px;
            background-color: $cornflower;
            font-size: 16px;
            color: #FFF;
            width: 216px;
          }
        }
      }
    }
    > div:nth-of-type(2){
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: .2s ease;
      border: 1px solid #e9e9e9;
      border-top: 0;
    }
  }
  .bubbleWrap{
    position: relative;
  }
</style>
