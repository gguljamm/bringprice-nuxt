<template>
  <div class="facilitiesAll">
    <div class="detail-top" ref='top'>
      <div class="top-control">
        <div class="contents">
          <div class="group-flex">
            <div
              class="x-btn"
              @click="$emit('close-facilities')"
            />
          </div>
          <span class="title">편의시설 및 서비스</span>
        </div>
      </div>
    </div>
    <div class="contentWrap">
      <div class="specialList">
        <p class="title">{{specialFacility.group}}</p>
        <div class="wrap">
          <div
            v-for="(val, index) in specialFacility.facilities"
            :key="index"
            class="list"
          >
            <div class="img" :style="{backgroundImage: `url(${val.url})`}"></div>
            <div class="name">{{val.name}}</div>
          </div>
        </div>
      </div>
      <div
        v-for="(val, index) in facilitiesData"
        :key="index"
        class="normalList"
      >
        <p class="title">{{val.group}}</p>
        <div class="wrap" :class="val.names.length > 6 && !val.click ? 'close' : ''">
          <ul>
            <li
              v-for="(list, index2) in val.names"
              :key="index2"
            >{{list}}</li>
          </ul>
          <div v-if="val.names.length > 6 && !val.click" class="mask"></div>
        </div>
        <button v-if="val.names.length > 6 && !val.click" class="readMore" @click="val.click = true">모두보기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['facilities', 'specialFacility'],
  data() {
    const facilitiesData = [];
    this.facilities.forEach((val) => {
      if (val.id !== 1) {
        const temp = {};
        temp.group = val.group;
        temp.id = val.id;
        temp.names = [...val.names];
        temp.click = false;
        facilitiesData.push(temp);
      }
    });
    return {
      facilitiesData,
    };
  },
};
</script>

<style lang="scss" scoped>
  .facilitiesAll{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 11;
    overflow-y: auto;
    .detail-top{
      width: 100%;
      padding-top: constant(safe-area-inset-top);
      padding-top: env(safe-area-inset-top);
      position: fixed;
      top: 0;
      left: 0;
      color: $greyish-brown;
      z-index: 11;
      border-bottom: 1px solid #ecedf2;
      background-color: #fff;
      .top-control{
        width: 100%;
        height: 54px;
        background-color: rgba(255, 255, 255, 0);
        -webkit-transition: opacity, .2s;
        -moz-transition: opacity, .2s;
        -ms-transition: opacity, .2s;
        -o-transition: opacity, .2s;
        transition: opacity, .2s;
        visibility: visible;
        &.open{
          background-color: rgba(255, 255, 255, 1);
        }
        > .contents{
          width: 100%;
          height: 100%;
          position: relative;
          text-align: center;
          line-height: 54px;
          .group-flex {
            position: absolute;
            right: 10px;
            top: calc(50% - 20px);
            display: flex;
            align-items: center;
            width: 40px;
            height: 40px;
            .x-btn {
              width: 100%;
              height: 100%;
              background-size: 20px 20px;
              background-position: center center;
              cursor: pointer;
              background-repeat: no-repeat;
              background-color: transparent;
              background-image: url(~assets/img/common/x_black.svg);
            }
          }
          .title{
            font-size: 14px;
            color: #332b48;
          }
        }
      }
      p {
        padding-left: 20px;
      }
    }
    .contentWrap{
      margin-top: 74px;
      margin-bottom: 53px;
      .title{
        font-size: 20px;
        font-weight: 500;
        color: #000;
      }
      .specialList::after, .normalList::after {
        content: '';
        display: block;
        width: calc(100% - 40px);
        margin: 0 auto;
        height: 1px;
        background-color: #f2f2f2;
      }
      .normalList::after {
        width: calc(100% - 20px);
        margin: 0;
      }
      .normalList:last-of-type::after{
        display: none;
      }
      .specialList{
        padding-bottom: 24px;
        .title{
          padding-left: 20px;
        }
        .wrap{
          margin-top: 24px;
          white-space: nowrap;
          overflow-x: auto;
          padding-bottom: 24px;
          .list{
            width: 74px;
            display: inline-block;
            vertical-align: top;
            font-size: 0;
            /*margin-left: 14px;*/
            &:first-of-type{
              margin-left: 20px;
            }
            &:last-of-type {
              margin-right: 20px;
            }
            .img{
              margin: 0 auto;
              width: 60px;
              height: 60px;
              background-image: url('https://cdn.bringprice.com/image/teaser/flight/방콕.jpg');
              background-size: 44px 44px;
              background-position: center center;
              background-repeat: no-repeat;
              border-radius: 50px;
            }
            .name{
              font-size: 14px;
              color: #000;
              padding: 0 8px;
              margin-top: 18px;
              text-align: center;
              white-space: normal;
            }
          }
        }
      }
      .normalList{
        margin-top: 40px;
        padding-left: 20px;
        .wrap{
          padding-bottom: 40px;
          position: relative;
          &.close{
            max-height: 128px;
            overflow: hidden;
          }
          .mask{
            width: 100%;
            height: 110px;
            background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), #ffffff);
            position: absolute;
            bottom: 0;
          }
          ul{
            margin-top: 20px;
            li{
              margin-top: 12px;
              font-weight: 400;
              font-size: 16px;
              &:first-of-type{
                margin-top: 0;
              }
              &::before {
                content: '\B7';
                margin-right: 4px;
              }
            }
          }
        }
        .readMore{
          color: #ff5a5d;
          font-size: 14px;
          font-weight: 500;
          margin-top: 20px;
          margin-bottom: 32px;
        }
      }
    }
  }
</style>
