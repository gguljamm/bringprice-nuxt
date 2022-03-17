<template>
  <div class="recentWrapper" v-if="recentList.length > 0">
    <div>
      <div>최근검색 기록</div>
      <button
        v-if="maxLeng !== 6 && recentList.length > 3"
        @click="maxLeng = 6"
      >모두보기</button>
      <ul>
        <li
          v-for="(list, index) in recentList"
          v-if="index < maxLeng && list"
          :key="index"
        >
          <div
            @click="submit(list)"
          >
            <div>{{ list.type === 'hotel' ? getHotelPlaceName(list.destination) : getPlaceName(list.wishCities) }}</div>
            <div>
              {{ list.type === 'hotel' ? getDate(list.checkin, list.checkout) : getDate(list.startDate, list.returnDate) }}
            </div>
            <button>
              {{ list.type === 'hotel' ? '호텔 검색' : '항공권 검색' }}
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line

export default {
  data() {
    return {
      recentList: [],
      maxLeng: 3,
      format: Format,
    };
  },
  mounted() {
    this.recentList = this.$cookies.get('bpHistory') ? JSON.parse(this.$cookies.get('bpHistory')).reverse() : [];
  },
  methods: {
    getDate(start, end) {
      return `${this.format.dateFormat(start)} - ${this.format.dateFormat(end)} | ${this.format.getBetweenDay(start, end)}박`;
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
      this.$router.push(path);
    },
  },
};
</script>

<style lang="scss" scoped>
  .recentWrapper{
    padding: 20px;
    > div{
      background-color: #FFF;
      padding: 10px 0 0;
      border-radius: 2px;
      position: relative;
      > button{
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 12px;
        color: #6491f8;
      }
      > div{
        padding: 0 10px;
        font-size: 12px;
        font-weight: bold;
        color: #9b9b9b;
        padding-bottom: 12px;
      }
      > ul{
        padding: 0;
        margin: 0;
        list-style: none;
        > li{
          border-bottom: 1px solid #f8f8f8;
          position: relative;
          > div{
            cursor: pointer;
            padding: 10px 10px;
            > div:first-of-type{
              color: #4a4a4a;
              padding-right: 100px;
              font-size: 14px;
            }
            > div:nth-of-type(2) {
              color: $brown-grey;
              font-size: 12px;
              margin-top: 4px;
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
          }
          &:last-of-type{
            border-bottom: 0;
          }
        }
      }
    }
  }
</style>
