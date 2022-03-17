<template>
  <div
    id="hotelDetail"
    ref="hotelDetail"
  >
    <div
      v-if="hotelDetailData"
      class="hotelDetail-wrap"
    >
      <div class="detail-top" ref='top'>
        <div class="top-control" :class="topControlFlag ? 'open' : ''">
          <div class="contents">
            <div class="group-flex">
              <div
                class="chevron-left"
                :class="topControlFlag ? 'open' : 'back'"
                @click="back"
              />
            </div>
            <div
              @click="share"
              :class="topControlFlag ? 'open' : 'back'"
              class="top-control-external"
            >공유하기</div>
          </div>
        </div>
      </div>
      <div class="contents-wrap"
        ref="detailContent"
        :style="{ top: 0 }"
      >
        <div class="slider-img-wrap">
          <swiper-slide
            :hotelListImg="img"
            class="detail-img"
            ref='img'
          ></swiper-slide>
        </div>
        <detailTab
          :hotelDetail="hotelDetailData"
          :searchFlag="searchFlag"
          :inputData="inputData"
          :searchIndex="searchIndex"
          :facilitiesReadMore="facilitiesReadMore"
          @open-facilities="facilitiesReadMore = true"
          @swiper-change="swiperChange"
          @set-swiper="setSwiper"
        />
      </div>
    </div>
    <div class="booking-wrap">
      <div v-if="!loading" class="price-info">
        <div v-if="hotelDetailData.rooms.length > 0" class="info">
          <div>{{ format.getBetweenDay(inputData.checkinDate, inputData.checkoutDate)}}박 {{format.getBetweenDay(inputData.checkinDate, inputData.checkoutDate) + 1}}일 총 숙박 요금</div>
          <div>아고다에서 최저가 예약시</div>
        </div>
        <div v-else class="soldOut">
          <div>해당일 제공되는 <span>객실 없음</span></div>
        </div>
        <div class="val" v-if="hotelDetailData.rooms.length > 0">
          <div><span class="point">{{format.priceFormat(hotelDetailData.rooms[0].totalPrice)}}</span>원</div>
          <div><span class="pricePerNightIcon"></span> 1박 당 {{format.priceFormat(hotelDetailData.rooms[0].pricePerNight)}}원</div>
        </div>
      </div>
      <div
        v-if="!loading"
        class="booking">
        <button
          v-if="hotelDetailData.rooms && hotelDetailData.rooms.length > 0"
          @click="bookingHotel(hotelDetailData.rooms[0].roomUrl, hotelDetailData.korName, hotelDetailData.rooms[0].totalPrice)"
          class="booking-btn book"
        >예약하기</button>
        <div v-else class="booking-btn soldOut">SOLD OUT</div>
      </div>
    </div>
    <Alert v-if="$route.query && $route.query.popFlag === 'alert'"></Alert>
    <div
      @click="$router.back()"
      :style="$route.query.share ? { display: 'block' } : { display: 'none' }"
      class="bpPop"
    >
      <share
        :shareFlag="'hotel'"
        :hotelDetailData="hotelDetailData"
      />
    </div>
    <transition name="slide-bottom-fade" mode="out-in">
      <facilitiesWrap
        v-if="facilitiesReadMore"
        :facilities="hotelDetailData.facilities"
        :specialFacility="hotelDetailData.specialFacility"
        @close-facilities="facilitiesReadMore = false"
      />
    </transition>
  </div>
</template>

<script>
import detailTab from './detailTab.vue';
import swiperSlide from './detailSwiperSlide.vue'; // eslint-disable-line
import share from '~/components/common/user/mobile/share.vue'; // eslint-disable-line
import facilitiesWrap from './facilities.vue';
import Alert from '~/components/common/alert.vue'; // eslint-disable-line
import Api from '~/utils/api'; // eslint-disable-line
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['inputData', 'hotelDetail'],
  components: {
    facilitiesWrap,
    detailTab,
    swiperSlide,
    share,
    Alert,
  },
  data() {
    return {
      img: [],
      hotelDetailData: this.hotelDetail || null,
      format: Format,
      searchFlag: 'room',
      topVal: 0,
      scrollTop: 0,
      searchIndex: 0,
      swiperEl: '',
      viewAllPhotos: false,
      loading: true,
      facilitiesReadMore: false,
      timeout: '',
      tempData: [
        {
          name: '모든객실에서 제공되는 시설 및 서비스',
          list: ['객실 내 안전 금고', '긴 침대(2m 이상)', 'DVD/CD 플레이어', '거울', '간이주방', '욕실 내 TV', '에베베베베베베베베베베베', '에베베베베베베', '에베베'],
          index: 3,
        },
        {
          name: '모든객실에서 제공되는 시설 및 서비스',
          list: ['객실 내 안전 금고', '긴 침대(2m 이상)', 'DVD/CD 플레이어', '거울', '간이주방', '욕실 내 TV', '에베베베베베베베베베베베', '에베베베베베베', '에베베'],
          index: 2,
        },
        {
          name: '모든객실에서 제공되는 시설 및 서비스',
          list: ['객실 내 안전 금고', '긴 침대(2m 이상)', 'DVD/CD 플레이어', '거울', '간이주방', '욕실 내 TV', '에베베베베베베베베베베베', '에베베베베베베', '에베베'],
          index: 1,
        },
        {
          name: '모든객실에서 제공되는 시설 및 서비스',
          list: ['객실 내 안전 금고', '긴 침대(2m 이상)', 'DVD/CD 플레이어', '거울', '간이주방', '욕실 내 TV'],
          index: 0,
        },
      ],
    };
  },
  computed: {
    topControlFlag() {
      return this.scrollTop >= 248;
    },
    scrollOpen() {
      return this.scrollTop >= 280;
    },
  },
  methods: {
    swiperChange(index) {
      this.searchFlag = index === 0 ? 'room' : 'hotel';
    },
    setSwiper(swiperEl) {
      // swiperEl.swiper.slideTo(1, 100);
      this.swiperEl = swiperEl;
    },
    selectedFlagChange(flag) {
      this.searchFlag = flag;
      this.searchIndex = flag === 'room' ? 0 : 1;
      if (this.swiperEl) {
        this.swiperEl.swiper.slideTo(this.searchIndex, 300);
      }
    },
    bookingHotel(queryUrl, name, totalPrice) {
      const encode = `https://bringprice.com/hotelOuterLink/${encodeURIComponent(queryUrl)}`;
      // console.log(encode);
      if (queryUrl) {
        // console.log(encode);
        window.open(encode);
      }
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'exitHotel',
        eventAction: 'mobile',
        eventLabel: name,
        eventValue: parseInt(totalPrice, 10),
      });
    },
    bodyScroll() {
      this.scrollTop = this.$refs.detailContent.scrollTop;
    },
    setHotelInfo() {
      this.topVal = this.$refs.top.clientHeight;
      this.$refs.detailContent.addEventListener('scroll', this.bodyScroll);
      this.img = this.hotelDetailData.images;
      this.searchFlag = this.hotelDetailData && this.hotelDetailData.rooms && this.hotelDetailData.rooms.length > 0 ? 'room' : 'hotel';
    },
    back() {
      history.back();
      this.$store.commit('clearHotelDetail');
    },
    share() {
      if (window.navigator.userAgent.indexOf('bpIos') >= 0) {
        window.plugins.socialsharing.share(
          '브링프라이스',
          `${this.hotelDetailData.korName}`,
          this.hotelDetailData.images ? this.hotelDetailData.images[0] : 'https://cdn.bringprice.com/shareThumbnailImage/default.png',
          `https://bringprice.com${this.$route.path}?utm_source=share&utm_medium=ios_app`,
        ); // eslint-disable-line
      } else {
        this.$router.push({ query: { share: 'share' } });
      }
    },
  },
  mounted() {
    // console.log('hotel detail mounted');
    window.document.body.style.overflowY = 'hidden';
    window.document.documentElement.style.overflowY = 'hidden';
    if (this.hotelDetailData) {
      this.loading = false;
      this.setHotelInfo();
    } else {
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
      Api.getHotelDetail(sendParam, this.$route.params.hotelId)
        .then((resp) => {
          this.loading = false;
          this.hotelDetailData = resp.data;
          // console.log(resp.data);
          // console.log((this.hotelDetailData));
          this.$nextTick(() => {
            this.setHotelInfo();
          });
        });
    }
  },
  beforeDestroy() {
    window.document.body.style.overflowY = '';
    window.document.documentElement.style.overflowY = '';
  },
};
</script>

<style lang="scss" scoped>
  #hotelDetail{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    .hotelDetail-wrap{
      z-index: 11;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      .detail-top{
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        color: $greyish-brown;
        z-index: 11;
        .top-control{
          width: 100%;
          height: 54px;
          height: calc(54px + constant(safe-area-inset-top));
          height: calc(54px + env(safe-area-inset-top));
          background-color: rgba(255, 255, 255, 0);
          -webkit-transition: opacity, .2s;
          -moz-transition: opacity, .2s;
          -ms-transition: opacity, .2s;
          -o-transition: opacity, .2s;
          transition: opacity, .2s;
          visibility: visible;
          padding-top: constant(safe-area-inset-top);
          padding-top: env(safe-area-inset-top);
          &.open{
            background-color: rgba(255, 255, 255, 1);
          }
          > .contents{
            /*transition: opacity 0.3s ease;*/
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            justify-content: space-between;
            text-align: center;
            align-items: center;
            .group-flex{
              display: flex;
              align-items: center;
            }
            .hotelName{
              max-width: calc(275px);
              color: #000;
              font-size: 16px;
              margin-left: 4px;
              word-break: break-all;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .chevron-left{
              width: 40px;
              height: 40px;
              background-size: 21px;
              background-position: center center;
              margin-left: 4px;
              cursor: pointer;
              background-repeat: no-repeat;
              background-color: transparent;
              &.back{
                background-image: url(~assets/img/hotelDetail/chevron-left.svg);
              }
              &.open{
                background-image: url(~assets/img/hotelDetail/chevron-left-black.svg);
              }
            }
          }
          .top-control-external{
            padding-right: 19px;
            font-weight: bold;
            font-size: 14px;
            color: #fff;
            &.open{
              color: #000;
            }
          }
        }
        p {
          padding-left: 20px;
        }
      }
    }
  }
  .contents-wrap {
    position: absolute;
    bottom: 71px;
    left: 0;
    right: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .slider-img-wrap {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      .detail-img {
        width: 100%;
        height: 328px;
        max-height: 100%;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        overflow: hidden;
      }

      .info-wrap {
        position: absolute;
        text-align: center;
        color: #fff;
        z-index: 1;
        .title {
          font-weight: bold;
          font-size: 18px;
          padding: 0 20px;
        }
      }
      .view-photo{
        z-index: 1;
        font-size: 12px;
        text-align: center;
        width: 90px;
        height: 32px;
        line-height: 32px;
        border-radius: 2px;
        background-color: #fff;
        position: absolute;
        right: 10px;
        bottom: 10px;
        cursor: pointer;
      }
    }
  }
  .booking-wrap{
    width: 100%;
    background-color: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    box-shadow: 0 -2px 6px 0 rgba(0, 0, 0, 0.1);
    z-index: 11;
    transition: .3s ease;
    padding-bottom: 13px;
    .price-info{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px 10px 20px;
      .soldOut{
        font-size: 10px;
        color: #000;
        span{
          font-weight: bold;
        }
      }
      .info{
        div:first-of-type{
          font-weight: bold;
          color: #282729;
          font-size: 12px;
          line-height: 15px;
        }
        div:nth-child(2) {
          margin-top: 1px;
          line-height: 12px;
          font-size: 10px;
          color: #939499;
        }
      }
      .val{
        text-align: right;
        div:first-of-type {
          font-size: 10px;
          color: #000;
          .point{
            font-size: 16px;
            line-height: 19px;
            font-weight: bold;
            color: #20d578;
          }
        }
        div:nth-child(2) {
          margin-top: 1px;
          font-size: 10px;
          line-height: 12px;
          color: #939499;
        }
      }
    }
    .booking{
      width: 100%;
      display: flex;
      font-weight: bold;
      padding-left: 20px;
      padding-right: 20px;
    }
    .booking-btn{
      width: 100%;
      height: 47px;
      border-radius: 6px;
      text-align: center;
      line-height: 47px;
      color: #fff;
      font-weight: bold;
      &.book{
        background-color: $cornflower;
      }
      &.soldOut{
        background-color: #868686;
      }
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
  }
</style>
