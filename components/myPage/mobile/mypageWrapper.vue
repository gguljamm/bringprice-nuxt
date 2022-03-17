<template>
  <div
    :class="!load ? 'fadeOut' : 'fadeIn'"
    id="myPageWrapper">
      <div class="top-info">
        <div
          class="contents">
          <div
            v-if="nowPage !== 0"
            class="chevron-left x-btn"
            @click="back"
          ></div>
        </div>
      </div>
      <div
        class="content-wrap">
        <div
          v-if="nowPage === 0"
          class="main-menu-wrap">
          <div
            v-if="load"
            class="title-wrap">
            <p>{{ cookiesData.name }}님, </p>
            <p>환영합니다.</p>
          </div>
          <p
            @click="changePage(1)"
            class="fixedUserInfo">개인정보 수정
          </p>
          <div class="mapageMenu">
            <ul>
              <li
                @click="changePage(2)"
              >알림</li>
              <li
                @click="$router.push('/pp')"
              >서비스 약관</li>
              <li
                @click="$router.push('/tos')"
              >개인 정보 보호정책</li>
              <li
                @click="logout"
                class="logout"
              >로그아웃</li>
            </ul>
          </div>
        </div>
        <userInfoFixed
          v-if="load && nowPage === 1"
          :cookiesData="cookiesData"
          :localCookiesData="localCookiesData"
          :load="load"
          @changePage="changePage"
          @submitUserInfo="submit"
          @getUserInfo="getUserInfo"
        />
        <priceTracking
          v-if="nowPage === 2"
        />
        <pwFixed
          v-if="nowPage === 3"
          :pwFixLoading="pwFixLoading"
          @submitPw="submitPw"
        />
      </div>
  </div>
</template>

<script>
import userInfoFixed from './userInfoFixedWrapper.vue';
import priceTracking from './priceTracking.vue';
import pwFixed from './pwFixed.vue';

export default {
  props: ['localCookiesData', 'cookiesData', 'load', 'nowPage', 'pwFixLoading'],
  components: {
    userInfoFixed,
    priceTracking,
    pwFixed,
  },
  methods: {
    logout() {
      this.$router.push({
        query: {
          popFlag: 'alert',
          alertId: 19,
        },
      });
    },
    changePage(val) {
      // console.log(val);
      this.$emit('changePage', val);
    },
    submit(reqData) {
      this.$emit('submitUserInfo', reqData);
    },
    submitPw(pwObj) {
      this.$emit('submitPw', pwObj);
    },
    getUserInfo() {
      this.$emit('getUserInfo');
    },
    back() {
      this.changePage(0);
    },
  },
  mounted() {
    this.getUserInfo();
  },
};
</script>


<style lang="scss" scoped>
  .fadeIn{
    opacity: 1;
  }
  .fadeOut{
    opacity: 0;
  }
  #myPageWrapper{
    width: 100%;
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
    transition: 0.3s ease;
    .content-wrap{
      padding: 45px 20px 0 20px;
    }
    .title-wrap{
      font-weight: bold;
      font-size: 20px;
      line-height: 30px;
      transition: .3s ease;
    }
    .fixedUserInfo{
      color: $soft-blue;
      font-size: 14px;
      margin-top: 10px;
    }
    .mapageMenu{
      width: 100%;
      margin-top: 30px;
      li{
        width: 100%;
        font-size: 14px;
        margin-top: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #f8f8f8;
        &:first-of-type{
          margin-top: 0;
        }
        &.logout{
          color: $brown-grey;
        }
      }
    }
    .top-info{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      transition: opacity 0.3s ease;
      width: 100%;
      height: 48px;
      height: calc(48px + constant(safe-area-inset-top));
      height: calc(48px + env(safe-area-inset-top));
      padding-top: constant(safe-area-inset-top);
      padding-top: env(safe-area-inset-top);
      z-index: 1;
      background: #fff;
    }
    .top-info > .contents{
      transition: opacity 0.3s ease;
      width: 100%;
      height: 100%;
      position: relative;
      text-align: center;
      align-items: center;
      display: flex;
      justify-content: flex-end;
    }
    .top-info .contents .x-btn{
      width: 40px;
      height: 40px;
      background-size: 21px;
      background-position: center center;
      margin-right: 4px;
      cursor: pointer;
      background-repeat: no-repeat;
      background-image: url(~assets/img/common/x_black.svg);
      background-color: transparent;
    }
  }
</style>
