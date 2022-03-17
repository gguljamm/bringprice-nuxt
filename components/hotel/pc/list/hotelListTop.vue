<template>
  <div
    class="hotelList-top"
  >
    <div>
      <div class="top-title">
        <filterList
          :inputData="inputData"
          :filterActive="filterActive"
          :listLoading="listLoading"
          :filterData="filterData"
          :openPopFlag="openPopFlag"
          :totalSize="totalSize"
          class="list-top-filter"
          @open-filter="openPop"
          @apply-filter="researchFilter"
          @getHotelCount="getHotelCount"
          @close-filter="$emit('close-filter')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import filterList from './filters/filterList.vue';

export default {
  props: ['inputData', 'listLoading', 'filterActive', 'noListData', 'filterData', 'openPopFlag', 'totalSize'],
  components: {
    filterList,
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 'auto',
      },
      mapToggle: false,
    };
  },
  methods: {
    getHotelCount(sendParam) {
      this.$emit('getHotelCount', sendParam);
    },
    viewMap() {
      this.mapToggle = !this.mapToggle;
      this.$emit('view-map', this.mapToggle);
    },
    openPop(flag) {
      this.$emit('open-filter', flag);
    },
    researchFilter(filter) {
      this.$emit('apply-filter', filter);
    },
  },
};
</script>

<style lang="scss" scoped>
  .hotelList-top{
    width: 100%;
    transition: .3s ease;
    background-color: #fff;
    position: relative;
    border-top: 1px solid #f2f2f2;
    padding-top: 10px;
    padding-bottom: 10px;
    z-index: 4;
  }
  .top-title{
    max-width: 1110px;
    margin: 0 auto;
    transition: .3s ease;
    line-height: 38px;
    height: 33px;
    position: relative;
    > div {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-y: visible;
    }
  }
  .top-title > .contents{
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-left: 60px;
    padding-right: 60px;
  }
  .top-destination{
    text-align: left;
    font-size: 26px;
    color: #4a4a4a;
  }
  .top-destination .contry.bold{
    font-weight: bold;
  }
  .list-top-filter{
    background-color: #fff;
  }
</style>
