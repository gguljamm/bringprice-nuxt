<template>
  <!--<transition name="fade">-->
  <div
    v-if="init && hotelList.length > 0"
    class="hotelList"
    ref="hotelList"
  >
    <div class="list-info-wrap">
      <div class="list-info">
        <p class="title">추천하는 숙박 시설</p>
        <p class="subTitle">브링프라이스는 예산에 맞는 숙박 시설을 찾아 드리고 있어요.</p>
      </div>
      <div
        @click.stop
        class="ratingBtn-wrap">
        <div
          @click="$emit('rating-List-Open')"
          class="ratingBtn">{{ orderByText(orderBy) }}</div>
        <div
          v-if="ratingListOpen"
          class="ratingList">
          <ul>
            <li class="list-top">정렬기준</li>
            <li @click="researchOrderBy({ key: 'orderBy', val: 'WEIGHT_DESC' })">추천순</li>
            <li @click="researchOrderBy({ key: 'orderBy', val: 'RATING_DESC' })">인기순</li>
            <li @click="researchOrderBy({ key: 'orderBy', val: 'PRICE_ASC' })">최저가순</li>
            <li @click="researchOrderBy({ key: 'orderBy', val: 'STAR_DESC' })">성급높은순</li>
          </ul>
        </div>
      </div>
    </div>
    <div
      v-if="remainingPercent && remainingPercent > 0 && !filterData['filter.isBookableHotel']"
      class="remainingPercent"
    >서두르세요! 여행하시려는 날짜와 숙박 인원에 대해 숙소의 <span class="num">{{100 - remainingPercent}}%</span>가 이미 예약되었습니다.</div>
    <div class="contents">
      <ul>
        <waterfall
          v-if="isShowWaterfall"
          :scrollTop="scrollTop"
          :containerHeight="containerHeight"
          :containerWidth="containerWidth"
          :waterfallState="$store.state.waterfallState"
          :itemPadding="0"
          :startGrid="1"
          :list="hotelList"
          :windowWidth="windowWidth"
          ref="waterfall"
        >
          <component
            slot="cell"
            slot-scope="props"
            :is="'item'"
            :index="props.index"
            :item="props.item"
            :itemSpaceBottom="1"
            :hotelList="hotelList"
            :isMap="isMap"
            @open-detail='openDetail'
          />
        </waterfall>
        <!--<loadingAni-->
          <!--v-if="addListLoading"-->
          <!--class="loading"-->
        <!--/>-->
      </ul>
    </div>
  </div>
  <!--</transition>-->
</template>

<script>
import Item from './waterfallList.vue';
import loadingAni from '../../mobile/list/loading.vue';
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['hotelList', 'scrollTop', 'addListLoading', 'isMap', 'ratingListOpen', 'orderBy', 'filterData', 'filterActive', 'remainingPercent', 'listRender', 'windowWidth'],
  components: {
    loadingAni,
    Item,
  },
  data() {
    return {
      format: Format,
      isShowWaterfall: false,
      changeWindow: 0,
      // waterfallState: null,
      containerHeight: 0,
      containerWidth: 0,
      init: false,
      resizeTimeOut: '',
    };
  },
  methods: {
    researchOrderBy(filter) {
      const obj = {};
      if (this.filterActive) {
        Object.keys(this.filterData).forEach((globalKey) => {
          obj[globalKey] = this.filterData[globalKey];
        });
      }
      obj[filter.key] = filter.val;
      // console.log(obj);
      this.$emit('apply-filter', obj);
    },
    openDetail(id, index) {
      this.$emit('open-detail', id, index);
    },
    handleResize() {
      if (this.resizeTimeOut) {
        clearTimeout(this.resizeTimeOut);
      }
      this.resizeTimeOut = setTimeout(() => {
        this.changeWindow = window.innerWidth;
        if (this.windowWidth !== this.changeWindow) {
          this.$emit('change-width');
        }
        this.getContainerWidth();
        this.resizeTimeOut = '';
      }, 500);
    },
    getContainerWidth() {
      // window 50% or 70% - (hotel list에 left 여백 값 - map과 list 간 여백)
      this.containerWidth = ((((this.windowWidth ? this.windowWidth : window.innerWidth) / 100) * (this.isMap ? 50 : 70)) - ((((this.windowWidth ? this.windowWidth : window.innerWidth) / 100) * 50) - 555));
    },
    orderByText(code) {
      let returnVal = '';
      switch (code) {
        case 'WEIGHT_DESC' :
          returnVal = '추천순';
          break;
        case 'RATING_DESC' :
          returnVal = '인기순';
          break;
        case 'PRICE_ASC' :
          returnVal = '최저가순';
          break;
        case 'STAR_DESC' :
          returnVal = '성급순';
          break;
        default :
          returnVal = '추천순';
          break;
      }
      return returnVal;
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.$store.state.waterfallState = null;
    this.isShowWaterfall = true;
    this.getContainerWidth();
    this.containerHeight = window.innerHeight;
    this.$emit('set-body-scroll');
    this.$nextTick(() => {
      this.$emit('complete-list-render');
      this.init = true;
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>

<style lang="scss" scoped>
  .hotelList {
    width: 100%;
    margin-top: 20px;
    transition: .3s ease;
    .list-info-wrap{
      position: relative;
      transition: .3s ease;
      &::after{
        content: '';
        clear: both;
        display: block;
      }
      > div {
        &::after{
          content: '';
          clear: both;
          display: block;
        }
      }
      .list-info{
        float: left;
        .title{
          font-size: 22px;
          color: #000;
        }
        .subTitle{
          padding-top: 8px;
          font-size: 14px;
          line-height: 17px;
          color: #7f7f7f;
        }
      }
      .ratingBtn-wrap{
        float: right;
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 2;
        cursor: pointer;
        .ratingBtn {
          color: #585858;
          padding: 8px 32px 8px 14px;
          border-radius: 16.5px;
          font-size: 14px;
          transition: .3s ease;
          margin-bottom: -8px;
          &::after{
            right: 12px;
          }
        }
        .ratingList {
          width: 136px;
          border-radius: 10px;
          box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
          border: solid 1px #cdcdcd;
          background-color: #fff;
          position: absolute;
          left: calc(50% - 68px);
          top: -33px;
          li{
            position: relative;
            transition: 0.3s ease;
            width: 100%;
            text-align: center;
            line-height: 38px;
            font-size: 16px;
            font-weight: 500;
            color: #000;
            background-color: #fff;
            cursor: pointer;
            &.list-top{
              cursor: default;
            }
            &:not(&:first-of-type) {
              border: 1px solid #f2f2f2;
            }
            &:first-of-type{
              text-align: left;
              padding-left: 28px;
              height: 41px;
              line-height: 41px;
              border-top-left-radius: 10px;
              border-top-right-radius: 10px;
              &::after {
                right: 23px;
              }
            }
            &:last-of-type{
              border-bottom-left-radius: 10px;
              border-bottom-right-radius: 10px;
            }
            &:not(.list-top):hover{
              background-color: #f2f2f2;
            }
          }
        }
        .ratingList li:first-of-type, .ratingBtn {
          &::after {
            transition: .3s ease;
            position: absolute;
            top: 50%;
            content: '';
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid #000;
            opacity: 0.7;
            clear: both;
          }
        }
      }
    }
    .remainingPercent{
      width: 100%;
      height: 53px;
      margin-top: 18px;
      padding: 18px 20px;
      background-color: #fff;
      border-radius: 4px;
      border: solid 1px #f2f2f2;
      font-size: 14px;
      .num{
        color: #ff6c6c;
        font-weight: bold;
      }
    }
    .contents {
      width: 100%;
      position: relative;
      margin-top: 10px;
    }

    .loading {
      margin: 30px auto 0 auto;
      display: flex;
      justify-content: center;
      z-index: 15;
    }
  }
</style>
