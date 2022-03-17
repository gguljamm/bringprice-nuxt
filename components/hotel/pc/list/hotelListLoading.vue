<template>
  <div id="hotelList">
    <div
      class="hotelList-section">
      <div class="contents">
        <ul
          class="listLoading"
        >
          <li>
            <div class="moveItem"/>
            <div class="slide"/>
            <div class='info'>
              <div class="list-info-short"/>
              <div class="list-info-long"/>
              <div class="list-info-middle"/>
              <div class="list-info-big"/>
            </div>
          </li>
          <li>
            <div class="moveItem"/>
            <div class="slide"/>
            <div class='info'>
              <div class="list-info-short"/>
              <div class="list-info-long"/>
              <div class="list-info-middle"/>
              <div class="list-info-big"/>
            </div>
          </li>
          <li>
            <div class="moveItem"/>
            <div class="slide"/>
            <div class='info'>
              <div class="list-info-short"/>
              <div class="list-info-long"/>
              <div class="list-info-middle"/>
              <div class="list-info-big"/>
            </div>
          </li>
          <li>
            <div class="moveItem"/>
            <div class="slide"/>
            <div class='info'>
              <div class="list-info-short"/>
              <div class="list-info-long"/>
              <div class="list-info-middle"/>
              <div class="list-info-big"/>
            </div>
          </li>
          <li>
            <div class="moveItem"/>
            <div class="slide"/>
            <div class='info'>
              <div class="list-info-short"/>
              <div class="list-info-long"/>
              <div class="list-info-middle"/>
              <div class="list-info-big"/>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['mapToggle'],
};
</script>

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
    display: flex;
  }
 .hotelList-section ul{
   width: 100%;
 }
 .hotelList-section li{
    margin-top: 10px;
    border-radius: 2px;
    height: 157px;
    background-color: #fff;
    list-style: none;
    padding: 10px;
    display: flex;
    position: relative;
    .info{
      width: 100%;
      padding-left: 10px;
    }
 }
 .hotelList-section .listLoadingMap{
   padding-right: 20px;
 }
 .hotelList-section .listLoadingMap li{
   width: 100%;
 }
  .slide{
    width: 200px;
    height: 137px;
    background-color: #f8f8f8;
  }
  .moveItem{
    width: 77px;
    height: 147px;
    top: 10px;
    transition: .3s ease;
    background-image: linear-gradient(to left, rgba(238, 238, 238, 0), #fff, rgba(255, 255, 255, 0));
    content: '';
    opacity: 0;
    display: block;
    position: absolute;
    animation: moveleft 1.5s infinite linear;
  }
  @keyframes moveleft {
    from {
      opacity: 0;
      transform: translateX(-15%);
    }
    10%{
      opacity: 1;
    }
    60%{ opacity: 1; }
    to {
      opacity: 0;
      transform: translateX(650%);
    }
  }
  .list-info-long{
    width: 33%;
    height: 17px;
    margin-top: 10px;
    background-color: #f8f8f8;
  }
  .list-info-short{
    width: 17%;
    height: 17px;
    margin-top: 10px;
    background-color: #f8f8f8;
  }
  .list-info-middle{
    width: 29%;
    height: 17px;
    margin-top: 10px;
    background-color: #f8f8f8;
  }
  .list-info-big{
    width: 100%;
    height: 36px;
    margin-top: 10px;
    background-color: #f8f8f8;
  }
</style>
