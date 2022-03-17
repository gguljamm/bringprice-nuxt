<template>
  <div>
    <div class="multiScheduleListWrap" v-if="$route.params.step === 'list'">
      <ul>
        <flight-list-loading v-if="multiInfo.scheduleList.length === 0"></flight-list-loading>
        <li
          v-for="(x, index) in sortedList"
          :key="index"
          v-if="index < multiInfo.scheduleLength"
          @click="x.totalPrice ? submit(x.index) : ''"
        >
          <div class="itinerary">
            <div
              v-for="(city, index) in x.ArrRavelCities"
              :key="index"
            >
              <div class="orderDot" :class="`order${city.City}`">
                <div v-if="index !== 0"><div></div><div></div><div></div></div>
              </div>
              <div>
                <div><span>{{ inputData.wishCities[city.City].PlaceName }},</span> {{ inputData.wishCities[city.City].CountryName }}</div>
                <div>{{ city.Day }}박</div>
              </div>
              <div>
                {{ format.dateDotFormat(x.FlightInfo[`Flight${index}`].OutboundDate) }}.{{ format.getDayOfWeek(x.FlightInfo[`Flight${index}`].OutboundDate) }} -
                {{ format.dateDotFormat(x.FlightInfo[`Flight${index+1}`].OutboundDate) }}.{{ format.getDayOfWeek(x.FlightInfo[`Flight${index+1}`].OutboundDate) }}
              </div>
            </div>
          </div>
          <div class="btnWrap">
            <div v-if="x.loading">{{ totalPassenger > 1 ? '1인 평균' : '' }} 최저가</div>
            <div v-else>최저가 로딩중</div>
            <div v-if="x.totalPrice">
              <span>{{ x.totalPrice }}</span>원 부터
            </div>
            <div v-else><div class="loader"></div></div>
          </div>
        </li>
      </ul>
      <button class="btnMore"
        v-if="multiInfo.scheduleLength < multiInfo.scheduleList.length"
        @click="appendSchedule()"
      >일정 더보기</button>
    </div>
    <multi-flight-select
      v-else-if="$route.params.step === 'select' && this.multiInfo.selectedIndex >= 0"
      :inputData="inputData"
      :multiInfo="multiInfo"
      :filter="filter"
      :sortState="sortState"
      :multiRequestNum="multiRequestNum"
    ></multi-flight-select>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
import EventBus from '~/utils/eventBus'; //eslint-disable-line
import MultiFlightSelect from './multiFlightSelect.vue';
import FlightListLoading from './flightListLoading.vue';

export default {
  props: ['inputData', 'multiInfo', 'filter', 'sortState', 'progress', 'multiRequestNum'],
  components: {
    MultiFlightSelect,
    FlightListLoading,
  },
  data() {
    return {
      format: Format,
    };
  },
  computed: {
    totalPassenger() {
      return parseInt(this.$route.params.adults, 10) + parseInt(this.$route.params.children, 10) + parseInt(this.$route.params.infants, 10);
    },
    sortedList() {
      if (!this.multiInfo.scheduleList || this.multiInfo.scheduleList.length === 0) {
        return [];
      }
      const newList = [];
      for (let x = 0; x < this.multiInfo.scheduleList.length && x < this.multiInfo.scheduleLength; x += 1) {
        const obj = this.multiInfo.scheduleList[x];
        obj.index = x;
        newList.push(obj);
      }
      newList.sort((x, y) => {
        if (x.totalPrice === 0 || y.totalPrice === 0) {
          return false;
        }
        return (parseInt(x.totalPrice.replace(/,/g, ''), 10) - parseInt(y.totalPrice.replace(/,/g, ''), 10));
      });
      return newList;
    },
  },
  methods: {
    submit(index) {
      this.$emit('multi-submit', index);
    },
    totalPassengerNum() {
      return parseInt(this.inputData.adults, 10) + parseInt(this.inputData.children, 10) + parseInt(this.inputData.infants, 10); // eslint-disable-line
    },
    appendSchedule() {
      EventBus.$emit('append-schedule');
    },
  },
};
</script>

<style lang="scss" scoped>
  .multiScheduleListWrap{
    > ul{
      padding: 10px 20px 20px 20px;
      > li{
        list-style: none;
        margin-bottom: 10px;
        padding: 16px 0 0;
        background-color: #FFF;
        border-radius: 6px;
        cursor: pointer;
        &:last-of-type{
          margin-bottom: 0;
        }
        .itinerary{
          padding: 0 10px;
          > div{
            padding: 10px 0;
            overflow-y: auto;
            .orderDot{
              width: 6px;
              height: 6px;
              position: absolute;
              margin-left: 6px;
              margin-top: 4px;
              border-radius: 100%;
              &.order0{
                background-color: #02ccb3;
              }
              &.order1{
                background-color: #c5e675;
              }
              &.order2{
                background-color: #9edebc;
              }
              &.order3{
                background-color: #02b1cc;
              }
              &.order4{
                background-color: #081c75;
              }
              &.order5{
                background-color: #8095ff;
              }
              > div{
                position: absolute;
                left: 2px;
                top: -36px;
                > div{
                  width: 2px;
                  height: 2px;
                  background-color: #e1e1e1;
                  margin-bottom: 10px;
                }
              }
            }
            > div:nth-of-type(2){
              font-size: 14px;
              line-height: 15px;
              overflow-y: auto;
              padding-left: 20px;
              > div:first-of-type{
                float: left;
              }
              > div:nth-of-type(2){
                float: right;
              }
            }
            > div:nth-of-type(3){
              font-size: 12px;
              line-height: 15px;
              color: #9b9b9b;
              margin-top: 2px;
              float: right;
            }
            > div > span{
              font-weight: bold;
            }
            &:first-of-type{
              padding-top: 0;
            }
            &:last-of-type{
              padding-bottom: 12px;
              border-bottom: 1px solid #f8f8f8;
            }
          }
        }
        .btnWrap{
          position: relative;
          width: 100%;
          padding: 6px 10px;
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
          text-align: right;
          > div:first-of-type{
            font-size: 12px;
            color: #9b9b9b;
            line-height: 18px;
          }
          > div:nth-of-type(2){
            font-size: 14px;
            line-height: 28px;
            height: 28px;
            > span{
              font-size: 18px;
              font-weight: bold;
            }
          }
          > div > span{
            font-weight: bold;
          }
          > button{
            background-color: #f8f8f8;
            color: #9b9b9b;
            height: 37px;
            width: 100px;
            font-size: 14px;
            position: absolute;
            right: 10px;
            top: 12px;
            border-radius: 2px;
          }
        }
      }
    }
  }
  .flights{
    padding: 10px 20px 20px 20px;
  }
  .btnMore{
    display: block;
    margin: 0 auto 20px;
    padding: 12px 40px;
    background-color: #FFF;
    color: #9b9b9b;
    font-size: 14px;
    border-radius: 2px;
  }
</style>
