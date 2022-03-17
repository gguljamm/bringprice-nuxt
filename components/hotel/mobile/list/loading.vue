<template>
  <div class="loader">
    <svg class="circular" viewBox="25 25 50 50">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0" stop-color="#7167ff" />
          <stop offset="100%" stop-color="#72dcdd" />
        </linearGradient>
      </defs>
      <circle class="path" stroke="url(#gradient)" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
    </svg>
  </div>


</template>

<style lang="scss" scoped>
  .loader {
    position: relative;
    margin: 0px auto;
    width: 45px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  }

  .loader:before {
    content: '';
    display: block;
    padding-top: 100%;
  }

  .circular {
    -webkit-animation: rotate 2s linear infinite;
    animation: rotate 2s linear infinite;
    height: 100%;
    -webkit-transform-origin: center center;
    -ms-transform-origin: center center;
    transform-origin: center center;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  .path {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    -webkit-animation: dash 1.5s ease-in-out infinite;
    animation: dash 1.5s ease-in-out infinite;
    stroke-linecap: round;
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
