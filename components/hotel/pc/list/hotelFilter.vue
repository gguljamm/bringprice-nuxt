<template>
  <div
    v-if="!listLoading"
    id="filter"
  >
    <div
      @click.stop
      class="filter-wrap">
      <div class="filter-list-wrap">
        <div class="contents">
          <p class="filter-title">정렬 및 필터</p>
          <div class="filter-list">
            <p class="title">정렬</p>
            <ul>
              <li>
                <div class="row-wrap">
                  <div
                    @click="selectFilter('orderBy', 'WEIGHT_DESC')"
                    :class="localFilter.orderBy === 'WEIGHT_DESC' ? 'active' : ''"
                    class="filter-btn">추천순</div>
                  <div
                    @click="selectFilter('orderBy', 'RATING_DESC')"
                    :class="localFilter.orderBy === 'RATING_DESC' ? 'active' : ''"
                    class="filter-btn">인기순</div>
                  <div
                    @click="selectFilter('orderBy', 'PRICE_ASC')"
                    :class="localFilter.orderBy === 'PRICE_ASC' ? 'active' : ''"
                    class="filter-btn">최저가순</div>
                  <div
                    @click="selectFilter('orderBy', 'STAR_DESC')"
                    :class="localFilter.orderBy === 'STAR_DESC' ? 'active' : ''"
                    class="filter-btn">성급순</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="clear"/>
          <div class="filter-list">
            <div class="flex-space-btw">
              <p class="title">숙소 성급</p>
              <transition name="fade" mode="out-in">
                <p
                  v-if="localFilter['filter.star'] && localFilter['filter.star'] > 0"
                  @click="resetStarRating"
                  class="reset">재설정</p>
              </transition>
            </div>
            <ul>
              <li>
                {{ localFilter['filter.star'].indexOf(2) }}
                <div class="row-wrap">
                  <div
                    @click="putStar('filter.star', 2)"
                    :class="localFilter['filter.star'] && localFilter['filter.star'].indexOf(2) >= 0 ? 'active' : ''"
                    class="filter-btn">2성급+</div>
                  <div
                    @click="putStar('filter.star', 3)"
                    :class="localFilter['filter.star'] && localFilter['filter.star'].indexOf(3) >= 0 ? 'active' : ''"
                    class="filter-btn">3성급+</div>
                  <div
                    @click="putStar('filter.star', 4)"
                    :class="localFilter['filter.star'] && localFilter['filter.star'].indexOf(4) >= 0 ? 'active' : ''"
                    class="filter-btn">4성급+</div>
                  <div
                    @click="putStar('filter.star', 5)"
                    :class="localFilter['filter.star'] && localFilter['filter.star'].indexOf(5) >= 0 ? 'active' : ''"
                    class="filter-btn">5성급</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="clear"/>
          <div class="filter-list">
            <div class="flex-space-btw">
              <p class="title">투숙객 평가 점수</p>
              <transition name="fade" mode="out-in">
                <p
                  v-if="localFilter['filter.rating'] && localFilter['filter.rating'] > 0"
                  @click="resetRatingAvg"
                  class="reset">재설정</p>
              </transition>
              </div>
            <ul>
              <li>
                <div class="row-wrap">
                  <div
                    @click="selectFilter('filter.rating', 6)"
                    :class="localFilter['filter.rating'] <= 6 ? 'active' : ''"
                    class="filter-btn">6+ 양호</div>
                  <div
                    @click="selectFilter('filter.rating', 7)"
                    :class="localFilter['filter.rating'] <= 7 ? 'active' : ''"
                    class="filter-btn">7+ 좋음</div>
                  <div
                    @click="selectFilter('filter.rating', 8)"
                    :class="localFilter['filter.rating'] <= 8 ? 'active' : ''"
                    class="filter-btn">8+ 우수</div>
                  <div
                    @click="selectFilter('filter.rating', 9)"
                    :class="localFilter['filter.rating'] <= 9 ? 'active' : ''"
                    class="filter-btn">9+ 최고</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="clear"/>
          <div class="filter-list swiper">
            <p class="title">요금 범위</p>
            <p class="title-sub">1박 당 기본 금액(지방세 및 수수료 포함)</p>
            <div class="price-range-wrap">
              <p class="price">
                {{ format.numberFormat(price.min) }}원 <span v-if="price.min > 0" class="daysPrice">({{ format.numberFormat(Math.floor(price.min / format.getBetweenDay($route.params.checkin, $route.params.checkout))) }}원/1박)</span>
              - <span v-if="price.max === 2000000">제한 없음</span>
                <span v-else>{{ `${format.numberFormat(price.max)}원` }} <span class="daysPrice">{{`(${format.numberFormat(Math.floor(price.max / format.getBetweenDay($route.params.checkin, $route.params.checkout)))}원/1박)` }}</span></span>
              </p>
              <vue-slider
                ref="slider1"
                class="priceSlider"
                v-bind="priceSlider"
                v-model="priceSlider.value"
                @callback="priceSliderChange"
              />
            </div>
          </div>
          <div class="clear"/>
          <div class="filter-list plant">
            <div class="flex-space-btw">
              <p class="title">시설</p>
              <transition name="fade" mode="out-in">
                <p
                  v-if="localFilter['filter.facilities'] && localFilter['filter.facilities'].length > 0"
                  @click="resetFacilities"
                  class="reset">재설정</p>
              </transition>
            </div>
            <ul>
              <li>
                <div class="row-wrap-plant">
                  <div
                    v-for="x in facilities"
                    :key="x.code"
                  >
                    <div class="filter-btn"
                      :class="localFilter['filter.facilities'].indexOf(x.code) >= 0 ? 'active' : ''"
                      @click="pushFilter('filter.facilities', x.code)"
                    >{{ x.name }}</div>
                  </div>
                </div>
                <div class="clear"/>
              </li>
            </ul>
          </div>
          <div class="clear"/>
          <div class="filter-list plant">
            <div class="flex-space-btw">
              <p class="title">카테고리</p>
              <transition name="fade" mode="out-in">
                <p
                  v-if="localFilter['filter.categories'] && localFilter['filter.categories'].length > 0"
                  @click="resetCategories"
                  class="reset">재설정</p>
              </transition>
            </div>
            <ul>
              <li>
                <div class="row-wrap-plant">
                  <div
                    v-for="x in categories"
                    :key="x.code"
                  >
                    <div class="filter-btn"
                      :class="localFilter['filter.categories'].indexOf(x.code) >= 0 ? 'active' : ''"
                      @click="pushFilter('filter.categories', x.code)"
                    >{{ x.name }}</div>
                  </div>
                </div>
                <div class="clear"/>
              </li>
            </ul>
          </div>
        </div>
        <div class="clear"/>
      </div>
      <div class="clear"/>
      <div class="submit-wrap">
        <div
          @click="submit"
          class="submit-btn">
          적용
        </div>
        <div
          @click="back"
          class="back-btn">
          취소
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['inputData', 'filterData', 'listLoading', 'noListData'],
  data() {
    const localFilter = {
      'filter.star': this.filterData['filter.star'],
      'filter.rating': this.filterData['filter.rating'],
      'filter.categories': [],
      'filter.facilities': [],
      orderBy: this.filterData.orderBy,
    };
    localFilter['filter.categories'].push(...this.filterData['filter.categories']);
    localFilter['filter.facilities'].push(...this.filterData['filter.facilities']);
    const days = Format.getBetweenDay(this.$route.params.checkin, this.$route.params.checkout);
    return {
      format: Format,
      days,
      localFilter,
      price: {
        min: this.filterData['filter.minPrice'] || 0,
        max: this.filterData['filter.maxPrice'] || 2000000,
      },
      priceSlider: {
        value: [
          this.filterData['filter.minPrice'] || 0,
          this.filterData['filter.maxPrice'] || 2000000,
        ],
        width: '100%',
        height: 4,
        dotSize: 26,
        interval: 1000,
        min: 0,
        max: 2000000,
        disabled: false,
        show: false,
        tooltip: 'none',
        bgStyle: {
          backgroundColor: '#f8f8f8',
        },
        processStyle: {
          backgroundColor: '#7167ff',
        },
      },
      facilities: [
        { code: 'WIFI', name: 'Wi-Fi (공용 구역)' },
        { code: 'FREE_WIFI', name: 'Wi-Fi (무료/전 객실)' },
        { code: 'BREAKFAST', name: '조식' },
        { code: 'FREE_BREAKFAST', name: '무료 조식' },
        { code: 'PARKING', name: '주차' },
        { code: 'FREE_PARKING', name: '무료 주차' },
        { code: 'FREE_PICKUP', name: '무료 픽업' },
        { code: 'SHUTTLE', name: '셔틀 서비스' },
        { code: 'FRONT_DESK_24', name: '24시간 프론트' },
        { code: 'NO_FRONT_DESK', name: '프론트 없음' },
        { code: 'FRONT_DESK', name: '프론트 시설' },
        { code: 'BARBECUE', name: '바베큐 시설' },
        { code: 'POOL', name: '수영장' },
        { code: 'ELEVATOR', name: '엘리베이터' },
        { code: 'INTERNET', name: '인터넷' },
        { code: 'LAUNDRY', name: '세탁 시설' },
        { code: 'KITCHEN', name: '주방' },
        { code: 'CHILDCARE', name: '어린이 케어' },
        { code: 'RESTAURANT', name: '레스토랑' },
        { code: 'CAFE_BAR', name: '카페 바' },
        { code: 'ROOM_SERVICE', name: '룸서비스' },
        { code: 'SMOKE', name: '흡연 시설' },
        { code: 'TERRACE', name: '테라스' },
        { code: 'GARDEN', name: '정원' },
        { code: 'LOBBY', name: '로비' },
        { code: 'BEACH', name: '바닷가' },
        { code: 'MEETING_ROOM', name: '회의실' },
        { code: 'LUGGAGE_STORAGE', name: '수하물 보관소' },
        { code: 'LIBRARY', name: '도서관' },
        { code: 'FITNESSCENTER', name: '피트니스 센터' },
        { code: 'ATM', name: 'ATM' },
        { code: 'SHOPPING', name: '쇼핑 시설' },
        { code: 'WEDDING', name: '웨딩서비스' },
        { code: 'CLUB', name: '클럽' },
        { code: 'HAIRSALON', name: '미용실' },
        { code: 'ACTIVITY', name: '엑티비티 및 레저 활동' },
        { code: 'SPA', name: '스파' },
        { code: 'BATH', name: '목욕시설' },
        { code: 'CASINO', name: '카지노' },
      ],
      categories: [
        { code: 'HOTEL', name: '호텔' },
        { code: 'APARTMENT', name: '아파트' },
        { code: 'HOSTEL', name: '호스텔' },
        { code: 'GUESTHOUSE_BNB', name: '게스트 하우스' },
        { code: 'MOTEL', name: '모텔' },
        { code: 'PENSION', name: '펜션' },
        { code: 'RESORT', name: '리조트' },
        { code: 'CAMP', name: '캠프' },
        { code: 'ETC', name: '기타' },
      ],
    };
  },
  methods: {
    pushFilter(key, value) {
      if (this.localFilter[key].indexOf(value) >= 0) {
        this.localFilter[key].splice(this.localFilter[key].indexOf(value), 1);
      } else {
        this.localFilter[key].push(value);
      }
    },
    priceSliderChange(val) {
      this.price.min = val[0];
      this.price.max = val[1];
    },
    selectFilter(type, val) {
      // console.log(this.localFilter[type]);
      // console.log(val);
      if (this.localFilter[type] === val) {
        this.localFilter[type] = undefined;
        if (type === 'orderBy') {
          this.localFilter[type] = 'WEIGHT_DESC';
        }
        return;
      }
      this.localFilter[type] = val;
    },
    putStar(type, val) {
      if (this.localFilter[type].indexOf(val) >= 0) {
        this.localFilter[type].splice(this.localFilter[type].indexOf(val), 1);
      } else {
        this.localFilter[type].push(val);
      }
      // console.log(this.localFilter[type]);
    },
    resetCategories() {
      this.localFilter['filter.categories'] = [];
    },
    resetFacilities() {
      this.localFilter['filter.facilities'] = [];
    },
    resetFilter() {
      this.localFilter = {
        'filter.categories': [],
        'filter.facilities': [],
        'filter.maxPrice': undefined,
        'filter.minPrice': undefined,
        'filter.rating': undefined,
        'filter.star': undefined,
        orderBy: 'WEIGHT_DESC',
      };
      this.price.min = 0;
      this.price.max = 2000000;
      this.priceSlider.value = [0, 2000000];
    },
    resetStarRating() {
      this.localFilter['filter.star'] = undefined;
    },
    resetRatingAvg() {
      this.localFilter['filter.rating'] = undefined;
    },
    back() {
      this.$emit('back');
    },
    submit() {
      const obj = this.localFilter;
      obj['filter.minPrice'] = this.price.min !== 0 ? this.price.min : undefined;
      obj['filter.maxPrice'] = this.price.max !== 2000000 ? this.price.max : undefined;
      // console.log(obj);
      this.$emit('apply-filter', obj);
      this.back();
    },
    priceRangeFormat(x) {
      return (Math.round(x / 1000) * 1000);
    },
  },
  mounted() {
    window.document.body.style.overflowY = 'hidden';
    window.document.documentElement.style.overflowY = 'hidden';
    if (!Array.isArray(this.filterData)) {
      // console.log(this.filterData);
      setTimeout(() => {
        this.priceSlider.show = true;
      }, 500);
    } else {
      this.$router.push({ params: { filter: null }, query: this.$route.query });
    }
  },
  beforeDestroy() {
    window.document.body.style.overflowY = '';
    window.document.documentElement.style.overflowY = '';
  },
};
</script>

<style lang="scss" scoped>
  #filter{
    width: 1100px;
    position: fixed;
    top: 60px;
    bottom: 0;
    overflow: auto;
    left: calc(50% - 555px);
  }
  @media screen and (max-width: 1110px) {
    #filter{
      left: 0;
    }
  }
  .clear{
    clear: both;
  }
  .filter-title{
    font-weight: bold;
    font-size: 20px;
    padding-top: 30px;
    color: $greyish-brown;
  }
  .filter-wrap{
    width: 800px;
    position: relative;
    height: 100%;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .1);
    background-color: #fff;
  }
  .filter-list-wrap{
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 80px;
    overflow: auto;
  }
  .filter-list-wrap .contents{
    width: 100%;
    padding: 0 60px 0 60px;
  }
  .title-sub{
    margin-top: 2px;
    color: $brown-grey;
    font-size: 12px;
  }
  .flex-space-btw {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .reset{
      float: right;
      font-weight: bold;
      font-size: 12px;
      cursor: pointer;
    }
  }
  .filter-list{
    color: $brown-grey;
    &:first-of-type{
      padding-top: 30px;
    }
    padding-top: 30px;
    .title{
      font-size: 14px;
      line-height: 20px;
    }
  }
  .filter-list ul{
    margin-top: 10px;
  }
  .filter-list li{
    width: 100%;
    list-style: none;
  }
  .filter-list-wrap .contents li .row-wrap{
    width: 100%;
    display: flex;
    margin-top: 7px;
  }
  .filter-list.swiper{
    width: 100%;
    float: none;
  }
  .filter-btn{
    cursor: pointer;
    width: 25%;
    height: 53px;
    font-size: 14px;
    color: #9b9b9b;
    padding: 18px 0 18px 0;
    text-align: center;
    list-style: none;
    background-color: #FFF;
    border: 1px solid #e1e1e1;
    border-radius: 2px;
    margin-left: 8px;
    transition: 0.3s ease;
    &:first-of-type{
      margin-left: 0;
    }
  }
  .row-wrap-plant .filter-btn{
    width: 164px;
  }
  .filter-btn.active{
    color: #fff;
    background-color: $cornflower;
  }
  .filter-list .price-range-wrap{
    width: 100%;
  }
  .price{
    font-size: 18px;
    color: #000;
    font-weight: bold;
    margin-top: 10px;
    .daysPrice{
      font-weight: normal;
      font-size: 14px;
    }
  }
  .priceSlider{
    margin-top: 20px;
  }
  .filter-list.plant{
    float: none;
    padding-bottom: 20px;
  }
  .filter-list.plant li{
    white-space: nowrap;
  }
  .filter-list.plant li .row-wrap-plant{
    display: block;
    margin-left: -4px;
    margin-right: -4px;
    white-space: normal;
    box-sizing: border-box;
    > div{
      margin-top: 8px;
      padding-left: 4px;
      padding-right: 4px;
      width: 25%;
      display: inline-block;
      > .filter-btn{
        width: 100%;
      }
    }
  }
  .filter-list.plant li .row-wrap-plant > .filter-btn{
    width: 25%;
    float: left;
  }
  .row-wrap-plant > .filter-btn{
    margin-top: 8px;
    padding-right: 8px;
    margin-left: 0;
  }
  .submit-wrap{
    display: flex;
    flex-flow: row-reverse;
    z-index: 13;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px 20px;
    background-color: #fff;
    border-top: 1px solid #e9e9e9;
    font-size: 16px;
    .submit-btn{
      width: 209px;
      height: 53px;
      background-color: $cornflower;
      color: #fff;
      border-radius: 2px;
      font-weight: normal;
      text-align: center;
      line-height: 53px;
      cursor: pointer;
    }
    .back-btn{
      width: 120px;
      height: 53px;
      border-radius: 2px;
      font-weight: normal;
      text-align: center;
      line-height: 47px;
      cursor: pointer;
    }
  }
</style>
