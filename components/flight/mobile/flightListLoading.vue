<template>
  <div id="hotelList">
    <div
      :style="$route.params.popFlag === 'list' ? { paddingTop: '145px' } : ''"
      class="hotelList-section">
      <div class="contents">
        <ul>
          <li>
            <div class="moveItem"/>
            <div class="slide"/>
            <div class="list-info-long"/>
            <div class="list-info-short"/>
            <div class="list-info-big"/>
          </li>
          <li>
            <div class="moveItem"/>
            <div class="slide"/>
            <div class="list-info-long"/>
            <div class="list-info-short"/>
            <div class="list-info-big"/>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  #hotelList{
    width: 100%;
  }
  #hotelList .hotelList-section{
    width: 100%;
    background-color: #f8f8f8;
  }
  .hotelList-section .contents{
    width: 100%;
  }
  .hotelList-section li{
    width: 100%;
    position: relative;
    margin-top: 10px;
    border-radius: 2px;
    height: 248px;
    background-color: #fff;
    list-style: none;
    padding: 10px;
    &:first-of-type{
      margin-top: 0;
    }
  }
  .slide{
    width: 100%;
    height: 151px;
    background-color: #f8f8f8;
  }
  .moveItem {
    width: 30%;
    height: 238px;
    top: 0;
    position: absolute;
    opacity: 0;
    transition: .3s ease;
    background-image: linear-gradient(to left, rgba(238, 238, 238, 0), #fff, rgba(255, 255, 255, 0));
    content: '';
    display: block;
    animation: moveleft 1s infinite linear;
  }
  @keyframes moveleft {
    from {
      opacity: 0;
      transform: translateX(-20%);
    }
    10%{
      opacity: 1;
    }
    60%{ opacity: 1; }
    to {
      opacity: 0;
      transform: translateX(250%);
    }
  }
  .list-info-long{
    width: 33%;
    height: 8px;
    margin-top: 10px;
    background-color: #f8f8f8;
  }
  .list-info-short{
    width: 17%;
    height: 8px;
    margin-top: 10px;
    background-color: #f8f8f8;
  }
  .list-info-big{
    width: 100%;
    height: 27px;
    margin-top: 10px;
    background-color: #f8f8f8;
  }
</style>
