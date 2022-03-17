<template>
  <div id="listWrapper" ref='wrap'>
    <search
      class="listSearch"
      :autoPop="autoPop"
      :searchTypePop="searchTypePop"
      :wishCities="wishCities"
      @open-search-type-pop="searchTypePop = true, openPopFlag = false, ratingListOpen = false"
      @close-search-type-pop="searchTypePop = false"
      @auto-pop-on="autoPop=true, openPopFlag = false, searchTypePop = false, ratingListOpen = false"
      @close-pop="autoPop=false"
    ></search>
    <div
      v-if="$route.params.popFlag2 !== 'detail'"
      class="hotelListTop">
      <hotelListTop
        class="listPageTop"
        :inputData="inputData"
        :listLoading="listLoading"
        :filterActive="filterActive"
        :noListData="noListData"
        :filterData="filterData"
        :openPopFlag="openPopFlag"
        :totalSize="totalSize"
        @open-filter="openFilter"
        @apply-filter="researchFilter"
        @close-filter="openPopFlag = false"
        @getHotelCount="getHotelCount"
      ></hotelListTop>
      <div
        class="progressBar"
        v-if="progress > 0 && progress < 100"
        :class="progress > 0 && progress < 98 ? 'fadeIn' : 'fadeOut'"
        :style="{width: `${progress - 1 }%`}"></div>
    </div>
    <div
      v-if="$route.params.popFlag2 !== 'detail'"
      class="main-wrap">
      <div
        :style="$route.params.popFlag === 'map' ? { width: '50%' } : { width: '70%' }"
        class="hotelList-wrap"
        ref="hotelListWrap"
      >
        <hotelList
          @click.stop
          :key="`${listRender}${$route.params.popFlag === 'map'}${windowWidth}`"
          v-if="!listLoading"
          :style="listRender ? { opacity: 1 } : { opacity: 0 }"
          :hotelList="hotelList"
          :listRender="listRender"
          :scrollTop="scrollTop"
          :isMap="$route.params.popFlag === 'map'"
          :addListLoading="addListLoading"
          :ratingListOpen="ratingListOpen"
          :orderBy="filterData['orderBy']"
          :filterData="filterData"
          :filterActive="filterActive"
          :remainingPercent="remainingPercent"
          :windowWidth="windowWidth"
          @change-width="changeWindowSize"
          @rating-List-Open="ratingListOpen = true, openPopFlag = false, searchTypePop = false, autoPop = false"
          @complete-list-render="listRendering"
          @set-body-scroll="scrollEvent"
          @open-detail="openDetail"
          @apply-filter="researchFilter"
        ></hotelList>
        <hotelListLoading
          v-if="listLoading"
          :mapToggle="$route.params.popFlag === 'map'"
        ></hotelListLoading>
        <div
          v-if="lastPage"
          class="last-page">
          <p class="last-page-title">검색 결과 끝.</p>
          <div class="last-page-info">
            <p>마음에 드는 호텔이 없으신가요?</p>
            <p>필터를 사용해보세요.</p>
          </div>
          <button
            class="last-page-btn"
            @click="openFilter('filter')"
          >정렬 및 필터
          </button>
        </div>
        <div
          v-if="noListData && !listLoading"
          class="resetFilter">
          <p class="reset-title">검색 결과 없음</p>
          <p class="reset-info">
            더 많은 검색 결과를 원하시면 날짜를 바꾸거나 필터를 제거하여 검색 조건을 변경해보세요.
          </p>
          <button
            @click="resetFilter"
            class="reset-btn"
          >필터 초기화
          </button>
        </div>
        <div v-if="!listLoading && totalSize >= 30" class="pagiNation">
          <div>
            <button class="previousPage" @click="pagiNaiton('previous')">이전</button>
            <button @click="pagiNaiton('next')" class="nextPage">다음</button>
            <div class="info">
              검색된 {{totalSize > 300 ? '300+' : `${totalSize}개`}} 중 {{ ((page - 1) * 30) === 0 ? 1 : ((page - 1) * 30) }} ~ {{ (((page - 1) * 30) + hotelList.length) }}
            </div>
          </div>
        </div>
      </div>
      <hotelMap
        class="hotelMap-wrap"
        ref="hotelMap"
        :style="[mapTop, $route.params.popFlag === 'map' ? { width: '50%' } : { width: '30%' }]"
        :filterActive="filterActive"
        :input-data="inputData"
        :noListData="noListData"
        :listLoading="listLoading"
        :geoValue="$store.state.hotelListObj.geoValue"
        :hotelList="hotelList"
        :selectedIndex="selectedIndex"
        :isMap="$route.params.popFlag === 'map'"
        :mapReSearchLoading="mapReSearchLoading"
        @change-selected-index="changeSelectedIndex"
        @change-last-center="changeLastCenter"
        @research-from-map="mapReSearch"
        @open-detail="openDetail"
        @view-map="viewMap"
      />
      <a :href="$store.state.hotelListObj.requireParam"></a>
    </div>
    <hotel-detail
      v-else
      @mountListWrapper="$emit('mountListWrapper')"
    />
  </div>
</template>

<script>
import hotelListTop from './hotelListTop.vue';
import hotelList from './hotelList.vue';
import hotelListLoading from './hotelListLoading.vue';
import hotelFilter from './hotelFilter.vue';
import hotelMap from './hotelMap.vue';
import hotelDetail from '../detail/hotelDetail.vue';
import Search from '~/components/search/web/search.vue'; // eslint-disable-line
import WebCalendar from '~/components/search/web/calendar.vue'; // eslint-disable-line
import WebOption from '~/components/flight/web/option.vue'; // eslint-disable-line

export default {
  props: ['inputData', 'hotelList', 'filterData', 'listLoading', 'addListLoading', 'mapReSearchLoading', 'selectedIndex', 'filterActive', 'noListData', 'lastPage', 'progress', 'page', 'totalSize', 'remainingPercent'],
  components: {
    hotelListTop,
    hotelList,
    hotelListLoading,
    hotelMap,
    hotelFilter,
    hotelDetail,
    Search,
    WebCalendar,
    WebOption,
  },
  data() {
    return {
      listRender: false,
      lastScroll: 0,
      scrollTop: 0,
      detail: false,
      wishCities: [],
      autoPop: false,
      searchTypePop: false,
      mapTop: { top: `${118}px` },
      openPopFlag: false,
      ratingListOpen: false,
      windowWidth: 0,
    };
  },
  methods: {
    getHotelCount(sendParam) {
      this.$emit('getHotelCount', sendParam);
    },
    changeWindowSize() {
      this.windowWidth = window.innerWidth;
    },
    pagiNaiton(key) {
      // console.log(Math.floor(this.totalSize / 30), this.page, this.page > 0);
      if (this.page > 0) {
        if (key === 'next' && Math.floor(this.totalSize / 30) >= this.page) {
          this.listRender = false;
          this.$emit('add-hotel-list');
        }
        if (key === 'previous' && this.page > 1) {
          this.listRender = false;
          this.$emit('previous-hotel-list');
        }
      }
    },
    listRendering() {
      setTimeout(() => {
        // window.scrollTo(0, 0);
        this.listRender = true;
      }, 500);
    },
    closeAutoPop() {
      this.autoPop = false;
      this.openPopFlag = false;
      this.searchTypePop = false;
      this.ratingListOpen = false;
    },
    openDetail(id, index) {
      const hotelId = id;
      this.$store.commit('saveHotelDetail', this.$store.state.hotelListObj.list[index]);
      window.open(`${window.location.href}/detail/${hotelId}`, '_blank');
      // this.$router.push({ params: { filter: 'detail', hotelId }, query: this.$route.query });
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'openDetail',
        eventAction: this.$route.params.popFlag,
        eventLabel: this.hotelList[index].korName,
      });
    },
    scrollEvent() {
      window.addEventListener('scroll', this.bodyScroll);
    },
    back() {
      if (this.$route.params.popFlag2 || this.$route.params.popFlag === 'map') {
        history.back();
      } else {
        // console.log('all clear');
        this.$store.commit('clearHotel');
        history.back();
      }
    },
    viewMap(mapFlag) {
      this.listRender = false;
      if (mapFlag) {
        this.$router.push({ params: { popFlag: 'map' }, query: this.$route.query });
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'openMap',
          eventAction: 'web',
        });
      } else {
        this.$router.push({ params: { popFlag: 'list' }, query: this.$route.query });
      }
    },
    openFilter(type) {
      this.autoPop = false;
      this.ratingListOpen = false;
      this.searchTypePop = false;
      // if (this.listLoading) {
      //   return;
      // }
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'clickFilterHotel',
        eventAction: 'web',
      });
      this.openPopFlag = type;
      // this.$router.push({ params: { filter: flag }, query: this.$route.query });
    },
    researchFilter(filter) {
      this.ratingListOpen = false;
      this.listRender = false;
      this.lastScroll = 0;
      this.$emit('apply-filter', filter);
    },
    resetFilter() {
      this.listRender = false;
      this.$emit('reset-filter');
    },
    changeSelectedIndex(index) {
      this.$emit('change-selected-index', index);
    },
    changeLastCenter(lat, lng) {
      this.$emit('change-last-center', lat, lng);
    },
    mapReSearch(geoVal, loading) {
      this.lastScroll = 0;
      this.$emit('research-from-map', geoVal, loading);
    },
    controlMapPos() {
      const scrollY = (window.pageYOffset || document.documentElement.scrollTop);
      const documentHeight = document.body.scrollHeight;
      if (scrollY < 118) {
        const topVal = 118 - scrollY;
        this.mapTop = { top: `${topVal}px` };
      } else if ((documentHeight - 200) < (scrollY + window.innerHeight)) {
        this.mapTop = { top: '64px', bottom: '200px' };
      } else {
        this.mapTop = { top: '64px' };
      }
    },
    bodyScroll() {
      const scrollY = (window.pageYOffset || document.documentElement.scrollTop);
      this.controlMapPos();
      this.scrollTop = scrollY;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.windowWidth = window.innerWidth;
      if (this.$route.params.popFlag2 !== 'detail') {
        this.$emit('setHotelList');
        this.$emit('mountListWrapper');
        window.addEventListener('scroll', this.bodyScroll);
      }
      window.document.addEventListener('click', this.closeAutoPop);
    });
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.bodyScroll);
    window.removeEventListener('click', this.closeAutoPop);
  },
};
</script>

<style lang="scss" scoped>
  .hotelListTop{
    background-color: #FFF;
    position: relative;
  }
  #listWrapper{
    width: 100%;
    overflow: hidden;
  }
  .main-wrap{
    width: 100%;
    overflow: hidden;
    position: relative;
  }
  .hotelList-wrap{
    width: 100%;
    padding-left: calc(50% - 555px);
    min-height: 90vh;
    padding-top: 10px;
    padding-bottom: 100px;
    .pagiNation{
      display: flex;
      justify-content: center;
      margin-top: 60px;
      button{
        background-color: #fff;
        font-size: 14px;
        color: #585858;
        border: 1px solid #cdcdcd;
        border-radius: 2px;
        position: relative;
        height: 43px;
        &::after, &::before{
          content: '';
          position: absolute;
          top: calc(50% - 10px);
          width: 20px;
          height: 20px;
        }
        &.previousPage{
          padding: 11px 35px 12px 42px;
          &::before{
            left: 19px;
            background-image: url(~assets/img/common/chevron-left.svg);
            background-size: 20px 20px;
            background-repeat: no-repeat;
            background-position: center center;
          }
        }
        &.nextPage{
          padding: 0 42px 0 35px;
          margin-left: 10px;
          &::after{
            right: 19px;
            transform: rotate(180deg);
            background-size: 20px 20px;
            background-repeat: no-repeat;
            background-position: center center;
            background-image: url(~assets/img/common/chevron-left.svg);
          }
        }
      }
      .info{
        font-size: 14px;
        padding-top: 16px;
        text-align: center;
      }
    }
  }
  .hotelFilter-wrap{
    z-index: 13;
    height: 100%;
  }
  .hotelMap-wrap{
    transition: .3s ease;
  }
  .bpWebPop{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 12;
    background-color: rgba(255, 255, 255, 0.7);
    overflow: auto;
    > .bpWebInner{
      width: 800px;
      position: absolute;
      top: 100px;
      bottom: 100px;
      left: 50%;
      margin-left: -400px;
      background-color: #FFF;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid #f1f1f1;
    }
  }
  .last-page, .resetFilter{
    padding-top: 20px;
    padding-right: 20px;
    padding-bottom: 30px;
    width: 100%;
    .last-page-title, .reset-title{
      font-weight: bold;
      font-size: 20px;
    }
    .last-page-info, .reset-info{
      font-size: 14px;
      color: $brown-grey;
      padding-top: 10px;
      padding-right: 20px;
      line-height: 16px;
    }
    .last-page-btn, .reset-btn{
      width: 103px;
      height: 43px;
      line-height: 16px;
      font-size: 14px;
      border: 0;
      background-color: $cornflower;
      color: #fff;
      border-radius: 2px;
      margin-top: 10px;
    }
  }
  .fadeIn{
    opacity: 1;
  }
  .fadeOut{
    opacity: 0;
  }
  .progressBar{
    position: absolute;
    z-index: 4;
    background-color: $dodger-blue;
    height: 2px;
    left: 0;
    bottom: 0;
    border-radius: 1px;
    transition: .5s ease;
  }
</style>
