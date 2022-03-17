<template>
  <div class="searchWrap">
    <div>
      <div class="searchContainer" :class="$route.path !== '/' ? 'listSearchContainer' : ''">
        <h3 v-if="isNotList()">어디로 떠나볼까요?</h3>
        <auto-complete
          :autoPop="autoPop"
          :wishCities="wishCities"
          :orderFix="orderFix"
          :searchTypePop="searchTypePop"
          @auto-pop-on="$emit('auto-pop-on')"
          @close-search-type-pop="$emit('close-search-type-pop')"
          @open-search-type-pop="$emit('open-search-type-pop')"
          @close-pop="$emit('close-pop')"
          @clear-wish="clearWish"
        ></auto-complete>
      </div>
    </div>
    <div class="progressBar" v-if="progress < 1" :style="{width: `${100 * progress}%`}"></div>
  </div>
</template>

<script>
import AutoComplete from './autoComplete.vue';

export default {
  components: {
    AutoComplete,
  },
  props: ['autoPop', 'wishCities', 'orderFix', 'progress', 'searchTypePop'],
  methods: {
    isNotList() {
      return this.$route.path.indexOf('/hotelList') !== 0 && this.$route.path.indexOf('/flightList') !== 0;
    },
    clearWish() {
      if (this.$route.path.indexOf('/flightList/') === 0) {
        const leng = this.wishCities.length;
        for (let x = 0; x < leng; x += 1) {
          this.wishCities.splice(0, 1);
        }
      } else {
        this.$emit('clear-wish');
      }
    },
  },
};
</script>

<style scoped lang="scss">
  .listSearchContainer{
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  .searchWrap{
    width: 100%;
    height: 196px;
    background-color: #FFF;
    border-bottom: 1px solid #e9e9e9;
    position: relative;
    > div:not(.progressBar){
      max-width: 1230px;
      margin: 0 auto;
      background-color: #FFF;
      height: 195px;
      width: 100%;
    }
  }
  .searchWrap.listSearch{
    width: 462px;
    height: 44px;
    z-index: 11;
    position: fixed;
    left: calc(50% - 390px);
    top: 10px;
    .searchContainer {
      padding: 0;
      position: absolute;
      max-width: 462px;
    }
    > div:not(.progressBar){
      max-width: 462px;
      height: 44px;
      margin: 0;
    }
  }
  .searchContainer{
    padding: 48px 60px 31px;
    background-color: #FFF;
    max-width: 1230px;
    h3{
      font-size: 20px;
      font-weight: bold;
      line-height: 30px;
      padding-bottom: 10px;
    }
  }
  @media (max-width: 1110px) {
    .searchWrap.listSearch{
      border: 0;
      left: 150px;
      width: calc(100% - 460px)
    }
  }
</style>
