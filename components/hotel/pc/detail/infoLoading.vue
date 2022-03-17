<template>
  <ul class="loading-info">
    <li>
      <div class="moveItem"/>
      <div class='info'>
        <div class="list-info x358"/>
        <div class="middle">
          <div class="list-info x195"/>
          <div class="list-info x495"/>
        </div>
        <div class="flex">
          <div class="list-info tag"/>
          <div class="list-info tag"/>
        </div>
      </div>
    </li>
    <li>
      <div class="moveItem"/>
      <div class='info'>
        <div class="list-info x358"/>
        <div class="middle2">
          <div class="list-info x195"/>
          <div class="list-info x224"/>
        </div>
      </div>
    </li>
    <li>
      <div class="moveItem"/>
      <div class='info'>
        <div class="list-info x78"/>
        <div class="middle3">
          <div>
            <div>
              <div class="list-info x157"/>
            </div>
            <div>
              <div class="list-info x115"/>
            </div>
          </div>
          <div>
            <div>
              <div class="list-info x201"/>
            </div>
            <div>
              <div class="list-info x157"/>
            </div>
          </div>
          <div>
            <div>
              <div class="list-info x131"/>
            </div>
          </div>
        </div>
      </div>
    </li>
    <li>
      <div class="moveItem"/>
      <div class='info'>
        <div class="middle4">
          <div class="list-info x78"/>
          <div class="list-info x736"/>
          <div class="list-info x736"/>
          <div class="list-info x736"/>
          <div class="list-info x131"/>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
</script>

<style lang="scss" scoped>
  .loading-info{
    > li{
      position: relative;
      &::after{
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background-color: #cdcdcd;
        margin-top: 20px;
        margin-bottom: 30px;
      }
      &:last-of-type::after{
        display: none;
      }
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
    .flex{
      display: flex;
      margin-top: 19px;
    }
    .list-info{
      width: 100%;
      height: 19px;
      background-color: #f9f9f9;
    }
    .middle{
      margin-top: 12px;
      margin-bottom: 19px;
      > div{
        margin-top: 3px;
        &:first-of-type{
          margin-top: 0;
        }
      }
    }
    .middle2{
      margin-top: 19px;
      /*margin-bottom: 19px;*/
      > div{
        margin-top: 10px;
        &:first-of-type{
          margin-top: 0;
        }
      }
    }
    .middle3{
      > div{
        display: flex;
        > div {
          width: 50%;
          > div{
            margin-top: 12px;
            float: left;
          }
          &::after{
            clear: both;
            content: '';
            display: block;
          }
        }
      }
    }
    .middle4{
      div {
        margin-top: 10px;
      }
    }
    .list-info.x358{
      width: 358px;
      height: 32px;
    }
    .list-info.x495{
      width: 495px;
    }
    .list-info.x358{
      width: 358px;
    }
    .list-info.x157{
      width: 157px;
    }
    .list-info.x115{
      width: 115px;
    }
    .list-info.x201{
      width: 201px;
    }
    .list-info.x131{
      width: 131px;
    }
    .list-info.x75{
      width: 75px;
    }
    .list-info.x78{
      width: 78px;
    }
    .list-info.tag{
      width: 107px;
      height: 33px;
      border-radius: 16.5px;
      margin-left: 10px;
      &:first-of-type{
        margin-left: 0;
      }
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
  }
</style>
