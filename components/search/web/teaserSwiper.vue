<template>
  <div
    v-swiper:index="swiperOption"
    class="teaserSwiperWrap"
  >
    <ul class="swiper-wrapper">
      <li v-for="(y, index2) in data.list" :key="index2" class="swiper-slide">
        <div :style="{ backgroundImage: `url(${y.imgUrl})` }"></div>
        <div>{{ y.title }}</div>
        <div class="content">{{ y.content }}</div>
        <button
          @click="openUrl(y.url, data.type === 'hotel', y.title)"
        >{{ data.type === 'flight' ? '항공권 검색' : '호텔 검색' }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['data'],
  data() {
    return {
      swiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 8,
      },
    };
  },
  methods: {
    openUrl(url, isHotel, title) {
      if (isHotel) {
        this.$store.commit('clearHotel');
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'teaser',
          eventAction: 'hotel',
          eventLabel: title,
        });
      } else {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'teaser',
          eventAction: 'flight',
          eventLabel: title,
        });
      }
      this.$router.push(url);
    },
  },
};
</script>

<style lang="scss" scoped>
  .teaserSwiperWrap{
    position: relative;
    > ul{
      > li{
        position: relative;
        width: 271.5px;
        background-color: #FFF;
        &:before{
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          background-color: rgba(0,0,0,.47);
          opacity: 0;
          transition: .3s ease;
        }
        &:hover:before{
          opacity: 1;
        }
        > button{
          position: absolute;
          height: 53px;
          border-radius: 4px;
          padding: 0 16px;
          left: 50%;
          transform: translate(-50%, -50%);
          top: 50%;
          opacity: 0;
          background-color: rgba(255, 255, 255, .9);
          transition: .3s ease;
        }
        &:hover > button{
          opacity: 1;
        }
        > div:first-of-type{
          width: 100%;
          height: 162px;
          background-size: cover;
          background-position: bottom;
          background-repeat: no-repeat;
        }
        > div:nth-of-type(2){
          font-size: 16px;
          font-weight: bold;
          line-height: 24px;
          padding: 10px 12px 0;
        }
        > div:nth-of-type(3){
          line-height: 18px;
          color: #9b9b9b;
          font-size: 12px;
          padding: 0 12px 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
</style>
