<template>
  <div
    :class="{
      scrollDown,
      scrollDownTop,
      scrollWeb,
    }"
  >
    <!-- Google Tag Manager (noscript) -->
    <noscript v-if="init"><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MS3L4FP"
                                  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <div v-if="!isMobile && $route.name !== 'event'" id="header-all-wrap">
      <div id="logo">
        <a href="/">
          <img src="https://cdn.bringprice.com/image/2019/logo.svg" alt="logo">
        </a>
      </div>
      <header-wrap></header-wrap>
    </div>
    <nuxt/>
    <navigator v-if="init && isMobile"></navigator>
    <Footer v-else-if="init"></Footer>
    <Alert v-if="$route.query && $route.query.popFlag === 'alert'"></Alert>
<!--    <transition name="fade">-->
<!--      <Covid v-if="!$store.state.isMobile && $store.state.covid && ['', 'flightList'].indexOf($route.path.split('/')[1]) >= 0"-->
<!--        :isPop="true"-->
<!--      ></Covid>-->
<!--    </transition>-->
  </div>
</template>

<script>
import Navigator from './../components/common/navigator.vue';
import Footer from './../components/common/footer.vue';
import HeaderWrap from './../components/common/header.vue';
import Alert from './../components/common/alert.vue';
import EventBus from '~/utils/eventBus.js'; //eslint-disable-line
import User from '~/utils/user.js'; //eslint-disable-line
import Api from '~/utils/api.js'; //eslint-disable-line
import Covid from './../components/common/covid.vue';

export default {
  components: {
    Navigator,
    Footer,
    Alert,
    HeaderWrap,
    Covid,
  },
  data() {
    return {
      init: false,
      scrollDown: false,
      scrollDownTop: false,
      scrollWeb: false,
      lastScroll: 0,
      isMobile: true,
      timeout: '',
    };
  },
  middleware: 'layout',
  methods: {
    bodyScroll() {
      const scrollY = (window.pageYOffset || document.documentElement.scrollTop);
      if (this.lastScroll < scrollY) {
        this.scrollDown = true;
        this.scrollDownTop = true;
        if (scrollY < 30) {
          this.scrollDownTop = false;
        }
      } else {
        this.scrollDown = false;
        this.scrollDownTop = false;
      }
      if (scrollY <= 0) {
        this.scrollDown = false;
        this.scrollDownTop = false;
        this.scrollWeb = false;
      } else {
        this.scrollWeb = true;
      }
      if (scrollY + window.outerHeight > document.body.clientHeight - 50) {
        this.scrollDown = false;
      }
      this.lastScroll = scrollY;
    },
    resizeWindow() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        if ((window.innerWidth <= 768) !== this.isMobile) {
          this.isMobile = !this.isMobile;
          this.$store.commit('changeMobileFlag');
          this.timeout = '';
        }
      }, 300);
    },
    kakaoInit(tryNum) {
      if (window.Kakao) {
        window.Kakao.init('7f305ea34f15e8ccfa948fcb4dab29d9');
      } else if (tryNum < 5) {
        setTimeout(() => {
          this.kakaoInit(tryNum + 1);
        }, 1000);
      } else {
        console.log('kakao init fail');
      }
    },
  },
  mounted() {
    const interval = setInterval(() => {
      Api.covid('summary').then((resp) => {
        this.$store.commit('setCovid', resp.data);
        clearInterval(interval);
      });
    }, 10000);
    Api.covid('summary').then((resp) => {
      this.$store.commit('setCovid', resp.data);
      clearInterval(interval);
    });
    if (this.$route.query.popFlag) {
      this.$router.replace({
        query: {
          popFlag: undefined,
          alertId: undefined,
        },
      });
    }
    if (this.$route.query.share) {
      this.$router.replace({
        query: {
          share: undefined,
        },
      });
    }
    EventBus.$on('scrollDown', (flag) => {
      // console.log(flag);
      this.scrollDown = flag;
      this.scrollDownTop = flag;
    });
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
      window.addEventListener('resize', this.resizeWindow);
    }
    // if (!this.isMobile) {
    //   this.$store.commit('changeMobileFlag');
    // }
    window.addEventListener('scroll', this.bodyScroll);
    if (this.$cookies.get('bpUser')) {
      this.$store.state.isLogin = true;
    }
    this.kakaoInit(0);
    if (this.$cookies.get('bpUser') && this.$cookies.get('bpUser').data) {
      User.getMailingInfo(this.$cookies.get('bpUser').data.userID)
        .then((resp) => {
          for (let x = 0; x < resp.data.Result.length; x += 1) {
            const temp = resp.data.Result[x];
            this.$store.state.mailingList.push(temp);
          }
        });
    }
    let isLowBrowser = false;
    if (!this.$cookies.get('bpBrowserAlert')) {
      const agent = navigator.userAgent.toLowerCase();
      if (agent.indexOf('msie') !== -1) {
        isLowBrowser = true;
      }
    }
    if (this.isMobile && this.$route.fullPath.indexOf('/flightList') >= 0) {
      const fullPath = this.$route.fullPath;
      this.$router.replace('/');
      setTimeout(() => {
        this.$router.push(fullPath);
        this.$nextTick(() => {
          this.init = true;
        });
      }, 500);
    } else {
      setTimeout(() => {
        if (isLowBrowser) {
          this.$cookies.set('bpBrowserAlert', 't', '30d', '/', '.bringprice.com');
          this.$router.push({
            query: {
              popFlag: 'alert',
              alertId: 17,
            },
          });
        }
      }, 10);
      this.init = true;
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.bodyScroll);
    window.removeEventListener('resize', this.resizeWindow);
  },
};
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Roboto+Slab');
  @import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR');


  html {
    font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
    font-size: 16px;
    color: #4a4a4a;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  *, *:before, *:after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s ease;
  }
  .fade-enter, .fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  html{
    width: 100%;
    height: 100%;
  }

  body{
    position: relative;
    width: 100%;
    min-height: 100%;
    background-color: #f8f8f8;
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
  }
  [v-cloak] {
    display: none;
  }

  #__nuxt, #__layout, #__layout > div{
    width: 100%;
    height: 100%;
  }
  :focus{
    outline: none;
  }
  .all-wrap{
    width: 100%;
    max-width: 1230px;
    margin: 0 auto;
  }
  .loaderWrapper{
    text-align: center;
    height: 64px;
    width: 100%;
  }
  .lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 64px;
    height: 64px;
  }
  .lds-ellipsis div {
    position: absolute;
    top: 27px;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: $brown-grey;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  .lds-ellipsis div:nth-child(1) {
    left: 6px;
    animation: lds-ellipsis1 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(2) {
    left: 6px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(3) {
    left: 26px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(4) {
    left: 45px;
    animation: lds-ellipsis3 0.6s infinite;
  }
  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(19px, 0);
    }
  }
  @keyframes toast {
    0% {
      visibility: visible;
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    80%{
      opacity: 1;
    }
    95% {
      visibility: hidden;
      opacity: 0;
    }
    100% {
      display: none;
      visibility: hidden;
      opacity: 0;
    }
  }
  .slide-fade-enter-active,
  .slide-bottom-fade-enter-active,
  .slide-left-fade-enter-active,
  .slide-right-fade-enter-active{
    transition: all .3s ease;
  }
  .slide-fade-leave-active,
  .slide-bottom-fade-leave-active,
  .slide-left-fade-enter-active{
    transition: all .1s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to,
  .slide-bottom-fade-enter, .slide-bottom-fade-leave-to,
  .slide-left-fade-enter, .slide-left-fade-leave-to,
  .slide-right-fade-enter, .slide-right-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .slide-fade-enter{
    transform: translateX(50px);
  }
  .slide-bottom-fade-enter{
    transform: translateY(50px);
  }
  .slide-left-fade-enter{
    transform: translateX(-50px);
  }
  .slide-right-fade-enter{
    transform: translateX(50px);
  }

</style>

<style lang="scss" scoped>
  #header-all-wrap {
    width: 1110px;
    margin: 0 auto;
  }
  #logo{
    /*padding: 8px 0;*/
    > a{
      width: 132px;
      height: 20px;
      display: block;
      img{
        width: 100%;
        height: 100%;
      }
    }
    position: fixed;
    top: 22px;
    z-index: 13;
  }
  a{
    color: inherit;
    text-decoration: none;
  }
</style>

