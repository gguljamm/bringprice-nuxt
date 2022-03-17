<template>
  <div>
    <div class="multiScheduleListWrap" v-if="$route.params.step === 'list'">
      <ul>
        <flight-list-loading
          v-if="multiInfo.scheduleList.length === 0"
        ></flight-list-loading>
        <li
          v-for="(x, index) in sortedList"
          :key="index"
          v-if="index < multiInfo.scheduleLength"
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
            <div>{{ totalPassenger > 1 ? '1인 평균' : '' }} 최저가</div>
            <div v-if="x.totalPrice">
              <span>{{ x.totalPrice }}</span>원 부터
            </div>
            <div v-else>&nbsp;</div>
            <button
              class="active"
              v-if="x.totalPrice"
              @click="submit(x.index)"
            >일정선택</button>
            <button
              class="loading"
              v-else
            >로딩중</button>
          </div>
        </li>
      </ul>
      <button class="btnMore"
        v-if="multiInfo.scheduleLength < multiInfo.scheduleList.length"
        @click="appendSchedule()"
      >일정 더보기</button>
    </div>
    <multi-flight-select
      v-else-if="$route.params.step === 'select' && multiInfo.selectedIndex >= 0"
      :inputData="inputData"
      :multiInfo="multiInfo"
      :filter="filter"
      :sortState="sortState"
      :priceAlertFlag="priceAlertFlag"
      :multiRequestNum="multiRequestNum"
      @reset-filter="$emit('reset-filter')"
    ></multi-flight-select>
  </div>
</template>

<script>
import MultiFlightSelect from './multiFlightSelect.vue';
import FlightListLoading from './flightListLoading.vue';
import Format from '~/utils/format'; // eslint-disable-line
import EventBus from '~/utils/eventBus'; //eslint-disable-line

export default {
  props: ['inputData', 'multiInfo', 'filter', 'sortState', 'progress', 'priceAlertFlag', 'multiRequestNum'],
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
    appendSchedule() {
      EventBus.$emit('append-schedule');
    },
    submit(index) {
      this.$emit('multi-submit', index);
    },
    totalPassengerNum() {
      return parseInt(this.inputData.adults, 10) + parseInt(this.inputData.children, 10) + parseInt(this.inputData.infants, 10); // eslint-disable-line
    },
  },
  mounted() {
    if (this.$route.params.step === 'select' && this.multiInfo.selectedIndex === -1) {
      this.$router.replace({
        params: {
          step: 'list',
        },
      });
    }
  },
};
</script>

<style scoped lang="scss">
  .multiScheduleListWrap{
    > ul{
      > li{
        list-style: none;
        margin-bottom: 10px;
        padding: 16px 0 0;
        background-color: #FFF;
        border-radius: 6px;
        display: table;
        width: 100%;
        &:last-of-type{
          margin-bottom: 0;
        }
        .itinerary{
          padding: 0 10px;
          width: 70%;
          display: table-cell;
          vertical-align: top;
          > div{
            padding: 10px 0;
            overflow-y: hidden;
            .orderDot{
              width: 6px;
              height: 6px;
              position: absolute;
              margin-left: 6px;
              margin-top: 6px;
              border-radius: 100%;
              &.order0{
                background-color: #8095ff;
              }
              &.order1{
                background-color: #35ae6e;
              }
              &.order2{
                background-color: #6bdcbe;
              }
              &.order3{
                background-color: #3f4d9c;
              }
              &.order4{
                background-color: #9ddc75;
              }
              &.order5{
                background-color: #074840;
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
              font-size: 16px;
              line-height: 20px;
              overflow-y: hidden;
              padding-left: 20px;
              > div:first-of-type{
                float: left;
              }
              > div:nth-of-type(2){
                float: right;
              }
            }
            > div:nth-of-type(3){
              font-size: 14px;
              line-height: 16px;
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
            }
          }
        }
        .btnWrap{
          position: relative;
          width: 30%;
          display: table-cell;
          vertical-align: bottom;
          padding: 0 20px 12px;
          text-align: right;
          > div:first-of-type{
            font-size: 12px;
            color: #9b9b9b;
            line-height: 15px;
          }
          > div:nth-of-type(2){
            margin-top: 2px;
            font-size: 14px;
            height: 21px;
            line-height: 21px;
            > span{
              font-size: 18px;
              font-weight: bold;
            }
          }
          > div > span{
            font-weight: bold;
          }
          > button{
            border: 1px solid $cornflower;
            background-color: #FFF;
            color: $cornflower;
            height: 53px;
            font-size: 16px;
            width: 100%;
            border-radius: 2px;
            margin-top: 10px;
            transition: .3s ease;
            &.active:hover{
              background-color: $cornflower;
              color: #FFF;
            }
            &.loading{
              color: #9b9b9b;
              background-color: #f8f8f8;
              border: #f8f8f8;
            }
          }
        }
      }
    }
  }
  .btnMore{
    display: block;
    margin: 40px auto 20px;
    padding: 12px 40px;
    background-color: #FFF;
    border-radius: 2px;
    color: #9b9b9b;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
  }
</style>
