<template>
  <div
    class="userInfoFixedWrapper">
    <userInfo
      :localCookiesData="localData"
      :email="localData.email"
      @inputEmail="inputEmail"
    />
    <addUserInfo
      :ymd="localData.dob"
      :genderLocal="localData.gender"
      :tourStyleLocal="localData.tourStyle"
      :preperAirlineLocal="localData.preperAirline"
      @gender="gender"
      @preperAirline="preperAirline"
      @tourStyle="tourStyle"
    />
    <userNotice
      :subscribedLocal="localData.subscribed"
      @change-subscribed="changeSubscribed"
    />
    <button
      @click="submit"
      :class="isChangedUserData ? 'active' : ''"
      class="submit-btn">적용</button>
  </div>
</template>


<script>
import userInfo from './userInfo.vue';
import addUserInfo from './addUserInfo.vue';
import userNotice from './userNotice.vue';
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['localCookiesData', 'cookiesData', 'load'],
  components: {
    userInfo,
    addUserInfo,
    userNotice,
  },
  data() {
    return {
      format: Format,
      localData: this.localCookiesData,
    };
  },
  computed: {
    isChangedUserData() {
      return this.localData.email !== this.cookiesData.email ||
        new Set(this.localData.preperAirline).size !== new Set(this.cookiesData.preference_airline).size ||
        this.localData.preperAirline.some(item => this.cookiesData.preference_airline.every(item2 => item !== item2)) ||
        new Set(this.localData.tourStyle).size !== new Set(this.cookiesData.tour_style).size ||
        this.localData.tourStyle.some(item => this.cookiesData.tour_style.every(item2 => item !== item2)) ||
        this.localData.subscribed !== this.cookiesData.subscribed ||
        this.localData.dob.year !== this.cookiesData.dob.year || this.localData.dob.month !== this.cookiesData.dob.month || this.localData.dob.day !== this.cookiesData.dob.day ||
        this.localData.gender !== this.cookiesData.gender;
    },
  },
  methods: {
    inputEmail(e) {
      this.localData.email = e.target.value;
      // console.log(this.localData.email);
    },
    gender(val) {
      if (val !== this.localData.gender) {
        this.localData.gender = val;
      } else {
        this.localData.gender = '';
      }
    },
    tourStyle(val) {
      if (this.localData.tourStyle.includes(val)) {
        this.localData.tourStyle.splice(this.localData.tourStyle.indexOf(val), 1);
      } else {
        this.localData.tourStyle.push(val);
      }
    },
    preperAirline(val) {
      if (val === 0) {
        this.localData.preperAirline = [];
      } else if (this.localData.preperAirline.includes(val)) {
        this.localData.preperAirline.splice(this.localData.preperAirline.indexOf(val), 1);
      } else {
        this.localData.preperAirline.push(val);
      }
    },
    deleteMailing(id) {
      this.$emit('deleteMailing', id);
    },
    changePage(val) {
      this.$emit('changePage', val);
    },
    changeSubscribed() {
      this.localData.subscribed = this.localData.subscribed === 1 ? 0 : 1;
    },
    initLocalData() {
      const localData = {
        name: this.cookiesData.name,
        email: this.cookiesData.email,
        dob: {
          year: this.cookiesData.dob.year,
          month: this.cookiesData.dob.month,
          day: this.cookiesData.dob.day,
        },
        preperAirline: [...this.cookiesData.preference_airline],
        tourStyle: [...this.cookiesData.tour_style],
        gender: this.cookiesData.gender,
        subscribed: this.cookiesData.subscribed,
      };
      this.localData = localData;
    },
    submit() {
      const errMsg = {
        ymdErr: false,
        email: false,
      };
      if (this.$cookies.get('bpUser').data.social_login && (!this.localData.email || this.localData.email === undefined || this.localData.email === 'undefined')) {
        errMsg.email = !this.format.emailcheck(this.localData.email);
      }
      errMsg.ymdErr = this.localData.dob.year && this.format.zeros(this.localData.dob.month) && this.format.zeros(this.localData.dob.day) ? this.format.ymdErrCheck(this.localData.dob.year, this.format.zeros(this.localData.dob.month), this.format.zeros(this.localData.dob.day)) : false;
      if (this.isChangedUserData) {
        if (errMsg.email || errMsg.ymdErr) {
          this.$router.push({ query: { popFlag: 'alert', alertId: errMsg.ymdErr ? 4 : 14 } });
        } else {
          const submitData = {
            Birthday: this.localData.dob.year && this.format.zeros(this.localData.dob.month) && this.format.zeros(this.localData.dob.day) ? `${this.localData.dob.year}-${this.format.zeros(this.localData.dob.month)}-${this.format.zeros(this.localData.dob.day)}` : '',
            Gender: this.localData.gender,
            Subscribed: this.localData.subscribed,
            TourStyle: this.localData.tourStyle,
            PreferenceAirline: this.localData.preperAirline,
          };
          if (this.localData.email) {
            submitData.Email = this.localData.email;
          }
          this.$router.push({ query: { popFlag: 'alert', alertId: 6 } });
          this.$emit('submitUserInfo', submitData);
        }
      }
    },
  },
  mounted() {
    this.initLocalData();
  },
};
</script>

<style lang="scss" scoped>
  .submit-btn{
    width: 209px;
    height: 53px;
    float: right;
    margin-top: 30px;
    border-radius: 2px;
    color: #9b9b9b;
    transition: .3s;
    background-color: #f2f2f2;
    cursor: default;
    &.active{
      cursor: pointer;
      color: #fff;
      background-color: $cornflower;
    }
  }
</style>

