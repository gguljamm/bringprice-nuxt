<template>
  <div class="booking-loading">
    <ul class="loading-info">
      <li>
        <div class="moveItem"/>
        <div class='info'>
          <div class="list-info x195"></div>
          <div class="list-info x141"></div>
          <div class="middle5">
            <div class="list-info card"></div>
            <div class="list-info card"></div>
            <div class="list-info card"></div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
</script>

<style lang="scss" scoped>
  .booking-loading{
    position: relative;
    padding: 25px 20px 30px 20px;
    .loading-info{
      > li{
        position: relative;
        .moveItem {
          width: 77px;
          transition: .3s ease;
          background-image: linear-gradient(to left, rgba(238, 238, 238, 0), #fff, rgba(255, 255, 255, 0));
          content: '';
          opacity: 0;
          display: block;
          position: absolute;
          height: auto;
          top: 0;
          bottom: 0;
          animation: moveBooking 1.5s infinite linear;
        }
        .list-info{
          margin-top: 10px;
          width: 100%;
          height: 19px;
          background-color: #f9f9f9;
        }
        .middle5 {
          margin-top: 34px;
          div {
            margin-top: 10px;
          }
        }
      }
      .list-info.x195{
        width: 195px;
      }
      .list-info.x141{
        width: 141px;
      }
      .list-info.card{
        width: 100%;
        height: 105px;
      }
    }
  }
  @keyframes moveBooking {
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
      transform: translateX(450%);
    }
  }
</style>
