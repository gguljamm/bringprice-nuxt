<template>
  <div :class="$route.path.indexOf('/hotelList/') >= 0 || $route.path.indexOf('/flight/') >= 0 ? 'list' : ''">
    <div class="recommendMulti"
         v-if="flag === 'flight' && wishCities.length > 0 && wishCities.length < 6 && !isDept"
    >
      <div>여행도시를 더 추가해보세요!</div>
      <div>가장 저렴하고 여행하기 좋은 항공권에 맞춰<br>다양한 여행일정을 추천해드립니다.</div>
    </div>
    <div class="everywhere"
      v-if="flag === 'flight' && placeList.length === 0"
    >
      <div class="recommendWrapper" v-if="!loading && validRecommendList && !isDept">
        <div>
          <div>{{ wishCities.length === 0 ? '인기 여행지' : '함께가기 좋은 여행지' }}</div>
          <ul>
            <li
              v-for="x in recommendList"
              :key="x.PlaceId"
              v-if="startCity.PlaceId !== (x.CityId || x.PlaceId)"
              @click.stop="submit(x, true)"
            >
              <div>{{ x.PlaceName }},</div>
              <div>{{ x.CountryName }}</div>
            </li>
          </ul>
        </div>
      </div>
      <div
        @click.stop="submit('every')"
        class="everyBtn"
        v-if="wishCities.length === 0"
      >
        <div>EVERYWHERE</div>
        <div>
          여행날짜가 답.정.너 라면?<br>
          예산에 맞는 항공권가격으로 여행지를 찾아보세요.
        </div>
      </div>
    </div>
    <div
      v-else-if="flag === 'hotel' && placeList.length === 0 && !loading"
      class="everywhere"
    >
      <div class="recommendWrapper">
        <div>
          <div>인기 여행지</div>
          <ul>
            <li
              v-for="(place, index) in hotelRecommendList" :key="index" @click.stop="submit(place)"
              :class="$route.path !== '/'  ? 'placeLists' : ''"
            >
              <div>{{ place.name }}</div>
              <div>{{ place.city_name ? `${place.city_name}, ` : '' }}{{ place.region ? `${place.region}, ` : '' }} {{ place.country_name }}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="flightSearchList" v-if="!loading && placeList.length > 0">
      <ul v-if="flag === 'flight'">
        <li v-for="place in placeList" :key="place.id" @click.stop="submit(place)" v-if="place.CityId !== '-sky'">
          <div>{{ place.PlaceName }}{{ place.RegionId ? ` ${place.RegionId}` : '' }},</div>
          <div>{{ place.CountryName }}</div>
        </li>
      </ul>
      <ul v-else>
        <li v-for="(place, index) in placeList" :key="index" @click.stop="submit(place)">
          <div>{{ place.name }}</div>
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

export default {
  props: ['placeList', 'loading', 'flag', 'wishCities', 'recommendList', 'startCity', 'isDept', 'destination'],
  data() {
    return {
      format: Format,
      hotelRecommendList: [
        { city_name: '방콕', country: 'th', country_name: '태국', latitude: 13.7558002471924, longitude: 100.505996704102, name: '방콕', region: '방콕 지방', type: 'city' },
        { city_name: '도쿄', country: 'jp', country_name: '일본', latitude: 35.6859600461771, longitude: 139.729518064178, name: '도쿄', region: '도쿄 도', type: 'city' },
        { city_name: '다낭', country: 'vn', country_name: '베트남', latitude: 16.0683664014158, longitude: 108.219195144338, name: '다낭', region: '다낭', type: 'city' },
        { city_name: '', country: 'kr', country_name: '대한민국', latitude: 33.389711, longitude: 126.536904, name: '제주도', region: '제주도', type: 'region' },
      ],
    };
  },
  computed: {
    validRecommendList() {
      return this.recommendList.length > 0 && !this.recommendList.some(x => this.startCity.PlaceId === (x.CityId || x.PlaceId));
    },
  },
  methods: {
    submit(data, isRecommend) {
      if (this.flag === 'flight') {
        if (isRecommend) {
          ga('send', { // eslint-disable-line
            hitType: 'event',
            eventCategory: 'recommendCity',
            eventAction: data.PlaceId,
          });
        }
        if (data === 'every') {
          this.$emit('clear-wish');
          // this.$router.push('/date/flight/SELA&every');
        } else if (!this.wishCities.some(x => ((x.CityId || x.PlaceId) === (data.CityId || data.PlaceId)))
          && ((data.CityId || data.PlaceId) !== (this.startCity.CityId || this.startCity.PlaceId))
        ) {
          this.$store.commit('appendFlightPlaceInfo', data);
          this.$emit('add-wish', data);
        } else if ((data.CityId || data.PlaceId) === (this.startCity.CityId || this.startCity.PlaceId)) {
          this.$emit('swipe-wish', data);
        } else {
          this.$router.push({
            query: {
              popFlag: 'alert',
              alertId: 2,
            },
          });
        }
      } else {
        this.$emit('change-destination', data);
        // this.$router.push(`/date/hotel/${data}`);
      }
    },
  },
  mounted() {
    if (this.wishCities && this.wishCities.length === 0) {
      this.$emit('init-recommend');
    } else if (this.wishCities && this.wishCities.length > 0) {
      this.$emit('recommend-list');
    }
    this.$emit('init-first');
  },
  beforeDestroy() {
    if (this.flag === 'hotel' && !this.destination) {
      this.$emit('change-destination', this.placeList[0], true);
    }
  },
};
</script>

<style lang="scss" scoped>
  .list{
    .recommendWrapper{
      > div{
        padding: 12px 0 0;
      }
    }
  }
  .recommendMulti{
    padding: 10px 20px;
    background-color: #f8f8f8;
    > div:first-of-type{
      font-size: 14px;
      font-weight: bold;
      line-height: 20px;
    }
    > div:nth-of-type(2){
      font-size: 12px;
      color: #9b9b9b;
      line-height: 18px;
    }
  }
  .everywhere{
    .everyBtn{
      padding: 12px 14px;
      background-color: #FFF;
      position: relative;
      cursor: pointer;
      height: 76px;
      border-radius: 6px;
    }
    .swiper-left-enter-active &, .swiper-left-leave-active &,
    .swiper-right-enter-active &, .swiper-right-leave-active & {
      display: none;
    }
  }
  .everywhere .everyBtn > div:first-child{
    color: #6491f8;
    font-size: 16px;
    font-weight: bold;
    line-height: 22px;
  }
  .everywhere > div > div:nth-of-type(2) {
    color: #4a4a4a;
    font-size: 13px;
    margin-top: 2px;
    line-height: 15px;
  }
  .flightSearchList{
    .swiper-left-enter-active &, .swiper-left-leave-active &,
    .swiper-right-enter-active &, .swiper-right-leave-active & {
      display: none;
    }
  }
  .flightSearchList > ul{
    list-style: none;
    padding-top: 10px;
  }
  .flightSearchList > ul > li{
    cursor: pointer;
    padding: 12px 14px;
    &:hover{
      background-color: #f9f9f9;
      color: inherit;
      > div:nth-of-type(2) {
        color: #868686;
      }
    }
    > div:first-of-type{
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    > div:nth-of-type(2){
      font-size: 12px;
      margin-top: 2px;
      color: $brown-grey;
    }
  }
  .recommendWrapper{
    margin-top: 10px;
    > div{
      background-color: #FFF;
      padding: 12px 0 2px;
      border-radius: 6px;
      > div{
        font-size: 12px;
        font-weight: bold;
        color: #9b9b9b;
        padding: 0 14px 12px;
      }
      > ul{
        padding: 0;
        margin: 0;
        list-style: none;
        > li{
          position: relative;
          padding: 12px 14px;
          cursor: pointer;
          &:hover{
            background-color: #f9f9f9;
            color: inherit;
            > div:nth-of-type(2) {
              color: #868686;
            }
          }
          > div:nth-of-type(2) {
            color: $brown-grey;
            font-size: 12px;
          }
          &:last-of-type{
            border-bottom: 0;
          }
        }
      }
    }
  }
</style>
