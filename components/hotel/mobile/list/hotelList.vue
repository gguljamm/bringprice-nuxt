<template>
  <div id="hotelList">
    <div
      :style="noListData ? { paddingTop: '153px' } : ''"
      class="hotelList-section"
      ref="hotelListSection"
    >
      <div class="info">
        <div class="ratingBtn-wrap" @click.stop="$emit('rating-List-Open')">
          <div class="ratingBtn">{{ orderByText(orderBy) }}</div>
        </div>
        <p v-if="totalSize > 0" class="totalCount">검색된 숙소 총 <span class="num">{{totalSize > 300 ? '300+' : `${totalSize}개`}}</span></p>
      </div>
      <div class="contents">
        <ul v-if="hotelList.length > 0">
          <waterfall
            v-if="isShowWaterfall"
            :scrollTop="scrollTop"
            :containerHeight="containerHeight"
            :containerWidth="containerWidth"
            :waterfallState="$store.state.waterfallState"
            :itemPadding="0"
            :startGrid="1"
            :list="hotelList"
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
              @open-detail='openDetail'
            />
          </waterfall>
        </ul>
      </div>
    </div>
    <div
      v-if="lastPage"
      class="last-page">
        <p class="last-page-title">검색 결과 끝.</p>
        <div class="last-page-info">
          <p>마음에 드는 호텔이 없으신가요?</p>
          <p>필터를 사용해보세요.</p>
        </div>
        <button
          @click="$emit('open-filter')"
          class="last-page-btn"
        >정렬 및 필터</button>
    </div>
    <div class="bpPop" :style="ratingListOpen ? { display: 'block' } : { display: 'none' }" @click="$emit('rating-List-Close')">
      <transition name="slide-bottom-fade" mode="out-in">
        <div
          v-if="ratingListOpen"
          @click.stop
          class="ratingList">
          <ul>
            <li @click="researchOrderBy({ key: 'orderBy', val: 'WEIGHT_DESC' })" :class="orderBy === 'WEIGHT_DESC' ? 'active' : ''">추천순</li>
            <li @click="researchOrderBy({ key: 'orderBy', val: 'RATING_DESC' })" :class="orderBy === 'RATING_DESC' ? 'active' : ''">인기순</li>
            <li @click="researchOrderBy({ key: 'orderBy', val: 'PRICE_ASC' })" :class="orderBy === 'PRICE_ASC' ? 'active' : ''">최저가순</li>
            <li @click="researchOrderBy({ key: 'orderBy', val: 'STAR_DESC' })" :class="orderBy === 'STAR_DESC' ? 'active' : ''">성급 순</li>
            <li @click="$emit('rating-List-Close')">취소</li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>

import swiperSlide from './swiperSlide.vue';
import Item from './waterfallList.vue';
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['hotelList', 'listLoading', 'lastScroll', 'lastPage', 'noListData', 'addListLoading', 'orderBy', 'filterActive', 'filterData', 'ratingListOpen', 'totalSize'],
  components: {
    swiperSlide,
    Item,
  },
  data() {
    return {
      scrollTop: 0,
      format: Format,
      isShowWaterfall: false,
      // waterfallState: null,
      containerHeight: 0,
      containerWidth: 0,
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
    openDetail(id, index) {
      this.$emit('open-detail', id, index);
    },
    bodyScroll() {
      const scrollY = (window.pageYOffset || document.documentElement.scrollTop);
      const documentHeight = document.body.scrollHeight;
      this.scrollTop = scrollY;
      if (this.noListData) {
        return;
      }
      if (!this.listLoading && !this.addListLoading && !this.lastPage) {
        if (documentHeight <= (scrollY + window.innerHeight) + 100) {
          this.$emit('add-hotel-list');
        }
      }
    },
  },
  mounted() {
    this.isShowWaterfall = true;
    this.containerWidth = window.innerWidth - 40;
    this.containerHeight = document.body.scrollHeight;
    window.addEventListener('scroll', this.bodyScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.bodyScroll);
    this.$store.commit('saveWaterfallState', this.$refs.waterfall && this.$refs.waterfall.state ? this.$refs.waterfall.state : null);
  },
};
</script>
<style lang="scss" scoped>
  #hotelList{
    width: 100%;
    // overflow: hidden;
  }
  #hotelList .hotelList-section{
    width: 100%;
    background: #f8f8f8;
    padding-top: 147px;
    .info {
      padding-left: 20px;

      .totalCount {
        color: #868686;
        font-size: 10px;
        .num {
          color: #000;
          font-weight: bold;
        }
      }

      .ratingBtn-wrap {
        margin-top: 20px;
        .ratingBtn {
          float: left;
          height: 33px;
          line-height: 33px;
          color: #585858;
          padding: 0 32px 0 0;
          border-radius: 16.5px;
          font-size: 16px;
          font-weight: bold;
          transition: .3s ease;
          position: relative;

          &::after {
            right: 12px;
            transition: .3s ease;
            position: absolute;
            top: calc(50% - 2.5px);
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

        &::after {
          content: '';
          clear: both;
          display: block;
        }
      }
    }
  }
  .hotelList-section .contents{
    width: 100%;
  }
  .hotelList-section ul{
    display: flex;
    justify-content: center;
    padding-top: 10px;
  }
  .last-page{
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    width: 100%;
    .last-page-title{
      font-weight: bold;
      font-size: 20px;
    }
    .last-page-info{
      font-size: 12px;
      color: $brown-grey;
      padding-top: 10px;
      padding-right: 20px;
      line-height: 16px;
    }
    .last-page-btn{
      width: 81px;
      height: 33px;
      line-height: 16px;
      font-size: 12px;
      border: 0;
      background-color: $cornflower;
      color: #fff;
      border-radius: 2px;
      margin-top: 10px;
    }
  }
  .ratingList{
    width: 100%;
    position: absolute;
    bottom: 20px;
    padding: 0 10px;
    ul {
      border-radius: 10px;
      overflow: hidden;
      li {
        width: 100%;
        background-color: #fff;
        text-align: center;
        font-size: 16px;
        border-bottom: 1px solid #e9e9e9;
        cursor: pointer;
        padding: 20px 0 18px 0;
        &:nth-child(4){
          border-bottom-right-radius: 10px;
          border-bottom-left-radius: 10px;
        }
        &:last-child {
          border-top-right-radius: 10px;
          border-top-left-radius: 10px;
          margin-top: 10px;
          border-bottom: 0;
          color: #868686;
        }
        &.active{
          color: $dodger-blue;
          font-weight: bold;
        }
      }
    }
  }
  .bpPop{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 12;
    background-color: rgba(0, 0, 0, .3);
  }
</style>
