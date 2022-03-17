<template>
  <div class="recentWrapper" v-if="recentList.length > 0">
    <div>최근검색 기록</div>
    <div
      v-swiper:mySwiper="swiperOption"
    >
      <transition-group name="fade" tag="ul" class="swiper-wrapper" mode="out-in">
        <li
          class="swiper-slide"
          v-for="(list, index) in recentList"
          v-if="list"
          :key="index"
        >
          <button
            class="btnX"
            @click="recentDel(index)"
          ></button>
          <div
            :title="list.type === 'hotel' ? getHotelPlaceName(list.destination) : getPlaceName(list.wishCities)"
          >{{ list.type === 'hotel' ? getHotelPlaceName(list.destination) : getPlaceName(list.wishCities) }}</div>
          <div>
            <div
              :title="list.type === 'flight' ? getPlaceNameCode(list) : getHotelContryName(list.destination)"
            >{{ list.type === 'flight' ? getPlaceNameCode(list) : getHotelContryName(list.destination) }}</div>
            <div>{{ list.type === 'hotel' ? getDate(list.checkin, list.checkout) : getDate(list.startDate, list.returnDate) }}</div>
          </div>
          <button
            class="submit"
            @click="submit(list)"
          >
            {{ list.type === 'hotel' ? '호텔 검색' : '항공권 검색' }}
          </button>
        </li>
      </transition-group>
    </div>
    <div
      class="swiper-button-prev" slot="button-prev"
    ></div>
    <div
      class="swiper-button-next" slot="button-next"
    ></div>
  </div>
</template>

<script>
import format from '~/utils/format'; // eslint-disable-line
export default {
  data() {
    return {
      format,
      swiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 8,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
      recentList: [],
    };
  },
  mounted() {
    this.recentList = this.$cookies.get('bpHistory') ? JSON.parse(this.$cookies.get('bpHistory')).reverse() : [];
  },
  methods: {
    getDate(start, end) {
      return `${this.format.dateFormat(start)} - ${this.format.dateFormat(end)} | ${this.format.getBetweenDay(start, end)}박`;
    },
    recentDel(index) {
      const arr = [];
      for (let x = 0; x < this.recentList.length; x += 1) {
        if (x !== index) {
          arr.push(this.recentList[x]);
        }
      }
      const reverse = [];
      for (let x = arr.length - 1; x >= 0; x -= 1) {
        reverse.push(arr[x]);
      }
      if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && window.location.hostname !== 'dev.bp.front.bringprice.com') {
        this.$cookies.set('bpHistory', JSON.stringify(reverse), '30d', '/', '.bringprice.com');
      } else {
        this.$cookies.set('bpHistory', JSON.stringify(reverse), '30d', '/');
      }
      this.recentList = [];
      this.$nextTick(() => {
        for (let x = 0; x < arr.length; x += 1) {
          this.recentList.push(arr[x]);
        }
      });
    },
    getHotelContryName(destination) {
      if (destination.indexOf('region') >= 0) {
        const obj = JSON.parse(destination);
        return `${obj.city_name || obj.region || obj.country_name}, ${obj.country_name}`;
      }
      return '';
    },
    getHotelPlaceName(destination) {
      if (destination.indexOf('region') >= 0) {
        const obj = JSON.parse(destination);
        return obj.name;
      }
      return destination;
    },
    getPlaceName(wishCities) {
      const arr = [];
      for (let x = 0; x < wishCities.length; x += 1) {
        arr.push(wishCities[x].PlaceName);
      }
      return arr.join(', ');
    },
    getPlaceNameCode(list) {
      const arr = [];
      arr.push(`${list.startCity.PlaceName}(${list.startCity.PlaceId.substr(0, 3)})`);
      for (let x = 0; x < list.wishCities.length; x += 1) {
        arr.push(`${list.wishCities[x].PlaceName}(${list.wishCities[x].PlaceId.substr(0, 3)})`);
      }
      arr.push(`${list.startCity.PlaceName}(${list.startCity.PlaceId.substr(0, 3)})`);
      return arr.join(' - ');
    },
    submit(list) {
      let path = '';
      if (list.type === 'flight') {
        const arr = [];
        for (let x = 0; x < list.wishCities.length; x += 1) {
          arr.push(list.wishCities[x].PlaceId.split('-')[0]);
        }
        path = `/flightList/${list.startCity.PlaceId.split('-')[0]}/${list.startDate}/${list.returnDate}/${arr.join('&')}/Economy/1/0/0/list`;
      } else {
        path = `/hotelList/${list.destination}/${list.checkin}/${list.checkout}/2/null/1/list`;
        this.$store.commit('clearHotel');
      }
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'recentSearch',
        eventAction: list.type,
      });
      this.$router.push(path);
    },
  },
};
</script>

<style lang="scss" scoped>
  .recentWrapper{
    padding-top: 45px;
    position: relative;
    > div:first-of-type{
      font-size: 16px;
      font-weight: bold;
      padding-bottom: 12px;
    }
    ul{
      width: 100%;
      li {
        background-color: #FFF;
        padding: 10px;
        border-radius: 2px;
        white-space: nowrap;
        position: relative;
        > div:first-of-type{
          font-weight: bold;
          line-height: 24px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        > div:nth-of-type(2) {
          font-size: 12px;
          color: #9b9b9b;
          margin-top: 10px;
          line-height: 18px;
          > div{
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        button.btnX{
          position: absolute;
          background-image: url(~assets/img/common/x_black.svg);
          width: 18px;
          height: 18px;
          right: 10px;
          top: 10px;
          background-size: cover;
        }
        button.submit{
          margin-top: 10px;
          opacity: 0.9;
          border-radius: 2px;
          background-color: #e9e9e9;
          color: #9b9b9b;
          width: 100%;
          height: 52px;
          transition: .3s ease;
          &:not(.disable):hover{
            color: #FFF;
            background-color: $cornflower;
            font-weight: bold;
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  .recentWrapper .swiper-button-prev, .recentWrapper .swiper-button-next{
    width: 20px;
    height: 20px;
    background-image: url(~assets/img/common/chevron-left.svg);
    position: absolute;
    top: 137px;
  }
  .recentWrapper .swiper-button-next{
    right: -30px;
    transform: rotate(180deg);
    cursor: pointer;
  }
  .recentWrapper .swiper-button-prev{
    left: -30px;
  }
  .recentWrapper .swiper-slide{
    width: 271.5px;
  }
</style>
