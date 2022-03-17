<template>
  <div
    @click.stop
    id="loginWrapper">
    <div class="top-info">
      <div
        class="contents">
        <div
          class="chevron-left x-btn"
          @click="back"
        />
        <span
          v-if="!searchPwFlag"
          @click="searchPwFlag = !searchPwFlag"
          class="search-password">비빌번호 찾기</span>
      </div>
    </div>
    <div
      v-if="!searchPwFlag"
      class="login-form"
      @keyup.enter="bpLogin"
    >
      <div class="login">
        <p class="title">로그인</p>
        <p class="title-sub">로그인 후 브링프라이스만의 회원특가를 만나보세요!</p>
        <div
          class="inputWrapper">
          <p class="input-title input-email">이메일주소</p>
          <input type="text" class="email" v-bind:value="email" v-on:input="email = $event.target.value">
          <div class="err"
            :style="{
              opacity: emailValidation ? 0 : 1
            }"
          >이메일 형식이 올바르지 않습니다.</div>
          <p class="input-title input-password">비밀번호</p>
          <input type="password" class="password" v-model="password">
          <div class="err" :style="{
            opacity: pwValidation ? 0 : 1
          }">비밀번호가 너무 짧습니다.</div>
        </div>
        <div class="btn-wrap">
          <button
            @click="bpLogin"
            :class="email && password && emailValidation && pwValidation ? 'active' : ''"
            class="submit">
            <div
              v-if="signinLoading"
              @click.stop
              class="loaderWrapper btn-loading">
              <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>

            로그인</button>
          <socialBtns
            @social-login="socialLogin"
            :isIos="isIos"
          />
        </div>
      </div>
    </div>
    <searchPassword
      v-else
    />
  </div>
</template>

<script>
import searchPassword from './searchPassword.vue';
import user from '~/utils/user'; // eslint-disable-line
import Format from '~/utils/format'; // eslint-disable-line
import socialBtns from './socialBtns.vue';

export default {
  components: {
    socialBtns,
    searchPassword,
  },
  data() {
    return {
      format: Format,
      email: '',
      password: '',
      searchPwFlag: false,
      signinLoading: false,
      isApp: false,
      isIos: false,
    };
  },
  methods: {
    back() {
      history.back();
    },
    bpLogin() {
      if (this.email && this.password && this.emailValidation && this.pwValidation) {
        const submitData = {
          UserName: this.email,
          Password: this.password,
        };
        this.signinLoading = true;
        user.login(submitData).then((resp) => {
          this.$emit('after-login', resp, null, null);
          this.signinLoading = false;
          // location.reload();
        }).catch(() => {
          this.signinLoading = false;
          this.email = '';
          this.password = '';
          alert('아이디 또는 비밀번호가 틀렸거나 존재하지 않은 계정입니다.');
        });
      }
    },
    openSignUp() {
      this.$router.push({ query: { popFlag: 'signUp' } });
    },
    socialLogin(obj) {
      this.$emit('social-login', obj);
    },
  },
  computed: {
    emailValidation() {
      if (!this.email) {
        return true;
      }
      if (!this.format.emailcheck(this.email)) {
        return false;
      }
      return true;
    },
    pwValidation() {
      if (!this.password) {
        return true;
      }
      if (this.password.length < 7) {
        return false;
      }
      return true;
    },
  },
  mounted() {
    this.isApp = window.navigator.userAgent.indexOf('bpAos') >= 0 || window.navigator.userAgent.indexOf('bpIos') >= 0;
    this.isIos = window.navigator.userAgent.indexOf('bpIos') >= 0;
  },
};
</script>

<style lang="scss" scoped>
#loginWrapper{
  .top-info{
    transition: opacity 0.3s ease;
    width: 100%;
    height: 48px;
    background-color: #fff;
    position: fixed;
    height: calc(48px + constant(safe-area-inset-top));
    height: calc(48px + env(safe-area-inset-top));
    top: 0;
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
    left: 0;
    right: 0;
    z-index: 1;
  }
  .top-info > .contents{
    transition: opacity 0.3s ease;
    width: 100%;
    height: 100%;
    position: relative;
    text-align: center;
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .top-info .contents .x-btn{
    width: 40px;
    height: 40px;
    background-size: 21px;
    background-position: center center;
    margin-left: 4px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-image: url(~assets/img/common/chevron-left.svg);
    background-color: transparent;
  }
  .top-info .contents .search-password{
    font-size: 12px;
    line-height: 26px;
    cursor: pointer;
    padding-right: 20px;
  }
  .err{
    transition: opacity .3s ease;
    height: 20px;
    color: #d0021b;
    font-size: 16px;
    margin-top: 10px;
  }
  width: 100%;
  height: 100vh;
  background-color: #fff;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f1f1;
  a{
    color: inherit;
    text-decoration: none;
  }
  .login-form{
    margin-top: 48px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 70px;
  }
  .title{
    font-size: 20px;
    line-height: 29px;
    font-weight: bold;
  }
  .title-sub{
    font-size: 14px;
    line-height: 20px;
    color: $brown-grey;
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
  .inputWrapper{
    width: 100%;
    margin-top: 30px;
    .input-title{
      font-size: 14px;
      color: $brown-grey;
    }
    .email, .password{
      transition: 0.3s ease;
      width: 100%;
      height: 36px;
      border: none;
      border-bottom: 2px solid #e9e9e9;
    }
    input:focus{
      border-bottom: 2px solid $soft-blue;
    }
    .input-password{
      margin-top: 16px;
    }
  }
  .btn-wrap{
    margin-top: 10px;
    button{
      width: 100%;
      height: 53px;
      border-radius: 2px;
      transition: .3s ease;
    }
    .submit{
      background-color: #e9e9e9;
      position: relative;
      .btn-loading{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.3);
      }
    }
    button.active{
      background-color: $cornflower;
      font-weight: bold;
      color: #fff;
    }
    button.sns{
      color: $cornflower;
      border: 1px solid $cornflower;
    }
    button{
      font-size: 16px;
      color: $greyish-brown;
      margin-top: 10px;
      &:first-of-type{
        margin-top: 0;
      }
    }
  }
  .fwb{
    font-weight: bold;
  }
}
</style>
