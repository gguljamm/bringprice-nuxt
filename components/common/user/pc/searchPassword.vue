<template>
  <div id="searchPassword">
    <div
      class="login">
      <p class="title">비밀번호 찾기</p>
      <p class="title-sub">이메일주소를 입력하시면 임시비밀번호를 보내드립니다.</p>
      <div
        class="inputWrapper">
        <p class="input-title input-email">이메일주소</p>
        <input type="text" class="email" @keyup="typing($event)">
        <div class="err" v-text="errMsg"/>
      </div>
    </div>
    <div class="btn-wrap">
      <button
        @click="submit"
        class="login-btn"
        :class="UserName !== '' && !errMsg ? 'active' : ''"
      >
        <div
          v-if="searchPwLoading"
          @click.stop
          class="loaderWrapper btn-loading">
          <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
      임시 비밀번호 받기</button>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
import user from '~/utils/user'; // eslint-disable-line

export default {
  data() {
    return {
      format: Format,
      UserName: '',
      errMsg: '',
      searchPwLoading: false,
    };
  },
  methods: {
    typing(e) {
      this.UserName = e.target.value;
      if (this.UserName !== '') {
        this.errCheck();
      } else {
        this.errMsg = '';
      }
    },
    errCheck() {
      if (this.format.emailcheck(this.UserName)) {
        this.errMsg = '';
      } else {
        this.errMsg = '이메일 형식에 맞춰서 입력해 주세요.';
      }
    },
    submit() {
      if (!this.errMsg && this.UserName !== '') {
        this.searchPwLoading = true;
        user.pwRequest(this.UserName).then(() => {
          alert('입력하신 메일로 임시 비밀번호를 보내드렸습니다.');
          this.searchPwLoading = false;
        }).catch(() => {
          alert('존재하지 않는 계정입니다.');
          this.searchPwLoading = false;
        });
      }
    },
  },
};
</script>


<style lang="scss" scoped>
  #searchPassword{
    width: 100%;
    .err{
      height: 20px;
      color: #d0021b;
      font-size: 16px;
      margin-top: 5px;
    }
    .title{
      font-size: 20px;
      font-weight: bold;
      line-height: 29px;
    }
    .title-sub{
      font-size: 16px;
      color: $brown-grey;
    }
    .inputWrapper{
      width: 100%;
      margin-top: 30px;
      .input-title{
        font-size: 14px;
        color: $brown-grey;
      }
      .email{
        transition: 0.3s ease;
        width: 100%;
        height: 36px;
        border: none;
        border-bottom: 2px solid #e9e9e9;
      }
      input:focus{
        border-bottom: 2px solid $soft-blue;
      }
    }
    .login-btn{
      width: 100%;
      height: 53px;
      cursor: default;
      transition: 0.3s ease;
      margin-top: 20px;
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
      .lds-ellipsis{
        height: 100%;
        div{
          top: 22px;
        }
      }
    }
    .login-btn.active{
      font-weight: bold;
      color: #fff;
      cursor: pointer;
      background-color: $cornflower;
    }
  }
</style>
