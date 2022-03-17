<template>
  <div class="flightPlaceWrapper">
    <div class="searchBox">
      <div class="searchHead">
        <button @click="historyBack()"></button>
      </div>
      <div class="inputBox">
        <button
          @click="inputData.wishCities.length < 6 ? openInputPop('add') : ''"
        ></button>
      </div>
      <div ref="wishList" class="inputList">
        <transition-group name="fade" tag="div">
          <button
            :key="inputData.startCity.PlaceId"
            @click="openInputPop('start')"
          >
            {{ inputData.startCity.PlaceName === '서울' ? '인천/김포' : inputData.startCity.PlaceName }}
            <span>출발{{ !inputData.startCity.PlaceId ? '지 입력' : '' }}</span>
          </button>
          <button
            v-for="(x, index) in inputData.wishCities"
            :key="x.PlaceId"
          >
            <div @click="openInputPop(`city${index}`)">{{ x.PlaceName }}</div>
            <div @click="delCity(index)"></div>
          </button>
        </transition-group>
      </div>
      <div class="bubbleWrap">
        <div class="bubble">출발지는 여기서 변경 가능합니다.</div>
      </div>
    </div>
    <div class="searchContent">
      <div>
        <div>여행도시를 더 추가해보세요!</div>
        <div>가장 저렴하고 여행하기 좋은 항공권에 맞춰<br>다향한 다구간 여행일정을 추천해드립니다.</div>
      </div>
      <transition name="fade">
        <div class="recommendWrapper" v-if="validRecommendList > 0 && !loading">
          <div>
            <div>함께가기 좋은 여행지</div>
            <ul>
              <li
                v-for="x in recommendList"
                :key="x.PlaceId"
                v-if="inputData.startCity.PlaceId !== (x.CityId || x.PlaceId)"
                @click="addWishCity(x)"
              >
                <div>{{ x.PlaceName }},</div>
                <div>{{ x.CountryName }}</div>
                <button>추가</button>
              </li>
            </ul>
          </div>
        </div>
        <div v-else-if="loading">
          <div class="loaderWrapper">
            <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="searchButton" v-if="inputData.wishCities.length >= 1">
        <button
          @click="submit()"
        >
          {{ inputData.wishCities.length === 1 ? '왕복항공권 검색' : '다구간항공권 검색' }}
        </button>
      </div>
    </transition>
    <transition name="slide-bottom">
      <input-place
        v-if="$route.params.param2"
        @change-value="changeValue"
      ></input-place>
    </transition>
  </div>
</template>

<script>
import Api from '~/utils/api'; // eslint-disable-line
import InputPlace from './inputPopup.vue';

export default {
  components: {
    InputPlace,
  },
  data() {
    return {
      inputData: {
        startCity: {
          PlaceName: '',
          CountryName: '',
          PlaceId: '',
        },
        wishCities: [],
      },
      loading: false,
      recommendList: [],
    };
  },
  computed: {
    validRecommendList() {
      return this.recommendList.length > 0 && !this.recommendList.some(x => this.inputData.startCity.PlaceId === (x.CityId || x.PlaceId));
    },
  },
  methods: {
    changeValue(place, param) {
      const arrCityCode = [];
      const arrWish = this.inputData.wishCities;
      for (let x = 0; x < arrWish.length; x += 1) {
        arrCityCode.push(arrWish[x].CityId || arrWish[x].PlaceId);
      }
      if (param !== 'start') {
        arrCityCode.push(this.inputData.startCity.CityId || this.inputData.startCity.PlaceId);
        if (arrCityCode.indexOf(place.CityId || place.PlaceId) < 0) {
          if (param === 'add') {
            this.inputData.wishCities.push(place);
          } else if (param.indexOf('city') === 0) {
            const index = parseInt(param.split('city')[1], 10);
            this.inputData.wishCities[index] = place;
          }
          this.$store.commit('appendFlightPlaceInfo', place);
          this.recommendCityList();
        } else {
          setTimeout(() => {
            this.$router.push({
              query: {
                popFlag: 'alert',
                alertId: 2,
              },
            });
          }, 10);
        }
      } else if (arrCityCode.indexOf(place.CityId || place.PlaceId) < 0) {
        this.inputData.startCity = place;
        this.$store.commit('appendFlightPlaceInfo', place);
        this.recommendCityList();
      } else {
        setTimeout(() => {
          this.$router.push({
            query: {
              popFlag: 'alert',
              alertId: 2,
            },
          });
        }, 10);
      }
    },
    openInputPop(flag) {
      this.$router.push({
        params: {
          param2: flag,
        },
      });
    },
    addWishCity(city) {
      if (!this.inputData.wishCities.some(x => (x.CityId || x.PlaceId) === (city.CityId || city.PlaceId)) &&
        ((this.inputData.startCity.CityId || this.inputData.startCity.PlaceId) !== (city.CityId || city.PlaceId))
      ) {
        this.inputData.wishCities.push(city);
        this.$store.commit('appendFlightPlaceInfo', city);
        this.$nextTick(() => {
          this.$refs.wishList.scrollLeft = 9999;
        });
        this.recommendCityList();
      }
    },
    delCity(index) {
      this.inputData.wishCities.splice(index, 1);
      this.recommendCityList();
    },
    historyBack() {
      history.back();
    },
    recommendCityList() {
      this.recommendList = [];
      if (this.inputData.wishCities.length >= 6) {
        return;
      }
      this.loading = true;
      Api.recommendCityList(this.inputData.startCity.PlaceId, this.inputData.wishCities)
        .then((resp) => {
          this.loading = false;
          if (resp.data.Status === 'Success') {
            this.recommendList = resp.data.Result.Places;
          }
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        });
    },
    submit() {
      if (!this.inputData.startCity.PlaceId) {
        this.$router.push({
          query: {
            popFlag: 'alert',
            alertId: 18,
          },
        });
        return;
      }
      const arr = [];
      for (let x = 0; x < this.inputData.wishCities.length; x += 1) {
        arr.push(this.inputData.wishCities[x].PlaceId.split('-')[0]);
      }
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'clickFlightSearch',
        eventAction: arr.length === 1 ? 'mobile-round' : 'mobile-multi',
        eventLabel: arr.length === 1 ? arr[0] : arr.length,
      });
      this.$router.push(
        `/date/flight/${this.inputData.startCity.PlaceId.split('-')[0]}&${arr.join('&')}`,
      );
    },
  },
  mounted() {
    if (this.$route.params.param !== 'SELA' && this.$route.params.param !== 'ICN' && this.$route.params.param !== 'GMP') {
      this.inputData.startCity = {
        PlaceName: '서울',
        CountryName: '대한민국',
        PlaceId: 'SELA-sky',
      };
    }
    if (this.$store.state.flightPlaceInfo[this.$route.params.param]) {
      const cityInfo = this.$store.state.flightPlaceInfo[this.$route.params.param];
      this.inputData.wishCities.push(cityInfo);
      this.recommendCityList();
    } else {
      Api.findCityName(`${this.$route.params.param}-sky`).then((resp) => {
        this.inputData.wishCities.push(resp.data.Result);
        this.$store.commit('appendFlightPlaceInfo', resp.data.Result);
        this.recommendCityList();
      });
    }
  },
};
</script>

<style lang="scss" scoped>
  .flightPlaceWrapper{
    width: 100%;
    height: 100%;
    background-color: #f8f8f8;
    .searchBox{
      background-color: #FFF;
      position: fixed;
      top: 0;
      padding-top: constant(safe-area-inset-top);
      padding-top: env(safe-area-inset-top);
      left: 0;
      width: 100%;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      .searchHead{
        height: 50px;
        position: relative;
        > button{
          left: 4px;
          top: 0;
          width: 40px;
          height: 40px;
          background-image: url(~assets/img/common/chevron-left.svg);
          background-size: 21px;
          background-position: center 14px;
          background-repeat: no-repeat;
          border: 0;
          background-color: transparent;
          position: absolute;
          cursor: pointer;
        }
      }
      .inputBox{
        position: relative;
        padding: 0 20px 10px;
      }
      .inputBox > button{
        width: 100%;
        height: 40px;
        border-radius: 4px;
        background-color: #f8f8f8;
        border: 0;
        padding: 0 16px;
        cursor: pointer;
      }
      .inputBox:before{
        content: '';
        width: 20px;
        height: 20px;
        background-image: url(~assets/img/common/search_grey.svg);
        position: absolute;
        background-size: 20px 20px;
        top: 10px;
        left: 34px;
        pointer-events: none;
        transition: opacity .2s ease;
      }
      .inputList{
        padding-bottom: 10px;
        height: 43px;
        white-space: nowrap;
        font-size: 0;
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        button{
          display: inline-block;
          font-size: 12px;
          height: 33px;
          border: 1px solid $cornflower;
          background-color: $cornflower;
          color: #FFF;
          border-radius: 2px;
          margin-right: 6px;
          position: relative;
          &:first-of-type{
            background-color: #FFF;
            color: #4a4a4a;
            margin-left: 20px;
            padding: 0 12px;
            cursor: pointer;
            border: 1px solid #e1e1e1;
            font-weight: bold;
            > span{
              color: #9b9b9b;
              font-weight: normal;
            }
          }
          &:last-of-type{
            margin-right: 20px;
          }
          > div:first-of-type{
            padding: 0 12px 0 12px;
            margin-right: 24px;
            height: 100%;
            line-height: 33px;
            cursor: pointer;
            > span{
              font-weight: normal;
            }
          }
          > div:nth-of-type(2){
            cursor: pointer;
            content: '';
            position: absolute;
            width: 24px;
            height: 33px;
            background-image: url(~assets/img/common/x-white.svg);
            right: 0;
            top: 0;
            background-repeat: no-repeat;
            background-size: 10px;
            background-position: center center;
          }
        }
      }
      .bubbleWrap{
        animation: toast 3s 1 ease;
        animation-fill-mode: forwards;
        position: relative;
        padding: 0 16px;
        margin-left: 20px;
        font-size: 14px;
        border: 1px solid transparent;
        .unVisible{
          visibility: hidden;
        }
        .bubble{
          height: 34px;
          border-radius: 14px;
          box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
          background-color: #000000;
          white-space: nowrap;
          position: absolute;
          top: 0;
          left: 0;
          padding: 0 10px;
          color: #fff;
          text-align: center;
          font-size: 10px;
          display: flex;
          align-items: center;
          &:before {
            content: '';
            position: absolute;
            top: -5px;
            left: 20%;
            margin-left: -4px;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 5px solid #4a4a4a;
          }
        }
      }
    }
  }
  .searchContent{
    padding-top: 148px;
    padding-bottom: 121px;
    > div:first-of-type{
      background-color: #FFF;
      padding: 12px 20px;
      > div:first-of-type{
        font-size: 14px;
        color: #4a4a4a;
        font-weight: bold;
        line-height: 20px;
      }
      > div:nth-of-type(2){
        font-size: 12px;
        color: #9b9b9b;
        margin-top: 4px;
        line-height: 14px;
      }
    }
    .recommendWrapper{
      padding: 20px;
      > div{
        background-color: #FFF;
        padding: 12px 0 2px;
        border-radius: 6px;
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
        > div{
          font-size: 12px;
          font-weight: bold;
          color: #9b9b9b;
          padding: 0 10px 12px;
        }
        > ul{
          padding: 0;
          margin: 0;
          list-style: none;
          > li{
            border-bottom: 1px solid #f8f8f8;
            position: relative;
            padding: 10px 10px;
            cursor: pointer;
            > div:first-of-type{
              color: #4a4a4a;
              font-size: 14px;
              line-height: 20px;
            }
            > div:nth-of-type(2) {
              color: $brown-grey;
              font-size: 12px;
              line-height: 18px;
            }
            > button{
              position: absolute;
              right: 10px;
              top: 50%;
              transform: translateY(-50%);
              padding: 0 14px;
              height: 28px;
              border-radius: 14px;
              background-color: #f8f8f8;
              border: 0;
              font-size: 12px;
              color: $brown-grey;
              cursor: pointer;
            }
            &:last-of-type{
              border-bottom: 0;
            }
          }
        }
      }
    }
  }
  .searchButton{
    position: fixed;
    bottom: 51px;
    left: 0;
    width: 100%;
    height: 70px;
    padding: 12px 20px;
    background-color: #FFF;
    box-shadow: 0 -2px 4px 0 rgba(0,0,0,.1);
    transition: .3s ease;
    .scrollDown &{
      transform: translateY(51px);
    }
    > button{
      height: 46px;
      background-color: $cornflower;
      width: 100%;
      color: #FFF;
      font-weight: bold;
      line-height: 47px;
    }
  }
  .slide-bottom-enter-active {
    transition: all .3s ease;
  }
  .slide-bottom-leave-active {
    transition: all .3s ease;
  }
  .slide-bottom-enter, .slide-bottom-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(100px);
  }
</style>
