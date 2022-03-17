<template>
  <div
    id="userInfoWrapper">
    <div
      class="userInfo">
      <p class="title">개인정보</p>
      <div
        class="inputWrapper">
        <p class="input-title input-email">이름</p>
        <input type="text" class="email" :value="localCookiesData.name" disabled>
        <p class="input-title input-email">이메일</p>
        <input
          v-if="$cookies.get('bpUser').data.social_login && (!localCookiesData.email || localCookiesData.email === undefined || localCookiesData.email === 'undefined')"
          type="email"
          class="email"
          @keyup="$emit('inputEmail', $event)"
          placeholder="이메일을 등록해주세요!"
        >
        <input
          v-else
          type="text"
          class="email"
          :value="email"
          disabled
        >
        <div
          v-if="!$cookies.get('bpUser').data.social_login"
          class="changePw" @click="$emit('changePage', 3)"><span>비밀번호 변경</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['localCookiesData', 'email'],
  data() {
    return {
      format: Format,
      viewPassword: false,
    };
  },
  beforeDestroy() {
    this.$emit('resetLocalData');
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
      }
      .input-title{
        font-size: 14px;
        color: $brown-grey;
        margin-top: 20px;
      }
      .inputWrapper{
        margin-top: 30px;
        .email, .changePw{
          transition: 0.3s ease;
          background-color: transparent;
          width: 100%;
          height: 36px;
          border: none;
          font-size: 14px;
          border-bottom: 2px solid #e9e9e9;
          &:focus{
            border-bottom: 2px solid $soft-blue;
          }
        }
        .changePw{
          margin-top: 20px;
          line-height: 36px;
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
  }
</style>
