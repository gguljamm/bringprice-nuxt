<template>
  <div
    class="filterPopWrapper"
    :class="type === 'date' ? 'date' : ''"
    @click.stop
  >
    <div class="filter-title">
      <div class="contents-wrap">
        <p v-if="title">{{ title }}</p>
        <div
          @click.stop="$emit('close-filter')"
          class="x-btn"></div>
      </div>
    </div>
    <div :class="type !== 'date' && type !== 'changeTime' && type !== 'changeTimeMulti' && type !== 'carriers' ? 'contents-wrap' : ''">
      <WebOption
        v-if="type === 'option'"
        :filterData="filterData"
        class="popWrap"
      />
      <WebCalendar
        v-if="type === 'date'"
        :filterData="filterData"
        :type="'datePop'"
        class="popCalendarWrap"
      />
      <carriersPopUp
        v-if="type === 'carriers'"
        :filterData="filterData"
        class="popWrap"
        @submit-filter="submitFilter"
      />
      <transferCount
        v-if="type === 'transferCount'"
        :filterData="filterData"
        class="popWrap"
        @submit-filter="submitFilter"
      />
      <changeTime
        v-if="type === 'changeTime'"
        :filterData="filterData"
        class="popWrap"
        @submit-filter="submitFilter"
      />
      <changeTimeMulti
        v-if="type === 'changeTimeMulti'"
        :filterData="filterData"
        :multiInfo="multiInfo"
        @submit-filter="submitFilter"
      />
      <etcFilter
        v-if="type === 'etc'"
        :filterData="filterData"
        @submit-filter="submitFilter"
      />
    </div>
  </div>
</template>

<!--changeTimeMulti-->

<script>
import WebOption from '~/components/flight/web/option.vue'; // eslint-disable-line
import '~/assets/scss/filterPopWrapper.scss'; // eslint-disable-line
import WebCalendar from '~/components/search/web/calendar.vue'; // eslint-disable-line
import carriersPopUp from './carriers.vue';
import transferCount from './transferCount.vue';
import changeTime from './changeTime.vue';
import changeTimeMulti from './changeTimeMulti.vue';
import etcFilter from './etc.vue';

export default {
  props: ['title', 'type', 'filterData', 'multiInfo'],
  components: {
    WebOption,
    WebCalendar,
    carriersPopUp,
    transferCount,
    changeTime,
    changeTimeMulti,
    etcFilter,
  },
  methods: {
    submitFilter(submit, sortState, key) {
      this.$emit('submit-filter', submit, sortState, key);
    },
  },
};
</script>

<style lang="scss" scoped>
  .filterPopWrapper{
    min-height: 200px;
  }
</style>
