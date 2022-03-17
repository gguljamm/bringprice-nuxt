<template>
  <div class="openSearchWrap">
    <ul>
      <li
        v-for="(x, index) in exceptNoPriceList"
        :key="index"
        :class="{
          isExcept: isExceptCountry(x.info),
          expend: x.open
        }"
      >
        <div
          @click="getCitySubList(x.index)"
        >
          <div :class="x.info.Direct ? 'direct2' : ''"><div>{{ x.info.DestinationPlaceName }}</div></div>
          <div v-if="!x.open">{{ format.numberFormat(x.info.Price) }}원 부터</div>
        </div>
        <div v-if="x.list.length > 0">
          <div
            class="subList"
            v-for="(y, index2) in x.list"
            :key="index2"
            v-if="y.Price > 0 && (filter.stops.length === 0 || (filter.stops.includes(1) && filter.stops.includes(2) && y.Direct))"
            @click="submit(y.Code)"
          >
            <div :class="y.Direct ? 'direct' : ''"><div>{{ y.DestinationPlaceName }}</div></div>
            <div><span>{{ format.numberFormat(y.Price) }}</span>원 부터</div>
          </div>
        </div>
        <div v-else class="loading">
          <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
      </li>
      <flight-list-loading v-if="cityList.length === 0"></flight-list-loading>
      <div v-if="exceptNoPriceList.length === 0"><h3>검색결과가 없습니다.</h3><br>날짜를 변경하여 다시 검색해주세요.</div>
    </ul>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
import FlightListLoading from './flightListLoading.vue';

export default {
  props: ['inputData', 'cityList', 'filter'],
  components: {
    FlightListLoading,
  },
  data() {
    return {
      format: Format,
    };
  },
  computed: {
    exceptNoPriceList() {
      return this.cityList.filter(x => x.info.Price > 0);
    },
  },
  methods: {
    submit(code) {
      this.$router.push(this.$route.fullPath.replace('every', code));
    },
    getCitySubList(index) {
      this.$emit('get-city-sub-list', index);
    },
    isExceptCountry(list) {
      let code = false;
      if (list.DestinationPlaceName === '홍콩') {
        code = 'HKG';
      } else if (list.DestinationPlaceName === '괌') {
        code = 'GUM';
      } else if (list.DestinationPlaceName === '싱가포르') {
        code = 'SIN';
      } else if (list.DestinationPlaceName === '모리셔스') {
        code = 'MRU';
      }
      return code;
    },
  },
};
</script>

<style lang="scss" scoped>
  .openSearchWrap > ul > li.expend > div:first-of-type > div:first-of-type.direct2 > div:after{
    display: none;
  }
  .openSearchWrap{
    > ul{
      padding: 20px 16px;
      list-style: none;
      > li{
        background-color: #FFF;
        width: 100%;
        margin-bottom: 10px;
        color: #4a4a4a;
        font-size: 16px;
        position: relative;
        &:last-of-type{
          margin-bottom: 0;
        }
        &:after{
          content: '';
          width: 18px;
          height: 18px;
          position: absolute;
          background-image: url(~assets/img/common/chevron-left.svg);
          right: 12px;
          top: 20px;
          transform: rotate(270deg);
          background-position: center center;
          pointer-events: none;
        }
        &.expend:after{
          transform: rotate(90deg);
        }
        &.isExcept:after{
          display: none;
        }
        &.isExcept > div:first-of-type > div:nth-of-type(2) {
          margin-right: 0;
        }
        /*&.isExcept > div:first-of-type > div:nth-of-type(2) {*/
          /*margin-right: 12px;*/
        /*}*/
        > div:first-of-type{
          height: 58px;
          cursor: pointer;
          color: #4a4a4a;
          padding: 0 12px;
          > div:first-of-type{
            font-size: 0;
            float: left;
            transform: translateY(-50%);
            top: 50%;
            position: relative;
            > div{
              font-size: 16px;
            }
            &.direct2 > div:after{
              content: '직항';
              color: #9b9b9b;
              font-size: 12px;
              display: block;
            }
          }
          > div:nth-of-type(2){
            float: right;
            margin-right: 36px;
            font-size: 14px;
            font-weight: bold;
            transform: translateY(-50%);
            top: 50%;
            position: relative;
          }
        }
        &.expend > div:first-of-type{
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
          border-radius: 2px;
        }
        > div:nth-of-type(2){
          display: none;
          > div:first-of-type > div:nth-of-type(2){
            color: $rosy-pink;
          }
          .subList{
            overflow: hidden;
            border-bottom: 1px solid #f8f8f8;
            position: relative;
            height: 60px;
            padding: 0 12px;
            width: 100%;
            cursor: pointer;
            > div:first-of-type{
              font-size: 0;
              float: left;
              transform: translateY(-50%);
              top: 50%;
              position: relative;
              > div{
                font-size: 14px;
                display: inline-block;
              }
              &.direct > div:after{
                content: '직항';
                color: #9b9b9b;
                font-size: 12px;
                display: block;
              }
            }
            > div:nth-of-type(2){
              float: right;
              font-size: 14px;
              color: #4a4a4a;
              transform: translateY(-50%);
              top: 50%;
              position: relative;
              > span{
                font-size: 14px;
                font-weight: bold;
              }
            }
            > button{
              position: absolute;
              right: 12px;
              top: 14px;
              background-color: $cornflower;
              color: #FFF;
              height: 32px;
              width: 58px;
              line-height: 32px;
              border-radius: 2px;
              font-size: 12px;
              font-weight: bold;
            }
          }
        }
        &.expend > div:nth-of-type(2){
          display: block;
        }
      }
    }
    .loading{
      padding: 10px 12px;
      text-align: center;
      font-size: 0;
    }
  }
</style>
