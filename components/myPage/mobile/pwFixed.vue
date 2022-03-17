<template>
  <div
    id="userInfoWrapper">
    <div
      class="userInfo">
      <p class="title">비밀번호 수정</p>
      <div
        class="inputWrapper">
        <p class="input-title input-password">현재 비밀번호</p>
        <input type="password" class="password" v-bind:value="nowPw" v-on:input="nowPw = $event.target.value">
        <div class="flex-btw">
          <p class="input-title input-password">새로운 비밀번호</p>
          <span
            @click="viewPassword = !viewPassword"
            class="view-password">비밀번호 보기</span>
        </div>
        <input :type="viewPassword ? 'text' : 'password'" class="password" v-bind:value="newPw" v-on:input="newPw = $event.target.value">
      </div>
      <div class="btn-wrap">
        <button
          @click="submitPw"
          class="submit-btn">
          <div
            v-if="pwFixLoading"
            @click.stop
            class="loaderWrapper btn-loading">
            <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
          </div>
          적용</button>
      </div>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['cookiesData', 'pwFixLoading'],
  data() {
    return {
      format: Format,
      nowPw: '',
      newPw: '',
      viewPassword: false,
    };
  },
  methods: {
    submitPw() {
      this.$emit('submitPw', { nowPw: this.nowPw, newPw: this.newPw });
      this.nowPw = '';
      this.newPw = '';
    },
  },
};
</script>


<style lang="scss" scoped>
  .clear{
    clear: both;
  }
  #userInfoWrapper{
    width: 100%;
    .userInfo{
      .title{
        font-weight: bold;
        font-size: 20px;
        margin-top: 5px;
      }
      .input-title{
        font-size: 14px;
        color: $brown-grey;
        margin-top: 20px;
      }
      .inputWrapper{
        margin-top: 30px;
        input[type=text], input[type=password]{
          transition: 0.3s ease;
          background-color: transparent;
          width: 100%;
          height: 36px;
          border: none;
          border-bottom: 2px solid #e9e9e9;
          &:focus{
            border-bottom: 2px solid $soft-blue;
          }
        }
        .flex-btw{
          margin-top: 20px;
          .input-password{
            margin-top: 0;
          }
          display: flex;
          justify-content: space-between;
        }
        .view-password{
          font-size: 14px;
          cursor: pointer;
          color: $soft-blue;
          margin-top: 10px;
        }
      }
    }
    .btn-wrap{
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 12px 20px;
      z-index: 13;
      background-color: #fff;
      box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
      .submit-btn{
        width: 100%;
        height: 53px;
        border-radius: 2px;
        background-color: $cornflower;
        color: #fff;
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
    }
  }
</style>
