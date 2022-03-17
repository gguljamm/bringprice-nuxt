<template>
  <div
    @click.stop
    id="signUpFormWrapper">
    <div class="top-info">
      <div
        class="contents">
        <div
          class="chevron-left x-btn"
          @click="back"
        />
      </div>
    </div>
    <div
      class="signUp">
      <p class="title">회원가입</p>
      <div
        class="inputWrapper">
        <p class="input-title input-email">이름</p>
        <input type="text" class="email" v-bind:value="name" v-on:input="name = $event.target.value" ref="name" placeholder="홍길동">
        <div class="err" :style="{ opacity: !nameFlag.type && name ? 1 : 0 }">{{ nameFlag.msg }}</div>
        <p class="input-title input-email">이메일</p>
        <input type="text" class="email" v-model="email" placeholder="ID@email.com">
        <div class="err" :style="{ opacity: !emailDataCheck ? 1 : 0 }">이메일 형식에 맞춰서 입력해 주세요</div>
        <p class="input-title input-password">비밀번호</p>
        <input :type="viewPassword ? 'text' : 'password'" class="password" v-model="password" placeholder="7자 이상 영문 대소문자, 숫자 조합으로 가능합니다.">
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
    </div>
    <div class="btn-wrap">
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
        </div>
        가입하기</button>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['signupLoading'],
  data() {
    return {
      format: Format,
      viewPassword: false,
      email: '',
      password: '',
      password2: '',
      conduction: 1,
      name: '',
      passwordErr: '',
    };
  },
  methods: {
    back() {
      this.$router.push('/user');
    },
    signUp() {
      // console.log(this.nameFlag, this.emailDataCheck, this.passwordCheck, this.password === this.password2, this.email, this.password, this.password2);
      if (this.nameFlag.type && this.emailDataCheck && this.passwordCheck.type && this.name && this.password === this.password2 && this.email && this.password && this.password2) {
        const submitData = {
          Name: this.$refs.name.value,
          UserName: this.email,
          Password: this.password,
          conduction: this.conduction,
        };
        // console.log(submitData);
        this.$emit('sign-up', submitData);
      }
    },
  },
  computed: {
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
};
</script>


<style lang="scss" scoped>
  .clear{
    clear: both;
  }
  #signUpFormWrapper{
    width: 100%;
    height: 100vh;
    position: relative;
    background-color: #fff;
    .signUp{
      width: 100%;
      position: absolute;
      top: 78px;
      right: 0;
      left: 0;
      bottom: 90px;
      overflow-y: auto;
      padding: 0 20px 0 20px;
    }
    .title{
      font-size: 20px;
      font-weight: bold;
    }
    .top-info{
      transition: opacity 0.3s ease;
      width: 100%;
      height: 48px;
      background-color: #fff;
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
        height: 36px;
        border: none;
        font-size: 14px;
        border-bottom: 2px solid #e9e9e9;
        &::placeholder{
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
    .tip{
      font-size: 14px;
      margin-top: 40px;
      line-height: 22px;
      span{
        padding-left: 5px;
      }
    }
    .signUp-btn{
      width: 100%;
      height: 53px;
      cursor: default;
      transition: 0.3s ease;
      color: $brown-grey;
      background-color: #f8f8f8;
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
    .signUp-btn.active{
      font-weight: bold;
      color: #fff;
      cursor: pointer;
      background-color: $cornflower;
    }
    .btn-wrap{
      width: 100%;
      background-color: #fff;
      z-index: 13;
      padding: 12px 20px;
      box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
</style>

