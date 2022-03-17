<template>
  <div id="room-info">
    <div class="room-title">
      <p class="title">객실정보</p>
      <span class="sub-title">수수료 및 세금이 포함되어있는 금액입니다.</span>
    </div>
    <div
      class="room-wrap"
    >
      <div
        v-swiper:mySwiper="swiperOption"
        @slideChange="swiperChange"
        ref="swiper"
        class="contents">
        <div
          class="swiper-wrapper"
        >
          <div
            v-for="(room, index) in hotelInfo.rooms"
            :key="index"
            class="room-option swiper-slide"
            :style="[
              index === 0 && swiperIndex > 0 ? { marginLeft: '10px' } : {},
              index > 0 && swiperIndex > 0 && index === swiperIndex ? { marginLeft: '10px' } : {},
              index > 0 && index > swiperIndex ? { marginLeft: '10px' } : {}
            ]"
          >
            <div class="option">
              <div class="option-top">
                <p class="title"><span>{{ room.name }}</span></p>
              </div>
              <div class="option-bottom">
                <div class="room-option-list">
                <div
                  v-if="getOptions(index).length > 0"
                  v-for="(val, optionIndex) in getOptions(index)"
                  :key="optionIndex"
                  class="option-list"><span>{{ getOptionName(val) }}</span></div>
                </div>
              </div>
            </div>
            <div class="price">
              <span class="agent">아고다</span>
              <p class="val"><span class="point">{{format.priceFormat(room.totalPrice)}}</span>원</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['hotelInfo'],
  data() {
    return {
      format: Format,
      totalPrice: 0,
      selectIndex: 0,
      swiperOption: {
        // width: 0,
        // init: false,
      },
      swiperIndex: 0,
    };
  },
  methods: {
    getOptions(index) {
      const options = [
        { val: this.hotelInfo.rooms[index].bookNowPayLater, name: 'bookNowPayLater' },
        { val: this.hotelInfo.rooms[index].breakfastIncluded, name: 'breakfastIncluded' },
        { val: this.hotelInfo.rooms[index].freeWifi, name: 'freeWifi' },
        { val: this.hotelInfo.rooms[index].isFreeCancelable, name: 'isFreeCancelable' },
      ].filter(item => item.val);
      return options.map(item => item.name);
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
    swiperChange() {
      this.swiperIndex = this.$refs.swiper.swiper.activeIndex;
    },
  },
};
</script>

<style lang="scss">
  #room-info{
    .swiper-container{
      overflow: visible;
      transition: .3s ease;
    }
  }
</style>

<style lang="scss" scoped>
  #room-info {
    margin-top: 40px;
    .room-wrap {
      width: calc(100% - 40px);
      padding-left: 20px;
      padding-right: 30px;
      .contents {
        width: 100%;
        margin-bottom: 100px;
      }
    }

    .room-title {
      padding: 0 20px;

      .title {
        color: #282729;
        font-size: 20px;
        font-weight: 500;
      }

      .sub-title {
        font-size: 12px;
        line-height: 15px;
        color: #939499;
        margin-top: 4px;
      }
    }

    .room-option {
      width: 100%;
      border-radius: 4px;
      border: solid 1px #f2f2f2;
      background-color: #ffffff;
      margin-top: 10px;
      padding: 16px 12px 10px 12px;

      &:first-of-type {
        .price{
          .val{
            .point{
              color: #20d578;
            }
          }
        }
      }

      .option {
        width: 100%;
        background-color: #fff;

        .option-top {
          display: flex;
          align-items: center;

          .title {
            color: #282729;
            font-size: 14px;
          }
        }
      }

      .price {
        .agent {
          margin-top: 8px;
          font-size: 10px;
          color: #939499;
          line-height: 12px;
        }

        .val {
          font-size: 18px;
          color: #000;

          .point {
            font-weight: bold;
          }
        }
      }

      .option-bottom {
        margin-top: 16px;
        color: $greyish-brown;
        font-size: 14px;
        line-height: 20px;

        .price-info {
          color: #868686;
          font-size: 12px;
          line-height: 15px;
        }

        .room-option-list {
          font-size: 12px;
          color: #000;
          &::after{
            clear: both;
            content: '';
            display: block;
          }
          .option-list {
            line-height: 22px;
            float: left;
            margin-left: 4px;
            &:first-of-type{
              margin-left: 0;
            }
            span {
              border-radius: 8.5px;
              padding: 3px 6px;
              font-size: 10px;
              color: #282729;
              background-color: #f8f9fb;
            }
          }
        }
      }
    }

    .select-btn {
      width: 67px;
      height: 37px;
      border-radius: 2px;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid $very-light-pink;
      color: $brown-grey;
    }

    .select-btn.active {
      border: none;
      color: #fff;
      background-color: $cornflower;
      font-weight: normal;
    }
  }
</style>

