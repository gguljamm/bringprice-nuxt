<template>
  <div
    @click.stop
    class="filterPopWrapper"
    :class="type === 'date' ? 'date' : ''"
  >
    <div class="filter-title">
      <div class="contents-wrap">
        <p>{{ title }}</p>
        <div
          @click.stop="$emit('close-filter')"
          class="x-btn"></div>
      </div>
    </div>
    <div :class="type !== 'date' ? 'contents-wrap' : ''">
      <Calendar
        v-if="type === 'date'"
        :filterData="filterData"
        :type="'datePop'"
        class="popCalendarWrap"
      />
      <WebOption
        v-if="type === 'option'"
        :filterData="filterData"
      />
      <starRating
        v-if="type === 'star'"
        :filterData="filterData"
        :hotelsCount="totalSize"
        class="popWrap"
        @apply-filter="researchFilter"
        @getHotelsCount="getHotelsCount"
      />
      <rating
        v-if="type === 'rating'"
        :filterData="filterData"
        :hotelsCount="totalSize"
        class="popWrap"
        @apply-filter="researchFilter"
        @getHotelsCount="getHotelsCount"
      />
      <categories
        v-if="type === 'categories'"
        :filterData="filterData"
        :hotelsCount="totalSize"
        class="popWrap"
        @apply-filter="researchFilter"
        @getHotelsCount="getHotelsCount"
      />
      <priceRating
        v-if="type === 'price'"
        :filterData="filterData"
        :hotelsCount="totalSize"
        class="popWrap"
        @apply-filter="researchFilter"
        @getHotelsCount="getHotelsCount"
      />
      <facilities
        v-if="type === 'facilities'"
        :filterData="filterData"
        :hotelsCount="totalSize"
        class="popWrap"
        @apply-filter="researchFilter"
        @getHotelsCount="getHotelsCount"
      />
      <freeFacilities
        v-if="type === 'freeFacilities'"
        :filterData="filterData"
        :hotelsCount="totalSize"
        class="popWrap"
        @apply-filter="researchFilter"
        @getHotelsCount="getHotelsCount"
      />
    </div>
  </div>
</template>

<script>
import Api from '~/utils/api';  // eslint-disable-line
import starRating from './starRating.vue';
import rating from './rating.vue';
import categories from './categories.vue';
import priceRating from './price.vue';
import facilities from './facilities.vue';
import freeFacilities from './freeFacilities.vue';
import WebOption from '~/components/flight/web/option.vue'; // eslint-disable-line
import '~/assets/scss/filterPopWrapper.scss'; // eslint-disable-line
import Calendar from "../../../../search/web/calendar"; // eslint-disable-line

export default {
  props: ['title', 'type', 'filterData', 'totalSize'],
  components: {
    Calendar,
    WebOption,
    starRating,
    rating,
    categories,
    priceRating,
    facilities,
    freeFacilities,
  },
  data() {
    return {
      hotelsCount: this.totalSize,
    };
  },
  computed: {
    requireParam() {
      return this.$store.state.hotelListObj.requireParam;
    },
  },
  methods: {
    researchFilter(filter) {
      this.$emit('apply-filter', filter);
      this.$emit('close-filter');
    },
    getHotelsCount(filter) {
      console.log(this.requireParam);
      const req = JSON.parse(this.requireParam);
      const obj = {};
      Object.keys(req).forEach((globalKey) => {
        obj[globalKey] = req[globalKey];
      });
      if (!Array.isArray(filter)) {
        obj[filter.key] = filter.val;
      } else {
        filter.forEach((val) => {
          obj[val.key] = val.val;
        });
      }
      let sendParam = '';
      Object.keys(obj).forEach((key) => {
        sendParam += `${key}=${obj[key]}&`;
      });
      sendParam = sendParam.slice(0, -1);
      this.$emit('getHotelCount', sendParam);
    },
  },
  mounted() {
    this.getHotelsCount({});
  },
};
</script>

<style lang="scss">
</style>

<style lang="scss" scoped>
</style>
