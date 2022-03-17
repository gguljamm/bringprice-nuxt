<template>
  <div id="detailContentWrap">
    <div class="info">
      <div>
        <hotelInfo
          :searchFlag="searchFlag"
          ref="hotel"
          :hotelInfo="hotelDetail"
          :inputData="inputData"
          :facilitiesReadMore="facilitiesReadMore"
          @open-facilities="$emit('open-facilities')"
        />
        <roomInfo
          v-if="hotelDetail && hotelDetail.rooms && hotelDetail.rooms.length > 0"
          :searchFlag="searchFlag"
          ref="room"
          :hotelInfo="hotelDetail"
        />
      </div>
    </div>
  </div>
</template>

<script>

import roomInfo from './roomInfo.vue';
import hotelInfo from './hotelInfo.vue';

export default {
  props: ['searchFlag', 'inputData', 'hotelDetail', 'searchIndex', 'facilitiesReadMore'],
  components: {
    roomInfo,
    hotelInfo,
  },
};
</script>

<style lang="scss" scoped>
  #detailContentWrap {
    position: relative;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow-x: hidden;
    background-color: #fff;
    margin-top: -20px;
    z-index: 1;
  }
</style>
