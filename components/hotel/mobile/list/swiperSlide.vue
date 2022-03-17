<template>
  <div style="height: 151px">
    <div
      v-if="init"
      v-swiper:mySwiper="swiperOption"
      class="hotelSwiperWrapMobile"
      style="height: 151px;"
      ref="myswiper"
    >
      <div class="swiper-wrapper">
        <div
          v-for="(x, index) in img.slice(0, imgMaxLength)"
          :key="`${x}${index}`"
          class="swiper-slide"
        >
          <div
            :data-background="x"
            class="list-img swiper-lazy"
          ></div>
          <div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
        </div>
      </div>
      <div
        class="swiper-pagination swiper-pagination-bullets"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['hotelListImg'],
  data() {
    const img = [];
    for (let x = 0; x < this.hotelListImg.length; x += 1) {
      img.push(this.hotelListImg[x]);
    }
    return {
      imgMaxLength: 5,
      init: false,
      img,
      swiperOption: {
        spaceBetween: 0,
        lazy: true,
        loop: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init = true;
    });
  },
  beforeDestroy() {
    // this.mySwiper.clickable = false;
    // this.mySwiper.destroy(false, false);
  },
};
</script>
<style>
  .hotelSwiperWrapMobile .swiper-pagination{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hotelSwiperWrapMobile .swiper-pagination-bullet{
    width: 6px;
    height: 6px;
    opacity: .5;
    background: #fff;
  }
  .hotelSwiperWrapMobile .swiper-pagination-bullet.swiper-pagination-bullet-active{
    width: 8px;
    height: 8px;
    background: #fff;
    padding-top: 1.5px;
    opacity: .8;
  }
</style>

<style lang="scss" scoped>
  .list-img{
    width: 100%;
    // margin-top: 13px;
    height: 100%;
    background-size: cover;
    background-position: center center;
  }
  .list-img::before{
    width: 100%;
    height: 100%;
    display: block;
    opacity: 0.5;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), #000000);
    z-index: -1;
    content: '';
  }
  // .swiper-lazy-loaded{background-color: #f8f8f8;}
</style>

