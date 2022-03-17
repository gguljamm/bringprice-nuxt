<template>
  <div class="flightHotelWrap">
    <div>
      <strong>브링프라이스에서만<br>만날 수 있는 특가 호텔!</strong>
      <div>실제 여행객들의 만족 후기가 높은<br>호텔들 순서로 추천해드려요.</div>
      <button
        @click="hotelList()"
      >호텔 검색</button>
    </div>
    <ul>
      <li
        v-for="x in $store.state.flightHotelList.list.slice(0, 3)"
        :key="x.id"
      ><div
        @click="hotelDetail(x.id)"
      >
        <div :style="{backgroundImage: `url(${x.images[0]})`}"></div>
        <div>
          <div>{{ x.category }}</div>
          <div>{{ x.korName }}</div>
          <div>{{ x.star }}성급 | {{ x.rating }} | {{ x.city }}</div>
          <div>{{ Format.priceFormat(x.rooms[0].pricePerNight) }}원</div>
        </div>
      </div></li>
    </ul>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line

export default {
  data() {
    return {
      Format,
    };
  },
  methods: {
    hotelList() {
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'flightHotel',
        eventAction: 'detail',
        eventLabel: 'button',
      });
      window.open(`${window.location.origin}/hotelList/${JSON.stringify(this.$store.state.flightHotelList.city)}/${this.$route.params.startDate}/${this.$route.params.returnDate}/2/null/1/list`, '_blank');
    },
    hotelDetail(id) {
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'flightHotel',
        eventAction: 'detail',
        eventLabel: 'recommend',
      });
      window.open(`${window.location.origin}/hotelList/${JSON.stringify(this.$store.state.flightHotelList.city)}/${this.$route.params.startDate}/${this.$route.params.returnDate}/2/null/1/list/detail/${id}`, '_blank');
    },
  },
};
</script>

<style lang="scss" scoped>
  .flightHotelWrap{
    display: flex;
    height: 298px;
    padding-bottom: 20px;
    > div:first-of-type{
      flex: 0 0 25%;
      text-align: center;
      padding-top: 42px;
      > strong{
        font-size: 18px;
        font-weight: bold;
        line-height: 27px;
      }
      > div{
        color: #9b9b9b;
        font-size: 12px;
        line-height: 18px;
        margin-top: 8px;
      }
      > button{
        width: 154px;
        height: 43px;
        border-radius: 2px;
        border: solid 1px $cornflower;
        margin-top: 32px;
        color: $cornflower;
      }
    }
    ul{
      flex: 0 0 75%;
      padding-right: 10px;
      display: flex;
      > li{
        flex: 0 0 33.3333%;
        padding-right: 10px;
        > div{
          height: 258px;
          cursor: pointer;
          > div:first-of-type{
            height: 156px;
            width: 100%;
            background-size: cover;
            background-position: center center;
          }
          > div:nth-of-type(2){
            border: solid 1px #e9e9e9;
            border-top: 0;
            padding: 7px 10px 10px;
            > div:first-of-type, > div:nth-of-type(3){
              font-size: 10px;
              font-weight: bold;
              color: #9b9b9b;
              line-height: 15px;
            }
            > div:nth-of-type(2){
              font-size: 14px;
              line-height: 20px;
              margin-top: 2px;
            }
            > div:nth-of-type(4){
              margin-top: 6px;
              font-size: 18px;
              line-height: 27px;
              font-weight: bold;
              text-align: right;
            }
          }
        }
      }
    }
  }
</style>
