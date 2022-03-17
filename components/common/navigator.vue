<template>
  <div
    v-show="navigatorShow"
    v-if="$route.name !== 'hotelOuterLink'"
    id="bpNavigator">
    <div>
      <button
        :class="isHome ? 'selected' : ''"
        :style="{ width: isIos ? '33.333%' : '25%' }"
        class="home"
        @click="home()"
      ></button>
      <button
        v-if="!isIos"
        :style="{ width: isIos ? '33.333%' : '25%' }"
        :class="isMytrip ? 'selected' : ''"
        class="myTrip"
        @click="search()"
      ></button>
      <button
        :style="{ width: isIos ? '33.333%' : '25%' }"
        :class="isUser ? 'selected' : ''"
        class="user"
        @click="user()"
      ></button>
      <button
        :style="{ width: isIos ? '33.333%' : '25%' }"
        :class="isNoti ? 'selected' : ''"
        class="noti"
        @click="noti()"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isHome() {
      return !this.isNoti && !this.isMytrip && !this.isUser;
    },
    isMytrip() {
      return this.$route.path.indexOf('/mytrip') >= 0;
    },
    isUser() {
      return this.$route.path.indexOf('/user') >= 0;
    },
    isNoti() {
      return this.$route.path.indexOf('/event') >= 0;
    },
  },
  data() {
    return {
      navigatorShow: true,
      windowHeight: 0,
      windowWidth: 0,
      isIos: window.navigator.userAgent.indexOf('bpIos') >= 0,
    };
  },
  methods: {
    home() {
      this.$router.push('/');
    },
    search() {
      this.$router.push('/mytrip');
    },
    user() {
      this.$router.push('/user');
    },
    noti() {
      this.$router.push('/event');
    },
    keyboardUp() {
      if (this.windowWidth === window.innerWidth && document.activeElement.tagName === 'INPUT') {
        if (this.windowHeight > window.innerHeight) {
          this.navigatorShow = false;
          this.windowHeight = window.innerHeight;
        } else {
          this.navigatorShow = true;
          this.windowHeight = window.innerHeight;
        }
      } else {
        this.navigatorShow = true;
        this.windowHeight = window.innerHeight;
      }
    },
  },
  mounted() {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
    window.addEventListener('resize', this.keyboardUp);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.keyboardUp);
  },
};
</script>

<style lang="scss" scoped>
  #bpNavigator{
    width: 100vw;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 51px;
    z-index: 10;
    overflow: hidden;
  }
  #bpNavigator > div{
    background-color: #FFF;
    border-top: 1px solid #f8f8f8;
    height: 51px;
    position: relative;
    width: 100%;
    transition: .3s ease;
  }
  .scrollDown #bpNavigator > div{
    transform: translateY(51px);
  }
  #bpNavigator > div > button{
    float: left;
    width: 25%;
    padding: 0;
    border: 0;
    background: center no-repeat;
    height: 50px;
    cursor: pointer;
  }
  #bpNavigator > div > .home{
    background-image: url(~assets/img/common/ic-bp-off.svg);
  }
  #bpNavigator > div > .myTrip{
    background-image: url(~assets/img/common/briefcase.svg);
  }
  #bpNavigator > div > .user{
    background-image: url(~assets/img/common/user.svg);
  }
  #bpNavigator > div > .noti{
    background-image: url(~assets/img/common/bell.svg);
  }
  #bpNavigator > div > .home.selected{
    background-image: url(~assets/img/common/ic-bp-on.svg);
  }
  #bpNavigator > div > .myTrip.selected{
    background-image: url(~assets/img/common/briefcase_purple.svg);
  }
  #bpNavigator > div > .user.selected{
    background-image: url(~assets/img/common/user_purple.svg);
  }
  #bpNavigator > div > .noti.selected{
    background-image: url(~assets/img/common/bell_purple.svg);
  }
</style>
