<template>
  <div style="height: 200px" :style="isMap ? { width: '230px' } : { width: '260px' }">
    <div
      v-swiper:mySwiper="swiperOption"
      class="hotelSwiperWrapPc"
      style="height: 200px;"
      ref="myswiper"
    >
      <div class="mask"
           @mouseover="hoverFlag = true"
           @mouseout="hoverFlag = false"
      ></div>
      <div class="swiper-wrapper">
        <div
          v-for="(x, index) in img.slice(0, imgMaxLength)"
          :key="`${x}${index}`"
          class="swiper-slide"
        >
          <div
            :data-background="x"
            class="list-img swiper-lazy"
          />
          <div
            :class="isOld ? 'hide' : ''"
            class="swiper-lazy-preloader swiper-lazy-preloader-black"></div>
        </div>
      </div>
      <div
        @click.stop
        :class="hoverFlag ? 'fadeIn' : 'fadeOut'"
        class="swiper-pagination swiper-pagination-bullets"
        @mouseover="hoverFlag = true"
        @mouseout="hoverFlag = false"
      ></div>
      <div
        @click.stop
        :class="hoverFlag ? 'fadeIn' : 'fadeOut'"
        class="swiper-button-prev" slot="button-prev"
        @mouseover="hoverFlag = true"
        @mouseout="hoverFlag = false"
      ></div>
      <div
        @click.stop
        :class="hoverFlag ? 'fadeIn' : 'fadeOut'"
        class="swiper-button-next" slot="button-next"
        @mouseover="hoverFlag = true"
        @mouseout="hoverFlag = false"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['hotelListImg', 'isMap'],
  data() {
    const img = [];
    for (let x = 0; x < this.hotelListImg.length; x += 1) {
      img.push(this.hotelListImg[x]);
    }
    const agent = navigator.userAgent.toLowerCase();
    const isOld = (navigator.appName === 'Netscape' && agent.indexOf('trident') !== -1) || (agent.indexOf('msie') !== -1);
    return {
      imgMaxLength: 5,
      img,
      hoverFlag: false,
      swiperOption: {
        loopedSlides: 1,
        spaceBetween: 0,
        lazy: true,
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
      isOld,
    };
  },
};
</script>
<style>
  .hotelSwiperWrapPc .swiper-pagination{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hotelSwiperWrapPc .swiper-pagination-bullet.swiper-pagination-bullet-active{
    width: 8px;
    height: 8px;
    background: #fff;
    padding-top: 1.5px;
    opacity: .8;
  }
  .hotelSwiperWrapPc .swiper-pagination-bullet{
    width: 6px;
    height: 6px;
    opacity: .5;
    background: #fff;
  }
  .hotelSwiperWrapPc .swiper-button-prev, .swiper-button-next{
    width: 20px;
    height: 20px;
    color: #efefef;
    background-image: url(~assets/img/hotelList/swiper-nav.svg);
    top: 60%;
  }
  .hotelSwiperWrapPc .swiper-button-next{
    transform: rotate(180deg);
    background-image: url(~assets/img/hotelList/swiper-nav.svg)
  }
</style>
<style lang="scss" scoped>
  .swiper-lazy-preloader.hide{
    display: none;
  }
  .list-img{
    width: 100%;
    // margin-top: 13px;
    height: 100%;
    background-size: cover;
    background-position: center center;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
  }
  .hotelSwiperWrapPc{
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
  .swiper-lazy-loaded{background-color: #f8f8f8;}
  .fadeIn{
    transition: 0.3s ease;
    opacity: 1;
  }
  .fadeOut{
    transition: 0.3s ease;
    opacity: 0;
  }
</style>

