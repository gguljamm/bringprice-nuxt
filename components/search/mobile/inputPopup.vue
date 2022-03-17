<template>
  <div class="popInput">
    <div>
      <div class="title">
        <button @click="historyBack()"></button>
      </div>
      <div class="inputBox" :class="focused ? 'focused' : ''">
        <input
          ref="searchInput"
          @focus="focused = true"
          @focusout="focused = false"
          @keyup="keyup()"
          :placeholder="$route.params.param2 === 'start' ? '출발지 입력' : ''"
        >
      </div>
    </div>
    <ul v-if="!autoCompleteLoading">
      <li v-for="place in placeList" :key="place.id" @click="submit(place)">
        <div>{{ place.PlaceName }}{{ place.RegionId ? ` ${place.RegionId}` : '' }},</div>
        <div>{{ place.CountryName }}</div>
      </li>
    </ul>
    <div class="loaderWrapper" v-else>
      <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>
  </div>
</template>

<script>
import Api from '~/utils/api'; // eslint-disable-line

export default {
  data() {
    return {
      focused: false,
      placeList: [],
      autoCompleteLoading: false,
      delay: 300,
      timeout: '',
      timesActive: false,
    };
  },
  methods: {
    historyBack() {
      history.back();
    },
    keyup() {
      const query = this.$refs.searchInput.value;
      if (query.length === 0) {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.autoCompleteLoading = false;
        this.timesActive = false;
        this.placeList = [];
        return;
      }
      this.timesActive = true;
      this.autoCompleteLoading = true;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        Api.flightAutoComplete(query).then((resp) => {
          this.autoCompleteLoading = false;
          this.placeList = resp.data.Result.Places;
        }).catch((error) => {
          if (error.message !== 'cancel') {
            this.placeList = [];
            this.autoCompleteLoading = false;
          }
        });
      }, this.delay);
    },
    submit(place) {
      this.$emit('change-value', place, this.$route.params.param2);
      window.history.back();
    },
  },
  beforeDestroy() {
    window.document.body.style.overflowY = '';
    window.document.documentElement.style.overflowY = '';
  },
  mounted() {
    this.$refs.searchInput.focus();
    window.document.body.style.overflowY = 'hidden';
    window.document.documentElement.style.overflowY = 'hidden';
  },
};
</script>

<style lang="scss" scoped>
  .popInput{
    position: fixed;
    top: 0;
    top: constant(safe-area-inset-top);
    top: env(safe-area-inset-top);
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 11;
    background-color: #f8f8f8;
    > div:first-of-type{
      background-color: #FFF;
      .title{
        height: 40px;
        position: relative;
        > button{
          left: 4px;
          top: 0;
          width: 40px;
          height: 40px;
          background-image: url(~assets/img/common/x_black.svg);
          background-size: 21px;
          background-position: center 14px;
          background-repeat: no-repeat;
          border: 0;
          background-color: transparent;
          position: absolute;
          cursor: pointer;
        }
      }
      .inputBox{
        position: relative;
        padding: 10px 20px 14px;
        input{
          width: 100%;
          height: 40px;
          border-radius: 4px;
          background-color: #f8f8f8;
          border: 0;
          padding: 0 16px;
          padding-left: 40px;
          &:focus{
            padding-left: 16px;
          }
        }
        &:before{
          content: '';
          width: 20px;
          height: 20px;
          background-image: url(~assets/img/common/search_grey.svg);
          position: absolute;
          background-size: 20px 20px;
          top: 20px;
          left: 34px;
          pointer-events: none;
          transition: opacity .2s ease;
        }
        &.focused:before{
          display: none;
        }
        &.focused{
          padding-right: 58px;
        }
        &.focused:after{
          content: '취소';
          color: #4a4a4a;
          line-height: 40px;
          position: absolute;
          right: 20px;
        }
      }
    }
    > ul{
      position: absolute;
      top: 104px;
      bottom: 0;
      left: 0;
      right: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding-top: 10px;
      > li{
        cursor: pointer;
        border-bottom: 1px solid #e5e5e5;
        padding: 10px 20px;
      }
      li > div:first-child{
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      li > div:nth-of-type(2){
        color: $brown-grey;
        font-size: 12px;
        margin-top: 2px;
      }
    }
  }
</style>
