<template>
  <li
    @click="openDetail(item.id, index)"
  >
    <div class="lists">
      <div
        class="swiper-slide-wrap"
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
          :hotelListImg="item.images && item.images.length > 0 ? item.images : [{url: 'https://cdn.bringprice.com/image/schedule/no-image-box.png'}]"
        />
      </div>
      <div class="list-info">
        <div class="contents">
          <p class="list-info-title">{{ item.korName }}</p>
          <p class="list-info-sub">
            {{ item.star }}성급 |
            <span v-if="item.review && item.review.summary.score > 0">{{ item.review.summary.score }} {{ item.review ? format.ratingText(item.review.summary.score) : '' }} |</span>
            <span v-else-if="item.address">{{ item.address }}</span>
          </p>
        </div>
      </div>
      <div
        v-if="item.rooms.length && item.rooms[0]"
        class="contents">
        <div class="list-title">
          <p class="price">
            <span>
              <span
                class="bold">
              {{ format.priceFormat(item.rooms[0].pricePerNight) }}</span>원 부터
            </span>
          </p>
        </div>
      </div>
      <div
        v-else
        class="contents">
        <div class="list-title">
          <p>
            <span>
              <span
                class="soldOut">SOLD OUT</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
import swiperSlide from './swiperSlide.vue'; // eslint-disable-line

export default {
  props: ['index', 'item', 'itemWidth', 'hotelList', 'inputData'],
  data() {
    return {
      format: Format,
    };
  },
  components: {
    swiperSlide,
  },
  methods: {
    openDetail(id, index) {
      this.$emit('open-detail', id, index);
      // this.$store.commit('saveHotelDetail', this.$store.state.hotelListObj.list[index]);
    },
  },
};
</script>

<style lang="scss" scoped>
 .hotelList-section li{
   list-style: none;
   width: 100%;
   margin-top: 10px;
   border-radius: 4px;
   border: 1px solid #f2f2f2;
   background-color: #ffffff;
   overflow: hidden;
  }
  .swiper-container{
    height: 151px;
    background-color: #f8f8f8;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
  }
  .hotelList-section ul .lists{
    width: 100%;
    background-color: #fff;
    color: #9b9b9b;
    border-radius: 2px;
    overflow: hidden;
    position: relative;
    .swiper-slide-wrap{
      width: 100%;
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
  }
  .hotelList-section .lists .list-title{
    line-height: 24px;
    margin-right: 10px;
    float: right;
  }
  .hotelList-section .lists .title{
    width: 153px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    position: absolute;
    top: 10px;
    left: 10px;
    color: #fff;
    z-index: 2;
    background-color: $rosy-pink;
    font-size: 10px;
  }
  .hotelList-section .lists .price{
    font-size: 12px;
    margin-top: 1px;
  }
  .hotelList-section .lists .price.solo{
    margin: 0;
    line-height: 34px;
  }
  .hotelList-section .lists .price .bold{
    font-weight: bold;
    font-size: 18px;
    color: #000;
  }
  .soldOut{
    font-weight: bold;
    font-size: 18px;
    color: #cdcdcd;
  }
  .hotelList-section .lists > .contents{
    width: 100%;
    margin-top: 8px;
    padding-bottom: 10px;
    &::after{
      content: '';
      clear: both;
      display: block;
    }
  }
  .booking{
    background-color: $rosy-pink;
    font-size: 14px;
    border-radius: 2px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 101px;
    height: 37px;
    margin-right: 10px;
    line-height: 37px;
  }
  .list-info{
    width: 100%;
  }
  .hotelList-section .lists .list-info .contents{
    width: 100%;
    padding-left: 10px;
    padding-top: 10px;
    color: $greyish-brown;
    .category{
      font-size: 10px;
      line-height: 10px;
      font-weight: bold;
      margin-bottom: 1px;
      color: $brown-grey;
    }
  }
  .hotelList-section .lists .list-info .list-info-title{
    font-size: 14px;
    line-height: 17px;
    font-weight: bold;
    color: #000;
  }
  .hotelList-section .lists .list-info .list-info-sub{
    font-size: 12px;
    line-height: 14px;
    color: $brown-grey;
  }
</style>
