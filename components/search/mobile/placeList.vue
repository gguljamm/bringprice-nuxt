<template>
  <div class="placeListWrap">
    <div class="everywhere"
      v-if="flag === 'flight' && placeList.length === 0 && !loading"
    >
      <div
        @click="submit('every')"
      >
        <div>EVERYWHERE</div>
        <div>
          여행날짜가 답.정.너 라면?<br>
          예산에 맞는 항공권가격으로 여행지를 찾아보세요.
        </div>
      </div>
      <div class="recommendWrapper" v-if="recommendList.length > 0">
        <div>
          <div>인기 여행지</div>
          <ul>
            <li
              v-for="x in recommendList"
              :key="x.PlaceId"
              @click="addWishCity(x)"
            >
              <div>{{ x.PlaceName }}</div>
              <div>{{ x.CountryName }}</div>
              <button>추가</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="everywhere"
      v-else-if="flag === 'hotel' && placeList.length === 0 && !loading"
    >
      <div style="display: none;"></div>
      <div class="recommendWrapper">
        <div>
          <div>인기 여행지</div>
          <ul>
            <li v-for="(place, index) in hotelRecommendList" :key="index" @click="submit(place)">
              <div>{{ place.name }}</div>
              <div>{{ place.city_name ? `${place.city_name}, ` : '' }}{{ place.region ? `${place.region}, ` : '' }} {{ place.country_name }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="flightSearchList" v-if="!loading && placeList.length > 0">
      <ul v-if="flag === 'flight'">
        <li v-for="place in placeList" :key="place.id" @click="submit(place)" v-if="place.CityId !== '-sky'">
          <div><span v-html="listName(place.PlaceName)"></span>{{ place.RegionId ? ` ${place.RegionId}` : '' }}</div>
          <div>{{ place.CountryName }}</div>
        </li>
      </ul>
      <ul v-else>
        <li v-for="(place, index) in placeList" :key="index" @click="submit(place)">
          <div v-html="listName(place.name)"></div>
          <div>{{ place.city_name ? `${place.city_name}, ` : '' }}{{ place.region ? `${place.region}, ` : '' }} {{ place.country_name }}</div>
        </li>
      </ul>
    </div>
    <div class="loaderWrapper" v-if="loading">
      <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
import Api from '~/utils/api'; // eslint-disable-line

export default {
  props: ['placeList', 'loading', 'flag', 'query'],
  data() {
    return {
      format: Format,
      recommendList: [],
      localPlaceList: [],
      hotelRecommendList: [
        { city_name: '방콕', country: 'th', country_name: '태국', latitude: 13.7558002471924, longitude: 100.505996704102, name: '방콕', region: '방콕 지방', type: 'city' },
        { city_name: '도쿄', country: 'jp', country_name: '일본', latitude: 35.6859600461771, longitude: 139.729518064178, name: '도쿄', region: '도쿄 도', type: 'city' },
        { city_name: '다낭', country: 'vn', country_name: '베트남', latitude: 16.0683664014158, longitude: 108.219195144338, name: '다낭', region: '다낭', type: 'city' },
        { city_name: '', country: 'kr', country_name: '대한민국', latitude: 33.389711, longitude: 126.536904, name: '제주도', region: '제주도', type: 'region' },
      ],
    };
  },
  computed: {
  },
  methods: {
    listName(placeName) {
      // console.log(this.query);
      // console.log(placeName);
      if (placeName.indexOf(this.query) >= 0) {
        return placeName.replace(new RegExp(this.query, 'gi'), match => `<span class="sel">${match}</span>`);
      }
      return `<span>${placeName}</span>`;
    },
    submit(data) {
      if (this.flag === 'flight') {
        if (data === 'every') {
          this.$router.push('/date/flight/SELA&every');
          ga('send', { // eslint-disable-line
            hitType: 'event',
            eventCategory: 'clickFlightSearch',
            eventAction: 'mobile-round',
            eventLabel: 'every',
          });
        } else {
          this.$store.commit('appendFlightPlaceInfo', data);
          this.$router.push(`/place/${data.PlaceId.split('-')[0]}`);
        }
      } else {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'clickHotelSearch',
          eventAction: data.name,
        });
        this.$router.push(`/date/hotel/${JSON.stringify(data)}`);
      }
    },
    addWishCity(place) {
      this.$store.commit('appendFlightPlaceInfo', place);
      this.$router.push(`/place/${place.PlaceId.split('-')[0]}`);
    },
    bodyScroll() {
      this.$emit('clear-focus');
    },
  },
  mounted() {
    if (!this.$store.state.recommendList) {
      Api.recommendCityList('SELA-sky', []).then((resp) => {
        this.$store.commit('appendRecommendList', resp.data.Result.Places);
        this.recommendList = resp.data.Result.Places;
      });
    } else {
      this.recommendList = this.$store.state.recommendList;
    }
    window.addEventListener('scroll', this.bodyScroll);
  },
};
</script>

<style>
  .sel{
    color: #6491f8;
  }
</style>

<style lang="scss" scoped>
  .placeListWrap{
    &.swiper-left-enter-active, &.swiper-left-leave-active,
    &.swiper-right-enter-active, &.swiper-right-leave-active{
      position: absolute;
      width: 100%;
    }
  }
  .everywhere{
    padding: 16px;
    > div:first-of-type{
      padding: 12px 10px;
      background-color: #FFF;
      position: relative;
      cursor: pointer;
      height: 76px;
      border-radius: 6px;
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
      margin-bottom: 10px;
    }
  }
  .everywhere > div > div:first-child{
    color: #6491f8;
    font-size: 16px;
    font-weight: normal;
    line-height: 22px;
  }
  .everywhere > div > div:nth-of-type(2) {
    color: #4a4a4a;
    font-size: 13px;
    margin-top: 2px;
    line-height: 15px;
  }
  .everywhere > div:first-of-type:after{
    content: '';
    background-image: url(~assets/img/common/chevron-left.svg);
    width: 24px;
    height: 24px;
    position: absolute;
    right: 10px;
    top: 26px;
    transform: rotate(180deg);
  }
  .flightSearchList > ul{
    list-style: none;
    padding: 10px 20px;
  }
  .flightSearchList > ul > li{
    cursor: pointer;
    border-bottom: 1px solid #e5e5e5;
    padding: 15px 0;
  }
  .flightSearchList > ul > li > div:first-child{
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .flightSearchList > ul > li > div:nth-of-type(2){
    color: $brown-grey;
    font-size: 12px;
    margin-top: 2px;
  }
  .recommendWrapper{
    > div{
      background-color: #FFF;
      padding: 12px 0 2px;
      border-radius: 6px;
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
      > div{
        font-size: 12px;
        font-weight: bold;
        color: #9b9b9b;
        padding: 0 10px 12px;
      }
      > ul{
        padding: 0;
        margin: 0;
        list-style: none;
        > li{
          border-bottom: 1px solid #f8f8f8;
          position: relative;
          padding: 10px 10px;
          cursor: pointer;
          > div:first-of-type{
            color: #4a4a4a;
          }
          > div:nth-of-type(2) {
            color: $brown-grey;
            font-size: 12px;
          }
          > button{
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            padding: 0 14px;
            height: 28px;
            border-radius: 14px;
            background-color: #f8f8f8;
            border: 0;
            font-size: 12px;
            color: $brown-grey;
            cursor: pointer;
          }
          &:last-of-type{
            border-bottom: 0;
          }
        }
      }
    }
  }
</style>
