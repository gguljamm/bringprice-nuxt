<template>
  <div class="bookWrap">
    <div class="progress" v-if="bookList.length === 1"
      :class="progress(bookList[0]) === 100 ? 'fadeOut' : ''"
      :style="{
        width: !progressInit ? '0%' : `${progress(bookList[0])}%`,
      }"
    ></div>
    <div class="bookHeader">
      <button
        @click="historyBack()"
      ></button>
    </div>
    <div class="bookContent" v-if="bookList.length === 1">
      <h3>예약하기</h3>
      <p v-if="progress(bookList[0]) !== 100" class="loading">
        가격 및 좌석을 확인중입니다.
      </p>
      <p v-else>
        성인 {{ $route.params.adults }}명
        {{ $route.params.children > 0 ? `소아 ${$route.params.children}명` : '' }}
        {{ $route.params.infants > 0 ? `유아 ${$route.params.infants}명` : '' }}
        {{ cabinName }}기준 요금입니다.
      </p>
      <div :key="bookList[0].requestNum" class="bookList">
        <div>
          <ul>
            <li
              v-for="(book, index2) in bookList[0].list"
              :key="`${book[0].deeplink}${bookList[0].requestNum}`"
            >
              <outlink-segment
                :option="book"
                :bookIndex="0"
                :optionIndex="index2"
                @submit="submit"
              ></outlink-segment>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="bookContent" v-else>
      <h3>구간별 항공권 예약하기</h3>
      <p>
        성인 {{ $route.params.adults }}명
        {{ $route.params.children > 0 ? `소아 ${$route.params.children}명` : '' }}
        {{ $route.params.infants > 0 ? `유아 ${$route.params.infants}명` : '' }}
        {{ cabinName }}기준 요금입니다.
      </p>
      <div
        v-swiper:mySwiper="swiperOption"
        style="width: 100%;"
        ref="swiper"
      >
        <div class="swiper-wrapper">
          <div class="swiper-slide bookList"
            v-for="(itinerary, index) in bookList"
            :key="index"
          >
            <div>
              <div>
                <div>{{ index + 1 }}번째 구간</div>
                <div v-if="progress(bookList[index]) !== 100" class="loading">
                  가격 및 좌석을 확인중입니다.
                </div>
                <div v-else>
                  {{ format.dateFormat(SegmentsList[index].departureTime) }} {{ format.getDayOfWeek(SegmentsList[index].departureTime) }}요일
                  | {{ SegmentsList[index].originStationCode }} - {{ SegmentsList[index].destinationStationCode }}
                </div>
                <div class="progress"
                  :class="progress(bookList[index]) === 100 ? 'fadeOut' : ''"
                  :style="{
                    width: !progressInit ? '0%' : `${progress(bookList[index])}%`,
                  }"
                ></div>
              </div>
              <ul v-if="itinerary.list && itinerary.list.length > 0">
                <li v-for="(book, index2) in itinerary.list.slice(0, bookList[index].max)" :key="`${book[0].deeplink}${itinerary.requestNum}`">
                  <outlink-segment
                    :option="book"
                    :bookIndex="index"
                    :optionIndex="index2"
                    @submit="submit"
                  ></outlink-segment>
                </li>
                <button
                  class="moreBtn" v-if="bookList[index].max < bookList[index].list.length"
                  @click="bookList[index].max += 10"
                >더 비싼 예약사이트 보기 +{{ bookList[index].list.length - bookList[index].max > 10 ? 10 : bookList[index].list.length - bookList[index].max }}개</button>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
import OutlinkSegment from './outlinkSegment.vue';
import LivePriceHelper from '~/utils/livePriceHelper'; // eslint-disable-line

export default {
  components: {
    OutlinkSegment,
  },
  props: ['bookList', 'SegmentsList'],
  data() {
    return {
      format: Format,
      swiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 10,
      },
      progressInit: false,
    };
  },
  computed: {
    cabinName() {
      if (this.$route.params.cabinClass === 'PremiumEconomy') {
        return '프리미엄일반석';
      } else if (this.$route.params.cabinClass === 'Business') {
        return '비즈니스석';
      } else if (this.$route.params.cabinClass === 'FirstClass') {
        return '일등석';
      }
      return '일반석';
    },
  },
  methods: {
    progress(book) {
      return LivePriceHelper.progress(book);
    },
    sumPrice(items) {
      let sumPrice = 0;
      for (let x = 0; x < items.length; x += 1) {
        sumPrice += items[x].Price;
      }
      return sumPrice;
    },
    historyBack() {
      history.back();
    },
    submit(book, bookIndex, optionIndex, itemIndex) {
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'exitFlight',
        eventAction: `mobile-${this.bookList.length === 1 ? 'round' : 'multi'}`,
        eventLabel: book[itemIndex].agentName,
      });
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'averageFare',
        eventAction: 'mobile',
        eventValue: parseInt(book[itemIndex].price, 10),
      });
      window.open(book[itemIndex].deeplink, '_blank');
      this.$emit('send-log', bookIndex, optionIndex, itemIndex);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.progressInit = true;
    });
  },
};
</script>

<style lang="scss" scoped>
  .bookHeader {
    height: 46px;
    button:first-of-type {
      left: 4px;
      top: 0;
      width: 40px;
      height: 40px;
      background-size: 21px;
      background-position: center 14px;
      background-repeat: no-repeat;
      border: 0;
      background-color: transparent;
      position: absolute;
      cursor: pointer;
      background-image: url(~assets/img/common/x_black.svg);
    }
  }
  .bookContent{
    position: absolute;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    h3{
      padding: 0 20px;
      font-size: 20px;
      line-height: 29px;
    }
    p{
      padding: 0 20px;
      line-height: 20px;
      font-size: 14px;
      color: #9b9b9b;
      &.loading{
        color: #d0021b;
      }
    }
    .bookList{
      padding: 0 20px;
      margin-bottom: 30px;
      margin-top: 10px;
      &.swiper-slide{
        padding: 0;
        width: 85%;
        transform: translateX(20px);
        > div{
          background-color: #FFF;
          border-radius: 2px;
          box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
          > div{
            border-bottom: 1px solid #f8f8f8;
            padding: 10px;
            position: relative;
          }
        }
        &:last-of-type{
          width: calc(85% + 40px);
          padding-right: 40px;
        }
      }
      > div{
        > div{
          > div:first-of-type{
            font-size: 16px;
            line-height: 24px;
            font-weight: bold;
          }
          > div:nth-of-type(2){
            font-size: 14px;
            line-height: 20px;
            color: #9b9b9b;
            &.loading{
              color: #d0021b;
            }
          }
          > .progress{
            width: 0;
            position: absolute;
            bottom: 0;
            height: 2px;
            left: 0;
            border-radius: 1px;
            background-color: #ff677d;
            transition: 3s ease;
            &.fadeOut{
              animation: fadeOut 3s normal forwards;
            }
          }
        }
        > ul{
          background-color: #FFF;
          padding: 2px 10px;
          border-radius: 2px;
          .moreBtn{
            height: 38px;
            line-height: 38px;
            width: 100%;
            color: #9b9b9b;
            font-size: 12px;
            border-top: 1px solid #f8f8f8;
            text-align: left;
          }
          li{
            padding: 12px 0;
            border-bottom: 1px solid #f8f8f8;
            position: relative;
            &:last-of-type{
              border-bottom: 0;
            }
          }
        }
      }
    }
  }
  .bookWrap{
    > .progress{
      width: 0;
      position: fixed;
      top: 0;
      height: 2px;
      left: 0;
      border-radius: 1px;
      background-color: #ff677d;
      transition: 3s ease;
      &.fadeOut{
        animation: fadeOut 3s normal forwards;
      }
    }
  }
  @keyframes fadeOut {
    from {
    }
    80%{
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
</style>
