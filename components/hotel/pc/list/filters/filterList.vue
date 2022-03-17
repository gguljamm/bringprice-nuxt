<template>
  <div
    class="top-filter">
    <ul class="swiper-wrapper">
      <li
        class="filters swiper-slide date"
        :class="openPopFlag === 'star' ? 'popOn' : ''"
        @click.stop="openPopFlag === 'date' ? openFilter('') : openFilter('date')"
      >
        <span>{{ format.dateFormat(inputData.checkinDate) }} - {{ format.dateFormat(inputData.checkoutDate) }}</span>
        <filterPopWrapper
          v-if="openPopFlag === 'date'"
          :totalSize="totalSize"
          :type="'date'"
          @close-filter="$emit('close-filter')"
        />
      </li
      ><li
        class="filters swiper-slide option"
        :class="openPopFlag === 'option' ? 'popOn' : ''"
        @click.stop="openPopFlag === 'option' ? openFilter('') : openFilter('option')"
      >
        <span>{{ pramData.adults }} {{ pramData.children }} {{ pramData.rooms }}</span>
        <filterPopWrapper
          v-if="openPopFlag === 'option'"
          :totalSize="totalSize"
          :title="'인원 및 객실 수'"
          :type="'option'"
          @close-filter="$emit('close-filter')"
        />
      </li
      ><li
          class="filters swiper-slide"
          :class="[isStarRating ? 'active' : '', openPopFlag === 'star' ? 'popOn' : '']"
          @click.stop="openPopFlag === 'star' ? openFilter('') : openFilter('star')"
      >
        <span>성급</span>
        <span v-if="isStarRating" @click.stop="resetFilter('filter.star')" class="resetFilter"></span>
        <span v-else class="filterPoint"></span>
        <filterPopWrapper
          v-if="openPopFlag === 'star'"
          :totalSize="totalSize"
          :title="'성급'"
          :type="'star'"
          :filterData="filterData['filter.star']"
          @apply-filter="researchFilter"
          @getHotelCount="getHotelCount"
          @close-filter="$emit('close-filter')"
        />
      </li
      ><li
        class="filters swiper-slide"
        :class="[isRating ? 'active' : '', openPopFlag === 'rating' ? 'popOn' : '']"
        @click.stop="openPopFlag === 'rating' ? openFilter('') : openFilter('rating')"
      >
        <span>평점</span>
        <span v-if="isRating" @click.stop="resetFilter('filter.rating')" class="resetFilter"></span>
        <span v-else class="filterPoint"></span>
        <filterPopWrapper
          v-if="openPopFlag === 'rating'"
          :totalSize="totalSize"
          :title="'고객 평점'"
          :type="'rating'"
          :filterData="filterData['filter.rating']"
          @getHotelCount="getHotelCount"
          @apply-filter="researchFilter"
          @close-filter="$emit('close-filter')"
        />
      </li
      ><li
        class="filters swiper-slide"
        :class="[isCategories ? 'active' : '', openPopFlag === 'categories' ? 'popOn' : '']"
        @click.stop="openPopFlag === 'categories' ? openFilter('') : openFilter('categories')"
      >
        <span>숙소유형</span>
        <span v-if="isCategories" @click.stop="resetFilter('filter.categories')" class="resetFilter"></span>
        <span v-else class="filterPoint"></span>
        <filterPopWrapper
          v-if="openPopFlag === 'categories'"
          :totalSize="totalSize"
          :title="'숙소유형'"
          :type="'categories'"
          :filterData="filterData['filter.categories']"
          :key="$store.state.hotelListObj.categories"
          @getHotelCount="getHotelCount"
          @apply-filter="researchFilter"
          @close-filter="$emit('close-filter')"
        />
      </li
      ><li
        class="filters swiper-slide"
        :class="[isFacilities ? 'active' : '', openPopFlag === 'facilities' ? 'popOn' : '']"
        @click.stop="openPopFlag === 'facilities' ? openFilter('') : openFilter('facilities')"
      >
        <span>편의시설</span>
        <span v-if="isFacilities" @click.stop="resetFilter('filter.facilities')" class="resetFilter"></span>
        <span v-else class="filterPoint"></span>
        <filterPopWrapper
          v-if="openPopFlag === 'facilities'"
          :totalSize="totalSize"
          :title="'편의시설'"
          :type="'facilities'"
          :filterData="filterData['filter.facilities']"
          @getHotelCount="getHotelCount"
          @apply-filter="researchFilter"
          @close-filter="$emit('close-filter')"
        />
      </li
      ><li
        class="filters swiper-slide"
        :class="[isFreeFacilities ? 'active' : '', openPopFlag === 'freeFacilities' ? 'popOn' : '']"
        @click.stop="openPopFlag === 'freeFacilities' ? openFilter('') : openFilter('freeFacilities')"
      >
        <span>무료 서비스</span>
        <span v-if="isFreeFacilities" @click.stop="resetFilter('filter.freeFacilities')" class="resetFilter"></span>
        <span v-else class="filterPoint"></span>
        <filterPopWrapper
          v-if="openPopFlag === 'freeFacilities'"
          :totalSize="totalSize"
          :title="'무료 서비스'"
          :type="'freeFacilities'"
          :filterData="filterData['filter.freeFacilities']"
          @getHotelCount="getHotelCount"
          @apply-filter="researchFilter"
          @close-filter="$emit('close-filter')"
        />
      </li
      ><li
        class="filters swiper-slide"
        :class="[isPrice ? 'active' : '', openPopFlag === 'price' ? 'popOn' : '']"
        @click.stop="openPopFlag === 'price' ? openFilter('') : openFilter('price')"
      >
        <span>가격</span>
        <span v-if="isPrice" @click.stop="resetFilter('price')" class="resetFilter"></span>
        <span v-else class="filterPoint"></span>
        <filterPopWrapper
          v-if="openPopFlag === 'price'"
          :totalSize="totalSize"
          :title="'가격'"
          :type="'price'"
          :filterData="{ 'filter.maxPrice': filterData['filter.maxPrice'], 'filter.minPrice': filterData['filter.minPrice']}"
          @getHotelCount="getHotelCount"
          @apply-filter="researchFilter"
          @close-filter="$emit('close-filter')"
        />
      </li
      ><li
        class="filters swiper-slide quick"
        :class="[isPriceMax10 ? 'active' : '']"
        @click="isPriceMax10 ? researchFilter({ key: 'filter.maxPrice', val : undefined }) : researchFilter([{ key: 'filter.maxPrice', val: 100000 }, { key: 'filter.minPrice', val: 0 }])"
      >
        <span><span class="point">#</span>1박당 10만원 이하</span>
      </li
      ><li
        class="filters swiper-slide quick"
        :class="[isAvg8 ? 'active' : '']"
        @click="isAvg8 ? researchFilter({ key: 'filter.rating', val: undefined }) : researchFilter({ key: 'filter.rating', val: 8 })"
      >
        <span><span class="point">#</span>8+ 우수 이상</span>
      </li>
      <li
        class="filters swiper-slide quick"
        :class="[isBookableHotel ? 'active' : '']"
        @click="isBookableHotel ? researchFilter({ key: 'filter.isBookableHotel', val: false }) : researchFilter({ key: 'filter.isBookableHotel', val: true })"
      >
        <span><span class="point">#</span>예약가능객실만</span>
      </li>
    </ul>
  </div>
</template>

<script>

import '~/assets/scss/filterButtons.scss'; // eslint-disable-line
import Format from '~/utils/format'; // eslint-disable-line
import filterPopWrapper from './filterPopWrapper.vue';

export default {
  props: ['inputData', 'listLoading', 'filterActive', 'filterData', 'openPopFlag', 'totalSize'],
  components: {
    filterPopWrapper,
  },
  data() {
    return {
      format: Format,
      topChange: false,
      swiperOption: {
        slidesPerView: '10',
        clickable: false,
        touchMoveStopPropagation: true,
        preventClicks: true,
        watchOverflow: true,
      },
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
    isBookableHotel() {
      return this.filterData['filter.isBookableHotel'];
    },
    isStarRating() {
      return this.filterData['filter.star'].length > 0;
    },
    isRating() {
      return this.filterData['filter.rating'] !== '' && this.filterData['filter.rating'] !== undefined && this.filterData['filter.rating'] !== null;
    },
    isCategories() {
      return this.filterData['filter.categories'].length > 0;
    },
    isFacilities() {
      return this.filterData['filter.facilities'].length > 0;
    },
    isFreeFacilities() {
      return this.filterData['filter.freeFacilities'].length > 0;
    },
    isPrice() {
      return (this.filterData['filter.minPrice'] && this.filterData['filter.minPrice'] !== 0) || (this.filterData['filter.maxPrice'] && this.filterData['filter.maxPrice'] !== 2000000);
    },
    isPriceMax10() {
      return this.filterData['filter.maxPrice'] === 100000;
    },
    isAvg8() {
      return this.filterData['filter.rating'] === 8;
    },
  },
  methods: {
    getHotelCount(sendParam) {
      this.$emit('getHotelCount', sendParam);
    },
    resetFilter(key) {
      if (key === 'filter.star' || key === 'filter.rating' || key === 'filter.categories') {
        this.filterData[key] = '';
      }
      if (key === 'filter.facilities' || key === 'filter.freeFacilities') {
        // console.log(this.filterData[key]);
        this.filterData[key] = [];
      }
      if (key === 'price') {
        this.filterData['filter.maxPrice'] = '';
        this.filterData['filter.minPrice'] = '';
      }
      this.researchFilter({ key, val: this.filterData[key] });
    },
    getFilterData() {
      const obj = {};
      Object.keys(this.filterData)
        .forEach((globalKey) => {
          obj[globalKey] = this.filterData[globalKey];
        });
      return obj;
    },
    researchFilter(filterData) {
      // console.log(filterData);
      const obj = this.getFilterData();
      if (!Array.isArray(filterData)) {
        obj[filterData.key] = filterData.val;
      } else {
        filterData.forEach((val) => {
          obj[val.key] = val.val;
        });
      }
      this.$emit('apply-filter', obj);
    },
    splitDate(date) {
      return `${date.toString().substr(5, 2)}.${date.toString().substr(8, 2)}` * 1;
    },
    openFilter(type) {
      this.$emit('open-filter', type);
    },
  },
  mounted() {
    this.$emit('set-pop-up');
  },
};
</script>
