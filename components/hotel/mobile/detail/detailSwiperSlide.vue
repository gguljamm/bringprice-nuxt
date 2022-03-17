<template>
  <div
    v-swiper:detailMySwiper="detailSwiperOption"
    class="detailSwiperMobile"
  >
    <div
      class="swiper-wrapper detail-swiper-wrap">
      <div
        v-for="(x, index) in hotelListImg"
        :key="index"
        class="swiper-slide"
      >
        <div
          :style="{backgroundImage: `url(${x}), url(https://cdn.bringprice.com/image/schedule/no-image-box.png)`}"
          class="detail-list-img"
        />
      </div>
    </div>
    <div class="swiper-pagination swiper-pagination-bullets"></div>
    <div class="mask"></div>
  </div>
</template>
<script>
export default {
  props: ['hotelListImg'],
  data() {
    return {
      img: [],
      detailSwiperOption: {
        wrapperClass: 'detail-swiper-wrap',
        spaceBetween: 0,
        initialized: 1,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      },
    };
  },
};
</script>
<style lang="scss">
  .detailSwiperMobile {
    position: relative;
    .swiper-pagination-bullet.swiper-pagination-bullet-active{
      border-radius: 0;
      background: #fff;
    }
    .swiper-pagination-bullet{
      background: #fff;
      width: 20%;
      height: 100%;
      border-radius: 0;
      padding: 0;
      margin: 0 !important;
    }
    .swiper-pagination{
      font-size: 0;
      width: 130px;
      height: 2px;
      border-radius: 1px;
      overflow: hidden;
      position: absolute;
      left: calc(50% - 65px);
      bottom: 46px;
    }
  }
</style>

<style lang="scss" scoped>
  .mask{
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    bottom: 0;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2));
    z-index: 1;
  }
  .detail-list-img{
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center center;
    position: relative;
  }
</style>

