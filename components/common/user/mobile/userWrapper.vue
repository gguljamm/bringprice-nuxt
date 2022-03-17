<template>
  <div id="userWrapper">
    <div
      v-if="!$route.params.sign && !emailCheck"
      class="main">
      <div class="top-info">
        <span
          @click="$router.push({ params: { sign: 'signIn' } })"
        >로그인</span>
      </div>
      <div class="contents-wrap">
        <div class="title-wrap">
            <p>브링프라이스에 오신 것을</p>
            <p>환영합니다.</p>
        </div>
        <div class="login-btn">
          <button
            @click="$router.push({ params: { sign: 'signUp' } })"
            class="email"><strong>이메일</strong>로 회원가입</button>
        </div>
        <no-ssr>
          <socialBtns
            v-if="!emailCheck"
            :signFlag="'signUp'"
            :isApp="isApp"
            :isIos="isIos"
            @social-login="socialLogin"
          />
        </no-ssr>
        <div class="tip">
          <p class="signUpPolicy">회원가입을 함으로써 브링프라이스의 <span @click="$router.push('/tos')">서비스 이용약관</span>,
          <span @click="$router.push('/pp')">개인정보 보호정책</span>에 모두 동의합니다.</p>
        </div>
      </div>
    </div>
    <signUpWrapper
      v-if="$route.params.sign === 'signUp' && !emailCheck"
      @social-login="socialLogin"
      @after-login="afterLogin"
    />
    <signInWrapper
      v-if="$route.params.sign === 'signIn' && !emailCheck"
      @after-login="afterLogin"
      @social-login="socialLogin"
    />
    <snsGetUserEmail
      v-if="emailCheck"
      @snsGetUserEmail="snsPutUserEmail"
      @close-snsGetUserEmail="emailCheck = false"
    />
  </div>
</template>

<script>
import signUpWrapper from './signUpWrapper.vue';
import signInWrapper from './signInWrapper.vue';
import snsGetUserEmail from './snsGetUserEmail.vue';
import addUserDataForm from './addUserData.vue';
import socialBtns from './socialBtns.vue';
import login from '~/utils/login'; // eslint-disable-line
import base64 from 'base-64'; // eslint-disable-line
import user from '~/utils/user'; // eslint-disable-line

export default {
  components: {
    signUpWrapper,
    signInWrapper,
    snsGetUserEmail,
    socialBtns,
    addUserDataForm,
  },
  data() {
    return {
      signFlag: '',
      isApp: false,
      isIos: false,
      emailCheck: false,
      userToken: {},
      addUserInfoFlag: false,
      selectedSocial: false,
    };
  },
  methods: {
    closeAddUserData() {
      this.addUserInfoFlag = false;
    },
    snsPutUserEmail(resp) {
      const snsUserData = JSON.parse(base64.decode(this.userToken.data.Token.split('.')[1], true));
      snsUserData.userEmail = resp.userEmail;
      if (snsUserData.hasSubscribed) {
        snsUserData.hasSubscribed = resp.conduction;
      }
      const reqObj = {
        Email: snsUserData.userEmail,
        Subscribed: snsUserData.hasSubscribed,
      };
      user.putUserEmail(snsUserData.userID, reqObj, this.userToken.data.Token).then(() => {
        const COOKIEDATE = new Date();
        COOKIEDATE.setDate(COOKIEDATE.getDate() + 30);
        const cookieConditions = {
          expires: COOKIEDATE,
          path: '/',
        };
        if (window.location.hostname !== '127.0.0.1' && window.location.hostname !== 'localhost' && window.location.hostname !== 'dev.bp.front.bringprice.com') {
          cookieConditions.domain = '.bringprice.com';
        }
        this.$cookies.set(
          'bpUser',
          { data: snsUserData, token: this.userToken.data.Token },
          cookieConditions.expires,
          cookieConditions.path,
          cookieConditions.domain,
        );
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'login',
          eventAction: 'social',
          eventLabel: this.selectedSocial,
        });
        this.closeLogin(snsUserData);
      });
    },
    socialLogin(obj) {
      user.socialLogin(obj).then((resp) => {
        const encodeData = JSON.parse(base64.decode(resp.data.Token.split('.')[1], true));
        if (!encodeData.userEmail ||
          encodeData.userEmail === 'undefined' ||
          encodeData.userEmail === 'null'
        ) {
          this.emailCheck = true;
          this.userToken = resp;
          this.selectedSocial = obj.Auth;
        } else {
          // this.emailCheck = true;
          // this.userToken = resp;
          this.afterLogin(resp, obj.Auth, false);
        }
      });
    },
    afterLogin(resp, socialFlag, signUpFlag) {
      if (socialFlag) {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'login',
          eventAction: 'social',
          eventLabel: socialFlag,
        });
      } else {
        ga('send', { // eslint-disable-line
          hitType: 'event',
          eventCategory: 'login',
          eventAction: 'bringprice',
        });
      }
      const val = login.afterLogin(resp.data);
      // console.log(val);
      this.$cookies.set(
        'bpUser',
        { data: val.encodeData, token: val.token },
        val.cookieConditions.expires,
        val.cookieConditions.path,
        val.cookieConditions.domain,
      );
      this.closeLogin(val.encodeData, signUpFlag);
    },
    closeLogin(data, signUpFlag) {
      if (signUpFlag !== 'signUp') {
        this.$router.push({ query: { popFlag: undefined } });
        if (!data.userEmail ||
          data.userEmail === 'undefined' ||
          data.userEmail === 'null'
        ) {
          setTimeout(() => {
            this.$router.push({ query: { popFlag: 'alert', alertId: 15 } });
          }, 100);
        }
        this.$store.state.isLogin = true;
      } else {
        this.$emit('after-login');
      }
    },
  },
  mounted() {
    this.isApp = window.navigator.userAgent.indexOf('bpAos') >= 0 || window.navigator.userAgent.indexOf('bpIos') >= 0;
    this.isIos = window.navigator.userAgent.indexOf('bpIos') >= 0;
  },
};
</script>


<style lang="scss" scoped>
  .fwb{
    font-weight: bold;
  }
  #userWrapper{
    width: 100%;
    height: 100vh;
    background-color: #fff;
    .contents-wrap{
      padding: 30px 20px 0 20px;
    }
    .title-wrap{
      color: #4a4a4a;
      font-weight: bold;
      font-size: 20px;
      line-height: 30px;
    }
    .login-btn{
      margin-top: 30px;
      button.email{
        background-color: $cornflower;
        color: #fff;
        font-size: 16px;
      }
      button.sns{
        color: #fff;
        border: 1px solid #fff;
      }
      button{
        width: 100%;
        height: 47px;
        border-radius: 2px;
        margin-top: 10px;
        &:first-of-type{
          margin-top: 0;
        }
      }
    }
    .tip{
      color: #4a4a4a;
      font-size: 14px;
      margin-top: 20px;
      line-height: 20px;
      span{
        cursor: pointer;
        color: $soft-blue;
        text-decoration: underline;
      }
    }
    .top-info{
      width: 100%;
      height: 48px;
      line-height: 48px;
      padding-right: 20px;
      text-align: right;
      color: #4a4a4a;
    }
  }
</style>
