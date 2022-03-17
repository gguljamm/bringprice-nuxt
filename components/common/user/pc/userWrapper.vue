<template>
  <div id="user" :class="routerFlag">
    <div
      @click.stop
      @click="$router.back()"
      class="x-btn"/>
    <transition name="fade" mode="out-in">
        <signIn
          v-if="init && routerFlag === 'signIn' && !emailCheck && !addUserInfoFlag"
          :key="'signIn'"
          :isChangedData="isChangedData"
          @social-login="socialLogin"
          @after-login="afterLogin"
        />
        <signUp
          v-else-if="init && routerFlag === 'signUp' && !emailCheck && !addUserInfoFlag"
          :key="'signUp'"
          :isChangedData="isChangedData"
          @social-login="socialLogin"
          @after-login="afterLogin"
        />
        <snsGetUserEmail
          v-else-if="emailCheck && !addUserInfoFlag"
          @snsGetUserEmail="snsPutUserEmail"
          :key="'snsGetUserEmail'"
        ></snsGetUserEmail>
        <addUserDataForm
          v-else-if="addUserInfoFlag && !emailCheck"
          :key="'addUserDataForm'"
          :isChangedData="isChangedData"
          @bp-add-userInfo="addUserInfoSubmit"
        />
    </transition>
  </div>
</template>

<script>
import signUp from './signUp.vue';
import signIn from './signIn.vue';
import addUserDataForm from './addUserData.vue';
import snsGetUserEmail from './snsGetUserEmail.vue';
import login from '~/utils/login'; // eslint-disable-line
import base64 from 'base-64'; // eslint-disable-line
import user from '~/utils/user'; // eslint-disable-line

export default {
  props: ['routerFlag', 'isChangedData'],
  components: {
    signIn,
    signUp,
    addUserDataForm,
    snsGetUserEmail,
  },
  data() {
    return {
      init: false,
      base64,
      emailCheck: false,
      addUserInfoFlag: false,
      userToken: {},
      signupLoading: false,
      selectedSocial: null,
    };
  },
  methods: {
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
          this.afterLogin(resp, obj.Auth, null);
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
        this.$store.state.isLogin = true;
        this.openAddUserData();
      }
    },
    addUserInfoSubmit(addUserData) {
      this.signupLoading = true;
      user.putUserInfo(this.$cookies.get('bpUser').data.userID, addUserData, this.$cookies.get('bpUser').token).then(() => {
        this.signupLoading = false;
        this.$router.push({ query: { popFlag: undefined } });
      }).catch((err) => {
        this.signupLoading = false;
        console.log(err);
      });
    },
    openAddUserData() {
      this.addUserInfoFlag = true;
    },
  },
  mounted() {
    window.document.body.style.overflowY = 'hidden';
    window.document.documentElement.style.overflowY = 'hidden';
    this.$nextTick(() => {
      this.init = true;
    });
  },
  beforeDestroy() {
    window.document.body.style.overflowY = '';
    window.document.documentElement.style.overflowY = '';
  },
};
</script>

<style lang="scss" scoped>
  #user{
    width: 515px;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .x-btn{
      width: 30px;
      height: 30px;
      background-image: url(~assets/img/common/x.svg);
      background-size: 100% 100%;
      position: absolute;
      z-index: 1;
      cursor: pointer;
      top: 20px;
      right: 16px;
    }
  }
  @media screen and (max-height: 847px){
    #user.signIn{
      top: 0;
      left: 0;
      margin: 40px auto;
      transform: none;
    }
  }
  @media screen and (max-height: 1230px){
    #user.signUp{
      top: 0;
      left: 0;
      margin: 40px auto;
      transform: none;
    }
  }
</style>
