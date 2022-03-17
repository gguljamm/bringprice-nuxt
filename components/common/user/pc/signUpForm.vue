<template>
  <div
    @click.stop
    id="signUpFormWrapper">
    <div
      class="signUp">
      <p class="title">회원가입</p>
      <p class="title-sub">회원가입을 하시면 맞춤형 정보를 제공해드립니다.</p>
      <div
        class="inputWrapper">
        <p class="input-title input-email">이름</p>
        <input type="text" class="email" v-bind:value="name" v-on:input="name = $event.target.value" ref="name" placeholder="홍길동">
        <div class="err" :style="{ opacity: !nameFlag.type && name ? 1 : 0 }">{{ nameFlag.msg }}</div>
        <p class="input-title input-email">이메일</p>
        <input type="text" class="email" v-model="email" placeholder="ID@email.com">
        <div class="err" :style="{ opacity: !emailDataCheck ? 1 : 0 }">이메일 형식에 맞춰서 입력해 주세요</div>
        <p class="input-title input-password">비밀번호</p>
        <input type="password" class="password" v-model="password" placeholder="7자 이상 영문 대소문자, 숫자 조합으로 가능합니다.">
        <div class="flex-btw">
          <span class="err" :style="{ opacity: !passwordCheck.type ? 1 : 0 }">{{ passwordCheck.msg }}</span>
        </div>
        <p class="input-title input-password">비밀번호 확인</p>
        <input type="password" class="password" v-model="password2">
        <div class="flex-btw">
          <span class="err" :style="{ opacity: password !== password2 && password2 ? 1 : 0 }">비밀번호가 일치하지 않습니다.</span>
        </div>
      </div>
      <div
        class="tip">
        <label class="title-containner">
          <input type="checkbox" checked @click="conduction = conduction === 1 ? 0 : 1">
          <span class="checkmark"/>
        </label>
        <span>브링프라이스의 특별 할인, 프로모션, 정책 변경 사항 등을 보내드립니다. 계정설정에서 언제든지 수신거부 하실 수 있습니다.</span>
      </div>
      <p class="signUpPolicy">회원가입을 누름으로써 브링프라이스의 <span @click="openTerms('tos')">서비스 이용약관</span>, <span @click="openTerms('pp')">개인정보 보호정책</span>에 모두 동의합니다.</p>
      <button
        @click="signUp"
        class="signUp-btn"
        :class="nameFlag.type && emailDataCheck && passwordCheck.type && name && password === password2 && email && password && password2 ? 'active' : ''"
      >
        <div
          v-if="signupLoading"
          @click.stop
          class="loaderWrapper btn-loading">
          <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>회원가입</button>
    </div>
    <p class="sign-up">계정이 있으신가요? <span @click="openSignIn">로그인</span></p>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['signupLoading', 'isChangedData'],
  data() {
    return {
      format: Format,
      viewPassword: false,
      email: '',
      password: '',
      password2: '',
      name: '',
      conduction: 1,
      changedData: this.isChangedData,
    };
  },
  methods: {
    openSignIn() {
      this.$emit('open-signIn');
    },
    openTerms(val) {
      this.$emit('open-terms', val);
    },
    signUp() {
      if (this.nameFlag.type && this.emailDataCheck && this.passwordCheck.type && this.name && this.password === this.password2 && this.email && this.password && this.password2) {
        const submitData = {
          Name: this.$refs.name.value,
          UserName: this.email,
          Password: this.password,
          conduction: this.conduction,
        };
        this.$emit('bp-sign-up', submitData);
      }
    },
  },
  computed: {
    isAllActive() {
      return this.email || this.password || this.password2 || this.name;
    },
    nameFlag() {
      if (!this.name) {
        return this.format.nameRexp(this.name);
      }
      return this.format.nameRexp(this.name);
    },
    emailDataCheck() {
      if (!this.email) {
        return true;
      }
      if (!this.format.emailcheck(this.email)) {
        return false;
      }
      return true;
    },
    passwordCheck() {
      if (!this.password) {
        return this.format.pwRexp(this.password);
      }
      return this.format.pwRexp(this.password);
    },
  },
  mounted() {
    this.changedData.active = false;
  },
  watch: {
    isAllActive(n) {
      let r = false;
      if (n) {
        r = true;
      }
      this.changedData.active = r;
    },
  },
};
</script>


<style lang="scss" scoped>
  .clear{
    clear: both;
  }
  #signUpFormWrapper{
    width: 100%;
    .title{
      font-size: 20px;
      font-weight: bold;
      line-height: 30px;
    }
    .title-sub{
      font-size: 14px;
      line-height: 20px;
      color: $brown-grey;
    }
    .inputWrapper{
      width: 100%;
      margin-top: 30px;
      .input-title{
        font-size: 14px;
        color: $brown-grey;
      }
      .err{
        height: 24px;
        color: #d0021b;
        font-size: 16px;
        margin-top: 10px;
        transition: opacity .3s;
      }
      span.err{
        margin-top: 10px;
      }
      input ~ .input-title {
        margin-top: 20px;
        &:first-of-type{
          margin-top: 0;
        }
      }
      input[type=text], input[type=password]{
        transition: 0.3s ease;
        width: 100%;
        font-size: 16px;
        height: 36px;
        border: none;
        border-bottom: 2px solid #e9e9e9;
        &::placeholder{
          color: #e1e1e1;
        }
        &::-webkit-input-placeholder{
          color: #e1e1e1;
        }
        &::-ms-input-placeholder{
          color: #e1e1e1;
        }
      }
      .email:focus, .password:focus{
        border-bottom: 2px solid $soft-blue;
      }
      .flex-btw{
        display: flex;
        justify-content: space-between;
      }
      .view-password{
        cursor: pointer;
        color: $soft-blue;
        margin-top: 10px;
      }
    }
    .title-containner {
      width: 20px;
      height: 20px;
      display: inline-block;
      cursor: pointer;
      position: relative;
      font-size: 16px;
      line-height: 20px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      border-bottom: 1px solid #e9e9e9;
    }
    /* Hide the browser's default checkbox */
    .title-containner input {
      border-radius: 2px;
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    /* Create a custom checkbox */
    .checkmark {
      transition: 0.3s ease;
      position: absolute;
      top: 3px;
      left: 0;
      height: 20px;
      width: 20px;
      background-color: #e9e9e9;
    }
    /* When the checkbox is checked, add a blue background */
    .title-containner input:checked ~ .checkmark {
      border-radius: 2px;
      background-color: $cornflower;
    }
    /* Create the checkmark/indicator (hidden when not checked) */
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }
    /* Show the checkmark when checked */
    .title-containner input:checked ~ .checkmark:after {
      display: block;
    }
    /* Style the checkmark/indicator */
    .title-containner .checkmark:after {
      left: 6px;
      top: 1.5px;
      width: 8px;
      height: 13px;
      border: 1px solid white;
      border-width: 0 2px 2px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
    .tip {
      margin-top: 40px;
      line-height: 24px;
      font-size: 16px;

      span {
        padding-left: 5px;
      }
    }
    .signUpPolicy {
      font-size: 16px;
      padding-right: 20px;
      line-height: 24px;
      margin-top: 30px;
      span {
        cursor: pointer;
        color: $soft-blue;
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
    .signUp-btn{
      width: 100%;
      height: 53px;
      cursor: default;
      position: relative;
      transition: 0.3s ease;
      margin-top: 20px;
      color: $brown-grey;
      background-color: #f8f8f8;
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
    .signUp-btn.active{
      font-weight: bold;
      color: #fff;
      cursor: pointer;
      background-color: $cornflower;
    }
  }
</style>
