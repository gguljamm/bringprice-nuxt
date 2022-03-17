<template>
  <div
    id="hotelDetail"
    ref="hotelDetail"
    :style=" viewPhotoFlag ? { overflowY: 'hidden' } : { overflowY: '' }"
  >
    <div
      class="detail-wrap">
      <div v-if="loading" class="loading-img">
        <div class="moveItem"></div>
      </div>
      <div
        v-else
        class="hotel-img"
        :class="[viewPhotoFlag ? 'view' : '']"
      >
        <div
          :style="{backgroundImage: `url(${img[selectImageIndex] ? img[selectImageIndex] : ''}), url(https://cdn.bringprice.com/image/schedule/no-image-box.png)`}"
          class="pop-img"></div>
        <div class="bottom-wrap">
          <div
            class="hotel-img-list"
            :class="viewPhotoFlag ? 'view' : ''"
          >
            <div>
              <img
                v-for="(item, index) in img && img.length > 0 ? img.slice(0, img.length >= 5 ? 5 : img.length) : [{url: 'https://cdn.bringprice.com/image/schedule/no-image-box.png'}]"
                :key="index" :src="item" :alt="`img${index}`"
                :style="selectImageIndex !== index ? { opacity: 0.7 } : { opacity: 1 }"
                onError="this.src='https://cdn.bringprice.com/image/schedule/no-image-box.png'"
                @click="selectImageIndex = index"
              />
            </div>
          </div>
          <div
            @click="viewPhotoFlag = !viewPhotoFlag"
            class="view-photo-wrap">
            <button class="view-photo">{{ viewPhotoFlag ? '사진 목록 닫기' :'사진 모두보기'}}</button>
          </div>
        </div>
        <div
          :class="viewPhotoFlag ? 'view' : ''"
          class="mask"/>
      </div>
      <div class="info-wrap all-wrap">
        <div
          ref="hotelInfo"
          class="hotel-info">
          <ul
            v-if="!loading"
          >
            <li>
              <div class="info-title">
                <p class="hotel-name">{{ hotelDetailData.korName }}</p>
                <p class="info">
                  {{ hotelDetailData.star }}성급 |
                  <span v-if="hotelDetailData.rating">{{ hotelDetailData.rating }} {{ hotelDetailData.ratingText }} |</span>
                  {{ hotelDetailData.city }}
                </p>
                <p class="address">{{ hotelDetailData.address }}</p>
                <div class="info-btnWrap">
                  <div
                    @click="openMap"
                    class="map">지도보기</div>
                  <div
                    v-clipboard:copy="urlPath"
                    v-clipboard:success="onCopy"
                    class="copy">위치복사</div>
                </div>
              </div>
            </li>
            <li
              :style="!hotelDetailData.checkin && !hotelDetailData.checkout ? { border: 'none' } : ''"
            >
              <p class="hotelInfoTitle">숙소정보</p>
              <div v-if="hotelDetailData.overview" class="hotelTeaser">
                <p class="title">호텔소개</p>
                <div
                  ref="hotelTeaser"
                  class="intro"
                  :style="{
                      height: readMoreTeaser ? 'auto' : '69px',
                    }"
                ><span>{{ hotelDetailData.overview }}</span><div v-if="!readMoreTeaser" class="gra"></div></div>
                <div v-if="!readMoreTeaser" class="readMore">
                  <div
                    class="readMoreBtn moreIcon"
                    :class="readMoreTeaser ? 'on' : ''"
                    @click="readMoreTeaser = true">{{ readMoreTeaser ? '닫기' : '소개 더 읽기' }}</div>
                </div>
              </div>
            </li>
            <li>
              <div class="timeInfo">
                <div class="title">
                  <div v-if="hotelDetailData.checkin">체크인</div>
                  <div v-if="hotelDetailData.checkout">체크아웃</div>
                </div>
                <div class="time">
                  <div v-if="hotelDetailData.checkin">
                    {{ getTimeFormat(hotelDetailData.checkin) }}
                  </div>
                  <div v-if="hotelDetailData.checkout">
                    {{ getTimeFormat(hotelDetailData.checkout) }}
                  </div>
                </div>
              </div>
            </li>
            <li>
              <p class="title">편의시설</p>
              <div class="facilities">
                <div
                  v-if="hotelDetailData && hotelDetailData.mainFacilities && hotelDetailData.mainFacilities.length > 0"
                  class="main">
                  <div
                    v-for="(row, rowIndex) in mainFacilities"
                    :key="rowIndex"
                    class="facilitiesListWrap"
                  >
                    <div
                      v-for="(val, index) in row"
                      :key="index"
                      class="facilitiesList"
                    >
                      <div class="icon" :style="{backgroundImage: `url(${val.url})`}"></div>
                      <div class="name">{{val.name}}</div>
                    </div>
                  </div>
                </div>
                <div
                  class="facilitiesAll" :class="readMoreFacilities ? 'open' : ''">
                  <div class="contentWrap">
                    <div class="specialList">
                      <p class="title">{{hotelDetailData.specialFacility.group}}</p>
                      <div class="wrap">
                        <div
                          v-for="(val, index) in hotelDetailData.specialFacility.facilities"
                          :key="index" class="list"
                        >
                          <div class="img" :style="{backgroundImage: `url(${val.url})`}"></div>
                          <div class="name">{{val.name}}</div>
                        </div>
                      </div>
                    </div>
                    <div
                      v-for="(val, index) in hotelDetailData.facilities.filter(val => val.id !== 1)"
                      :key="index"
                      class="normalList"
                    >
                      <p class="title">{{val.group}}</p>
                      <div class="wrap">
                        <ul>
                          <li
                            v-for="(list, index2) in val.names"
                            :key="index2"
                          >{{list}}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="!readMoreFacilities" class="readMore">
                  <div
                    class="readMoreBtn moreIcon"
                    :class="readMoreFacilities ? 'on' : ''"
                    @click="readMoreFacilities = true"
                    >편의시설 더보기</div>
                </div>
              </div>
            </li>
          </ul>
          <info-loading v-else>
          </info-loading>
        </div>
        <div
          id="bookingWrap"
          class="booking-wrap"
          ref="bookingWrap"
          :style="bookingWrapStyle"
        >
          <div
            v-if="!loading"
            class="booking">
            <div class="booking-info">
              <p class="title">{{ hotelDetailData.korName }}</p>
              <p class="info">객실 별 제공되는 무료 서비스를 즐겨보세요.</p>
            </div>
            <div
              v-if="!loading && hotelDetailData && hotelDetailData.rooms.length > 0"
              class="room-option">
              <ul class="check-list">
                <li
                  v-for="(val, index) in roomOptions"
                  :key="index"
                >
                  <div>
                    <label :for="val.name + index" class="check">
                      <div>
                        <div class="check-wrap">
                          <input type="checkbox" :id="val.name + index" class="inputCheck" v-model="val.check" @click="setOptions(val.name)">
                          <span class="checked" :class="val.check ? 'active' : ''">
                            <transition name="fade">
                              <div class="checkSvg">
                                <svg viewBox="0 0 52 52" fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-width="3" focusable="false" aria-hidden="true" role="presentation" stroke-linecap="round" stroke-linejoin="round" style="height: 1em; width: 1em; display: block; overflow: visible;"><path d="m19.1 25.2 4.7 6.2 12.1-11.2"></path></svg>
                              </div>
                            </transition>
                          </span>
                          <span class="info">{{ getOptionName(val.name) }}</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </li>
              </ul>
            </div>
            <div class="room-list-wrap">
              <ul>
                <li
                  v-for="(room, index) in roomsData"
                  :key="index"
                  class="room">
                  <div
                    class="room-list">
                    <div class="room-option">
                      <div>
                        <div v-if="index === 0" class="price-point">최저가</div>
                        <div class="agoda-logo"></div>
                      </div>
                      <div>
                        <span
                          v-if="getOptions(room).length > 0"
                          v-for="(val, optionIndex) in getOptions(room)"
                          :key="optionIndex"
                          class="option">{{ getOptionName(val) }}</span>
                        <span
                          v-else
                          class="option"
                        >옵션없음</span>
                      </div>
                    </div>
                    <p class="price">
                      <span class="price-value">총 {{ format.priceFormat(room.totalPrice) }}</span>원~
                    </p>
                    <p class="priceOne">
                      <span class="price-value">1박 요금 평균 {{ format.priceFormat(room.pricePerNight) }}</span>원
                    </p>
                    <p class="room-name">{{ room.name }}</p>
                  </div>
                </li>
              </ul>
              <div
                v-if="roomsData.length > 3"
                class="gra"></div>
            </div>
          </div>
          <booking-loading
            v-else
          />
          <div
            v-if="!loading && hotelDetailData && hotelDetailData.rooms.length > 0"
            class="booking-btn book"
            @click="bookingHotel(hotelDetailData.rooms[0].roomUrl, hotelDetailData.korName, hotelDetailData.rooms[0].totalPrice)"
          >최저가로 호텔 예약하기</div>
          <div v-else-if="loading" class="booking-btn loading"></div>
          <div
            v-if="!loading && hotelDetailData && hotelDetailData.rooms.length <= 0"
            class="booking-btn soldOut"
          >SOLD OUT</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
import Api from '~/utils/api'; // eslint-disable-line
import viewPhoto from './viewPhoto.vue';
import bookingLoading from './bookingLoading.vue';
import infoLoading from './infoLoading.vue';

export default {
  components: {
    viewPhoto,
    bookingLoading,
    infoLoading,
  },
  head() {
    const des = JSON.parse(this.$route.params.destination);
    const city = des.city && (des.city_name || des.city.region || des.city.country_name);
    let cityVal = '';
    if (city) {
      cityVal = city;
    }
    const val = this.hotelDetailData && this.hotelDetailData.korName ? this.hotelDetailData.korName : `${cityVal}의 호텔`;
    return {
      title: val,
    };
  },
  data() {
    const searchInfo = this.$route.params;
    const inputData = {
      city: JSON.parse(searchInfo.destination),
      checkinDate: searchInfo.checkin,
      checkoutDate: searchInfo.checkout,
      adults: parseInt(searchInfo.adults, 10),
      children: searchInfo.children !== 'null' ? searchInfo.children.split('&') : [],
      rooms: parseInt(searchInfo.rooms, 10),
    };
    return {
      inputData,
      urlPath: '',
      format: Format,
      viewPhotoFlag: false,
      selectImageIndex: 0,
      img: [],
      roomOptions: [
        { name: 'bookNowPayLater', val: false },
        { name: 'breakfastIncluded', val: false },
        { name: 'freeWifi', val: false },
        { name: 'isFreeCancelable', val: false },
      ],
      mainFacilities: [],
      localRoomOptions: [],
      hotelDetailData: {},
      readMoreFacilities: false,
      readMoreTeaser: false,
      loading: true,
      bookingWrapStyle: {},
    };
  },
  computed: {
    roomsData() {
      const rooms = this.hotelDetailData.rooms;
      return rooms.filter(room => this.filterRoom(this.getOptions(room)));
    },
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
    filterRoom(options) {
      // console.log(options, this.localRoomOptions);
      if (this.localRoomOptions.length > 0) {
        return options.some(option => this.localRoomOptions.indexOf(option) >= 0);
      }
      return true;
    },
    getOptionName(code) {
      let returnVal = '';
      switch (code) {
        case 'bookNowPayLater' :
          returnVal = '선예약 후 결제';
          break;
        case 'breakfastIncluded' :
          returnVal = '조식포함';
          break;
        case 'freeWifi' :
          returnVal = '무료 와이파이';
          break;
        case 'isFreeCancelable' :
          returnVal = '무료 취소';
          break;
        default :
          returnVal = '';
          break;
      }
      return returnVal;
    },
    setOptions(val) {
      const index = this.localRoomOptions.indexOf(val);
      if (index >= 0) {
        this.localRoomOptions.splice(index, 1);
      } else {
        this.localRoomOptions.push(val);
      }
    },
    getOptions(room) {
      const options = [
        { val: room.bookNowPayLater, name: 'bookNowPayLater' },
        { val: room.breakfastIncluded, name: 'breakfastIncluded' },
        { val: room.freeWifi, name: 'freeWifi' },
        { val: room.isFreeCancelable, name: 'isFreeCancelable' },
      ].filter(item => item.val);
      return options.map(item => item.name);
    },
    onCopy() {
      this.$router.push({ query: { popFlag: 'alert', alertId: 13 } });
    },
    openMap() {
      const url = `https://google.com/maps/search/${this.hotelDetailData.latitude},${this.hotelDetailData.longitude}`;
      window.open(url, '_blank');
    },
    bookingHotel(queryUrl, name, totalPrice) {
      const encode = `/hotelOuterLink/${encodeURIComponent(queryUrl)}`;
      if (queryUrl) {
        window.open(encode);
      }
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'exitHotel',
        eventAction: 'web',
        eventLabel: name,
        eventValue: parseInt(totalPrice, 10),
      });
    },
    bodyScroll() {
      const scrollY = (window.pageYOffset || document.documentElement.scrollTop);
      if (scrollY >= 635) {
        if (this.$refs.hotelInfo.clientHeight + 705 < scrollY + this.$refs.bookingWrap.clientHeight + 68) {
          this.bookingWrapStyle = {
            position: 'absolute',
            top: 'unset',
            bottom: 0,
          };
        } else {
          this.bookingWrapStyle = {
            position: 'fixed',
            top: '94px',
            bottom: 'unset',
          };
        }
      } else {
        this.bookingWrapStyle = {
          position: 'absolute',
          left: '',
          top: '30px',
        };
      }
    },
  },
  mounted() {
    const param = {
      checkIn: this.inputData.checkinDate,
      checkOut: this.inputData.checkoutDate,
      numberOfAdults: this.inputData.adults,
      numberOfRooms: this.inputData.rooms,
      'place.latitude': this.inputData.city.latitude,
      'place.longitude': this.inputData.city.longitude,
    };
    if (this.inputData.children.length > 0) {
      const arr = this.inputData.children;
      param.numberOfChildren = arr.length;
      param.ageOfChildren = arr.join(',');
    }
    let sendParam = '';
    Object.keys(param)
      .forEach((key) => {
        sendParam += `${key}=${param[key]}&`;
      });
    sendParam = sendParam.slice(0, -1);
    // console.log(this.$route);
    Api.getHotelDetail(sendParam, this.$route.params.hotelId)
      .then((resp) => {
        this.hotelDetailData = resp.data;
        const facilities = this.hotelDetailData.mainFacilities;
        const facilitiesData = [];
        for (let x = 0; x < Math.ceil(facilities.length / 10); x += 1) {
          facilitiesData.push([]);
        }
        for (let x = 0; x < facilitiesData.length; x += 1) {
          for (let y = 0; y < 10; y += 1) {
            if (facilities[(x * 10) + y]) {
              facilitiesData[x].push(facilities[(x * 10) + y]);
            }
          }
        }
        this.mainFacilities = facilitiesData;
        this.img = this.hotelDetailData && this.hotelDetailData.images ? this.hotelDetailData.images : [];
        this.loading = false;
      });
    this.$nextTick(() => {
      // console.log(this.hotelDetailData);
      this.urlPath = window.location.href;
      window.addEventListener('scroll', this.bodyScroll);
    });
  },
  beforeDestroy() {
    this.$emit('mountListWrapper');
    window.removeEventListener('scroll', this.bodyScroll);
  },
};
</script>


<style lang="scss" scoped>
  #hotelDetail{
    width: 100%;
  }
  .detail-wrap{
    width: 100%;
  }
  .swiper-container{
    width: 100%;
    height: 546px;
  }
  .loading-img{
    width: 100%;
    height: 637px;
    background-color: #f2f2f2;
    position: relative;
    .moveItem{
      width: 77px;
      top: 10px;
      bottom: 10px;
      transition: .3s ease;
      background-image: linear-gradient(to left, rgba(238, 238, 238, 0), #fff, rgba(255, 255, 255, 0));
      content: '';
      opacity: 0;
      display: block;
      position: absolute;
      animation: moveImg 2s infinite linear;
    }
  }
  .hotel-img{
    width: 100%;
    height: 637px;
    position: relative;
    background-color: #fff;
    overflow: hidden;
    .mask{
      width: 100%;
      height: 120px;
      bottom: -150px;
      position: absolute;
      background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), #000);
      transition: .15s ease-out;
      &.view{
        bottom: 0;
      }
    }
    .pop-img{
      height: 100%;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
    }
    .bottom-wrap{
      width: 100%;
      position: absolute;
      max-width: 1230px;
      bottom: 16px;
      left: calc(50% - 615px);
      z-index: 3;
      .hotel-img-list{
        width: 840px;
        height: 90px;
        margin: 0 auto;
        position: relative;
        > div{
          transition: .15s ease-out;
          position: absolute;
          bottom: -150px;
        }
        &.view{
          > div{
            bottom: 0;
          }
        }
        img {
          cursor: pointer;
          float: left;
          width: 160px;
          height: 90px;
          margin-left: 10px;
          &:first-of-type{
            margin-left: 0;
          }
        }
        &::after{
          clear: both;
          content: '';
          display: block;
        }
      }
      .view-photo-wrap {
        cursor: pointer;
        padding: 10px 16px;
        font-size: 14px;
        bottom: 20px;
        color: #000;
        border: 1px solid #fff;
        background-color: #fff;
        border-radius: 4px;
        position: absolute;
        right: 0;
        z-index: 2;
      }
    }
  }
  .info-wrap{
    width: 100%;
    min-height: 700px;
    position: relative;
    &::after{
      clear: both;
      content: '';
      display: block;
    }
    .hotel-info{
      width: calc(100% - 454px);
      padding: 20px 20px 40px 20px;
      margin-top: 30px;
      margin-bottom: 57px;
      background-color: #fff;
      border-radius: 4px;
      border: solid 1px #f2f2f2;
      float: left;
      > ul > li{
        margin-top: 20px;
        border-bottom: 1px solid #cdcdcd;
        padding-bottom: 20px;
        &:first-of-type{
          margin-top: 0;
        }
        &:last-child{
          padding-bottom: 0;
          border: none;
        }
        .readMore{
          .readMoreBtn{
            position: relative;
            padding-right: 25px;
            color: $dodger-blue;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            display: inline-block;
          }
          .moreIcon{
            transition: .3s ease;
            &.on::after {
              transform: rotate(180deg);
            }
            &::after {
              transition: .3s ease;
              position: absolute;
              width: 18px;
              height: 18px;
              top: -1px;
              right: 0;
              content: '';
              background-repeat: no-repeat;
              background-size: 22px 22px;
              background-position: center center;
              background-image: url(~assets/img/hotelDetail/ic-expand-more.svg);
              clear: both;
            }
          }
        }
        .info-title {
          .hotel-name {
            font-size: 30px;
            font-weight: bold;
            color: #000;
          }

          .info {
            margin-top: 10px;
            font-size: 14px;
            color: #585858;

            span:last-of-type {
              margin-top: 10px;
            }
          }

          .info-btnWrap {
            width: 100%;
            display: flex;
            margin-top: 20px;

            > div {
              height: 33px;
              border-radius: 16.5px;
              border: solid 1px #cdcdcd;
              background-color: #fff;
              font-size: 14px;
              position: relative;
              cursor: pointer;
              margin-left: 10px;
              &:first-of-type{
                margin-left: 0;
              }
              &::before{
                position: absolute;
                content: '';
                width: 18px;
                height: 18px;
                left: 14px;
                top: 6px;
                background-size: 18px 18px;
                background-repeat: no-repeat;
              }
              &.map {
                padding: 8px 16px 8px 40px;
                &::before{
                  background-image: url(~assets/img/hotelDetail/ic-map.svg);
                }
              }

              &.copy {
                padding: 8px 16px 8px 40px;
                &::before{
                  background-image: url(~assets/img/hotelDetail/ic-copy.svg);
                }
              }
            }
          }
        }
        .hotelInfoTitle{
          font-size: 24px;
          font-weight: bold;
          color: #585858;
        }
        .hotelTeaser{
          margin-top: 20px;
          .intro{
            font-size: 16px;
            line-height: 23px;
            overflow: hidden;
            margin-top: 10px;
            transition: all .2s ease;
            position: relative;
            margin-bottom: 32px;
            .gra{
              height: 56px;
              background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), #ffffff);
              z-index: 9;
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
            }
          }
        }
        .timeInfo{
          width: 100%;
          font-size: 16px;
          .title, .time{
            &::after{
              content: '';
              clear: both;
              display: block;
            }
            div {
              width: 50%;
              float: left;
            }
          }
          .title{
            color: #868686;
          }
          .time{
            color: #000;
            margin-top: 10px;
          }
        }
        .title{
          color: #868686;
          font-size: 16px;
        }
        .address{
          margin-top: 6px;
          font-size: 16px;
        }
        .facilities{
          margin-top: 10px;
          .main {
            margin-bottom: 32px;
            .facilitiesListWrap {
              margin-top: 20px;

              &:first-of-type {
                margin-top: 16px;
              }

              &::after {
                clear: both;
                content: '';
                display: block;
              }

              .facilitiesList {
                width: 10%;
                float: left;

                &:first-of-type {
                  margin-left: 0;
                }

                .icon {
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

                .name {
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
          }
          .facilitiesAll{
            height: 0;
            overflow: hidden;
            &.open{
              height: auto;
              overflow: visible;
            }
            .contentWrap{
              margin-top: 60px;
              &::after{
                clear: both;
                content: '';
                display: block;
              }
              .title{
                font-size: 16px;
                color: #939499;
              }
              .specialList{
                .wrap{
                  .list{
                    width: calc(100% / 7);
                    margin-top: 20px;
                    display: inline-block;
                    vertical-align: top;
                    text-align: center;
                    font-size: 0;
                    .img{
                      margin: 0 auto;
                      width: 60px;
                      height: 60px;
                      background-image: url('https://cdn.bringprice.com/image/teaser/flight/방콕.jpg');
                      background-size: 44px 44px;
                      background-position: center center;
                      background-repeat: no-repeat;
                      border-radius: 50px;
                    }
                    .name{
                      font-size: 14px;
                      color: #000;
                      margin-top: 13px;
                      text-align: center;
                      padding: 0 8px;
                      white-space: normal;
                    }
                  }
                }
              }
              .normalList{
                margin-top: 60px;
                .wrap{
                  position: relative;
                  ul{
                    margin-top: 9px;
                    li{
                      float: left;
                      width: 50%;
                      margin-top: 12px;
                      font-weight: 400;
                      font-size: 16px;
                      color: #000;
                      &::before {
                        content: '\B7';
                        margin-right: 4px;
                      }
                    }
                    &::after{
                      content: '';
                      clear: both;
                      display: block;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .booking-wrap{
    width: 434px;
    border-radius: 4px;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
    border: solid 1px #537aff;
    background-color: #fff;
    margin-bottom: 57px;
    position: absolute;
    left: calc(((100% - 1230px) / 2) + (1230px - 454px) + 20px);
    right: 0;
    top: 30px;
    overflow: hidden;
    .gra{
      height: 56px;
      background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), #ffffff);
      z-index: 9;
      position: absolute;
      right: 15px;
      bottom: 55px;
      left: 0;
    }
    .booking{
      padding: 20px 0 0 20px;
    }
    .booking-info{
      padding-top: 10px;
      .title{
        font-weight: bold;
        font-size: 16px;
        color: #000;
      }
      .info{
        font-size: 12px;
        color: $brown-grey;
      }
    }
    .room-option{
      .check-list{
        margin-top: 20px;
        margin-bottom: 10px;
        &::after {
          clear: both;
          content: '';
          display: block;
        }
        li {
          float: left;
          margin-right: 10px;
          .checked {
            transition: .3s ease;
            width: 18px;
            height: 18px;
            border-radius: 2px;
            border: 1.5px solid #cdcdcd;
            position: relative;
            &.active{
              background-color: #537aff;
              border: 1.5px solid #537aff;
            }
            &.disable{
              border-color: #868686;
              background-color: #868686;
            }
            .checkSvg{
              position: absolute;
              font-size: 30px;
              margin: -8px;
              color: #fff;
            }
          }
          &:hover .checked:not(.active) {
            border: 1.5px solid #B2BFEA;
            background-color: #B2BFEA;
          }
          &:first-of-type{
            margin-left: 0;
          }
          &:last-of-type{
            margin-right: 0;
          }
        }
        li, div {
          label{
            display: block;
            cursor: pointer;
          }
          .check-wrap {
            display: flex;
            align-items: center;
            .inputCheck {
              display: none;
            }
            .title{
              font-size: 14px;
              color: #000;
              margin-left: 15px;
            }
            .info{
              font-size: 14px;
              color: #000;
              margin-left: 10px;
            }
          }
        }
      }
    }
    .room-list-wrap {
      overflow-y: scroll;
      max-height: 395px;
      padding-right: 20px;
      padding-bottom: 10px;
      .room-option{
        display: flex;
        justify-content: space-between;
        div:first-of-type{
          display: flex;
        }
        .price-point{
          background-color: #20d578;
          width: 37px;
          color: #fff;
          border-radius: 8px;
          font-size: 8px;
          font-weight: bold;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .price-point ~ .agoda-logo{
          margin-left: 4px;
        }
        .agoda-logo{
          width: 48px;
          height: 16px;
          background-repeat: no-repeat;
          background-size: 48px 16px;
          background-image: url(~assets/img/hotelDetail/agoda-logo.svg);
        }
      }
      .room {
          width: 100%;
          border: 1px solid #e9e9e9;
          border-radius: 2px;
          padding: 10px;
          margin-top: 6px;
          &:first-of-type{
            margin-top: 0;
          }
          &.more-room-btn{
            display: flex;
            cursor: pointer;
            justify-content: center;
            align-items: center;
          }
          .option {
            font-size: 10px;
            color: $brown-grey;
            font-weight: bold;
            &::after {
              content: '\B7';
              margin: 0 5px;
            }
            &:last-of-type::after{
              content: ' 가능';
            }
          }

          .price {
            font-size: 12px;
            line-height: 27px;
            margin-top: 6px;
            color: #000;
            .price-value {
              font-weight: bold;
              font-size: 18px;
            }
          }
          .priceOne{
            color: #868686;
            font-size: 12px;
          }

          .room-name {
            color: #000;
            font-size: 14px;
            line-height: 20px;
            margin-top: 8px;
          }
        &:first-of-type {
          margin-top: 0;
        }

        &:last-child {
          margin-bottom: 20px;
        }

        .title {
          color: $brown-grey;
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
    .booking-btn{
      width: 100%;
      height: 55px;
      cursor: pointer;
      text-align: center;
      line-height: 55px;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      &.book{
        background-color: $dodger-blue;
      }
      &.soldOut{
        cursor: default;
        background-color: #868686;
      }
      &.loading{
        background-color: #f2f2f2;
      }
    }
  }
  .tip{
    width: 100%;
    p{
      font-weight: bold;
      font-size: 10px;
      text-align: center;
      padding-top: 10px;
    }
  }
  .photo-wrap{
    width: 876px;
    height: 546px;
    position: fixed;
    top: calc(50% - 300px);
    z-index: 99;
  }
  .xBtn{
    width: 40px;
    height: 40px;
    background-image: url(~assets/img/hotelDetail/x-btn.svg);
    background-size: cover;
    cursor: pointer;
    background-position: center center;
    opacity: 0.3;
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 2;
    transition: 0.3s ease;
    &:hover{
      opacity: 1;
    }
  }
  .list-enter-active{
    transition: all .3s;
  }
  .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  @keyframes moveImg {
    from {
      opacity: 0;
      transform: translateX(0%);
    }
    10%{
      opacity: 1;
    }
    60%{ opacity: 1; }
    to {
      opacity: 0;
      transform: translateX(1500%);
    }
  }
</style>
