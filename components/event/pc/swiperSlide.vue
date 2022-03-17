<template>
  <div
    v-swiper:mySwiper="swiperOption"
    ref="slideSwiper"
    class="aboutPc"
    @slideChange="slideChange"
  >
    <div class="swiper-wrapper">
      <div
        v-for="(x, index) in hotelListImg"
        :key="index"
        class="swiper-slide"
      >
        <div
          :style="x ? { backgroundImage: `url(${x})` } : { backgroundImage: `url(${'https://cdn.bringprice.com/image/schedule/no-image-box.png'})` }"
          class="list-img"
          :class="index === 0 ? 'backPosRightCenter' : 'backPosLeftCenter'"
          @click="openVideo"
        ><div
          @click.stop
          class="slideMask"/></div>
      </div>
    </div>
    <div class="swiper-pagination" slot="pagination"></div>
    <div class="swiper-button-prev" slot="button-prev"></div>
    <div class="swiper-button-next" slot="button-next"></div>
  </div>
</template>
<script>
export default {
  props: ['hotelListImg'],
  data() {
    return {
      img: [],
      swiperOption: {
        spaceBetween: 60,
        slidesPerView: 2,
        centeredSlides: true,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
    };
  },
  methods: {
    slideChange() {
      this.$emit('swiper-change', this.$refs.slideSwiper.swiper.realIndex);
    },
    openVideo() {
      this.$emit('openVideo');
    },
  },
};
</script>
<style>
  .aboutPc .swiper-slide .slideMask{
    position: absolute;
    top: 0;
    left: 0;
    background-color: #000;
    width: 100%;
    height: 518px;
    opacity: .5;
    z-index: 2;
    transition: .3s ease;
    cursor: default;
  }
  .aboutPc .swiper-slide-active .slideMask {
    opacity: 0;
    z-index: -1;
  }
  .aboutPc .swiper-pagination{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .aboutPc .swiper-pagination-bullet.swiper-pagination-bullet-active{
    background: #fff;
    padding-top: 1.5px;
    opacity: .8;
  }
  .aboutPc .swiper-pagination-bullet{
    width: 10px;
    height: 10px;
    opacity: .5;
    background: #fff;
  }
  .aboutPc .swiper-button-prev, .aboutPc .swiper-button-next{
    width: 150px;
    height: 150px;
    background-size: 150px 150px;
    color: #efefef;
    background-image: url(~assets/img/hotelList/swiper-nav.svg);
    top: 40%;
    transition: .2s ease;
    opacity: .5;
  }
  .aboutPc .swiper-button-prev{
    left: 96px;
  }
  .aboutPc .swiper-button-prev:hover{
    left: 93px;
    opacity: 1;
  }
  .aboutPc .swiper-button-next:hover{
    right: 93px;
    opacity: 1;
  }
  .aboutPc .swiper-button-next{
    transform: rotate(180deg);
    right: 96px;
  }
  .aboutPc{
    overflow-x: hidden;
    overflow-y: visible;
  }
</style>
<style lang="scss" scoped>
  .list-img{
    width: 100%;
    height: 518px;
    background-size: cover;
    cursor: pointer;
  }
  .backPosLeftCenter{
    background-position: left center;
  }
  .backPosRightCenter{
    background-position: right center;
  }
  .aboutPc{
    position: relative;
  }
  .mask{
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3));
    z-index: 2;
    content: '';
  }
</style>

