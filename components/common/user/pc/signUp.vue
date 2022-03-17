<template>
  <div
    @click.stop
    id="signUp"
    :style="localFlag.addUser ? { height: '595px', overflowY: 'scroll', paddingBottom: 0 } : {}"
  >
    <div
      v-if="!localFlag.terms && !localFlag.emailSignUp && !localFlag.addUser"
      class="signUp">
      <div class="logo"></div>
      <p class="title">회원가입</p>
      <p class="title-sub">회원가입 후 브링프라이스만의 회원특가를 만나보세요!</p>
      <div class="btn-wrap">
        <socialbtn
          :signFlag="'signUp'"
          @social-login="socialLogin"
        />
        <signUpForm
          :signupLoading="signupLoading"
          :isChangedData="isChangedData"
          @open-add-userData="openAddUserData"
          @open-terms="openTerms"
          @open-signIn="openSignIn"
          @bp-sign-up="bpSignUp"
        />
      </div>
    </div>
    <terms
      v-if="localFlag.terms"
      @allow-check="allowCheck"
    />
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
import socialbtn from './socialBtns.vue';
import terms from './terms.vue';
import signUpForm from './signUpForm.vue';
import user from '~/utils/user'; // eslint-disable-line

export default {
  props: ['isChangedData'],
  components: {
    socialbtn,
    terms,
    signUpForm,
  },
  data() {
    return {
      format: Format,
      localFlag: {
        terms: false,
        addUser: false,
      },
      userData: {},
      signupLoading: false,
    };
  },
  methods: {
    openSignIn() {
      this.$router.replace({ query: { popFlag: 'signIn' } });
    },
    openTerms(flag) {
      // this.localFlag.terms = true;
      if (flag === 'tos') {
        window.open('tos');
      }
      if (flag === 'pp') {
        window.open('pp');
      }
    },
    socialLogin(resp) {
      this.$emit('social-login', resp);
    },
    afterLogin(resp) {
      this.$emit('after-login', resp, false, false);
    },
    openAddUserData(userData) {
      this.userData = userData;
      this.localFlag.emailSignUp = false;
      this.localFlag.addUser = true;
    },
    allowCheck() {
      this.localFlag.terms = false;
    },
    bpSignUp(userData) {
      this.signupLoading = true;
      user.signup(userData).then((resp) => {
        alert('회원가입이 완료되었습니다.');
        this.$emit('after-login', resp, false, 'signUp');
        this.signupLoading = false;
      }).catch((err) => {
        console.log(err);
        alert('이미 존재하는 계정입니다.');
        this.signupLoading = false;
      });
      // console.log('가입 요청');
    },
  },
};
</script>


<style lang="scss" scoped>
  #signUp{
    width: 100%;
    background-color: #fff;
    position: relative;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #f1f1f1;
    border-radius: 6px;
    .logo{
      width: 160px;
      height: 24px;
      background: url(https://cdn.bringprice.com/image/2019/logo.svg) no-repeat;
      background-size: 160px 24px;
      background-position: center center;
      margin-bottom: 10px;
    }
    a{
      color: inherit;
      text-decoration: none;
    }
    .title{
      font-size: 20px;
      font-weight: bold;
      line-height: 29px;
    }
    .title-sub{
      font-size: 14px;
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
    .signUp{
      padding: 50px;
    }
    .inputWrapper{
      width: 100%;
      margin-top: 30px;
      .input-title{
        font-size: 14px;
        color: $brown-grey;
      }
    }
    .btn-wrap{
      margin-top: 20px;
    }
  }
</style>
