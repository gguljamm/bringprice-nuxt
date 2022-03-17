<template>
  <div class="covidWrapper" v-if="init" :class="[isPop ? 'popup' : 'nopop', $store.state.isMobile ? 'mobile' : 'web']">
    <div>
      <div>
        <div>
          {{ date }} 기준<br>
          전세계 코로나19 발생 현황
        </div>
        <div
          v-swiper:index="swiperOption"
          ref="swiper"
        >
          <ul class="swiper-wrapper">
            <li class="swiper-slide">
              <div>전세계</div>
              <div>확진환자: {{ Format.numberFormat(global.TotalConfirmed) }}명 (+{{ Format.numberFormat(global.NewConfirmed) }})</div>
              <div>격리해제: {{ Format.numberFormat(global.TotalRecovered) }}명 (+{{ Format.numberFormat(global.NewRecovered) }})</div>
              <div>사망자: {{ Format.numberFormat(global.TotalDeaths) }}명 (+{{ Format.numberFormat(global.NewDeaths) }})</div>
            </li>
            <li class="swiper-slide" v-for="x in arrCountries" :key="x.code">
              <div>{{ x.name }}</div>
              <div>확진환자: {{ Format.numberFormat(getCountry(x.code).TotalConfirmed) }}명 (+{{ Format.numberFormat(getCountry(x.code).NewConfirmed) }})</div>
              <div>격리해제: {{ Format.numberFormat(getCountry(x.code).TotalRecovered) }}명 (+{{ Format.numberFormat(getCountry(x.code).NewRecovered) }})</div>
              <div>사망자: {{ Format.numberFormat(getCountry(x.code).TotalDeaths) }}명 (+{{ Format.numberFormat(getCountry(x.code).NewDeaths) }})</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format.js'; //eslint-disable-line

export default {
  props: ['isPop'],
  data() {
    const arr = [
      { code: 'GB', name: '영국' },
      { code: 'US', name: '미국' },
      { code: 'FR', name: '프랑스' },
      { code: 'IT', name: '이탈리아' },
      { code: 'CH', name: '스위스' },
      { code: 'PT', name: '포르투갈' },
      { code: 'CA', name: '캐나다' },
      { code: 'JP', name: '일본' },
      { code: 'CN', name: '중국' },
      { code: 'VN', name: '배트남' },
      { code: 'TH', name: '태국' },
      { code: 'TW', name: '대만' },
    ];
    return {
      swiperOption: {
        // autoplay: 3000,
        loop: true,
      },
      init: false,
      global: {},
      countries: [],
      Format,
      date: '',
      arrCountries: arr.sort(() => 0.5 - Math.random()),
    };
  },
  methods: {
    getCountry(code) {
      const country = this.$store.state.covid.Countries.find(v => v.CountryCode === code);
      return country || {};
    },
  },
  mounted() {
    const d = new Date(this.$store.state.covid.Date);
    this.init = true;
    this.global = this.$store.state.covid.Global;
    this.countries = this.$store.state.covid.Countries;
    this.date = `${d.getFullYear()}년 ${this.Format.zeros(d.getMonth() + 1)}월 ${this.Format.zeros(d.getDate())}일 ${this.Format.zeros(d.getHours())}:${this.Format.zeros(d.getMinutes())}`;
    this.$nextTick(() => {
      this.$refs.swiper.swiper.autoplay.start();
    });
  },
};
</script>

<style scoped lang="scss">
  .covidWrapper{
    position: fixed;
    top: 200px;
    left: 0;
    width: 100%;
    z-index: 11;
    &.nopop{
      position: relative;
      top: unset;
      left: unset;
      width: 100%;
      z-index: 0;
      > div{
        width: 100%;
        margin: auto;
        position: relative;
        > div{
          position: relative;
          width: 100%;
          right: auto;
          box-shadow: 0 0 2px 1px rgba(0,0,0,.1);
          border-radius: 4px;
        }
      }
    }
    &.nopop.mobile{
      padding: 20px;
    }
    &.nopop.web{
      margin-top: 20px;
    }
    > div{
      width: 1110px;
      margin: 0 auto;
      position: relative;
      > div{
        right: -320px;
        position: absolute;
        width: 300px;
        background: #FFF;
        box-shadow: 0 0 2px 1px rgba(0,0,0,.1);
        border-radius: 8px;
        > div:nth-of-type(1){
          padding: 16px 20px 10px;
          border-bottom: 1px solid #eee;
          line-height: 24px;
        }
        > div:nth-of-type(2){
          .swiper-slide{
            padding: 10px 20px 16px;
            > div{
              line-height: 26px;
              &:first-child{
                line-height: 40px;
                font-weight: bold;
                font-size: 20px;
              }
              &:last-child{
                padding-bottom: 0;
              }
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 1760px) {
    .covidWrapper.popup{
      display: none;
    }
  }
  @media screen and (min-width: 1760px) {
    .covidWrapper.nopop.web{
      display: none;
    }
  }
</style>
