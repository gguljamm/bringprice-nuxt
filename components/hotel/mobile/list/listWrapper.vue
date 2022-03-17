<template>
  <div
    id="hotelList-wrap"
    ref='wrap'
    @click="ratingListOpen = false"
  >
    <div class="listPageTop">
      <div class="top-control">
        <div
          class="contents">
          <div
            class="chevron-left"
            @click="back"
          ></div>
          <span
            class="title"
          >{{ inputData.city.name }}</span>
          <div class="top-control-right-wrap">
            <span
              class="filterPopIcon"
              :class="filterActive ? 'active' : ''"
              @click="openFilter">필터</span>
          </div>
        </div>
      </div>
      <hotelListTop
        :inputData="inputData"
        :listLoading="listLoading"
        :filterActive="filterActive"
        :noListData="noListData"
        :filterData="filterData"
        :progress="progress"
        @view-map="viewMap"
        @open-filter="openFilter"
        @apply-filter="researchFilter"
      />
    </div>
    <div class="hotelList-wrap">
<!--      <div style="padding: 20px; background-color: #FFF; border-radius: 10px; padding-top: 167px; font-size: 14px;">호텔 검색 서비스에 잠시 문제가 생겨 수정 중에 있습니다.<br>최대한 빠르게 정상화하겠습니다. 감사합니다.</div>-->
      <hotelList
        v-if="!listLoading"
        :hotelList="hotelList"
        :listLoading="listLoading"
        :lastScroll="lastScroll"
        :lastPage="lastPage"
        :addListLoading="addListLoading"
        :noListData="noListData"
        :orderBy="filterData['orderBy']"
        :filterActive="filterActive"
        :filterData="filterData"
        :ratingListOpen="ratingListOpen"
        :totalSize="totalSize"
        @last-scroll-change="lastScrollChange"
        @add-hotel-list="addHotelList"
        @open-detail="openDetail"
        @open-filter="openFilter"
        @rating-List-Open="ratingListOpen = true"
        @rating-List-Close="ratingListOpen = false"
        @apply-filter="researchFilter"
      />
      <hotelListLoading
        v-else
      />
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
        >필터 초기화</button>
      </div>
    </div>
    <div v-if="!listLoading && !addListLoading" class="viewMap" @click="viewMap"><div class="icon-map"></div><span>지도로 찾기</span></div>
    <transition name="slide-bottom-fade" mode="out-in">
      <hotelFilter
        v-if="$route.params.popFlag2 === 'filter'"
        class="filterComponent"
        ref="filterComponent"
        :listLoading="listLoading"
        :filterData="filterData"
        @apply-filter="researchFilter"
        @back="back"
      />
    </transition>
    <transition name="slide-bottom-fade" mode="out-in">
      <hotelMap
        v-if="$route.params.popFlag === 'map' && $route.params.popFlag !== 'filter'"
        :filterActive="filterActive"
        :input-data="inputData"
        :noListData="noListData"
        :listLoading="listLoading"
        :geoValue="$store.state.hotelListObj.geoValue || { center: { lat: inputData.city.latitude, lng: inputData.city.longitude } }"
        :hotelList="hotelList"
        :selectedIndex="selectedIndex"
        :mapReSearchLoading="mapReSearchLoading"
        :filterData="filterData"
        @view-map="viewMap"
        @open-filter="openFilter"
        @change-selected-index="changeSelectedIndex"
        @change-last-center="changeLastCenter"
        @research-from-map="mapReSearch"
        @open-detail="openDetail"
        @back="back"
        @apply-filter="researchFilter"
      />
    </transition>
    <transition name="slide-bottom-fade" mode="out-in">
      <div class="bpPop forIos" v-if="$route.params.popFlag2 === 'date'">
        <calendar></calendar>
      </div>
      <div class="bpPop" v-else-if="$route.params.popFlag2 === 'detail' && $route.params.hotelId">
        <hotel-detail
          :inputData="inputData"
          :hotelDetail="$store.state.hotelDetailObj.list"
        ></hotel-detail>
      </div>
    </transition>
    <div class="bpPop" v-if="$route.params.popFlag2 === 'option'">
      <Option v-if="$route.params.popFlag2 === 'option'"></Option>
    </div>
    <loadingAni
      v-if="listLoading || addListLoading"
      class="loading"
    />
  </div>
</template>

<script>
import hotelList from './hotelList.vue';
import hotelMap from './hotelMap.vue';
import hotelFilter from './hotelFilter.vue';
import hotelListTop from './hotelListTop.vue';
import hotelListLoading from './hotelListLoading.vue';
import loadingAni from './loading.vue';
import Format from '~/utils/format'; // eslint-disable-line
import Option from '~/components/flight/mobile/option.vue'; // eslint-disable-line
import Calendar from '~/components/search/mobile/calendar'; // eslint-disable-line
import HotelDetail from '~/components/hotel/mobile/detail/detailWrapper'; // eslint-disable-line

export default {
  props: ['inputData', 'hotelList', 'filterData', 'listLoading', 'addListLoading', 'mapReSearchLoading', 'selectedIndex', 'filterActive', 'noListData', 'lastPage', 'progress', 'totalSize'],
  components: {
    hotelList,
    hotelListLoading,
    loadingAni,
    hotelMap,
    hotelFilter,
    hotelListTop,
    Calendar,
    Option,
    HotelDetail,
  },
  data() {
    return {
      format: Format,
      lastScroll: 0,
      ratingListOpen: false,
    };
  },
  methods: {
    viewMap() {
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'openMap',
        eventAction: 'mobile',
      });
      this.$router.push({ params: { popFlag: 'map' }, query: this.$route.query });
    },
    openFilter() {
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'clickFilterHotel',
        eventAction: 'mobile',
      });
      this.$router.push({ params: { popFlag2: 'filter' }, query: this.$route.query });
    },
    lastScrollChange(val) {
      this.lastScroll = val;
    },
    openDetail(id, index) {
      // console.log('asdasd');
      const hotelId = id;
      this.$store.commit('saveHotelDetail', this.$store.state.hotelListObj.list[index]);
      this.$router.push({ params: { popFlag2: 'detail', hotelId }, query: this.$route.query });
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'openDetail',
        eventAction: this.$route.params.popFlag,
        eventLabel: this.hotelList[index].korName,
      });
    },
    resetFilter() {
      this.$emit('reset-filter');
    },
    addHotelList() {
      this.$emit('add-hotel-list');
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
    researchFilter(filter) {
      this.lastScroll = 0;
      this.ratingListOpen = false;
      this.$emit('apply-filter', filter);
    },
    back() {
      history.back();
    },
  },
  mounted() {
    this.$emit('mountListWrapper');
  },
};
</script>

<style lang="scss" scoped>
  #hotelList-wrap{
    width: 100%;
    min-height: 100vh;
    position: relative;
    background: #f8f8f8;
    padding-bottom: 51px;
  }
  .resetFilter{
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    width: 100%;
    .reset-title{
      font-weight: bold;
      font-size: 20px;
    }
    .reset-info{
      font-size: 12px;
      line-height: 16px;
      color: $brown-grey;
      padding-top: 10px;
      padding-right: 15px;
    }
    .reset-btn{
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
  .listPageTop{
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
    width: 100%;
    top: 0;
    position: fixed;
    z-index: 10;
  }
  .hotelList-wrap{
    padding-bottom: 30px;
  }
  .viewMap{
    width: 103px;
    height: 37px;
    font-size: 12px;
    border-radius: 16.5px;
    background-color: #fff;
    text-align: center;
    padding-left: 20px;
    line-height: 37px;
    position: fixed;
    bottom: 80px;
    left: calc(50% - 51.5px);
    transition: .3s ease;
    font-weight: bold;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
    z-index: 11;
    .icon-map{
      width: 14px;
      height: 12px;
      margin-top: 12px;
      background-size: 14px 12px;
      background-image: url(~assets/img/hotelList/icon-map.svg);
      background-repeat: no-repeat;
      background-position: center center;
      position: absolute;
      left: 14px;
    }
  }
  .scrollDown{
    .viewMap{
      transform: translateY(50px);
    }
  }
  .right{
    left: 100%;
  }
  .scrollDown .loading{
    transform: translateY(51px);
  }
  .loading{
    transition: .3s ease;
    position: fixed;
    // bottom: 0;
    bottom: 75px;
    left: calc(50% - 22.5px);
    display: flex;
    justify-content: center;
    z-index: 10;
  }
  .top-control{
    transition: opacity 0.3s ease;
    width: 100%;
    height: 48px;
    background: #fff;
    z-index: 1;
    position: relative;
  }
  .top-control > .contents{
    transition: opacity 0.3s ease;
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: space-between;
    text-align: center;
    align-items: center;
  }
  .top-control .contents .chevron-left{
    width: 40px;
    height: 40px;
    background-size: 21px;
    background-position: center center;
    margin-left: 4px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-image: url(~assets/img/hotelList/chevron-left.svg);
    background-color: transparent;
  }
  .top-control .contents .top-control-right-wrap {
    display: flex;
    align-items: center;
  }
  .top-control .contents .top-control-right-wrap .top-control-right{
    font-size: 12px;
    font-weight: bold;
    text-align: right;
    margin-right: 20px;
  }
  .top-control .contents .top-control-right-wrap .filterPopIcon{
    color: #000;
    font-size: 14px;
    line-height: 40px;
    margin-right: 10px;
    transition: .3s;
    &.active{
      color: #305bf0;
    }
  }
  .title{
    flex-wrap: wrap;
    transition: opacity 0.3s ease;
    font-size: 14px;
    position: absolute;
    left: 48px;
    height: 48px;
    line-height: 50px;
    color: $greyish-brown;
    opacity: 0;
    .scrollDownTop &{
      opacity: 1;
    }
  }
  .bpPop{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 11;
    background-color: rgba(0, 0, 0, .3);
    &.forIos {
      top: constant(safe-area-inset-top);
      top: env(safe-area-inset-top);
    }
  }
</style>
