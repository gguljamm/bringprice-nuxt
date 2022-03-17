<template>
  <div
    :class="!load ? 'fadeOut' : 'fadeIn'"
    id="myPageWrapper">
    <div class="all-wrap">
      <div class="title-wrap">
        <p>{{ localCookiesData.name }}님, </p>
        <p>환영합니다.</p>
      </div>
      <div class="contents-wrap">
        <div class="menu">
          <ul>
            <li
              @click="changePage(1)"
              :class="nowPage === 1 ? 'active' : ''">개인정보 변경</li>
            <li
              v-if="$cookies.get('bpUser') && !$cookies.get('bpUser').data.social_login"
              @click="changePage(2)"
              :class="nowPage === 2 ? 'active' : ''">비밀번호 변경</li>
            <li
              @click="changePage(3)"
              :class="nowPage === 3 ? 'active' : ''">가격추적 메일</li>
          </ul>
        </div>
        <div
          class="fixedPage">
          <userInfoFixed
            v-if="load && nowPage === 1"
            :localCookiesData="localCookiesData"
            :cookiesData="cookiesData"
            :load="load"
            @submitUserInfo="submit"
            @getUserInfo="$emit('getUserInfo')"
          />
          <pwFixed
            v-if="nowPage === 2"
            :pwFixLoading="pwFixLoading"
            @submitPw="submitPw"
          />
          <priceTracking
            v-if="nowPage === 3"
          />
        </div>
        <div class="clear"/>
      </div>
      <div class="clear"/>
    </div>
  </div>
</template>

<script>
import userInfoFixed from './userInfoFixedWrapper.vue';
import priceTracking from './priceTracking.vue';
import pwFixed from './pwFixed.vue';

export default {
  props: ['localCookiesData', 'cookiesData', 'nowPage', 'load', 'pwFixLoading', 'isChangedUserData'],
  components: {
    userInfoFixed,
    priceTracking,
    pwFixed,
  },
  methods: {
    inputUserPw(e, type) {
      this.$emit('inputUserPw', e, type);
    },
    deleteMailing(id) {
      this.$emit('deleteMailing', id);
    },
    changePage(val) {
      this.$emit('changePage', val);
    },
    submit(reqData) {
      this.$emit('submitUserInfo', reqData);
    },
    submitPw(pwObj) {
      if (this.nowPage === 2) {
        this.$emit('submitPw', pwObj);
      }
    },
  },
  mounted() {
    this.changePage(1);
    this.$emit('getUserInfoCheck');
  },
};
</script>

<style lang="scss" scoped>
  .clear{
    clear: both;
  }
  .fadeIn{
    opacity: 1;
  }
  .fadeOut{
    opacity: 0;
  }
  #myPageWrapper{
    width: 100%;
    min-height: 100vh;
    background: #fff;
    padding-bottom: 130px;
    transition: .3s ease;
    .contents-wrap{
      display: flex;
      margin-top: 80px;
    }
    .title-wrap{
      font-size: 24px;
      font-weight: bold;
      line-height: 36px;
      padding-top: 30px;
    }
    .all-wrap{
      padding-left: 60px;
      padding-right: 60px;
    }
    .menu{
      float: left;
      white-space: nowrap;
      li.active{
        font-weight: bold;
        color: $greyish-brown;
      }
      li{
        list-style: none;
        font-size: 20px;
        cursor: pointer;
        margin-top: 20px;
        color: $brown-grey;
        &:first-of-type{
          margin-top: 0;
        }
      }
    }
    .fixedPage{
      float: left;
      width: 75%;
      margin-left: 122px;
    }
    .submit-btn{
      width: 209px;
      height: 53px;
      float: right;
      margin-top: 30px;
      border-radius: 2px;
      background-color: $cornflower;
      color: #fff;
    }
  }
</style>

