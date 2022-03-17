<template>
  <div class="searchWrapper"
    :class="{
      active: isListFirstActive,
      firstActive: isSearchActive,
    }"
  >
    <transition name="widthSlide" mode="out-in">
      <div v-if="appDownSessionFlag === 'true' && !isApp" class="appDown">
        <div>
          <p><span class="pt">최저가 항공권</span> 놓치고 싶지 않다면!</p>
          <button @click="sendMarketStore" class="appDownBtn">앱 받기</button>
          <div @click="closeAppDown" class="closeBtn"></div>
        </div>
      </div>
    </transition>
    <div class="searchBox">
      <transition name="fade">
        <div class="title">
          안녕하세요!<br>
          어디로 떠나볼까요?
        </div>
      </transition>
      <div class="inputBox">
        <input
          class="searchInput"
          ref="searchInput"
          :class="isSearchActive ? 'active' : ''"
          @focus="searchActive()"
          @keyup="keyup"
        >
        <span class="mainPlaceholder" @click="$refs.searchInput.focus()" v-show="!isSearchActive">항공권, 호텔 검색</span>
        <transition name="fade">
          <button class="del" v-show="timesActive" @click="clearInput()"></button>
        </transition>
        <transition name="fade">
          <button class="cancel" @click="searchDisable()" v-show="isSearchActive">취소</button>
        </transition>
      </div>
      <div class="tab" v-show="isSearchActive">
        <button
          @click="selectedFlagChange('flight')"
          :class="serviceFlag === 'flight' ? 'selected' : ''"
          class="disable"
        >항공권</button>
        <button
          @click="selectedFlagChange('hotel')"
          :class="serviceFlag === 'hotel' ? 'selected' : ''"
        >호텔</button>
      </div>
    </div>
    <div class="searchListWrapper">
      <div class="teaserWrap" v-if="!isSearchActive">
<!--        <transition name="fade">-->
<!--          <Covid v-if="$store.state.covid"-->
<!--            :isPop="false"-->
<!--          ></Covid>-->
<!--        </transition>-->
        <place-recent></place-recent>
        <div class="teaserListWrap">
          <div class="teaserList event" v-for="(x, index) in teaserData" :key="index">
            <div>{{ x.title }}</div>
            <div>{{ x.description }}</div>
            <ul>
              <li v-for="(y, index2) in x.list" :key="index2" @click="openUrl(y.url, x.type === 'hotel')">
                <div :style="{ backgroundImage: `url(${y.imgUrl})` }"></div>
                <div>{{ y.title }}</div>
                <div>{{ y.content }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else>
        <transition name="swiper-left" mode="out-in">
          <place-list
            v-if="serviceFlag === 'flight'"
            :flag="'flight'"
            :placeList="flightPlaceList"
            :loading="autoCompleteLoading"
            :query="$refs.searchInput.value"
            @clear-focus="clearFocus"
          />
        </transition>
        <transition name="swiper-right" mode="out-in">
          <place-list
            v-if="serviceFlag === 'hotel'"
            :flag="'hotel'"
            :query="$refs.searchInput.value"
            :placeList="hotelPlaceList"
            :loading="autoCompleteLoading"
            @clear-focus="clearFocus"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import PlaceList from './placeList.vue';
import PlaceRecent from './placeRecent.vue';
import Api from '~/utils/api'; // eslint-disable-line
import Covid from '~/components/common/covid.vue'; // eslint-disable-line

export default {
  components: {
    PlaceList,
    PlaceRecent,
    Covid,
  },
  props: ['serviceFlag', 'teaserData'],
  data() {
    return {
      isSearchActive: false,
      isListFirstActive: false,
      hotelPlaceList: [],
      flightPlaceList: [],
      autoCompleteLoading: false,
      delay: 300,
      timeout: '',
      timesActive: false,
      focusTimeOut: '',
      appDownSessionFlag: 'false',
      init: false,
    };
  },
  computed: {
    isApp() {
      return window.navigator.userAgent.indexOf('bpIos') >= 0 || window.navigator.userAgent.indexOf('bpAos') >= 0;
    },
    query() {
      return this.$refs.searchInput.value;
    },
  },
  methods: {
    sendMarketStore() {
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIos) {
        location.href = 'itms-apps://itunes.apple.com/kr/app/apple-store/id1454195897';
      } else {
        // location.href = 'market://details?id=com.bpAos.bp.bp';
        // location.href = "intent://커스텀스킴주소#Intent; scheme=스킴; action=..;category=..; package=com.android.xxx; end;";
        location.href = 'https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.bpAos.bp.bp&ddl=1&pcampaignid=web_ddl_1';
        // location.href = 'intent://..#Intent; scheme=..; action=..;category=..; package=com.android.bp.bp; end;';
      }
    },
    closeAppDown() {
      this.appDownSessionFlag = false;
      window.sessionStorage.setItem('appDown', false);
    },
    openUrl(url, isHotel) {
      if (isHotel) {
        this.$store.commit('clearHotel');
      }
      this.$router.push(url);
    },
    clearFocus() {
      if (this.$refs.searchInput === document.activeElement) {
        this.$refs.searchInput.blur();
      }
    },
    clearInput() {
      this.$refs.searchInput.value = '';
      this.timesActive = false;
      this.$refs.searchInput.focus();
      this.hotelPlaceList = [];
      this.flightPlaceList = [];
    },
    selectedFlagChange(flag) {
      this.$emit('change-service-flag', flag);
      this.$nextTick(() => {
        this.keyup();
        this.$refs.searchInput.focus();
      });
    },
    searchActive() {
      this.isSearchActive = true;
      if (!this.serviceFlag) {
        this.$emit('change-service-flag', 'flight');
      }
    },
    searchDisable() {
      this.timesActive = false;
      this.isSearchActive = false;
      this.isListFirstActive = false;
      this.$refs.searchInput.value = '';
      this.hotelPlaceList = [];
      this.flightPlaceList = [];
    },
    keyup() {
      const query = this.$refs.searchInput.value;
      if (query.length === 0) {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.autoCompleteLoading = false;
        this.timesActive = false;
        this.flightPlaceList = [];
        this.hotelPlaceList = [];
        return;
      }
      this.timesActive = true;
      if (this.serviceFlag === 'hotel') {
        this.hotelAutoComplete(query);
      } else {
        this.flightAutoComplete(query);
      }
    },
    hotelAutoComplete(query) {
      this.autoCompleteLoading = true;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        Api.hotelAutoComplete(query).then((resp) => {
          this.isListFirstActive = true;
          this.autoCompleteLoading = false;
          this.hotelPlaceList = resp.data;
        }).catch((error) => {
          if (error.message !== 'cancel') {
            this.hotelPlaceList = [];
            this.autoCompleteLoading = false;
          }
        });
      }, this.delay);
    },
    flightAutoComplete(query) {
      this.autoCompleteLoading = true;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        Api.flightAutoComplete(query).then((resp) => {
          this.autoCompleteLoading = false;
          this.isListFirstActive = true;
          this.flightPlaceList = resp.data.Result.Places;
        }).catch((error) => {
          if (error.message !== 'cancel') {
            this.flightPlaceList = [];
            this.autoCompleteLoading = false;
          }
        });
      }, this.delay);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init = true;
    });
    if (window.sessionStorage.getItem('appDown') === null) {
      window.sessionStorage.setItem('appDown', true);
      this.appDownSessionFlag = 'true';
    } else {
      this.appDownSessionFlag = window.sessionStorage.getItem('appDown');
    }
    this.$refs.searchInput.value = '';
    if (this.$route.query.direct && this.$route.query.direct === 'appdown') {
      const obj = {};
      Object.keys(this.$route.query).forEach((x) => {
        if (x !== 'direct') {
          obj[x] = this.$route.query[x];
        }
      });
      this.$router.replace({
        query: obj,
      });
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIos) {
        location.href = 'itms-apps://itunes.apple.com/kr/app/apple-store/id1454195897';
      } else {
        // location.href = 'market://details?id=com.bpAos.bp.bp';
        // location.href = "intent://커스텀스킴주소#Intent; scheme=스킴; action=..;category=..; package=com.android.xxx; end;";
        location.href = 'https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.bpAos.bp.bp&ddl=1&pcampaignid=web_ddl_1';
        // location.href = 'intent://..#Intent; scheme=..; action=..;category=..; package=com.android.bp.bp; end;';
      }
    }
  },
};
</script>

<style lang="scss" scoped>
  .appDown{
    width: 100%;
    height: 48px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    border: solid 1px #f9f9f9;
    background-color: #fff;
    position: fixed;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    overflow: hidden;
    > div {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 36px 0 10px;
      position: relative;
      white-space: nowrap;
      p {
        font-size: 12px;
        color: #000;

        .pt {
          font-weight: bold;
        }
      }
      .appDownBtn {
        width: 57px;
        height: 23px;
        border-radius: 12.5px;
        background-color: #7167ff;
        font-size: 12px;
        color: #fff;
      }
      .closeBtn{
        width: 22px;
        height: 22px;
        background-image: url(~assets/img/common/ic-close.svg);
        background-size: 18px 18px;
        background-position: center center;
        background-repeat: no-repeat;
        position: absolute;
        right: 6px;
      }
    }
  }
  .searchWrapper{
    background-color: #f8f8f8;
    min-height: 100vh;
    min-height: calc(100vh - constant(safe-area-inset-top));
    min-height: calc(100vh - env(safe-area-inset-top));
    position: relative;
  }
  .searchBox{
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    padding-bottom: 10px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
    z-index: 2;
    background-color: $cornflower;
    color: #FFF;
    transition: .3s ease;
    .firstActive &{
      background-color: #FFF;
      padding-top: calc(40px + constant(safe-area-inset-top));
      padding-top: calc(40px + env(safe-area-inset-top));
    }
  }
  .title{
    font-size: 18px;
    padding-top: 73px;
    line-height: 22px;
    font-weight: bold;
    padding-left: 20px;
    overflow: hidden;
    transition: .3s ease;
    .firstActive &{
      height: 0;
      padding-top: 0;
    }
  }
  .inputBox{
    position: relative;
    padding: 10px 20px;
    .mainPlaceholder{
      position: absolute;
      left: 60px;
      top: calc(50% - 9px);
      color: #e1e1e1;
      font-size: 16px;
      cursor: none;
    }
  }
  .inputBox > input{
    width: 100%;
    height: 40px;
    background-color: #f9f9f9;
    border: 0;
    padding: 0 16px 0 40px;
    &.active{
      border-radius: 18px;
    }
  }
  .inputBox:before{
    content: '';
    width: 15px;
    height: 15px;
    background-image: url(~assets/img/common/search_grey.svg);
    position: absolute;
    background-size: 15px 15px;
    top: calc(50% - 7.5px);
    left: 32px;
    pointer-events: none;
    transition: opacity .2s ease;
  }
  .searchWrapper.firstActive .inputBox:before{
    opacity: 0.3;
  }
  .searchWrapper.firstActive .inputBox{
    padding-right: 61px;
  }
  .inputBox > button.del{
    position: absolute;
    width: 16px;
    height: 16px;
    background-color: #d8d8d8;
    border-radius: 100%;
    top: 22px;
    border: 0;
    right: 77px;
    cursor: pointer;
    transform: rotate(45deg);
  }
  .inputBox > button.del:before{
    content: '';
    height: 1px;
    width: 10px;
    border-bottom: 1px solid #FFF;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .inputBox > button.del:after{
    content: '';
    height: 10px;
    width: 1px;
    border-left: 1px solid #FFF;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .inputBox > button.cancel{
    position: absolute;
    right: 20px;
    height: 24px;
    top: 18px;
    border: 0;
    background: none;
    line-height: 24px;
    font-size: 14px;
    cursor: pointer;
    color: $dodger-blue;
  }
  .tab{
    width: 100%;
    height: 42px;
    padding: 0 20px;
  }
  .tab > button{
    padding: 0;
    background-color: transparent;
    height: 42px;
    width: 67px;
    font-size: 14px;
    color: $brown-grey;
    border: solid 1px #e5e5e5;
    border-radius: 2px;
    line-height: 40px;
  }
  .tab > button.selected{
    background-color: $cornflower;
    color: #FFF;
    border: solid 1px $cornflower;
    font-weight: normal;
  }
  .searchListWrapper{
    position: relative;
    padding-bottom: 51px;
    padding-top: 187px;
  }
  .searchWrapper.firstActive .searchListWrapper{
    padding-top: 152px;
  }
  .searchWrapper.active.firstActive .searchListWrapper{
    padding-top: 152px;
  }
  .searchListWrapper > div > div{}
  /* transition event */
  .swiper-left-enter-active, .swiper-left-leave-active,
  .swiper-right-enter-active, .swiper-right-leave-active {
    transition: .3s ease;
    transform: translateX(0);
  }
  .swiper-left-enter, .swiper-left-leave-to {
    transform: translateX(-100%);
  }
  .swiper-right-enter, .swiper-right-leave-to {
    transform: translateX(100%);
  }
  .teaserWrap{
    padding-bottom: 40px;
    .teaserListWrap {
      margin-top: 30px;
      .teaserList {
        margin-top: 20px;
        &:first-of-type{
          margin-top: 0;
        }
        > div:first-of-type {
          font-size: 18px;
          font-weight: bold;
          line-height: 20px;
          padding: 0 20px;
          color: #000;
        }

        > div:nth-of-type(2) {
          color: #868686;
          font-size: 12px;
          padding: 0 20px;
          line-height: 15px;
          margin-top: 2px;
        }

        > ul {
          padding: 0 20px;
          margin-top: 4px;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          white-space: nowrap;

          > li {
            cursor: pointer;
            display: inline-block;
            width: 200px;
            height: 200px;
            background-color: #FFF;
            border-radius: 4px;
            margin-right: 10px;
            border: 1px solid #f2f2f2;
            overflow: hidden;

            &:last-of-type {
              margin-right: 0;
            }

            > div:first-of-type {
              width: 100%;
              height: 130px;
              background-size: cover;
              background-position: bottom;
              position: relative;

              &:before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
                background-color: rgba(0, 0, 0, .3);
              }
            }

            > div:nth-of-type(2) {
              font-size: 12px;
              font-weight: bold;
              line-height: 15px;
              padding: 8px 8px 0;
              color: #000;
            }

            > div:nth-of-type(3) {
              color: #868686;
              font-size: 10px;
              padding: 0 8px 10px;
              margin-top: 2px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
  .widthSlide-leave-active {
    transition: width 0.25s, height 0.25s;
    transition-timing-function: ease-in-out;
  }

  .widthSlide-leave-to{
    width: 0;
  }
</style>
