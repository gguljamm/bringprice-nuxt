<template>
  <div id="mypage">
    <div
      v-if="$store.state.isMobile"
      class="mobileMypage">
      <myPageWrapperMobile
        v-if="$store.state.isLogin && !addUserInfoFlag"
        :localCookiesData="localCookiesData"
        :cookiesData="cookiesData"
        :nowPage="nowPage"
        :load="load"
        :pwFixLoading="pwFixLoading"
        @getUserInfo="getUserInfo"
        @changePage="changePage"
        @submitUserInfo="submitUserInfo"
        @submitPw="submitPw"
      />
      <addUserDataForm
        v-if="$store.state.isLogin && addUserInfoFlag"
        @close-addUserData="closeAddUserData"
        @bp-add-userInfo="addUserInfoSubmit"
      />
      <userWrapper
        v-if="!$store.state.isLogin"
        @after-login="afterLogin"
      />
    </div>
    <div
      v-if="!$store.state.isMobile"
      class="pcMypage">
      <myPageWrapperPc
        v-if="$store.state.isLogin"
        :load="load"
        :localCookiesData="localCookiesData"
        :cookiesData="cookiesData"
        :nowPage="nowPage"
        :pwFixLoading="pwFixLoading"
        @getUserInfo="getUserInfo"
        @getUserInfoCheck="getUserInfoCheck"
        @changePage="changePage"
        @submitUserInfo="submitUserInfo"
        @submitPw="submitPw"
      />
    </div>
  </div>
</template>

<script>
import myPageWrapperPc from '../../components/myPage/pc/mypageWrapper.vue';
import myPageWrapperMobile from '../../components/myPage/mobile/mypageWrapper.vue';
import userWrapper from '../../components/common/user/mobile/userWrapper.vue';
import addUserDataForm from '../../components/common/user/mobile/addUserData.vue';
import user from '~/utils/user'; // eslint-disable-line
import Format from '~/utils/format'; // eslint-disable-line
import base64 from 'base-64'; // eslint-disable-line

export default {
  components: {
    myPageWrapperPc,
    myPageWrapperMobile,
    userWrapper,
    addUserDataForm,
  },
  data() {
    return {
      format: Format,
      name: '',
      email: '',
      cookiesData: {
        dob: {
          year: '',
          month: '',
          day: '',
        },
        preference_airline: [],
        tour_style: [],
        subscribed: '',
        gender: '',
      },
      localCookiesData: {
        name: '',
        email: '',
        dob: {
          year: '',
          month: '',
          day: '',
        },
        preperAirline: [],
        tourStyle: [],
        subscribed: '',
        gender: '',
      },
      nowPage: 0,
      load: false,
      pwFixLoading: false,
      addUserInfoFlag: false,
      base64,
    };
  },
  methods: {
    afterLogin() {
      this.$store.state.isLogin = true;
      this.addUserInfoFlag = true;
    },
    closeAddUserData() {
      this.addUserInfoFlag = false;
    },
    changePage(val) {
      this.nowPage = val;
    },
    getUserInfo() {
      user.getUserInfo(this.$cookies.get('bpUser').data.userID, this.$cookies.get('bpUser').token).then((resp) => {
        this.cookiesData = {
          name: resp.data.name,
          email: resp.data.social_login ? resp.data.email : resp.data.username,
          gender: resp.data.gender,
          dob: {
            year: resp.data.dob ? resp.data.dob.split('-')[0] : '',
            month: resp.data.dob ? resp.data.dob.split('-')[1] : '',
            day: resp.data.dob ? resp.data.dob.split('-')[2] : '',
          },
          preference_airline: resp.data.preference_airline,
          tour_style: resp.data.tour_style,
          subscribed: resp.data.subscribed,
        };
        this.localCookiesData = {
          name: this.cookiesData.name,
          email: this.cookiesData.email,
          dob: {
            year: this.cookiesData.dob.year,
            month: this.cookiesData.dob.month,
            day: this.cookiesData.dob.day,
          },
          gender: this.cookiesData.gender,
          preperAirline: [],
          tourStyle: [],
          subscribed: this.cookiesData.subscribed,
        };
        this.localCookiesData.preperAirline.push(...this.cookiesData.preference_airline);
        this.localCookiesData.tourStyle.push(...this.cookiesData.tour_style);
        // console.log(this.localCookiesData);
        this.nowPage = this.$store.state.isMobile ? 0 : 1;
        this.load = true;
      }).catch((err) => {
        console.log(err);
      });
    },
    submitUserInfo(reqData) {
      // console.log(reqData);
      this.signupLoading = true;
      user.putUserInfo(this.$cookies.get('bpUser').data.userID, reqData, this.$cookies.get('bpUser').token).then(() => {
        this.signupLoading = false;
        const COOKIEDATE = new Date();
        COOKIEDATE.setDate(COOKIEDATE.getDate() + 30);
        const cookieConditions = {
          expires: COOKIEDATE,
          path: '/',
        };
        if (window.location.hostname !== '127.0.0.1' && window.location.hostname !== 'localhost' && window.location.hostname !== 'dev.bp.front.bringprice.com') {
          cookieConditions.domain = '.bringprice.com';
        }
        const obj = this.$cookies.get('bpUser').data;
        obj.userEmail = reqData.Email;
        this.$cookies.set(
          'bpUser',
          { data: obj, token: this.$cookies.get('bpUser').token },
          cookieConditions.expires,
          cookieConditions.path,
          cookieConditions.domain,
        );
        this.getUserInfo();
      }).catch((err) => {
        console.log(err);
      });
    },
    submitPw(pwObj) {
      if (!pwObj.nowPw || !pwObj.newPw) {
        alert('비밀번호를 입력해주세요');
        return;
      }
      if (pwObj.nowPw.length < 7) {
        alert('현재 비밀번호가 너무 짧습니다.');
        return;
      }
      if (pwObj.newPw.length < 7) {
        alert('새로운 비밀번호가 너무 짧습니다.');
        return;
      }
      if (!this.pwFixLoading) {
        this.pwFixLoading = true;
        user.changePw({
          UserName: this.cookiesData.email,
          Password: pwObj.nowPw,
          NewPassword: pwObj.newPw,
        }).then(() => {
          alert('비밀번호가 성공적으로 변경 되었습니다.');
          this.pwFixLoading = false;
        }).catch(() => {
          alert('비밀번호가 존재하지 않습니다.');
          this.pwFixLoading = false;
        });
      }
    },
    getUserInfoCheck() {
      if (this.$cookies.get('bpUser')) {
        this.getUserInfo();
      } else if (!this.$store.state.isLogin && !this.$store.state.isMobile) {
        location.href = '/?popFlag=signUp';
      }
    },
    addUserInfoSubmit(addUserData) {
      user.putUserInfo(this.$cookies.get('bpUser').data.userID, addUserData, this.$cookies.get('bpUser').token).then(() => {
        this.addUserInfoFlag = false;
      }).catch((err) => {
        console.log(err);
      });
    },
  },
  mounted() {
    if (!this.$store.state.isLogin && !this.$store.state.isMobile) {
      this.$router.replace('/');
    }
  },
};
</script>

<style lang="scss">
  #mypage{
    min-height: 100vh;
    background-color: #fff;
  }
</style>

