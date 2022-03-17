<template>
  <div id="addUserWrapper">
    <div
      class="addUserInfo">
      <p class="title">추가 개인정보</p>
      <div
        class="inputWrapper">
        <p class="input-title">생년월일</p>
        <div class="row-wrap posr">
          <div class="row birthday year">
            <input type="text" v-model="ymd.year">
            <span>년</span>
          </div>
          <div class="row birthday month">
            <input type="text" v-model="ymd.month">
            <span>월</span>
          </div>
          <div class="row birthday day">
            <input type="text" v-model="ymd.day">
            <span>일</span>
          </div>
        </div>
        <p class="input-title gender">성별</p>
        <div class="row-wrap">
          <button
            @click="$emit('gender', 'm')"
            :class="genderLocal === 'm' ? 'active' : ''"
            class="man">남자</button>
          <button
            @click="$emit('gender', 'f')"
            :class="genderLocal === 'f' ? 'active' : ''"
            class="woman">여자</button>
        </div>
        <p class="input-title">선호 항공사</p>
        <div class="row-wrap preper">
          <button
            @click="$emit('preperAirline', 0)"
            :class="preperAirlineLocal && preperAirlineLocal.length === 0 ? 'active' : ''"
          >선호 항공사 없음</button>
          <button
            @click="$emit('preperAirline', 1)"
            :class="preperAirlineLocal && preperAirlineLocal.indexOf(1) != -1 ? 'active' : ''"
          >저가 항공사</button>
          <button
            @click="$emit('preperAirline', 2)"
            :class="preperAirlineLocal && preperAirlineLocal.indexOf(2) != -1 ? 'active' : ''"
          >스카이팀</button>
          <button
            @click="$emit('preperAirline', 3)"
            :class="preperAirlineLocal && preperAirlineLocal.indexOf(3) != -1 ? 'active' : ''"
          >스타 얼라이언스</button>
          <button
            @click="$emit('preperAirline', 4)"
            :class="preperAirlineLocal && preperAirlineLocal.indexOf(4) != -1 ? 'active' : ''"
          >원월드</button>
        </div>
        <p class="input-title">투어 스타일</p>
        <div class="row-wrap style">
          <button
            @click="$emit('tourStyle', 1)"
            :class="tourStyleLocal && tourStyleLocal.indexOf(1) != -1 ? 'active' : ''"
          >배낭여행</button>
          <button
            @click="$emit('tourStyle', 2)"
            :class="tourStyleLocal && tourStyleLocal.indexOf(2) != -1 ? 'active' : ''"
          >럭셔리</button>
          <button
            @click="$emit('tourStyle', 3)"
            :class="tourStyleLocal && tourStyleLocal.indexOf(3) != -1 ? 'active' : ''"
          >쇼핑</button>
          <button
            @click="$emit('tourStyle', 4)"
            :class="tourStyleLocal && tourStyleLocal.indexOf(4) != -1 ? 'active' : ''"
          >유아동반</button>
          <button
            @click="$emit('tourStyle', 5)"
            :class="tourStyleLocal && tourStyleLocal.indexOf(5) != -1 ? 'active' : ''"
          >반려동물</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['cookiesData', 'tourStyleLocal', 'preperAirlineLocal', 'genderLocal', 'ymd'],
};
</script>

<style lang="scss" scoped>
  #addUserWrapper{
    margin-top: 30px;
    .title{
      font-weight: bold;
      font-size: 20px;
    }
    .input-title{
      font-size: 14px;
      color: $brown-grey;
      margin-top: 20px;
    }
    button{
      transition: 0.3s ease;
      width: 164px;
      background-color: #f8f8f8;
      color: $brown-grey;
      height: 53px;
      font-size: 14px;
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
          background-color: transparent;
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
          width: 203px;
        }
        .month, .day{
          width: 97px;
        }
      }
      .preper > button, .style > button{
        margin-left: 8px;
        &:first-of-type{
          margin-left: 0;
        }
      }
    }
  }
</style>
