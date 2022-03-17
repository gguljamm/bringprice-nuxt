<template>
  <li class="flightList"
    @click="submit()"
  >
    <div class="legs">
      <div
        v-for="(leg, index) in flights"
        :key="index"
      >
        <div>
          <div
            :style="{backgroundImage: 'url('+leg.carrierImages[0]+')'}"
          ></div>
          <div class="flightInfoLeft">
            <div><span>{{ getTime(leg.departureTime) }}</span> - <span>{{ getTime(leg.arrivalTime, leg.departureTime) }}</span></div>
            <div>
              <span>{{ format.dateFormat(leg.departureTime) }}</span>
              <span>{{ getCarrierName(leg.carriers) }}</span>
              <span>{{ leg.originPlace }} - {{ leg.destinationPlace }}</span>
            </div>
          </div>
          <div class="flightInfoRight">
            <div>
              <div>총 {{ format.getDurationString(leg.duration) }}</div>
              <div
                :class="filter.stops.includes(1) && filter.stops.includes(2) && leg.stops.length !== 0 ? 'highlight' : ''"
              >{{ leg.stops.length === 0 ? '직항' : `경유 ${leg.stops.length}회` }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="price">
      <div>{{ priceCount ? `총 ${priceCount}개 중 최저가` : '각 구간별 별도 결제시' }}</div>
      <div>{{ totalPassenger > 1 ? '1인 평균' : '' }} <span>{{ price }}</span>원 부터</div>
      <!--<button-->
        <!--@click="submit()"-->
      <!--&gt;상세정보 확인</button>-->
    </div>
  </li>
</template>

<script>
import format from '~/utils/format'; // eslint-disable-line
import EventBus from '~/utils/eventBus'; // eslint-disable-line

export default {
  props: ['flights', 'price', 'priceCount', 'links', 'filter'],
  data() {
    return {
      format,
    };
  },
  computed: {
    totalPassenger() {
      return parseInt(this.$route.params.adults, 10) + parseInt(this.$route.params.children, 10) + parseInt(this.$route.params.infants, 10);
    },
  },
  methods: {
    submit() {
      const legId = [];
      for (let x = 0; x < this.flights.length; x += 1) {
        legId.push(this.flights[x].legId);
      }
      EventBus.$emit('select-leg', legId, this.price);
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
    background-color: #FFF;
    margin-bottom: 10px;
    border-radius: 6px;
    cursor: pointer;
    .legs{
      padding: 2px 0;
      > div{
        padding: 10px 10px 0;
        > div{
          border-bottom: 1px solid #f8f8f8;
          padding-bottom: 10px;
          padding-left: 40px;
          position: relative;
          display: flex;
          > div:first-of-type{
            left: 0;
            width: 30px;
            height: 30px;
            position: absolute;
            top: 50%;
            margin-top: -20px;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: contain;
          }
          div.flightInfoLeft, div.flightInfoRight{
            flex: auto;
            font-size: 12px;
            &.flightInfoLeft {
              > div:first-of-type {
                /*font-weight: bold;*/
                > span{
                  color: #4a4a4a;
                  font-size: 14px;
                }
              }
              > div:nth-of-type(2) {
                margin-top: 2px;
                font-size: 0;
                span {
                  font-size: 12px;
                  display: inline-block;
                  color: #9b9b9b;
                  line-height: 15px;
                  &:after {
                    content: '|';
                    margin-right: 4px;
                    margin-left: 4px;
                  }
                  &:last-of-type:after {
                    content: '';
                    margin-right: 0;
                    margin-left: 0;
                  }
                }
              }
            }
            &.flightInfoRight{
              flex: 0 0 80px;
              text-align: right;
              position: relative;
              > div{
                top: 50%;
                position: relative;
                transform: translateY(-50%);
                > div:first-of-type{}
                > div:nth-of-type(2){
                  margin-top: 3px;
                  color: #9b9b9b;
                  &.highlight{
                    color: #d0021b;
                  }
                }
              }
            }
          }
        }
        &:last-of-type > div{
          border-bottom: 0;
        }
      }
    }
    .price{
      padding: 6px 10px 6px;
      position: relative;
      text-align: right;
      border-top: 1px solid #f8f8f8;
      > div:first-of-type{
        font-size: 10px;
        font-weight: bold;
        line-height: 15px;
        color: #9b9b9b;
        > span{
          font-weight: bold;
        }
      }
      > div:nth-of-type(2){
        font-size: 14px;
        line-height: 24px;
        > span{
          font-size: 18px;
          font-weight: bold;
        }
      }
      > button{
        height: 38px;
        border-radius: 2px;
        width: 109px;
        background-color: #f8f8f8;
        font-size: 14px;
        color: #9b9b9b;
        position: absolute;
        right: 10px;
        bottom: 10px;
      }
    }
  }
</style>
