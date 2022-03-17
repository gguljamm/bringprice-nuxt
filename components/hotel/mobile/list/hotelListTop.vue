<template>
  <div
    class="hotelList-top"
  >
    <div
      class="top-title"
    >
      <div
        v-if="$route.name !== 'hotelDetail'"
        class="contents"
      >
        <div
          class="top-destination"
        >
          <p>{{ inputData.city.name }},</p>
          <p class="contry sub">어디서 머물까요?</p>
        </div>
      </div>
    </div>
    <filterList
      :inputData="inputData"
      :filterActive="filterActive"
      :listLoading="listLoading"
      :filterData="filterData"
      :progress="progress"
      class="list-top-filter"
      @apply-filter="researchFilter"
      @open-filter="$emit('open-filter')"
    />
  </div>
</template>

<script>

import filterList from './filterList.vue';

export default {
  props: ['inputData', 'listLoading', 'filterActive', 'filterData', 'progress'],
  components: {
    filterList,
  },
  methods: {
    researchFilter(filter) {
      this.$emit('apply-filter', filter);
    },
  },
  mounted() {
    // this.excuteLoading();
  },
};
</script>

<style lang="scss" scoped>
  // .nuxt-progress{
  //   position: static;
  // }
  .hotelList-top{
    z-index: 1;
    width: 100%;
  }
  .top-title{
    position: relative;
    transition: .3s ease;
    padding-left: 20px;
    line-height: 20px;
    overflow: hidden;
    height: 56px;
    opacity: 1;
    z-index: 1;
    .scrollDownTop &{
      opacity: 0;
      pointer-events: none;
      // display: none;
    }
  }
  .top-title .contents{
    width: 100%;
  }
  .top-destination{
    text-align: left;
    font-size: 16px;
    color: #4a4a4a;
    padding-bottom: 12px;
    line-height: 22px;
  }
  .top-destination .contry.sub{
    color: $brown-grey;
  }
  .list-top-filter{
    background-color: #fff;
  }
</style>

