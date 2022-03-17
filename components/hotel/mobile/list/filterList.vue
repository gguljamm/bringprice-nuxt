<template>
  <div
    class="top-filter mobile"
  >
    <div class="top-filter">
      <ul class="flightBtns">
        <li
          class="filters date swiper-slide mobile" @click.stop="$router.push({params: {popFlag2: 'date'}})"
        >
          <span>{{ format.dateDotFormat(inputData.checkinDate) }} - {{ format.dateDotFormat(inputData.checkoutDate) }}</span>
        </li
        >
        <li
          class="filters option swiper-slide mobile" @click.stop="$router.push({params: {popFlag2: 'option'}})">
          <span>{{ pramData.adults }} {{ pramData.children }} {{ pramData.rooms }}</span>
        </li
        ><li
        class="filters swiper-slide mobile quick"
        :class="isPriceMax10 ? 'active' : ''"
        @click="isPriceMax10 ? researchFilter({key: 'filter.maxPrice', val: undefined}) : researchFilter([{ key: 'filter.maxPrice', val: 100000 }, { key: 'filter.minPrice', val: 0 }])"
        ><span class="point">#</span>1박당 10만원 이하</li
        ><li
        class="filters swiper-slide mobile quick"
        :class="isAvg8 ? 'active' : ''"
        @click="isAvg8 ? researchFilter({key: 'filter.rating', val: undefined}) : researchFilter({key: 'filter.rating', val: 8})"
        ><span class="point">#</span>8+ 우수 이상</li>
      </ul>
      <div
        v-if="progress > 0 && progress < 100"
        class="progressBar"
        :class="progress > 0 && progress < 95 ? 'fadeIn' : 'fadeOut'"
        :style="{width: `${progress - 1 }%`}"
      ></div>
    </div>
  </div>
</template>

<script>

import Format from '~/utils/format'; // eslint-disable-line
import '~/assets/scss/filterButtons.scss'; // eslint-disable-line

export default {
  props: ['inputData', 'listLoading', 'filterActive', 'filterData', 'progress'],
  data() {
    return {
      format: Format,
      topChange: false,
      pramData: {
        checkin: this.splitDate(this.inputData.checkinDate),
        checkout: this.splitDate(this.inputData.checkoutDate),
        adults: this.inputData.adults > 0 ? `성인 ${this.inputData.adults}명,` : '',
        children: this.inputData.children.length > 0 ? `아동${this.inputData.children.length}명,` : '',
        rooms: this.inputData.rooms > 0 ? `객실${this.inputData.rooms}개` : '',
      },
    };
  },
  computed: {
    isPriceMax10() {
      return this.filterData['filter.maxPrice'] === 100000;
    },
    isAvg8() {
      return this.filterData['filter.rating'] === 8;
    },
  },
  methods: {
    researchFilter(filter) {
      const obj = {};
      if (this.filterActive) {
        Object.keys(this.filterData).forEach((globalKey) => {
          obj[globalKey] = this.filterData[globalKey];
        });
      }
      if (filter.length > 1) {
        filter.forEach((val) => {
          obj[val.key] = val.val;
        });
      } else {
        obj[filter.key] = filter.val;
      }
      this.$emit('apply-filter', obj);
    },
    openFilter() {
      this.$emit('open-filter');
    },
    splitDate(date) {
      return `${date.toString().substr(5, 2)}.${date.toString().substr(8, 2)}` * 1;
    },
  },
  mounted() {
    this.$emit('set-pop-up');
    // console.log(this.$store.state.hotelListObj.filterValue);
  },
};
</script>

<style lang="scss" scoped>
  .top-filter{
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding-top: 104px;
    padding-top: calc(104px + constant(safe-area-inset-top));
    padding-top: calc(104px + env(safe-area-inset-top));
    border-top: none;
    background-color: #fff;
    font-size: 0;
    padding-bottom: 10px;
    .hotelMap &{
      padding-top: 104px;
    }
    > .flightBtns{
      overflow-x: scroll;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      li{
        margin-left: 6px;
        &:first-of-type{
          margin-left: 20px;
        }
        &:last-of-type{
          margin-right: 20px;
        }
      }
    }
    .scrollDownTop &{
      transform: translateY(-25px);
    }
  }
  .progressBar{
    position: absolute;
    background-color: $dodger-blue;
    height: 2px;
    left: 0;
    bottom: 0;
    border-radius: 1px;
    transition: .5s ease;
    z-index: 1;
    &.fadeIn{
      opacity: 1;
    }
    &.fadeOut{
      opacity: 0;
    }
  }
</style>
