<template>
  <div
    id="filter"
  >
    <div class="top-control">
      <div
        class="contents">
        <transition name="fade">
          <span
            v-if="isChangedData"
            @click="resetFilter"
            class="top-control-filter">재설정</span>
        </transition>
        <span class="title">필터</span>
        <div
          class="x-btn top-control-right"
          @click="back"
        ></div>
      </div>
    </div>
    <div class="filter-list-wrap">
      <div class="item-wrap">
        <div class="filter-list price">
          <p class="filter-title">가격</p>
          <div class="price-info">
            <p class="title">1박 당 기본금액</p>
            <p class="title-sub">지방세 및 수수료 포함</p>
          </div>
          <div class="price-range-wrap">
            <vue-slider
              ref="slider1"
              class="priceSlider"
              v-bind="priceSlider"
              v-model="priceSlider.value"
              @callback="priceSliderChange"
              @drag-end="getHotelsCount"
            />
            <div class="info-slider">
              <div>
                <input
                  ref="minPrice"
                  @paste.prevent
                  type="text"
                  class="slider-val"
                  v-on:input="onlyNumber($event, 'min')"
                  :placeholder="format.priceFormat(price.min)"
                >원
              </div>
              <span style="color: #000;font-size: 14px">~</span>
              <div>
                <input
                  ref="maxPrice"
                  @paste.prevent
                  type="text"
                  class="slider-val"
                  v-on:input="onlyNumber($event, 'max')"
                  :placeholder="format.priceFormat(price.max)"
                >원
              </div>
            </div>
          </div>
        </div>
        <div class="filter-list possible">
          <div @click="isBookNowPayLater">
            <span>선예약, 후지불</span>
            <div
              class="type-check">
              <button class="flip">
                <div
                  class="switch"
                  :class="localFilter['filter.isBookNowPayLater'] ? 'on' : ''"
                >
                  <span class="slider round"></span>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div class="filter-list possible">
          <div @click="isBookableHotel">
            <span>예약가능객실</span>
            <div
              class="type-check">
              <button class="flip">
                <div
                  class="switch"
                  :class="localFilter['filter.isBookableHotel'] ? 'on' : ''"
                >
                  <span class="slider round"></span>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div class="filter-list star">
          <p class="filter-title">성급</p>
          <ul>
            <li>
              <ul class="check-list">
                <li
                  v-for="(val, index) in checkList['filter.star']"
                  :key="index"
                >
                  <div>
                    <label :for="'check' + index" class="check">
                      <div>
                        <div class="check-wrap">
                          <div>
                            <span class="title">{{ index + 2 }}성급</span>
                            <span class="info">{{ val.info }}</span>
                          </div>
                          <div class="box">
                            <input type="checkbox" :id="'check' + index" class="inputCheck" @click="pushFilter('filter.star', index + 2)" v-model="val.type">
                            <div class="checked" :style="val.type ? { backgroundColor: '#537aff' } : { backgroundColor: '#fff' }" :class="val.type ? 'active' : ''">
                              <transition name="fade">
                                <div class="checkSvg" v-if="val.type"></div>
                              </transition>
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="filter-list rating">
          <p class="filter-title">고객평점</p>
          <vue-slider
            ref="slider"
            class="priceSlider ratingSlider"
            v-bind="ratingSlider"
            v-model="ratingSlider.value"
            @callback="changeRatingSlider"
          />
          <div class="sliderInfo"><span class="sliderValue">{{ ratingSlider.value + '+'}}</span> <span class="ratingText">{{ ratingText(ratingSlider.value) }} 이상</span></div>
        </div>
        <div class="filter-list facilities">
          <div @click="filterPop = 'facilities'">
            <div class="info">
              <p class="title-info">편의시설</p>
              <div v-if="localFilter['filter.facilities'].filter(v => v.indexOf('FREE_') === -1).length > 0" class="val">
                <div>
                  <span
                    v-for="(val, index) in localFilter['filter.facilities'].filter(v => v.indexOf('FREE_') === -1).slice(0, 3)"
                    :key="index"
                    class="vals"
                  >{{format.hotelFacilitiesOverride(val)}}</span>
                </div>
                <span v-if="localFilter['filter.facilities'].filter(v => v.indexOf('FREE_') === -1).length > 3"
                      class="etc"
                >외 {{localFilter['filter.facilities'].filter(v => v.indexOf('FREE_') === -1).length - 3}}개</span>
              </div>
            </div>
            <div class="right-icon"></div>
          </div>
        </div>
        <div class="filter-list categories">
          <div @click="filterPop = 'categories'">
            <div class="info">
              <p class="title-info">숙소유형</p>
              <div v-if="localFilter['filter.categories']" class="val">
                <div>
                  <span v-for="(val, index) in findCategoriesInfo(localFilter['filter.categories'])" :key="index" class="vals">{{val}}</span>
                </div>
                <span v-if="localFilter['filter.categories'].length > 3"
                      class="etc"
                >외 {{localFilter['filter.categories'].length - 3}}개</span>
              </div>
            </div>
            <div class="right-icon"></div>
          </div>
        </div>
        <div class="filter-list freeFacilities">
          <p class="filter-title">무료 서비스</p>
          <ul class="check-list">
            <li
              v-for="(val, index) in checkList['freeFacilities']"
              :key="index"
            >
              <div>
                <label :for="'freeFacilities' + index" class="check">
                  <div>
                    <div class="check-wrap">
                      <div>
                        <span class="title">{{ val.info }}</span>
                      </div>
                      <div class="box">
                        <input type="checkbox" :id="'freeFacilities' + index" class="inputCheck" @click="pushFilter('filter.freeFacilities', val.code)" v-model="val.type">
                        <div class="checked" :style="val.type ? { backgroundColor: '#537aff' } : { backgroundColor: '#fff' }" :class="val.type ? 'active' : ''">
                          <transition name="fade">
                            <div class="checkSvg" v-if="val.type"></div>
                          </transition>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="submit-wrap">
      <div class="submit-info">
        <transition name="fade">
          <div v-if="!countLoading">
            <p>검색된 숙소</p>
            <p>{{hotelsCount}}개</p>
          </div>
        </transition>
      </div>
      <button
        @click="submit"
        class="submit-btn">적용</button>
    </div>
    <transition name="slide-right-fade" mode="out-in">
      <filterGroup
        v-if="filterPop === 'facilities'"
        :filterPop="filterPop"
        :filterData="localFilter['filter.facilities'].filter(v => v.indexOf('FREE_') === -1)"
        @back="back"
        @close="filterPop = ''"
        @saveGroupFilter="saveGroupFilter"
      ></filterGroup>
      <filterGroup
        v-if="filterPop === 'categories'"
        :key="`${$store.state.hotelListObj.categories}`"
        :filterPop="filterPop"
        :filterData="localFilter['filter.categories']"
        @back="back"
        @close="filterPop = ''"
        @saveGroupFilter="saveGroupFilter"
      ></filterGroup>
    </transition>
  </div>
</template>

<script>
import Api from '~/utils/api';  // eslint-disable-line
import Format from '~/utils/format'; // eslint-disable-line
import '~/assets/scss/flip.scss'; // eslint-disable-line
import filterGroup from './filterGroup.vue';

export default {
  props: ['filterData', 'listLoading'],
  components: {
    filterGroup,
  },
  computed: {
    isChangedData() {
      return (this.localFilter['filter.star'] && this.localFilter['filter.star'].length > 0)
        || this.localFilter['filter.rating'] > 6
        || (this.localFilter['filter.categories'] && this.localFilter['filter.categories'].length > 0)
        || (this.localFilter['filter.facilities'] && this.localFilter['filter.facilities'].length > 0)
        || (this.localFilter['filter.freeFacilities'] && this.localFilter['filter.freeFacilities'].length > 0)
        || this.price.min > 0 || this.price.max < 2000000
        || this.localFilter['filter.isBookableHotel'] || this.localFilter['filter.isBookNowPayLater'];
    },
  },
  data() {
    const checkList = {
      'filter.star': [{
        info: '기본적인 숙박 시설',
      }, {
        info: '퀄리티가 있는 편안함',
      }, {
        info: '다양한 부가 서비스',
      }, {
        info: '최상의 서비스',
      }],
      freeFacilities: [
        { code: 'FREE_INTERNET', info: '무료 인터넷' },
        { code: 'FREE_BREAKFAST', info: '무료 조식' },
        { code: 'FREE_PARKING', info: '무료 주차' },
      ],
    };
    const localFilter = {
      'filter.star': this.filterData['filter.star'],
      'filter.rating': this.filterData['filter.rating'] || '',
      'filter.categories': [],
      'filter.facilities': [],
      'filter.freeFacilities': [],
      'filter.isBookableHotel': this.filterData['filter.isBookableHotel'],
      'filter.isBookNowPayLater': this.filterData['filter.isBookNowPayLater'],
      orderBy: this.filterData.orderBy,
    };
    checkList['filter.star'].forEach((val, index) => {
      const temp = val;
      temp.type = localFilter['filter.star'].indexOf(index + 2) >= 0;
    });
    checkList.freeFacilities.forEach((val) => {
      const temp = val;
      temp.type = this.filterData['filter.freeFacilities'].indexOf(val.code) >= 0;
    });
    for (let x = 0; x < this.filterData['filter.categories'].length; x += 1) {
      localFilter['filter.categories'].push(this.filterData['filter.categories'][x]);
    }
    for (let x = 0; x < this.filterData['filter.freeFacilities'].length; x += 1) {
      localFilter['filter.freeFacilities'].push(this.filterData['filter.freeFacilities'][x]);
    }
    for (let x = 0; x < this.filterData['filter.facilities'].length; x += 1) {
      localFilter['filter.facilities'].push(this.filterData['filter.facilities'][x]);
    }
    const days = Format.getBetweenDay(this.$route.params.checkin, this.$route.params.checkout);
    return {
      filterPop: '',
      localFilter,
      days,
      checkList,
      format: Format,
      price: {
        min: this.filterData['filter.minPrice'] || 0,
        max: this.filterData['filter.maxPrice'] || 2000000,
      },
      ratingSlider: {
        value: this.filterData['filter.rating'] || 6,
        width: '100%',
        height: 4,
        dotSize: 24,
        interval: 1,
        min: 6,
        max: 9,
        disabled: false,
        show: false,
        tooltip: 'focus',
        bgStyle: {
          backgroundColor: '#cdcdcd',
        },
        processStyle: {
          backgroundColor: '#b2bfea',
        },
      },
      priceSlider: {
        value: [
          this.filterData['filter.minPrice'] || 0,
          this.filterData['filter.maxPrice'] || 2000000,
        ],
        width: '100%',
        height: 4,
        dotSize: 24,
        interval: 1000,
        min: 0,
        max: 2000000,
        disabled: false,
        show: false,
        tooltip: 'none',
        enableCross: false,
        bgStyle: {
          backgroundColor: '#cdcdcd',
        },
        processStyle: {
          backgroundColor: '#b2bfea',
        },
      },
      requireParam: this.$store.state.hotelListObj.requireParam,
      hotelsCount: 0,
      countLoading: false,
      timeOut: '',
    };
  },
  methods: {
    isBookNowPayLater() {
      this.localFilter['filter.isBookNowPayLater'] = !this.localFilter['filter.isBookNowPayLater'];
      this.getHotelsCount();
    },
    isBookableHotel() {
      this.localFilter['filter.isBookableHotel'] = !this.localFilter['filter.isBookableHotel'];
      this.getHotelsCount();
    },
    findCategoriesInfo(categoriesInfoArr) {
      const storeCategories = this.$store.state.hotelListObj.categories;
      return storeCategories.map((val) => {
        const rs = categoriesInfoArr.indexOf(val.eng) !== -1;
        return rs ? val.kor : '';
      }).filter(val => val);
    },
    getHotelsCount() {
      if (this.timeOut) {
        clearTimeout(this.timeOut);
      }
      setTimeout(() => {
        this.countLoading = true;
        const req = JSON.parse(this.$store.state.hotelListObj.requireParam);
        const obj = {};
        Object.keys(req).forEach((globalKey) => {
          obj[globalKey] = req[globalKey] ? req[globalKey] : '';
        });
        let sendParam = '';
        this.localFilter['filter.minPrice'] = this.price.min;
        this.localFilter['filter.maxPrice'] = this.price.max;
        // console.log(this.localFilter);
        Object.keys(this.localFilter).forEach((val) => {
          obj[val] = this.localFilter[val] ? this.localFilter[val] : '';
        });
        Object.keys(obj).forEach((key) => {
          sendParam += `${key}=${obj[key]}&`;
        });
        sendParam = sendParam.slice(0, -1);
        Api.getHotelsCount(encodeURI(sendParam)).then((resp) => {
          this.hotelsCount = resp.data ? resp.data : 0;
          this.countLoading = false;
        });
      }, 500);
    },
    ratingText(val) {
      let returnVal = '';
      switch (val) {
        case 6 :
          returnVal = '양호';
          break;
        case 7 :
          returnVal = '좋음';
          break;
        case 8 :
          returnVal = '우수';
          break;
        case 9 :
          returnVal = '최고';
          break;
        default :
          returnVal = '';
          break;
      }
      return returnVal;
    },
    onlyNumber(ev, type) {
      const event = ev;
      const val = this.format.priceReFormat(ev.target.value);
      const flag = isNaN(val * 1);
      if (!flag) {
        if (((type === 'max' && (val * 1) <= 2000000) || (type === 'min' && (val * 1) >= 0 && (val * 1) < 2000000)) && val) {
          const arr = [type === 'min' ? val : this.priceSlider.value[0], type === 'max' ? val : this.priceSlider.value[1]];
          this.priceSlider.value = arr;
          this.price[type] = this.priceSlider.value[type === 'min' ? 0 : 1];
          event.target.value = this.format.priceFormat(val);
        }
      } else {
        event.target.value = this.format.priceFormat(this.priceSlider.value[type === 'min' ? 0 : 1]);
      }
      this.getHotelsCount();
    },
    saveGroupFilter(key, val) {
      if (key === 'filter.facilities') {
        const facilitiesList = this.localFilter[key].filter(item => item.indexOf('FREE_') >= 0);
        this.localFilter[key] = [];
        this.localFilter[key] = [...new Set(val.concat(facilitiesList))];
      } else {
        this.localFilter[key] = [...val];
      }
      this.filterPop = '';
      this.getHotelsCount();
    },
    pushFilter(key, value) {
      if (this.localFilter[key].indexOf(value) >= 0) {
        this.localFilter[key].splice(this.localFilter[key].indexOf(value), 1);
      } else {
        this.localFilter[key].push(value);
      }
      this.getHotelsCount();
    },
    changeRatingSlider(val) {
      this.localFilter['filter.rating'] = val;
      this.getHotelsCount();
    },
    priceSliderChange(val) {
      this.price.min = val[0];
      this.price.max = val[1];
    },
    resetFilter() {
      this.localFilter = {
        'filter.categories': [],
        'filter.facilities': [],
        'filter.maxPrice': '',
        'filter.minPrice': '',
        'filter.rating': '',
        'filter.star': [],
        'filter.freeFacilities': [],
        'filter.isBookableHotel': false,
        'filter.isBookNowPayLater': false,
        orderBy: 'WEIGHT_DESC',
      };
      Object.keys(this.checkList).forEach((key) => {
        this.checkList[key].forEach((val) => {
          const temp = val;
          temp.type = false;
        });
      });
      this.price.min = 0;
      this.price.max = 2000000;
      this.priceSlider.value = [0, 2000000];
      this.getHotelsCount();
    },
    back() {
      this.$emit('back');
    },
    submit() {
      const obj = this.localFilter;
      obj['filter.minPrice'] = this.price.min !== 0 ? this.price.min : undefined;
      obj['filter.maxPrice'] = this.price.max !== 2000000 ? this.price.max : undefined;
      this.$emit('apply-filter', obj);
      this.back();
    },
    priceRangeFormat(x) {
      return (Math.round(x / 1000) * 1000);
    },
    intervalGetHotelCount() {
      const interval = setInterval(() => {
        if (this.$store.state.hotelListObj.requireParam) {
          clearInterval(interval);
          this.getHotelsCount();
        }
      }, 100);
    },
  },
  mounted() {
    window.document.body.style.overflow = 'hidden';
    if (!Array.isArray(this.filterData)) {
      this.$nextTick(() => {
        this.intervalGetHotelCount();
        this.priceSlider.show = true;
        this.ratingSlider.show = true;
      }, 500);
    } else {
      this.$router.push({ params: { filter: null }, query: this.$route.query });
    }
  },
  beforeDestroy() {
    window.document.body.style.overflowY = '';
  },
};
</script>

<style lang="scss">
  #filter{
    .top-control {
      transition: opacity 0.3s ease;
      width: 100%;
      height: 50px;
      background-color: #fff;
      border-bottom: 1px solid #f2f2f2;
      .title{
        font-size: 16px;
        color: #000;
        line-height: 50px;
      }
      & > .contents {
        transition: opacity 0.3s ease;
        width: 100%;
        height: 100%;
        text-align: center;
        position: relative;
        .x-btn{
          width: 40px;
          height: 40px;
          background-size: 21px;
          background-position: center center;
          cursor: pointer;
          background-repeat: no-repeat;
          background-image: url(~assets/img/hotelList/x.svg);
          background-color: transparent;
          position: absolute;
          top: calc(50% - 20px);
          right: 0;
        }
        .top-control-right{
          font-size: 12px;
          font-weight: bold;
        }
        .top-control-filter{
          color: #868686;
          font-size: 14px;
          font-weight: bold;
          position: absolute;
          line-height: 50px;
          left: 10px;
        }
      }
    }
    .submit-wrap{
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 12px 10px;
      background-color: #fff;
      box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
      z-index: 5;
      .submit-btn{
        height: 54px;
        background-color: $dodger-blue;
        color: #fff;
        font-weight: bold;
        border-radius: 2px;
        font-size: 16px;
        text-align: center;
        line-height: 54px;
      }
    }
    .check-list{
      margin-top: 20px;
      li{
        margin-top: 20px;
      }
      li, div {
        &:first-of-type{
          margin-top: 0;
        }
        label{
          display: block;
          cursor: pointer;
        }
        .check-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .box{
            width: 18px;
            height: 18px;
            .inputCheck {
              display: none;
            }
            .checked {
              transition: .3s ease;
              width: 18px;
              height: 18px;
              border-radius: 2px;
              border: 1.5px solid #cdcdcd;
              background-color: #fff;
              position: relative;
              &.active{
                border: 1.5px solid $dodger-blue;
                background-color: $dodger-blue;
              }
              &.disable{
                border-color: #868686;
                background-color: #868686;
              }
              .checkSvg{
                position: absolute;
                top: calc(50% - 14px);
                left: calc(50% - 14.5px);
                width: 28px;
                height: 28px;
                background-image: url(~assets/img/hotelList/check.svg);
                background-position: center center;
                background-size: cover;
                background-repeat: no-repeat;
              }
            }
          }
          .title{
            font-size: 14px;
            color: #000;
          }
          .info{
            font-size: 14px;
            color: #868686;
          }
        }
      }
    }
    .filter-list.rating .vue-slider-component .vue-slider{
      margin-top: 32px;
      margin-bottom: 20px;
    }
    .vue-slider-component {
      &.ratingSlider .vue-slider::before{
        background-color: rgb(178, 191, 234);
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
        left: -10px;
      }
      .vue-slider {
        border-radius: 0;

        &::after, &::before {
          content: '';
          width: 10px;
          height: 4px;
          background-color: #ccc;
          position: absolute;
        }

        &::after {
          border-top-right-radius: 15px;
          border-bottom-right-radius: 15px;
          left: 100%;
        }

        &::before {
          border-top-left-radius: 15px;
          border-bottom-left-radius: 15px;
          left: -10px;
        }
      }
    }
    .vue-slider-component .vue-slider-dot{
      background-color: #fff;
      border-radius: 20px;
      border: 1px solid #fff;
      display: flex;
      justify-content: center;
      align-self: center;
    }
    .vue-slider-component .vue-slider-dot .vue-slider-dot-handle{
      width: 20px;
      height: 20px;
      background-color: $dodger-blue;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.24), 0 0 1px 0 rgba(0, 0, 0, 0.12);
    }
  }
</style>

<style lang="scss" scoped>
  #filter{
    width: 100%;
    background-color: #fff;
    position: fixed;
    top: 0;
    top: constant(safe-area-inset-top);
    top: env(safe-area-inset-top);
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 12;
    .filter-list-wrap{
      width: 100%;
      position: absolute;
      overflow-y: auto;
      top: 46px;
      left: 0;
      bottom: 78px;
      right: 0;
      -webkit-overflow-scrolling: touch;
      .item-wrap{
        padding: 0 10px;
      }
      .filter-list:not(.facilities):not(.categories):not(.possible){
        padding-top: 30px;
        padding-bottom: 30px;
      }
      .filter-list {
        border-bottom: 1px solid #efefef;
        &:first-of-type{
          padding-top: 0;
        }
        .filter-title{
          font-weight: bold;
          font-size: 16px;
          color: #585858;
        }
        &.price{
          font-size: 18px;
          color: #000;
          margin-top: 10px;
          .price-info{
            margin-top: 10px;
            .title{
              color: #000;
              font-size: 14px;
            }
            .title-sub{
              color: #868686;
              font-size: 12px;
            }
          }
          .price-range-wrap{
            width: 100%;
            .info-slider{
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 12px;
              color: #000;
              .slider-val{
                margin-right: 5px;
                font-size: 14px;
                text-align: right;
                width: 106px;
                height: 30px;
                border-radius: 2px;
                border: solid 1px #cdcdcd;
                background-color: #f9f9f9;
                padding-right: 5px;
                transition: .3s ease;
                &:focus{
                  border: 1px solid $dodger-blue;
                  background-color: #e9eeff;
                }
              }
            }
          }
          .daysPrice{
            font-weight: normal;
            font-size: 10px;
          }
          .priceSlider{
            margin-top: 20px;
          }
        }
        &.facilities, &.categories, &.possible{
          > div {
            width: 100%;
            height: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .info{
              .title-info{
                font-size: 16px;
                color: #000;
                line-height: 19px;
              }
              .val{
                line-height: 12px;
                font-size: 10px;
                color: $dodger-blue;
                display: flex;
                margin-top: 2px;
                .vals {
                  &:last-of-type::after{
                    content: '';
                  }
                  &::after{
                    content: ', ';
                  }
                }
                .etc{
                  margin-left: 4px;
                }
              }
            }
          }
        }
        .right-icon{
          width: 23px;
          height: 23px;
          background-size: 23px 23px;
          background-repeat: no-repeat;
          background-image: url(~assets/img/hotelList/ic-chevron-right.svg);
        }
      }
    }
    .flip {
      .switch{
        .slider.round{
          background-color: #868686;
        }
      }
      .switch.on.disable{
        .slider.round{
          background-color: #868686;
        }
        .slider.round::before{
          background-color: #fff;
        }
      }
      .switch.on{
        .slider.round{
          background-color: #b2bfea;
        }
        .slider.round::before{
          background-color: $dodger-blue;
        }
      }
    }
    .submit-wrap{
      display: flex;
      .submit-info{
        width: 50%;
        display: flex;
        justify-content: flex-end;
        text-align: right;
        padding-right: 12px;
        p:first-of-type{
          font-size: 12px;
          font-weight: bold;
          color: #868686;
          line-height: 15px;
        }
        p:nth-child(2){
          font-weight: bold;
          color: #000;
          font-size: 16px;
          line-height: 19px;
          margin-top: 5px;
        }
      }
      .submit-btn{
        width: 50%;
      }
    }
  }
</style>
