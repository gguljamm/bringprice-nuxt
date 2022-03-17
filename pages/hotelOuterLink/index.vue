<template>
  <div id="hotelOuterLinkWrap">
    <div id="loading-wrap">
      <div class="agoda">
        <div class="agoda-title"/>
      </div>
      <svg class="circular" viewBox="25 25 50 50">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0" stop-color="#7167ff" />
            <stop offset="100%" stop-color="#72dcdd" />
          </linearGradient>
        </defs>
        <circle class="path" stroke="url(#gradient)" cx="50" cy="50" r="20" fill="none" stroke-width="1" stroke-miterlimit="10"/>
      </svg>
    </div>
    <div class="info">
      <p class="title">아고다로 이동합니다</p>
      <p class="sub">
        <span>해당 사이트에서 예약을 완료해주세요.<br>아고다에서 더 많은 객실정보를 확인하실 수 있습니다.</span>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    openLink() {
      location.replace(decodeURIComponent(this.$route.params.url));
    },
  },
  mounted() {
    setTimeout(() => {
      this.openLink();
    }, 900);
  },
};
</script>


<style lang="scss">
  body{
    background-color: #fff;
  }
</style>

<style lang="scss" scoped>
  #hotelOuterLinkWrap{
    width: 100%;
    height: calc(100vh - 360px);
  }
  #loading-wrap{
    margin: 90px auto 0 auto;
    position: relative;
    width: 160px;
    height: 160px;
    background-color: #fff;
    border-radius: 50%;
    border: 1px solid #f3f1f1;
    .agoda{
      width: 150px;
      height: 150px;
      border-radius: 100%;
      background-color: #f3f1f1;
      position: absolute;
      top: calc(50% - 75px);
      left: calc(50% - 75px);
      display: flex;
      justify-content: center;
      align-items: center;
      .agoda-title{
        width: 50%;
        height: 50%;
        background-image: url(~assets/img/hotelDetail/agoda-logo.svg);
        background-size: 100% 70px;
        background-position: center center;
        background-repeat: no-repeat;
      }
    }
  }
  .circular {
      width: 200px;
      height: 200px;
      -webkit-animation: rotate 2s linear infinite;
      animation: rotate 2s linear infinite;
      -webkit-transform-origin: center center;
      -ms-transform-origin: center center;
      transform-origin: center center;
      position: absolute;
      top: 0;
      bottom: 0;
      left: -20px;
      right: 0;
      margin: auto;
      .path {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
        -webkit-animation: dash 1.5s ease-in-out infinite;
        animation: dash 1.5s ease-in-out infinite;
        stroke-linecap: round;
        border: 1px solid #f3f1f1;
      }
    }
    .info{
      text-align: center;
      .title{
        font-weight: bold;
        font-size: 20px;
      }
      .sub{
        margin-top: 4px;
        font-size: 14px;
        color: $brown-grey;
      }
      margin: 30px auto;
    }
  @-webkit-keyframes
  rotate {  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
  }
  @keyframes
  rotate {  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
  }

  @-webkit-keyframes
  dash {  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124;
    }
  }

  @keyframes
  dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 89, 200;
      stroke-dashoffset: -124;
    }
  }
</style>
