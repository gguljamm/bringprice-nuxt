<template>
  <div
    id="addUserDataWrapper">
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
      <p class="title">환영합니다</p>
      <p class="title-sub">추가정보를 입력하시면 맞춤형정보를 추천해드립니다.</p>
      <div
        class="inputWrapper">
        <p class="input-title">생년월일</p>
        <div class="row-wrap posr">
          <div class="row birthday year">
            <input type="text" v-model="year">
            <span>년</span>
          </div>
          <div class="row birthday month">
            <input type="text" v-model="month">
            <span>월</span>
          </div>
          <div class="row birthday day">
            <input type="text" v-model="day">
            <span>일</span>
          </div>
          <p class="err" v-text="errMsg"/>
        </div>
        <p class="input-title gender">성별</p>
        <div class="row-wrap">
          <button
            @click="putGender('m')"
            :class="userData.gender === 'm' ? 'active' : ''"
            class="man">남자</button>
          <button
            @click="putGender('f')"
            :class="userData.gender === 'f' ? 'active' : ''"
            class="woman">여자</button>
        </div>
        <p class="input-title">선호 항공사</p>
        <div class="row-wrap preper">
          <div class="preper-row">
          <button
            @click="addPreperAirline(0)"
            :class="userData.PreperAirline && userData.PreperAirline.length === 0 ? 'active' : ''"
          >선호 항공사 없음</button>
            <button
              @click="addPreperAirline(1)"
              :class="userData.PreperAirline && userData.PreperAirline.indexOf(1) != -1 ? 'active' : ''"
            >저가 항공사</button>
          </div>
          <div class="preper-row">
            <button
              @click="addPreperAirline(2)"
              :class="userData.PreperAirline && userData.PreperAirline.indexOf(2) != -1 ? 'active' : ''"
            >스카이팀</button>
            <button
              @click="addPreperAirline(3)"
              :class="userData.PreperAirline && userData.PreperAirline.indexOf(3) != -1 ? 'active' : ''"
            >스타 얼라이언스</button>
          </div>
          <div class="preper-row">
            <button
              @click="addPreperAirline(4)"
              :class="userData.PreperAirline && userData.PreperAirline.indexOf(4) != -1 ? 'active' : ''"
            >원월드</button>
          </div>
        </div>
        <p class="input-title">투어 스타일</p>
        <div class="row-wrap preper">
          <div class="preper-row">
            <button
              @click="addTourStyle(1)"
              :class="userData.TourStyle && userData.TourStyle.indexOf(1) != -1 ? 'active' : ''"
            >배낭여행</button>
            <button
              @click="addTourStyle(2)"
              :class="userData.TourStyle && userData.TourStyle.indexOf(2) != -1 ? 'active' : ''"
            >럭셔리</button>
          </div>
          <div class="preper-row">
            <button
              @click="addTourStyle(3)"
              :class="userData.TourStyle && userData.TourStyle.indexOf(3) != -1 ? 'active' : ''"
            >쇼핑</button>
            <button
              @click="addTourStyle(4)"
              :class="userData.TourStyle && userData.TourStyle.indexOf(4) != -1 ? 'active' : ''"
            >유아동반</button>
          </div>
          <div class="preper-row">
            <button
              @click="addTourStyle(5)"
              :class="userData.TourStyle && userData.TourStyle.indexOf(5) != -1 ? 'active' : ''"
            >반려동물</button>
          </div>
        </div>
      </div>
    </div>
    <div class="btn-wrap">
      <button
        @click="yearValidate || userData.gender ? submit() : ''"
        class="signUp-btn"
        :class="yearValidate || userData.gender ? 'active' : ''"
      >
        <div
          v-if="signupLoading"
          @click.stop
          class="loaderWrapper btn-loading">
          <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
      등록하기
      </button>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['signupLoading', 'userInfo'],
  data() {
    return {
      year: '',
      month: '',
      day: '',
      userData: {
        gender: '',
        PreperAirline: [],
        TourStyle: [],
      },
      errMsg: '',
      format: Format,
    };
  },
  methods: {
    putGender(val) {
      if (val !== this.userData.gender) {
        this.userData.gender = val;
      } else {
        this.userData.gender = '';
      }
    },
    back() {
      this.$emit('close-addUserData');
    },
    submit() {
      const submitData = {};
      if (!this.yearValidate && (this.year || this.month || this.day)) {
        this.errMsg = '생년월일이 유효하지 않습니다.';
      } else {
        this.errMsg = '';
        submitData.Birthday = `${this.year}-${this.format.zeros(this.month)}-${this.format.zeros(this.day)}`;
      }
      if (this.userData.gender) {
        submitData.Gender = this.userData.gender;
      }
      if (this.userData.PreperAirline && this.userData.PreperAirline.length > 0) {
        submitData.PreferenceAirline = this.userData.PreperAirline;
      } else {
        submitData.PreferenceAirline = [];
      }
      if (this.userData.TourStyle && this.userData.TourStyle.length > 0) {
        submitData.TourStyle = this.userData.TourStyle;
      } else {
        submitData.TourStyle = [];
      }
      // console.log(submitData);
      if (!this.errMsg) {
        this.$emit('bp-add-userInfo', submitData);
      }
    },
    addTourStyle(val) {
      if (this.userData.TourStyle.includes(val)) {
        this.userData.TourStyle.splice(this.userData.TourStyle.indexOf(val), 1);
      } else {
        this.userData.TourStyle.push(val);
      }
    },
    addPreperAirline(val) {
      if (val === 0) {
        this.userData.PreperAirline = [];
        return;
      }
      if (this.userData.PreperAirline.includes(val)) {
        this.userData.PreperAirline.splice(this.userData.PreperAirline.indexOf(val), 1);
      } else {
        this.userData.PreperAirline.push(val);
      }
    },
  },
  computed: {
    yearValidate() {
      const month = parseInt(this.month, 10);
      const day = parseInt(this.day, 10);
      return !this.format.ymdErrCheck(this.year, month < 10 ? `0${month}` : month, day < 10 ? `0${day}` : day);
    },
  },
  mounted() {
    window.document.body.style.overflowY = 'hidden';
    window.document.documentElement.style.overflowY = 'hidden';
  },
  beforeDestroy() {
    window.document.body.style.overflowY = '';
    window.document.documentElement.style.overflowY = '';
  },
};
</script>


<style lang="scss" scoped>
  #addUserDataWrapper{
    width: 100%;
    height: 100vh;
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
    background-color: #fff;
    position: relative;
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
      justify-content: flex-end;
      display: flex;
    }
    .top-info .contents .x-btn{
      width: 40px;
      height: 40px;
      background-size: 21px;
      background-position: center center;
      margin-right: 4px;
      cursor: pointer;
      background-repeat: no-repeat;
      background-image: url(~assets/img/common/x_black.svg);
      background-color: transparent;
    }
    .lds-ellipsis{
      height: 100%;
      div{
        top: 22px;
        background: #fff;
      }
    }
    .dn{
      display: none;
    }
    .posr{
      position: relative;
    }
    .signUp{
      padding: 30px 20px 100px 20px;
      width: 100%;
      position: absolute;
      overflow-y: auto;
      top: 46px;
      left: 0;
      bottom: 78px;
      right: 0;
      -webkit-overflow-scrolling: touch;
    }
    .title{
      font-size: 20px;
      font-weight: bold;
      line-height: 30px;
    }
    .title-sub{
      font-size: 12px;
      color: $brown-grey;
    }
    button{
      transition: 0.3s ease;
      width: 203px;
      background-color: #f8f8f8;
      color: $brown-grey;
      height: 53px;
    }
    button.active{
      background-color: $cornflower;
      color: #fff;
    }
    .inputWrapper{
      width: 100%;
      margin-top: 30px;
      .row-wrap.preper ~ .input-title {
        margin-top: 14px;
      }
      .input-title.gender{
        margin-top: 30px;
      }
      .input-title{
        font-size: 14px;
        color: $brown-grey;
        margin-top: 20px;
        margin-bottom: 10px;
        &:first-of-type{
          margin-top: 0;
          margin-bottom: 0;
        }
      }
      .row-wrap{
        width: 100%;
        display: flex;
        .err{
          position: absolute;
          left: 0;
          bottom: -70%;
          height: 24px;
          color: #d0021b;
          font-size: 16px;
          margin-top: 10px;
        }
        button.woman{
          margin-left: 9px;
        }
        input[type=text]{
          transition: 0.3s ease;
          width: 100%;
          height: 36px;
          border: none;
          border-bottom: 2px solid #e9e9e9;
          text-align: center;
        }
        input[type=text]:focus{
          border-bottom: 2px solid $soft-blue;
        }
        .row{
          position: relative;
          padding-left: 9px;
          &:first-of-type{
            padding-left: 0;
          }
        }
        .birthday{
          input{
            padding-right: 16px;
            padding-left: 16px;
          }
          span {
            position: absolute;
            right: 0;
            bottom: 6px;
            color: $brown-grey;
            font-size: 16px;
          }
        }
        .year{
          width: 50%;
        }
        .month, .day{
          width: 25%;
        }
        button{
          width: 50%;
          font-size: 14px;
        }
      }
      .row-wrap.preper{
        display: block;
        .preper-row{
          width: 100%;
          display: flex;
          button {
            width: 50%;
            margin-left: 9px;
            margin-top: 6px;
            &:nth-child(odd) {
              margin-left: 0;
            }
          }
          &:last-child{
            padding-right: 9px;
          }
        }
      }
    }
    .btn-wrap{
      width: 100%;
      z-index: 13;
      background-color: #fff;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 12px 20px;
      box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
      .signUp-btn{
        width: 100%;
        position: relative;
        font-size: 16px;
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
      }
    }
  }
</style>
