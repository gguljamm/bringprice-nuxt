<template>
  <div>
    <div class="tabs">
      <button
        class="btnTab"
        @click="changeTab('detail')"
        :class="flag === 'detail' ? 'selected' : ''"
      >상세 정보</button>
      <button
        class="btnTab"
        @click="changeTab('book')"
        :class="flag === 'book' ? 'selected' : ''"
      >가격비교</button>
      <button
        v-if="roundInfo && $store.state.flightHotelList.list && $store.state.flightHotelList.list.length > 0"
        class="btnTab"
        @click="changeTab('hotel')"
        :class="flag === 'hotel' ? 'selected' : ''"
      >호텔추천</button>
      <button class="btnClose"
        @click="$emit('close-tab')"
      ></button>
    </div>
    <web-book
      v-if="flag === 'book'"
      :inputData="inputData"
      :multiInfo="multiInfo"
      :roundInfo="roundInfo"
      :session="session"
      :legs="legs"
    ></web-book>
    <web-hotel v-else-if="flag === 'hotel'"></web-hotel>
    <web-detail
      v-else
      :inputData="inputData"
      :multiInfo="multiInfo"
      :roundInfo="roundInfo"
      :session="session"
      :legs="legs"
    ></web-detail>
  </div>
</template>

<script>
import WebBook from './book.vue';
import WebDetail from './detail.vue';
import WebHotel from './hotel.vue';

export default {
  props: ['legs', 'inputData', 'multiInfo', 'roundInfo', 'flag'],
  data() {
    const session = [];
    if (this.roundInfo) {
      session.push(this.roundInfo.SessionKey);
    } else {
      for (let x = 0; x < this.legs.length; x += 1) {
        const schedule = this.multiInfo.scheduleList[this.multiInfo.selectedIndex];
        const key = `${schedule.FlightInfo[`Flight${x}`].OriginPlace}|${schedule.FlightInfo[`Flight${x}`].DestinationPlace}|${schedule.FlightInfo[`Flight${x}`].OutboundDate}`;
        session.push(this.multiInfo.liveList[key].data.SessionKey);
      }
    }
    return {
      session,
    };
  },
  components: {
    WebBook,
    WebDetail,
    WebHotel,
  },
  methods: {
    changeTab(tab) {
      this.$emit('change-tab', tab);
    },
  },
};
</script>

<style lang="scss" scoped>
  .tabs{
    padding: 20px;
    position: relative;
    .btnTab{
      margin: 0 20px;
      height: 24px;
      color: #9b9b9b;
      &.selected{
        font-weight: bold;
        color: #4a4a4a;
      }
    }
    .btnClose{
      float: right;
      width: 24px;
      height: 24px;
      background-image: url(~assets/img/common/x_black.svg);
    }
  }
</style>
