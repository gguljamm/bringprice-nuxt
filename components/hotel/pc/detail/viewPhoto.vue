<template>
  <div
    id="viewPhoto"
    v-swiper:mySwiperDetail="swiperOptionDetail"
    ref="viewSlide"
    @slideChange="slideChange"
  >
    <div class="swiper-wrapper">
      <div
        v-for="(x, index) in hotelListImg.slice(0, 20)"
        :key="index"
        class="swiper-slide"
      >
        <div
          :style="{backgroundImage: `url(${x.url}), url(${'https://cdn.bringprice.com/image/schedule/no-image-box.png'})`}"
          class="list-img"
        />
      </div>
    </div>
    <div
      @click.stop
      class="pagination"
    >
      <div
        v-for="(x, index) in hotelListImg.slice(0, 20)"
        :key="index"
        :ref="`bullet${index}`"
        :class="slideIndex === index ? 'active' : ''"
        :style="
        slideIndex === index
        || (slideIndex - 1 === index || slideIndex - 2 === index || slideIndex - 3 === index)
        || (slideIndex + 1 === index || slideIndex + 2 === index || slideIndex + 3 === index)
        ? { display: 'block' } : { display: 'none' }"
        class="bullet"/>
    </div>
    <div
      class="swiper-button-prev swiperDetail-button-prev" slot="button-prev"
    ></div>
    <div
      class="swiper-button-next swiperDetail-button-next" slot="button-next"
    ></div>
  </div>
</template>
<script>
export default {
  props: ['hotelListImg'],
  data() {
    return {
      hoverFlag: false,
      slideIndex: 0,
      swiperOptionDetail: {
        spaceBetween: 0,
        navigation: {
          nextEl: '.swiperDetail-button-next',
          prevEl: '.swiperDetail-button-prev',
        },
      },
    };
  },
  methods: {
    slideChange() {
      this.slideIndex = this.$refs.viewSlide.swiper.activeIndex;
    },
  },
};
</script>
<style>
</style>

<style lang="scss" scoped>
  #viewPhoto{
    .pagination{
      width: 100%;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      z-index: 10;
      bottom: 20px;
      transition: .3s ease;
      .bullet{
        width: 8px;
        height: 8px;
        background: #fff;
        border-radius: 100% 100%;
        transition: .3s ease;
        opacity: 0.2;
        margin-left: 10px;
        &:first-of-type{
          margin-left: 0;
        }
        &.active{
          width: 12px;
          height: 12px;
          background: #fff;
          padding-top: 1.5px;
          opacity: 1;
        }
      }
    }
    .list-img{
      width: 160px;
      // margin-top: 13px;
      height: 90px;
      background-size: cover;
      background-position: center center;
      border-bottom-left-radius: 2px;
      border-top-left-radius: 2px;
      position: relative;
    }
    .swiperDetail-button-prev, .swiperDetail-button-next{
      width: 40px;
      height: 40px;
      color: #efefef;
      background-size: cover;
      background-image: url(~assets/img/hotelList/swiper-nav.svg);
      top: 50%;
      transition: 0.3s ease;
      opacity: 0.3;
    }
    .swiperDetail-button-next{
      transform: rotate(180deg);
      background-image: url(~assets/img/hotelList/swiper-nav.svg)
    }
    .swiper-lazy-loaded{background-color: #f8f8f8;}
    .swiperDetail-button-prev:hover, .swiperDetail-button-next:hover{
      opacity: 2;
    }
  }
</style>

