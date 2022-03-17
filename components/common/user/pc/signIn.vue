<template>
  <div
    @click.stop
    id="loginWrapper">
    <div class="logo">
      <img src="https://cdn.bringprice.com/image/2019/logo.svg" alt="logo">
    </div>
    <div
      v-if="!searchPwFlag"
      class="login"
      @keyup.enter="bpLogin"
    >
      <div class="login">
        <p class="title">로그인</p>
        <p class="title-sub">로그인 후 브링프라이스만의 회원특가를 만나보세요!</p>
        <div
          class="inputWrapper">
          <socialbtn
            :signFlag="'signIn'"
            @social-login="socialLogin"
          ></socialbtn>
          <p class="input-title input-email">이메일주소</p>
          <input type="text" class="email" v-model="email" @focus="focusCheck">
          <p class="input-title input-password">비밀번호</p>
          <input type="password" class="password" v-model="password">
          <transition name="fade" mode="out-in">
            <div v-if="loginErr" class="err">아이디와 비밀번호를 확인해 주세요.</div>
          </transition>
          <p class="search-password" v-if="!searchPwFlag"><span @click="searchPwFlag = !searchPwFlag">비밀번호를 잊으셨나요?</span></p>
        </div>
        <div class="btn-wrap">
          <button
            @click="bpLogin"
            :class="email && password && emailValidation && pwValidation ? 'active' : ''"
            class="submit">
            <div
              v-if="loginLoading"
              @click.stop
              class="loaderWrapper btn-loading">
              <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
            로그인</button>
        </div>
      </div>
    </div>
    <searchPassword
      v-else
    />
    <div
      class="tip">
      <p class="sign-up">계정이 없으신가요? <span @click="openSignUp">회원가입</span></p>
    </div>
  </div>
</template>

<script>
import socialbtn from './socialBtns.vue';
import searchPassword from './searchPassword.vue';
import user from '~/utils/user'; // eslint-disable-line
import Format from '~/utils/format'; // eslint-disable-line

export default {
  components: {
    socialbtn,
    searchPassword,
  },
  data() {
    return {
      format: Format,
      email: '',
      password: '',
      searchPwFlag: false,
      loginLoading: false,
      loginErr: false,
    };
  },
  methods: {
    focusCheck() {
      this.loginErr = false;
    },
    socialLogin(resp) {
      this.$emit('social-login', resp);
    },
    bpLogin() {
      if (this.email && this.password && this.emailValidation && this.pwValidation) {
        this.loginLoading = true;
        const submitData = {
          UserName: this.email,
          Password: this.password,
        };
        user.login(submitData).then((resp) => {
          this.$emit('after-login', resp, false, false);
          // location.reload();
          this.loginLoading = false;
        }).catch(() => {
          this.email = '';
          this.password = '';
          this.loginLoading = false;
          this.loginErr = true;
        });
      }
    },
    openSignUp() {
      this.$router.replace({ query: { popFlag: 'signUp' } });
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
};
</script>

<style lang="scss" scoped>
#loginWrapper{
  .err{
    height: 20px;
    color: #d0021b;
    font-size: 16px;
    margin-top: 10px;
  }
  width: 100%;
  background-color: #fff;
  padding: 50px;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f1f1;
  border-radius: 6px;
  .logo{
    width: 160px;
    height: 24px;
    margin-bottom: 10px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  a{
    color: inherit;
    text-decoration: none;
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
    margin-top: 30px;
    position: relative;
    button{
      width: 100%;
      height: 53px;
      border-radius: 2px;
      transition: .3s ease;
    }
    button.active{
      background-color: $cornflower;
      font-weight: bold;
      color: #fff;
      cursor: pointer;
    }
    .submit{
      position: relative;
      font-size: 16px;
      cursor: default;
      color: $greyish-brown;
      background-color: #e9e9e9;
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
      .lds-ellipsis{
        height: 100%;
        div{
          top: 22px;
        }
      }
      &:first-of-type{
        margin-top: 0;
      }
    }
  }
  .flex-space-btw{
    display: flex;
    justify-content: space-between;
  }
  .search-password{
    color: $soft-blue;
    font-weight: bold;
    cursor: pointer;
    font-size: 16px;
    text-align: right;
    padding-top: 10px;
  }
  .tip{
    margin-top: 20px;
    font-size: 16px;
    .signUpPolicy{
      font-size: 14px;
      padding-right: 20px;
      line-height: 20px;
      span{
        cursor: pointer;
        text-decoration: underline;
      }
    }
    .sign-up{
      margin-top: 15px;
      span{
        cursor: pointer;
        color: $soft-blue;
        font-weight: bold;
      }
    }
  }
}
</style>
