<template>
  <li>
    <div
      class="lists"
      @click="openDetail(item.id, index)"
      @mouseover="$store.state.hotelListObj.geoValue ? mouseOver() : ''"
      @mouseleave="mouseLeave"
    >
      <div
        class="swiper-slide-wrap"
        :class="isMap ? 'mapOn' : ''"
      >
        <div v-if="item.rating" class="score-wrap">
          <div>
            <div class="score">
              {{ item.rating }}
            </div>
            <div class="review">
              {{ item.ratingText }}
            </div>
          </div>
        </div>
        <swiperSlide
          :isMap="isMap"
          :hotelListImg="item.images && item.images.length > 0 ? item.images : [{url: 'https://cdn.bringprice.com/image/schedule/no-image-box.png'}]"
        />
      </div>
      <div class="info-wrap">
        <div class="list-info">
          <div class="contents">
            <p class="category">{{ item.category }}</p>
            <div class="list-info-title"><p>{{ item.korName }}</p></div>
            <p class="list-info-sub">
              {{ item.star }}성급 | {{ item.city }}
            </p>
            <div
              class="option-info bubbleWrap">
              <div v-if="item.roomOptions && item.roomOptions.length > 0" class="checkIcon"></div>
              <div>
                <span
                  v-for="(option, index) in item.roomOptions"
                  :key="index"
                  class="option"
                >{{ option }}</span>
                <Bubble v-if="item.rooms" :text="'일부 객실에서만 이용 가능'" :position="[0, item.roomOptions.length * 40]"/>
              </div>
            </div>
          </div>
        </div>
        <div class="list-price">
          <div
            :class="!item.rooms ? 'soldOut' : ''"
            class="list-title">
            <p class="price">
              <span v-if="item.rooms">
                <span class="bold">{{ format.priceFormat(item.rooms[0].pricePerNight) }}</span>원 부터/1박
              </span>
              <span v-else>
                <span class="bold soldOut">SOLD OUT</span>
              </span>
            </p>
            <div
              v-if="item.rooms"
              class="totalPrice"
            >총 {{ format.priceFormat(item.rooms[0].totalPrice) }}원</div>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
  import Format from '~/utils/format'; // eslint-disable-line
  import swiperSlide from './swiperSlide.vue'; // eslint-disable-line
  import Bubble from '~/components/common/bubble.vue'; // eslint-disable-line

export default {
  props: ['index', 'item', 'hotelList', 'isMap', 'listRender'],
  data() {
    return {
      format: Format,
      testImages: [
        {
          url: 'https://i.travelapi.com/hotels/1000000/10000/4300/4278/6660a382_b.jpg',
        },
        {
          url: 'https://i.travelapi.com/hotels/1000000/10000/4300/4278/6660a382_b.jpg',
        },
        {
          url: 'https://i.travelapi.com/hotels/13000000/12620000/12617300/12617225/48ec36b4_z.jpg',
        },
        {
          url: 'https://i.travelapi.com/hotels/1000000/10000/4300/4278/6660a382_b.jpg',
        },
        {
          url: 'https://i.travelapi.com/hotels/1000000/10000/4300/4278/errhahaha.jpg',
        },
        {
          url: 'https://i.travelapi.com/hotels/1000000/10000/4300/4278/errhahaha.jpg',
        },
        {
          url: 'https://i.travelapi.com/hotels/1000000/10000/4300/4278/6660a382_b.jpg',
        },
      ],
      options: [],
      bubbleFlag: false,
      timeout: '',
    };
  },
  components: {
    swiperSlide,
    Bubble,
  },
  methods: {
    mouseLeave() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.$store.state.hotelListObj.geoValue.markers[this.index].active = false;
    },
    mouseOver() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.$store.state.hotelListObj.geoValue.markers[this.index].active = true;
      this.timeout = setTimeout(() => {
        this.$store.state.hotelListObj.geoValue.center.lat = this.hotelList[this.index].latitude;
        this.$store.state.hotelListObj.geoValue.center.lng = this.hotelList[this.index].longitude;
      }, 300);
    },
    openDetail(id, index) {
      this.$emit('open-detail', id, index);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$emit('hotelList-render-complete');
    });
  },
};
</script>

<style lang="scss" scoped>
  .hotelList li{
    list-style: none;
    width: 100%;
    height: 200px;
    margin-top: 10px;
  }
  .pr{
    padding-right: 20px;
  }
  .swiper-container{
    width: 210px;
    height: 157px;
    margin: 0;
    background-color: #f8f8f8;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
  }
  .info-wrap{
    width: 100%;
    padding-top: 20px;
    padding-left: 16px;
    position: relative;
    .list-price{
      position: absolute;
      right: 16px;
      bottom: 16px;
    }
  }
  .hotelList ul .lists{
    background-color: #fff;
    color: #9b9b9b;
    position: relative;
    display: flex;
    cursor: pointer;
    border-radius: 4px;
    border: solid 1px #f2f2f2;
    transition: .3s ease;
    &:hover{
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
    }
    > div.info-wrap{
      flex: 50%;
    }
    .swiper-slide-wrap{
      width: 260px;
      height: 200px;
      position: relative;
      &.mapOn{
        width: 230px;
      }
      .score-wrap{
        background-color: #000;
        position: absolute;
        z-index: 2;
        border-radius: 4px;
        padding: 6px 10px 5px 10px;
        top: 10px;
        left: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        > div {
          text-align: center;
          color: #fff;
          .score {
            font-size: 14px;
            font-weight: bold;
          }

          .review {
            margin-top: 2px;
            font-size: 8px;
          }
        }
      }
    }
    .price {
      font-size: 14px;
      color: #000;
      text-align: right;
      .solo {
        margin: 0;
        line-height: 34px;
      }
      .bold {
        font-weight: bold;
        font-size: 20px;
        &.soldOut{
          color: #868686;
        }
      }
    }
    .totalPrice {
      text-align: right;
      font-size: 14px;
      color: #868686;
    }
    > .contents{
      width: 100%;
      padding-top: 2px;
      padding-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
    .list-info{
      width: 100%;
      .contents{
        width: 100%;
        color: $greyish-brown;
        &::after{
          content: '';
          display: block;
          clear: both;
        }
        .category{
          font-size: 12px;
          line-height: 12px;
          font-weight: bold;
          color: $brown-grey;
        }
        .option-info{
          margin-top: 10px;
          font-size: 12px;
          color: #000;
          display: flex;
          align-items: center;
          float: left;
          &::after{
            content: '';
            display: block;
            clear: both;
          }
          &.bubbleWrap{
            position: relative;
            z-index: 1;
            .checkIcon{
              width: 16px;
              height: 16px;
              background-repeat: no-repeat;
              background-image: url('~assets/img/hotelList/ic-check.svg');
              background-size: 16px 16px;
              &::after{
                clear: both;
                display: block;
                content: '';
              }
            }
          }
          .option {
            &:first-of-type{
              margin-left: 6px;
            }
            &::after {
              content: '\B7';
              margin: 0 5px;
            }
            &:last-of-type::after {
              content: '';
            }
          }
          &::after{
            clear: both;
            display: block;
            content: '';
          }
        }
        .list-info-title{
          position: relative;
          width: 100%;
          height: 20px;
          margin-top: 3px;
          p {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            right: 20px;
            bottom: 0;
            font-size: 16px;
            line-height: 20px;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .list-info-sub{
          font-size: 14px;
          line-height: 20px;
          color: $brown-grey;
        }
      }
    }
    .list-title{
      line-height: 24px;
      &.soldOut{
        padding-top: 10px;
      }
    }
    .title{
      height: 20px;
      text-align: center;
      line-height: 20px;
      position: absolute;
      top: 10px;
      left: 10px;
      color: #fff;
      z-index: 2;
      padding-left: 8px;
      padding-right: 8px;
      background-color: $rosy-pink;
      font-size: 10px;
    }
  }
</style>

<style>
  .swiper-slide .swiper-lazy-preloader{
    z-index: unset;
  }
</style>
