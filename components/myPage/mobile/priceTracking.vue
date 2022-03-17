<template>
  <div id="userNoticeWrapper">
    <p class="title">가격추적 이메일</p>
    <p class="sub-title">선택하신 목적지의 항공편의 변동된 가격 (성인1명, 이코노미석 기준)을 일주일마다 메일로 보내드립니다.</p>
    <div class="userNotice">
      <div
        v-for="(list, x) in trakingList"
        :key="x"
        class="trackingList flex-btw">
        <div class="listInfo">
          <p class="destination">{{ list.start_city }}, <span
            v-for="(wishCities, y) in list.wish_cities"
            :key="y"
          >{{ wishCities }}, </span></p>
          <p class="date-range">{{ list.start_date }} - {{ list.return_date }}</p>
        </div>
        <div
          @click="deleteMailing(list.id, x)"
          class="x-btn"/>
      </div>
    </div>
  </div>
</template>

<script>
import user from '~/utils/user'; // eslint-disable-line

export default {
  data() {
    return {
      trakingList: [],
    };
  },
  methods: {
    deleteMailing(id, x) {
      if (window.confirm('삭제하시겠습니까?')) {
        user.deleteMailing(id).then(() => {
          this.trakingList.splice(this.trakingList[x], 1);
        }).catch((err) => {
          console.log(err);
        });
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      user.getMailingInfo(this.$cookies.get('bpUser').data.userID).then((resp) => {
        this.trakingList = JSON.parse(JSON.stringify(resp)).data.Result;
      }).catch((err) => {
        console.log(err);
      });
    });
  },
};
</script>


<style lang="scss" scoped>
  #userNoticeWrapper{
    padding-bottom: 80px;
    .title{
      font-weight: bold;
      font-size: 20px;
      line-height: 29px;
    }
    .sub-title{
      font-size: 12px;
      line-height: 18px;
      color: $brown-grey;
    }
    .flex-btw{
      display: flex;
      justify-content: space-between;
    }
    .userNotice{
      margin-top: 10px;
      .trackingList{
        margin-top: 20px;
        &:first-of-type{
          margin-top: 0;
        }
        border-bottom: 1px solid #e9e9e9;
        padding-bottom: 10px;
        .listInfo{
          width: 100%;
          .destination{
            font-size: 14px;
            line-height: 24px;
          }
          .date-range{
            font-size: 12px;
            color: $brown-grey;
          }
        }
        .x-btn{
          width: 24px;
          height: 24px;
          background-size: 24px 24px;
          background-repeat: no-repeat;
          background-image: url(~assets/img/common/x_black.svg);
          cursor: pointer;
        }
      }
    }
  }
</style>
