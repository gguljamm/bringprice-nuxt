<template>
  <div
    id="hotelMapMobile"
    class="hotelMap scrollDown scrollDownTop">
    <div class="top-control">
      <div
        class="contents">
        <div
          class="chevron-left x-btn"
          @click="back"
        ></div>
        <span
          class="title"
        >{{ inputData.city.name }}</span>
        <div class="top-control-right-wrap">
          <span class="filterPopIcon" :class="filterActive ? 'active' : ''" @click="$emit('open-filter')">필터</span>
        </div>
      </div>
    </div>
    <hotelListTop
      :inputData="inputData"
      :filterActive="filterActive"
      :filterData="filterData"
      @view-map="$emit('view-map')"
      @open-filter="$emit('open-filter')"
      class="hotelMapTop"
      @back="history.back()"
      @apply-filter="researchFilter"
    />
    <no-ssr>
      <GmapMap
        v-if="mapInit"
        style="position: absolute; left: 0; right: 0; bottom: 0; top: 98px;"
        :zoom="15"
        :center="{lat: Number(mapCenter.lat), lng: Number(mapCenter.lng)}"
        :options="{
          // zoomControl: true, // zoom + - btn
          disableDefaultUI: true,
          gestureHandling: 'greedy',
        }"
        @center_changed="move"
      >
        <div v-if="geoValue && geoValue.markers">
          <GmapMarker
            v-for="(marker, index) in geoValue.markers"
            class="gmarker"
            :key="index"
            :position="marker.position"
            :title="'gmap-marker'"
            @click="changeSelectedIndex(index)"
            :icon="format.makeMarkerSVG({
                category: hotelList[index].category,
                price: marker.price.length > 0 ? format.priceFormat(marker.price[0].pricePerNight) : '',
                active: marker.active})"
            :zIndex="marker.active ? 1 : 0"
          />
        </div>
      </GmapMap>
    </no-ssr>
    <div
      v-if="Object.keys(selectedMapList).length > 0"
      @click="openDetail(selectedMapList.rooms)"
      class="hotelMapPop"
    >
      <div class="info-wrap">
        <div
          :style="{ backgroundImage: `url(${selectedMapList.images && selectedMapList.images[0]
            ? selectedMapList.images[0]
            : ''}), url(https://cdn.bringprice.com/image/schedule/no-image-box.png)`}"
          class="selectedImg"
        ></div>
        <div class="info">
          <div class="list-info">
            <div class="contents">
              <p class="category">{{ selectedMapList.category }}</p>
              <p class="list-info-title">{{ selectedMapList.korName }}</p>
              <p class="list-info-sub">
                {{ selectedMapList.star }} 성급
                <span v-if="selectedMapList.review && selectedMapList.review.summary.score > 0">
                  {{ selectedMapList.review.summary.score }} |
                  {{ format.ratingText(selectedMapList.review.summary.score) }}
                </span>
                <span v-else-if="selectedMapList.rating">
                  {{ selectedMapList.rating }} | {{ selectedMapList.ratingText }}
                </span>
              </p>
            </div>
          </div>
          <div class="list-title">
            <p class="price solo">
              <span v-if="selectedMapList.rooms">
                <span class="bold">
                {{ format.priceFormat(selectedMapList.rooms[0].pricePerNight) }}</span>원/1박 부터
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <button
      v-else
      class="research"
      :class="researchShow && !mapReSearchLoading
      ? 'show'
      : mapReSearchLoading
      ? 'show mapLoading' : ''"
      @click="!mapReSearchLoading ? research() : ''"
    >
      {{ !mapReSearchLoading ? '현 위치에서 재검색' : '불러오는 중'}}
    </button>
  </div>
</template>

<script>

import hotelListTop from './hotelListTop.vue';
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['inputData', 'listLoading', 'selectedIndex', 'geoValue', 'hotelList', 'mapReSearchLoading', 'filterActive', 'filterData'],
  components: {
    hotelListTop,
    // loadingAni,
  },
  data() {
    return {
      init: false,
      format: Format,
      place: null,
      selectedMapList: {},
      researchShow: false,
      mapCenter: {
        lat: this.$store.state.hotelListObj.geoValue.center.lat ? this.$store.state.hotelListObj.geoValue.center.lat : JSON.parse(this.$route.params.destination).latitude,
        lng: this.$store.state.hotelListObj.geoValue.center.lng ? this.$store.state.hotelListObj.geoValue.center.lng : JSON.parse(this.$route.params.destination).longitude,
      },
      infoOpen: true,
      selectMapIndex: null,
      mapInit: false,
      mapLoadTimeOut: '',
    };
  },
  methods: {
    researchFilter(filter) {
      this.$emit('apply-filter', filter);
    },
    move(e) {
      if (Object.keys(this.selectedMapList).length > 0) {
        this.selectedMapList = {};
        this.selectMapIndex = null;
      }
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.$emit('change-selected-index', -1);
      this.researchShow = false;
      this.timeout = setTimeout(() => {
        this.$emit('change-last-center', e.lat(), e.lng());
        this.researchShow = true;
      }, 300);
    },
    changeSelectedIndex(index) {
      this.geoValue.markers.forEach((val) => {
        const temp = val;
        temp.active = false;
      });
      this.geoValue.markers[index].active = true;
      this.selectedMapList = this.hotelList[index];
      this.selectMapIndex = index;
      this.$emit('change-selected-index', index);
    },
    research() {
      this.$emit('research-from-map', this.geoValue, true);
    },
    openDetail(rooms) {
      if (!rooms) {
        return;
      }
      const hotelId = this.selectedMapList.id;
      this.$emit('open-detail', hotelId, this.selectedIndex);
    },
    back() {
      // this.$emit('back');
      this.$router.push({ params: { popFlag: 'list' } });
    },
    mapLoad() {
      this.mapLoadTimeOut = setTimeout(() => {
        this.mapInit = true;
      }, 100);
    },
  },
  mounted() {
    window.document.body.style.overflowY = 'hidden';
    window.document.documentElement.style.overflowY = 'hidden';
    if (this.selectedIndex !== -1) {
      this.$emit('change-selected-index', -1);
    }
    this.$nextTick(() => {
      this.init = true;
      this.mapLoad();
    });
  },
  beforeDestroy() {
    if (this.mapLoadTimeOut) {
      clearTimeout(this.mapLoadTimeOut);
    }
    window.document.body.style.overflowY = '';
    window.document.documentElement.style.overflowY = '';
  },
};
</script>

<style>
  /*#hotelMapMobile .gm-ui-hover-effect{*/
    /*display: none;*/
    /*opacity: 0;*/
    /*visibility: hidden;*/
  /*}*/
  /* #hotelMapMobile .gm-style-iw{
    text-align: center;
  } */
  /*#hotelMapMobile .gm-style .gm-style-iw{*/
    /*overflow: visible !important;*/
  /*}*/
  /*#hotelMapMobile .gm-style .gm-style-iw .window-info{*/
    /*position: absolute;*/
    /*top: -9px;*/
    /*left: -15px;*/
    /*bottom: -9px;*/
    /*right: -15px;*/
    /*cursor: pointer;*/
  /*}*/
  #hotelMapMobile .gm-style .gm-style-iw .category{
    font-size: 10px;
    color: #9b9b9b;
  }
  #hotelMapMobile .gm-style .gm-style-iw .price{
    font-size: 12px;
    line-height: 15px;
    font-weight: bold;
  }
</style>

<style lang="scss" scoped>
  .hotelMap{
    z-index: 11;
    position: fixed;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    top: 0;
    top: constant(safe-area-inset-top);
    top: env(safe-area-inset-top);
    left: 0;
    bottom: 0;
    right: 0;
    background: #f8f8f8;
  }
 .hotelMapPop{
   width: calc(100% - 40px);
   z-index: 11;
   border-radius: 2px;
   position: absolute;
   bottom: 20px;
   background-color: #fff;
   left: calc(50% - ((100% - 40px) / 2));
    .info-wrap{
      width: 100%;
      //  height: 98px;
      position: relative;
    }
    .selectedImg{
      width: 114px;
      height: 100%;
      background-size: cover;
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
      background-position: center center;
      position: absolute;
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
      left: 0;
      top: 0;
      bottom: 0;
    }
    .list-title{
      width: 100%;
      padding-bottom: 10px;
      line-height: 24px;
    }
    .price{
      font-size: 12px;
      margin-top: 2px;
      color: $greyish-brown;
    }
    .price .bold{
      font-size: 16px;
      font-weight: bold;
      color: $greyish-brown;
    }
    .info{
      width: 100%;
      // position: absolute;
      padding-left: 124px;
      padding-right: 10px;
    }
    .list-info{
      width: 100%;
      padding-top: 8px;
    }
    .list-info .contents{
      width: 100%;
      color: $greyish-brown;
      .category{
        font-size: 10px;
        line-height: 15px;
        color: $brown-grey;
      }
    }
    .list-info .list-info-title{
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 5px;
    }
    .list-info .list-info-sub{
      font-size: 10px;
      margin-top: 2px;
      color: $brown-grey;
    }
  }
  .research{
    height: 53px;
    opacity: 0;
    position: absolute;
    transition: all .3s ease;
    bottom: 40px;
    left: 50%;
    pointer-events: none;
    transform: translateX(-50%);
    padding: 0 16px 0 44px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    background-color: $cornflower;
    border-radius: 23px;
    color: #fff;
    border: 0;
    z-index: 11;
    font: 16px Spoqa Han Sans;
    line-height: 53px;
  }
  .top-control{
    position: relative;
    z-index: 1;
    transition: opacity 0.3s ease;
    width: 100%;
    height: 48px;
    background: #fff;
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
  .top-control .contents .x-btn{
    width: 40px;
    height: 40px;
    background-size: 21px;
    background-position: center center;
    margin-left: 4px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-image: url(~assets/img/hotelList/x.svg);
    background-color: transparent;
  }
  .top-control .contents .top-control-right{
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
  .top-control .contents .top-control-filter{
    color: $brown-grey;
    font-size: 12px;
    font-weight: bold;
  }
  .top-control-external{
    width: 22px;
    height: 22px;
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
  .research.show{
    opacity: 1;
    pointer-events: all;
    transition: all .3s ease;
  }
  .research:before{
    background-image: url('../../../../assets/img/hotelList/refresh-ccw.svg');
    content: '';
    position: absolute;
    left: 16px;
    top: 17.5px;
    height: 18px;
    width: 18px;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .research.show.mapLoading::before{
    // transition: transform 0.3s ease;
    animation: mapLoading 0.5s infinite;
  }
  .scrollDown #bpNavigator > div{
    transform: translateY(0);
  }
  @keyframes mapLoading {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(-180deg);
    }
  }
 .loading{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }
</style>
