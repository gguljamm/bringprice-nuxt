<template>
  <div id="wrap">
    <div class="main">
      <header class="all-wrap">
          <div id="logo">
            <a href="/"></a>
          </div>
      </header>
      <div class="all-wrap">
        <div class="intro">
          <p class="title">여행이 시작되는 순간</p>
          <p class="title-sub">항공권은 왜 비쌀까요?</p>
          <p class="title-sub">꼭 그날 거기에 가려고 하기 때문입니다.</p>
          <p class="title-sub">다른 날, 다른 도시에 가는 항공권은 훨씬 더 싼데 말이죠.</p>
          <p class="title-sub">내 마음에 쏙 드는 가격으로 더 많은 곳을 더 쉽게 여행하세요.</p>
        </div>
      </div>
      <div class="mask"/>
    </div>
    <div class="bpHistory all-wrap">
      <div class="timeLine">
        <div class="progress"/>
        <ul>
          <li
            v-for="(x, index) in timeLine"
            :key="index"
          ><div
            @click="nowTimeLine = index"
            class="circle-wrap">
            <div
              class="circle"
              :class="nowTimeLine === index ? 'active' : ''"/>
            <span :class="nowTimeLine === index ? 'active' : ''"
              class="date">{{ x.date }}</span></div></li>
        </ul>
      </div>
      <div class="info">
        <p class="date">{{ timeLine[nowTimeLine] && timeLine[nowTimeLine].date }}</p>
        <p class="title">
          <template
            v-for="(x, index) in timeLine[nowTimeLine] && timeLine[nowTimeLine].info"
          >
            <span
              :key="index"
            >{{ timeLine[nowTimeLine].info[index] }}</span>
            <br v-if="index !== timeLine[nowTimeLine].info.length - 1" :key="`blank${index}`">
          </template>
        </p>
      </div>
    </div>
    <div class="service">
      <div class="slide-wrap">
        <slide
          :hotelListImg="['https://cdn.bringprice.com/image/2019/priceCalendar.png','https://cdn.bringprice.com/image/2019/everyWhere.png', 'https://cdn.bringprice.com/image/2019/multiFlight.png']"
          class="slide"
          @swiper-change="swiperChange"
          @openVideo="openVideo"
        />
      </div>
      <div class="info">
        <p class="title">{{ service[slideIndex] && service[slideIndex].info }}</p>
        <div class="sub-title">
          <div v-for="(x, index) in service[slideIndex].subInfo" :key="index">
            {{ x }}
          </div>
        </div>
      </div>
    </div>
    <div class="contact all-wrap">
      <p class="title address">CONTACT US</p>
      <p class="info">서울시 종로구 수표로 18길 22(관수동) 둘로스빌딩 7층,</p>
      <p class="info">브링프라이스</p>
      <p class="info num">02 6677 4468</p>
    </div>
    <div>
      <div class="footerBottom all-wrap">
        대표 : 원용연  사업자 등록번호 : 192-88-00229<br>
        Copyright 2018, (주)브링프라이스, All rights reserved
      </div>
    </div>
  </div>
</template>

<script>
import slide from './swiperSlide.vue';

export default {
  components: {
    slide,
  },
  data() {
    return {
      nowTimeLine: '',
      slideIndex: 0,
      timeLine: [
        {
          date: '2015.06',
          info: ['“스카이스캐너” 항공권 입점연동'],
        },
        {
          date: '2015.08',
          info: ['KBS 황금의펜타곤 시즌3 Finalist'],
        },
        {
          date: '2015.09',
          info: ['기관투자유치(Seed) - 마젤란기술투자, 여행박사'],
        },
        {
          date: '2016.11',
          info: ['Global with a Skyscanner Finalist'],
        },
        {
          date: '2017.03',
          info: ['“SK텔레콤” StartupKorea101 Alumni'],
        },
        {
          date: '2017.06',
          info: ['“여행박사” 항공권 검색특화 솔루션 연동개발'],
        },
        {
          date: '2018.02',
          info: ['“아고다” 숙박 입점연동'],
        },
        {
          date: '2018.08',
          info: ['“KB금융지주” Innovation Hub Alumni'],
        },
        {
          date: '2018.09',
          info: ['“위메프” 호텔 메타검색엔진 연동개발'],
        },
        {
          date: '2018.12',
          info: ['기관투자유치(Pre-Series A) - KB증권, 데일리호텔(Acquisition by 야놀자)'],
        },
        {
          date: '2019.01',
          info: ['“마이리얼트립” 호텔 메타검색엔진 연동개발'],
        },
        {
          date: '2019.05',
          info: ['“하나투어” 항공권 차세대프로젝트 연동개발'],
        },
        {
          date: '2019.12',
          info: ['“트래블포트코리아” 항공권 가격분석툴 연동개발'],
        },
        {
          date: '2020.06',
          info: ['“야놀자” 숙박/레저 화이트라벨 연동개발'],
        },
      ],
      service: [
        {
          info: '언제 떠나도 좋은 당신을 위해',
          subInfo: ['날짜를 고르기도 전에 날짜마다 달라지는 항공권 가격을', '달력에 미리 표시해드릴게요.'],
        },
        {
          info: '여행일자가 정해져 있다면',
          subInfo: ['에브리웨어가 있어요. 여행일을 선택하면 항공권 가격 기준으로', '여행지를 추천하는 기능을 써보세요.'],
        },
        {
          info: '여행 루트짜기 초고수 등장',
          subInfo: ['여러 도시를 한 번에 여행하는 다구간 항공권 검색할 때,', '여행도시들을 순서에 상관없이 입력하면 항공권 가격을 기반으로 한', '최적의 여행 일정을 계산해드려요.'],
        },
      ],
    };
  },
  methods: {
    swiperChange(index) {
      this.slideIndex = index;
    },
    openVideo() {
      let url = '';
      if (this.slideIndex === 0) {
        url = 'https://youtu.be/0ey6gpvKlBA';
      } else if (this.slideIndex === 1) {
        url = 'https://youtu.be/zdo4hnxFo5k';
      } else if (this.slideIndex === 2) {
        url = 'https://youtu.be/V569tWfH3xA';
      }
      window.open(url, '_blank');
    },
  },
  mounted() {
    this.nowTimeLine = this.timeLine.length - 1;
  },
};
</script>


<style lang="scss" scoped>
  #wrap{
    width: 100%;
    background-color: #fff;
    .all-wrap{
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
    }
    .main{
      width: 100%;
      min-height: 588px;
      background: url(https://cdn.bringprice.com/image/2019/bpMain.jpg) no-repeat;
      background-size: 100% 100%;
      position: relative;
      header{
        position: relative;
        z-index: 2;
        #logo{
          padding: 20px 0;
          > a{
            width: 132px;
            height: 20px;
            background: url(https://cdn.bringprice.com/image/2019/logo_white.svg) no-repeat;
            background-size: 132px 20px;
            background-position: center center;
            display: block;
          }
        }
      }
      .intro{
        position: relative;
        margin-top: 160px;
        z-index: 2;
        color: #fff;
        .title{
          font-weight: bold;
          font-size: 42px;
          line-height: 62px;
        }
        .title-sub{
          &:first-of-type{
            margin-top: 7px;
          }
          font-size: 16px;
          line-height: 26px;
        }
      }
      .mask{
        width: 100%;
        height: 100%;
        background-image: linear-gradient(to right, #000000, rgba(0, 0, 0, 0));
        opacity: .5;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
      }
    }
    .bpHistory{
      width: 100%;
      height: 600px;
      padding-top: 113px;
      .timeLine{
        margin-bottom: 53px;
        width: 100%;
        background-color: #e9e9e9;
        position: relative;
        display: block;
        height: 2px;
        .progress{
          width: calc(14 * (24px + 50px));
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background-color: #000;
        }
        ul{
          height: 2px;
        }
        & li{
          position: relative;
          display: block;
          margin-left: 50px;
          float: left;
          top: -29px;
          cursor: pointer;
          .circle-wrap{
              width: 25px;
              height: 50px;
              display: flex;
              justify-content: center;
              align-items: center;
              &:hover .circle{
                transform: scale(1.5);
              }
            .circle{
              border: 3px solid #1c1c1c;
              border-radius: 15px;
              width: 10px;
              height: 10px;
              background: #fff;
              position: relative;
              margin-top: 10px;
              transition: .3s ease;
            }
            span{
              font-size: 10px;
              color: $brown-grey;
              position: absolute;
              top: 0;
              left: calc(50% - 19px);
            }
          }
          .date.active{
            font-weight: bold;
            color: #1c1c1c;
          }
          .circle.active{
            transform: scale(1.5);
            background-color: #1c1c1c;
          }
        }
      }
      .info{
        .date{
          font-size: 10px;
          color: $brown-grey;
          line-height: 15px;
        }
        .title{
          font-weight: bold;
          font-size: 20px;
          line-height: 30px;
        }
      }
    }
    .service{
      width: 100%;
      height: 480px;
      background-color: #1c1c1c;
      position: relative;
      .slide-wrap{
        width: 100%;
        position: absolute;
        left: 0;
        top: -60%;
        .slide{
          width: 100%;
          height: 568px;
        }
      }
      .info{
        width: 1100px;
        margin: 0 auto;
        text-align: center;
        color: #fff;
        padding-top: 315px;
        padding-left: 20px;
        padding-right: 20px;
        .title{
          font-size: 28px;
          font-weight: bold;
          line-height: 26px;
        }
        .sub-title{
          font-size: 16px;
          line-height: 26px;
          margin-top: 20px;
        }
      }
    }
    .contact{
      width: 100%;
      margin-top: 100px;
      padding-bottom: 86px;
      .title{
        font-size: 42px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .info{
        font-size: 20px;
      }
      .info.num{
        margin-top: 10px;
      }
    }
    .footerBottom{
      font-size: 12px;
      color: #9b9b9b;
      border-top: 1px solid #e5e5e5;
      padding-top: 20px;
      padding-bottom: 20px;
      line-height: 15px;
    }
  }
</style>
