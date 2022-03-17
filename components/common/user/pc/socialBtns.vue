<template>
  <div class="scoial-btn-wrap">
    <button class="submit facebook"
      @click="clickFaceBookLogin"
    ><strong>페이스북</strong>으로 {{ signFlag === 'signUp' ? '회원가입' : '로그인' }}</button>
    <GoogleLogin
      class="submit google"
      :client_id="'7488890691-53ahrdq7uc1nvhs2c0l4rg0ggfv5dg55.apps.googleusercontent.com'"
      :onSuccess="googleLogin"
    ><strong>구글</strong>로 {{ signFlag === 'signUp' ? '회원가입' : '로그인'}}</GoogleLogin>
    <button class="submit kakao"
      @click="kakaoLogin"
    ><strong>카카오톡</strong>으로 {{ signFlag === 'signUp' ? '회원가입' : '로그인' }}</button>
    <!--<button class="submit naver"><strong>네이버</strong>로 로그인</button>-->
    <facebook-login class="facebookBtn"
      :appId="fbAppId"
      :loginOptions="{scope: 'email', return_scopes: true}"
      @login="facebookLogin"
    ></facebook-login>
    <div class="line"><span>또는</span></div>
  </div>
</template>

<script>
import user from '~/utils/user'; // eslint-disable-line
import facebookLogin from 'facebook-login-vuejs';
import GoogleLogin from 'vue-google-login';

export default {
  props: ['signFlag'],
  components: {
    facebookLogin,
    GoogleLogin,
  },
  data() {
    return {
      fbAppId: process.env.isDev ? 707555262713128 : 672066456262009,
      // base64,
    };
  },
  methods: {
    facebookLogin(resp) {
      if (!resp.response.authResponse) {
        return;
      }
      /* eslint-disable */
      FB.api('/me?fields=email, name', dude => {
        const obj = {
          UserName: dude.id,
          Email: dude.email || '',
          Name: dude.name,
          Auth: 'facebook',
        };
        this.$emit('social-login', obj);
      });
      /* eslint-enable */
    },
    clickFaceBookLogin() {
      window.document.querySelectorAll('.facebookBtn > button')[0].click();
    },
    googleLogin(GoogleUser) {
      const obj = {};
      const userInfo = GoogleUser.getBasicProfile();
      if (userInfo) {
        obj.UserName = userInfo.WU || Object.values(userInfo).find(v => !isNaN(v));
        obj.Email = userInfo.Bu || Object.values(userInfo).find(v => v.indexOf('@') >= 0);
        obj.Name = userInfo.Bd || Object.values(userInfo).find(v => v.indexOf(' ') >= 0);
      } else {
        alert('google login error');
      }
      obj.Auth = 'google';
      this.$emit('social-login', obj);
    },
    kakaoLogin() {
      const vThis = this;
      /* eslint-disable */
      Kakao.Auth.login({
        success: function(authObj) {
          Kakao.API.request({
            url: '/v2/user/me',
            success: function(res) {
              const obj = {
                UserName: res.id,
                Name: res.properties.nickname,
                Email: res.kakao_account.has_email ? res.kakao_account.email : '',
                Auth: 'kakao',
              };
              vThis.$emit('social-login', obj);
            },
            fail: function() {
              vThis.$router.push({
                query: {
                  popFlag: 'alert',
                },
              });
            }
          });
        },
        fail: function() {
          vThis.$router.push({
            query: {
              popFlag: 'alert',
            },
          });
        }
      });
      /* eslint-enable */
    },
  },
};
</script>

<style>
  .facebookBtn{
    display: none;
  }
</style>
<style lang="scss" scoped>
  .scoial-btn-wrap{
    width: 100%;
    margin-top: 30px;
    .line{
      text-align: center;
      position: relative;
      padding-top: 30px;
      padding-bottom: 30px;
      z-index: 2;
      &:before {
        border-top: 1px solid #e9e9e9;
        content:"";
        margin: 0 auto;
        position: absolute;
        top: 50%; left: 0; right: 0; bottom: 0;
        width: 100%;
        z-index: -1;
      }
      span {
        background: #fff;
        padding: 0 15px;
      }
    }
    .emailSignUp{
      width: 100%;
      height: 53px;
      color: #fff;
      background-color: $cornflower;
      font-weight: bold;
      font-size: 16px;
      border-radius: 2px;
    }
    button{
      width: 100%;
      height: 53px;
      border-radius: 2px;
    }
    .submit{
      font-size: 16px;
      color: $greyish-brown;
      background-color: #e9e9e9;
      margin-top: 10px;
      &:first-of-type{
        margin-top: 0;
      }
      &.facebook{
        color: #fff;
        background-color: #3a5a97;
      }
      &.google{
        color: #fff;
        background-color: #cb574c;
      }
      &.kakao{
        color: #3c1d1e;
        background-color: #fae100;
      }
      &.naver{
        color: #fff;
        background-color: #08cf5d;
      }
    }
  }
</style>
