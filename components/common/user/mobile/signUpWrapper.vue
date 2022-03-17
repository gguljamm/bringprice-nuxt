<template>
  <div id="signUpWrapper">
    <signUpForm
      v-if="!addSignFlag"
      :signupLoading="signupLoading"
      @sign-up="bpSignUp"
    />
  </div>
</template>


<script>
import user from '~/utils/user'; // eslint-disable-line
import signUpForm from './signUp.vue';

export default {
  components: {
    signUpForm,
  },
  data() {
    return {
      addSignFlag: false,
      userData: {},
      signupLoading: false,
    };
  },
  methods: {
    openAddUserData(userData) {
      this.userData = userData;
      this.addSignFlag = true;
    },
    bpSignUp(data) {
      this.signupLoading = true;
      user.signup(data).then((resp) => {
        this.signupLoading = false;
        alert('회원가입이 완료 되었습니다.');
        this.$emit('after-login', resp, null, 'signUp');
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
