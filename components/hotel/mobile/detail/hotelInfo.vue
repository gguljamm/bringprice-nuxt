<template>
  <div
    id="hotelInfo"
  >
    <div class="info-wrap">
      <div class="baseInfo">
        <p class="category">{{hotelInfo.category}}</p>
        <p class="hotelTitle">{{hotelInfo.korName}}</p>
        <div class="score">
          <div class="star" v-if="hotelInfo.star">
            <div
              v-for="x in Math.ceil(hotelInfo.star)"
              :key="x"
              :style="x === Math.ceil(hotelInfo.star) && !Number.isInteger(hotelInfo.star) ? {width: (11 * hotelInfo.star.toString().split('.')[1] * 0.1) + 'px'} : ''"
              class="starIcon"></div>
          </div>
          <span class="info">{{hotelInfo.star}}성급</span>
          <span class="info separator">|</span>
          <span class="info">{{hotelInfo.rating}} {{hotelInfo.ratingText}} ({{format.priceFormat(hotelInfo.reviewsCount)}}개)</span>
        </div>
        <div v-if="hotelInfo.address" class="address" @click="openMap">
          <div class="locationIcon"><p class="info"><span class="text">{{hotelInfo.address}}</span></p></div>
        </div>
        <div v-if="hotelInfo.overview" class="hotelTeaser">
          <p :class="readMoreTeaser ? 'open' : ''">{{hotelInfo.overview}}</p>
          <button v-if="!readMoreTeaser" @click="readMoreTeaser = true" class="readMoreTeaser">모두보기</button>
        </div>
      </div>
      <div class="line"></div>
      <div class="mapInfo">
        <p class="mapTitle">숙소위치</p>
        <GmapMap
          @click="openMap"
          class="bp-gMap"
          :zoom="17"
          :center="{lat: Number(hotelInfo.latitude), lng: Number(hotelInfo.longitude)}"
          :options="{
            disableDefaultUI: true,
            scrollwheel: false,
            navigationControl: false,
            mapTypeControl: false,
            scaleControl: false,
            clickableIcons: false,
            gestureHandling: 'none',
            zoomControl: false,
          }"
        >
          <GmapMarker
            @click="openMap"
            :position="{lat: Number(hotelInfo.latitude), lng: Number(hotelInfo.longitude)}"
            :title="'gmap-marker'"
            :icon="require('@/assets/img/hotelDetail/hotel-map.svg')"
          />
        </GmapMap>
      </div>
      <div class="line"></div>
      <div class="timeInfo">
        <p class="title">
          <span>체크인</span>
          <span>체크아웃</span>
        </p>
        <div class="time">
          <span
            v-if="hotelInfo.checkin"
          >{{ getTimeFormat(hotelInfo.checkin) }}</span>
          <span
            v-if="hotelInfo.checkout"
          >{{ getTimeFormat(hotelInfo.checkout) }}</span>
        </div>
      </div>
      <div class="line"></div>
      <div class="facilities">
        <p class="facilitiesTitle">편의시설 및 서비스</p>
        <div
          v-for="(row, rowIndex) in facilitiesList"
          :key="rowIndex"
          :class="facilitiesList[rowIndex].length < 5 ? 'default' : ''"
          class="facilitiesListWrap">
          <div
            v-for="(val, index) in row"
            :key="index"
            class="facilitiesList">
            <div class="icon" :style="{backgroundImage: `url(${val.url})`}"></div>
            <div class="name">{{val.name}}</div>
          </div>
        </div>
        <button class="facilities-btn" @click="$emit('open-facilities')">모두보기</button>
      </div>
      <div class="line"></div>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['searchFlag', 'hotelInfo', 'inputData', 'readMoreFacilities'],
  data() {
    const facilitiesData = [];
    for (let x = 0; x < Math.ceil(this.hotelInfo.mainFacilities.length / 5); x += 1) {
      facilitiesData.push([]);
    }
    for (let x = 0; x < facilitiesData.length; x += 1) {
      for (let y = 0; y < 5; y += 1) {
        if (this.hotelInfo.mainFacilities[(x * 5) + y]) {
          facilitiesData[x].push(this.hotelInfo.mainFacilities[(x * 5) + y]);
        }
      }
    }
    const facilitiesList = facilitiesData;
    return {
      facilitiesList,
      dayOfWeek: ['일', '월', '화', '수', '목', '금', '토'],
      format: Format,
      readMoreTeaser: false,
    };
  },
  methods: {
    getDayOfWeek(date) {
      const newDate = new Date(date);
      return `(${this.dayOfWeek[newDate.getDay()]})`;
    },
    getDateFormat(date) {
      const dateFormat = date.split('-');
      return `${dateFormat[1]}월 ${dateFormat[2]}일`;
    },
    getTimeFormat(time) {
      const timeFormat = time.split(' ');
      const timeStandard = timeFormat[1] === 'PM' ? '오후' : '오전';
      return `${timeStandard} ${timeFormat[0]}`;
    },
    openMap() {
      // console.log(this.hotelInfo);
      const url = `https://google.com/maps/search/${this.hotelInfo.latitude},${this.hotelInfo.longitude}`;
      window.open(url, '_blank');
    },
  },
  created() {
    this.infoFlag = true;
  },
};
</script>

<style lang="scss" scoped>
  #hotelInfo{
    width: 100%;
    .line{
      display: block;
      width: calc(100% - 40px);
      margin: 0 auto;
      height: 1px;
      background-color: #f2f2f2;
    }
  }
  .baseInfo {
    margin-top: 32px;
    padding-bottom: 33px;
    .category{
      color: #939499;
      font-weight: bold;
      font-size: 12px;
      line-height: 15px;
      padding: 0 20px;
    }
    .hotelTitle{
      padding: 0 20px;
      font-size: 20px;
      font-weight: bold;
      color: #000;
      margin-top: 4px;
    }
    .score{
      padding: 0 20px;
      display: flex;
      align-items: center;
      .star {
        display: flex;
        margin-right: 5px;
        .starIcon {
          overflow: hidden;
          width: 14px;
          height: 14px;

          &::after {
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            background-image: url(~assets/img/hotelDetail/star.svg);
            background-size: 11px 11px;
            background-repeat: no-repeat;
          }
        }
      }
      .info{
        font-size: 12px;
        line-height: 15px;
        color: #939499;
        &.separator{
          font-size: 10px;
          margin-left: 4px;
          margin-right: 4px;
        }
      }
    }
    .address {
      margin-top: 6px;
      padding: 0 20px;
      margin-bottom: 16px;
      .locationIcon {
        width: 100%;
        background-image: url(~assets/img/hotelDetail/location.svg);
        background-size: 10px 10px;
        background-position: 0 center;
        background-repeat: no-repeat;
      }
      .info{
        padding-left: 16px;
        word-break: break-all;
        font-size: 12px;
        color: #000;
        line-height: 19px;
      }
    }
    .hotelTeaser{
      padding: 0 20px;
      margin-top: 10px;
      p {
        position: relative;
        font-size: 16px;
        line-height: 21px;
        height: 58px;
        overflow: hidden;
        &.open{
          height: auto;
          &::after{
            display: none;
          }
        }
        &::after{
          content: '';
          display: block;
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), #ffffff);
        }
      }
      .readMoreTeaser{
        color: #ff5a5d;
        font-size: 14px;
        font-weight: 500;
        margin-top: 20px;
      }
    }
  }
  .mapInfo{
    margin-top: 40px;
    padding: 0 20px 20px 24px;
    .mapTitle{
      font-size: 20px;
      font-weight: 500;
      color: #282729;
    }
    .bp-gMap{
      margin-top: 16px;
      width: 100%;
      height: 150px;
    }
  }
  .timeInfo{
    width: 100%;
    padding: 24px 20px;
    font-size: 16px;
    .title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      color: #282729;
      line-height: 19px;
    }
    .time{
      display: flex;
      justify-content: space-between;
      font-weight: normal;
      line-height: 19px;
    }
  }
  .facilities{
    padding: 0 20px;
    margin-top: 40px;
    margin-bottom: 40px;
    .facilitiesTitle{
      font-weight: 500;
      color: #282729;
      font-size: 20px;
    }
    .facilitiesListWrap{
      margin-top: 20px;
      &:first-of-type{
        margin-top: 16px;
      }
      &::after{
        clear: both;
        content: '';
        display: block;
      }
      .facilitiesList{
        width: 20%;
        float: left;
        &:first-of-type{
          margin-left: 0;
        }
        .icon{
          margin: 0 auto;
          width: 60px;
          height: 60px;
          border-radius: 50px;
          background-color: #f8f9fb;
          background-size: 44px 44px;
          background-repeat: no-repeat;
          background-position: center center;
          padding: 8px;
        }
        .name{
          vertical-align: middle;
          text-align: center;
          width: 100%;
          height: 24px;
          margin-top: 8px;
          font-size: 10px;
          color: #282729;
          padding: 0 8px;
        }
      }
    }
    .facilities-btn{
      color: #ff5a5d;
      font-size: 14px;
      font-weight: 500;
      margin-top: 24px;
    }
  }
</style>
