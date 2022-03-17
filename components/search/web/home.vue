<template>
  <div
    @click="autoPop = false"
    class="bpSearchHome"
  >
    <transition name="fade" mode="out-in">
      <Calendar v-if="$route.params.step === 'date'"></Calendar>
      <Search
        v-else
        :autoPop="autoPop"
        :wishCities="wishCities"
        :searchTypePop="searchTypePop"
        @auto-pop-on="autoPop=true"
        @open-search-type-pop="searchTypePop = true"
        @close-search-type-pop="searchTypePop = false"
        @close-pop="autoPop=false"
        @clear-wish="wishCities=[]"
      ></Search>
    </transition>
    <div v-if="!$route.params.step" class="teaserWrap">
<!--      <Covid-->
<!--        v-if="$store.state.covid"-->
<!--        :isPop="false"-->
<!--      ></Covid>-->
      <PlaceRecent></PlaceRecent>
      <div class="teaserList" v-for="(x, index) in teaserData" :key="index">
        <div>{{ x.title }}</div>
        <div>{{ x.description }}</div>
        <teaser-swiper :data="x"></teaser-swiper>
      </div>
    </div>
  </div>
</template>

<script>
import Search from './search.vue';
import Calendar from './calendar.vue';
import PlaceRecent from './placeRecent.vue';
import TeaserSwiper from './teaserSwiper.vue';
import Covid from '~/components/common/covid.vue'; // eslint-disable-line

export default {
  components: {
    Search,
    Calendar,
    PlaceRecent,
    TeaserSwiper,
    Covid,
  },
  props: ['teaserData'],
  data() {
    return {
      searchTypePop: false,
      loginPop: false,
      autoPop: false,
      wishCities: [],
    };
  },
};
</script>

<style scoped lang="scss">
  .bpSearchHome{
    min-height: calc(100vh - 290px);
  }
  .teaserWrap{
    max-width: 1230px;
    margin: 0 auto;
    padding: 0 60px 100px;
    .teaserList{
      margin-top: 30px;
      > div:first-of-type{
        font-size: 16px;
        font-weight: bold;
        line-height: 24px;
      }
      > div:nth-of-type(2){
        line-height: 18px;
        color: #9b9b9b;
        font-size: 12px;
        margin-bottom: 6px;
      }
    }
  }
  @media screen and (max-width: 1110px){
    .teaserWrap{
      overflow: hidden;
    }
  }
  @media screen and (max-width: 1760px) {
    .covidWrapper{
      display: block;
    }
  }
</style>
