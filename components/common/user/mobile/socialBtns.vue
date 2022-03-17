<template>
  <div class="scoial-btn-wrap">
    <div class="line"><span>또는</span></div>
    <div v-if="isIos" class="btn-wrap">
      <button class="submit appleLogin" @click="appleLogin">
        <div class="logo"></div>
        <strong>Apple</strong>로 {{ signFlag === 'signUp' ? '등록' : '로그인'}}
      </button>
    </div>
    <div v-if="isIos" class="line"><span>또는</span></div>
    <div class="btn-wrap">
      <button class="submit facebook"
        @click="clickFaceBookLogin"
      ><strong>페이스북</strong>으로 {{ signFlag === 'signUp' ? '회원가입' : '로그인'}}</button>
      <no-ssr>
        <GoogleLogin
          v-if="!isApp"
          class="submit google"
          :client_id="'7488890691-53ahrdq7uc1nvhs2c0l4rg0ggfv5dg55.apps.googleusercontent.com'"
          :onSuccess="googleLogin"
        ><strong>구글</strong>로 {{ signFlag === 'signUp' ? '회원가입' : '로그인'}}</GoogleLogin>
        <button class="submit google"
          v-else
          @click="googleLoginApp()"
        >
          <strong>구글</strong>로 {{ signFlag === 'signUp' ? '회원가입' : '로그인'}}</button>
        <button class="submit kakao"
          @click="kakaoLogin"
        ><strong>카카오톡</strong>으로 {{ signFlag === 'signUp' ? '회원가입' : '로그인'}}</button>
          <!--<button class="submit naver"><strong>네이버</strong>로 {{ signFlag === 'signIn' ? '로그인' : '회원가입'}}</button>-->
        <facebook-login class="facebookBtn"
          :appId="fbAppId"
          :loginOptions="{scope: 'email', return_scopes: true}"
          @login="facebookLogin"
        ></facebook-login>
      </no-ssr>
    </div>
  </div>
</template>
<!--moc.tnetnocresuelgoog.sppa.pk1k1glt80d73ttr1de4nbt80u08a002-217327527071-->
<script>
import user from '~/utils/user'; // eslint-disable-line
import facebookLogin from 'facebook-login-vuejs';
import GoogleLogin from 'vue-google-login';

export default {
  props: ['signFlag', 'isApp', 'isIos'],
  components: {
    facebookLogin,
    GoogleLogin,
  },
  data() {
    return {
      fbAppId: process.env.isDev ? 707555262713128 : 672066456262009,
    };
  },
  methods: {
    /* eslint-disable */
    appleLogin() {
      SignInWithApple.isAvailable().then(() => {
        SignInWithApple.request({
          requestedScopes: [ SignInWithApple.Scope.Email, SignInWithApple.Scope.FullName ],
        }).then((credential) => {
          const obj = {
            UserName: credential.user,
            Email: credential.email || '',
            Name: `${credential.fullName.familyName} ${credential.fullName.givenName}`,
            Auth: 'apple',
          };
          this.$emit('social-login', obj);
        });
      });
    },
    googleLoginApp() {
      window.plugins.googleplus.login({
        scopes: '',
        webClientId: '7488890691-53ahrdq7uc1nvhs2c0l4rg0ggfv5dg55.apps.googleusercontent.com',
        offline: true,
      }, (resp) => {
        const obj = {
          UserName: resp.userId,
          Email: resp.email || '',
          Name: resp.displayName,
          Auth: 'google',
        };
        this.$emit('social-login', obj);
      }, (e) => {
        this.$router.push({
          query: {
            popFlag: 'alert',
          },
        });
      });
      /* eslint-enable */
    },
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
      if (this.isApp) {
        /* eslint-disable */
        const onLoginSuccess = (resp) => {
          // const obj = Object.assign({}, resp.authResponse);
          // obj.accessToken = undefined;
          // alert(Object.keys(obj).map(v => `${v}: ${obj[v]}`).join(', '));
          facebookConnectPlugin.api(`${resp.authResponse.userID}/?fields=id,email,name`, [], (resp2) => {
            const obj = {
              UserName: resp2.id,
              Email: resp2.email || '',
              Name: resp2.name,
              Auth: 'facebook',
            };
            this.$emit('social-login', obj);
          }, (error) => {
            this.$router.push({
              query: {
                popFlag: 'alert',
              },
            });
          });
        };
        const onLoginFail = (error) => {
          this.$router.push({
            query: {
              popFlag: 'alert',
            },
          });
        };

        facebookConnectPlugin.login(
          [
            'public_profile', 'email',
          ],
          onLoginSuccess,
          onLoginFail
        );

        /* eslint-enable */
      } else {
        window.document.querySelectorAll('.facebookBtn > button')[0].click();
      }
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
      if (this.isApp) {
        /* eslint-disable */
        KakaoCordovaSDK.login(null, (res) => {
          const obj = {
            UserName: res.id,
            Name: res.properties.nickname,
            Email: res.kakao_account.email,
            Auth: 'kakao',
          };
          vThis.$emit('social-login', obj);
        }, (e) => {
          this.$router.push({
            query: {
              popFlag: 'alert',
            },
          });
        });
      } else {
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
                this.$router.push({
                  query: {
                    popFlag: 'alert',
                  },
                });
              }
            });
          },
          fail: function(err) {
            this.$router.push({
              query: {
                popFlag: 'alert',
              },
            });
          }
        });
        /* eslint-enable */
      }
    },
  },
};
</script>


<style lang="scss" scoped>
  .scoial-btn-wrap{
    width: 100%;
    .top-info{
      transition: opacity 0.3s ease;
      width: 100%;
      height: 48px;
      background: #fff;
    }
    .top-info > .contents{
      transition: opacity 0.3s ease;
      width: 100%;
      height: 100%;
      position: relative;
      text-align: center;
      align-items: center;
      justify-content: flex-end;
      display: flex;
    }
    .top-info .contents .x-btn{
      width: 40px;
      height: 40px;
      background-size: 21px;
      background-position: center center;
      cursor: pointer;
      margin-right: 4px;
      background-repeat: no-repeat;
      background-image: url(~assets/img/common/x_black.svg);
      background-color: transparent;
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
      &.appleLogin{
        color: #fff;
        background-color: #000;
        padding: 0 8%;
        position: relative;
        font-size: 22px;
        .logo{
          width: 26px;
          height: 100%;
          background-size: 26px 26px;
          background-image: url(~assets/img/common/apple-logo.svg);
          background-repeat: no-repeat;
          background-position: center center;
          position: absolute;
          top: calc(50% - 26.5px);
        }
      }
    }
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
  }
</style>
