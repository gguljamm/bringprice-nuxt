<template>
  <div
    id="hotelMapPc"
    class="hotelMap">
    <!--{{Math.cos(mapCenter.lng * Math.PI/180) * 2 * Math.PI * 6378137 / (256 * Math.pow(2, 15))}}-->
    <div class="mapWrap">
      <div
        @click="openMap"
        :class="isMap ? 'on' : ''"
        class="mapBtn"></div>
      <no-ssr>
        <GmapMap
          v-if="init"
          style="height: 100%;"
          :zoom="15"
          :center="{lat: Number(mapCenter.lat), lng: Number(mapCenter.lng)}"
          :options="{
            scrollwheel: false,
            navigationControl: false,
            mapTypeControl: false,
            scaleControl: false,
            clickableIcons: true,
            zoomControl: true,
            suppressInfoWindows: true,
            gestureHandling: 'greedy',
            disableDefaultUI: true,
            zoomControlOptions: {
              position: 3,
            },
          }"
          @center_changed="move"
          ref="map"
        >
          <div v-if="hotelList && hotelList.length > 0 && geoValue && geoValue.markers">
            <GmapMarker
              v-for="(marker, index) in geoValue.markers"
              :key="index"
              :position="marker.position"
              :title="'gmap-marker'"
              @click="marker.price.length > 0 ? openDetail(index) : ''"
              @mouseover="marker.active = true"
              @mouseout="marker.active = false"
              :icon="format.makeMarkerSVG(
                {
                  category: hotelList[index].category,
                  price: marker.price.length > 0 ? format.priceFormat(marker.price[0].pricePerNight) : '',
                  active: marker.active
                }
              )"
              :zIndex="marker.active ? 1 : 0"
            />
          </div>
        </GmapMap>
      </no-ssr>
      <button
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
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['inputData', 'listLoading', 'selectedIndex', 'geoValue', 'hotelList', 'mapReSearchLoading', 'filterActive', 'isMap'],
  data() {
    return {
      init: false,
      format: Format,
      place: null,
      researchShow: false,
      infoOpen: true,
      mapCenter: {
        lat: this.$store.state.hotelListObj.geoValue.center.lat ? this.$store.state.hotelListObj.geoValue.center.lat : JSON.parse(this.$route.params.destination).latitude,
        lng: this.$store.state.hotelListObj.geoValue.center.lng ? this.$store.state.hotelListObj.geoValue.center.lng : JSON.parse(this.$route.params.destination).longitude,
      },
    };
  },
  methods: {
    move(e) {
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
    research() {
      this.$emit('research-from-map', this.geoValue, true);
    },
    openDetail(index) {
      this.$emit('open-detail', this.hotelList[index].id, index);
    },
    openMap() {
      this.$emit('view-map', this.$route.params.popFlag !== 'map');
    },
  },
  mounted() {
    this.init = true;
  },
};
</script>

<style>
  #hotelMapPc .gm-style .gm-style-iw .window-info{
    position: absolute;
    top: -9px;
    left: -15px;
    bottom: -9px;
    right: -15px;
    cursor: pointer;
  }
  #hotelMapPc .gm-style .gm-style-iw .category{
    color: #9b9b9b;
  }
  #hotelMapPc .gm-style .gm-style-iw .price{
    font-size: 16px;
    font-weight: bold;
  }
</style>

<style lang="scss" scoped>
  .hotelMap{
    width: 30%;
    z-index: 1;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    background: #f8f8f8;
    padding-left: 40px;
    .mapWrap{
      height: 100%;
      position: relative;
      .mapBtn{
        cursor: pointer;
        width: 42px;
        height: 42px;
        background-repeat: no-repeat;
        position: absolute;
        top: calc(50% - 21px);
        left: -21px;
        z-index: 1;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        border: solid 1px #cdcdcd;
        -webkit-background-size: 15px 15px;
        background-size: 15px 15px;
        background-image: url(~assets/img/common/chevron-left.svg);
        background-position: center center;
        background-color: #fff;
        border-radius: 50%;
        transition: .3s ease;
        &.on{
          transform: rotate(180deg);
        }
        &:hover{
          background-color: #f9f9f9;
        }
        &:not(.on):hover{
          transform: scale(1.1);
        }
      }
      .research{
        opacity: 0;
        position: absolute;
        transition: all .3s ease;
        bottom: 40px;
        left: 50%;
        pointer-events: none;
        transform: translateX(-50%);
        padding: 10px 14px 10px 38px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
        border: 1px solid $dodger-blue;
        background-color: $dodger-blue;
        border-radius: 23px;
        color: #fff;
        z-index: 11;
        font-size: 14px;
        &.show{
          opacity: 1;
          pointer-events: all;
          transition: all .3s ease;
        }
        &:before{
          background-image: url('../../../../assets/img/hotelList/refresh-ccw.svg');
          content: '';
          position: absolute;
          left: 16px;
          top: 10px;
          height: 15px;
          width: 15px;
          background-repeat: no-repeat;
          background-size: cover;
        }
        &.show.mapLoading::before{
          // transition: transform 0.3s ease;
          animation: mapLoading 0.5s infinite;
        }
      }
    }
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
</style>
