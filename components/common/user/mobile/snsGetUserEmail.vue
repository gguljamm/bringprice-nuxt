<template>
  <div
    @click.stop
    id="getEmail">
    <div class="top-info">
      <div
        class="contents">
        <div
          class="chevron-left x-btn"
          @click="$emit('close-snsGetUserEmail')"
        ></div>
      </div>
    </div>
    <div class="getEmailWrapper">
      <p class="title">이메일을 확인해주세요</p>
      <p class="title-sub">이메일 주소만 추가하시면 바로 가입됩니다.</p>
      <div
        class="inputWrapper">
        <p class="input-title input-email">이메일주소</p>
        <input type="text" class="email" v-model="userData.userEmail">
          <div class="err">
            <transition name="fade">
              <span v-if="!emailCheck && userData.userEmail">이메일 형식이 맞지 않습니다.</span>
            </transition>
          </div>
      </div>
      <div class="subscribe">
        <label class="title-containner">
          <input type="checkbox" checked @click="userData.conduction = userData.conduction === 1 ? 0 : 1">
          <span class="checkmark"/>
        </label>
        <span>브링프라이스의 특별 할인, 프로모션, 정책 변경 사항 등을 보내드립니다. 계정설정에서 언제든지 수신거부 하실 수 있습니다.</span>
      </div>
      <button
        @click="submit"
        class="signUp-btn"
        :class="emailCheck && userData.userEmail ? 'active' : ''"
      >가입하기</button>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line

export default {
  data() {
    return {
      userData: {
        userEmail: '',
        conduction: 1,
      },
      dataCheck: false,
      format: Format,
    };
  },
  methods: {
    openTerms() {
      this.localFlag.terms = true;
    },
    submit() {
      if (this.emailCheck && this.userData.userEmail) {
        // console.log(this.userData);
        this.$emit('snsGetUserEmail', this.userData);
      }
    },
  },
  computed: {
    emailCheck() {
      return this.format.emailcheck(this.userData.userEmail);
    },
  },
};
</script>

<style lang="scss" scoped>
  #getEmail{
    width: 100%;
    height: 100%;
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
    background-color: #fff;
    position: relative;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #f1f1f1;
    border-radius: 6px;
    .top-info {
      transition: opacity 0.3s ease;
      width: 100%;
      height: 48px;
      background: #fff;
      .contents {
        transition: opacity 0.3s ease;
        width: 100%;
        height: 100%;
        position: relative;
        text-align: center;
        align-items: center;
        justify-content: flex-start;
        display: flex;
        .x-btn {
          width: 40px;
          height: 40px;
          background-size: 21px;
          background-position: center center;
          cursor: pointer;
          margin-right: 4px;
          background-repeat: no-repeat;
          background-image: url(~assets/img/common/chevron-left.svg);
          background-color: transparent;
        }
      }
    }
    .getEmailWrapper {
      padding: 0 20px 0 20px;
      .title {
        font-size: 20px;
        font-weight: bold;
        line-height: 29px;
      }

      .title-sub {
        font-size: 12px;
        color: $brown-grey;
      }

      .inputWrapper {
        width: 100%;
        margin-top: 30px;

        .input-title {
          font-size: 14px;
          color: $brown-grey;
        }
        .email {
          transition: 0.3s ease;
          width: 100%;
          height: 36px;
          border: none;
          border-bottom: 2px solid #e9e9e9;
        }

        input:focus {
          border-bottom: 2px solid $soft-blue;
        }
        .err{
          height: 24px;
          color: #d0021b;
          font-size: 16px;
          margin-top: 10px;
        }
        span.err{
          margin-top: 10px;
        }
      }
      .subscribe {
        line-height: 24px;
        font-size: 16px;
        span{
          padding-left: 5px;
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
      }
    }
    .signUp-btn{
      width: 100%;
      height: 53px;
      cursor: default;
      transition: 0.3s ease;
      margin-top: 30px;
      border-radius: 2px;
      color: $brown-grey;
      background-color: #f8f8f8;
    }
    .signUp-btn.active{
      font-weight: bold;
      color: #fff;
      cursor: pointer;
      background-color: $cornflower;
    }
  }
</style>
