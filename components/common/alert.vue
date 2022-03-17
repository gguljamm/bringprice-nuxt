<template>
  <div class="alertWrap" @click="$router.back()">
    <div v-if="alertId === 19" class="confirm"
      @click.stop
    >
      <div v-html="text"></div>
      <div>
        <button @click="submit()">확인</button><button @click="$router.back()">취소</button>
      </div>
    </div>
    <div v-else @click.stop>
      <button @click="$router.back()"></button>
      <div v-html="text"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const alertId = this.$route.query.alertId;
    let text = '오류가 발생했습니다.';
    if (alertId === 0) {
      text = '일정이 너무 짧습니다.';
    } else if (alertId === 1) {
      text = '최대 6개 도시까지 가능합니다.';
    } else if (alertId === 2) {
      text = '중복된 도시입니다.';
    } else if (alertId === 3) {
      text = '가격알림이 설정되었습니다.';
    } else if (alertId === 4) {
      text = '생년월일이 유효하지 않습니다.';
    } else if (alertId === 5) {
      text = '성별을 선택해주세요.';
    } else if (alertId === 6) {
      text = '개인정보가 성공적으로 수정되었습니다.';
    } else if (alertId === 7) {
      text = '일정이 너무 깁니다.';
    } else if (alertId === 8) {
      text = '목적지를 입력해주세요.';
    } else if (alertId === 9) {
      text = '결과가 만료되었습니다.<br>새로고침 후 다시 시도해주세요.';
    } else if (alertId === 10) {
      text = '검색에 실패하였습니다.<br>잠시 후 다시 시도하거나,<br>검색조건을 변경해주세요.';
    } else if (alertId === 11) {
      text = '날짜를 선택해주세요.';
    } else if (alertId === 12) {
      text = '가격알림을 삭제했습니다.';
    } else if (alertId === 13) {
      text = '클립보드에 복사 되었습니다.';
    } else if (alertId === 14) {
      text = '이메일 형식이 올바르지 않습니다.';
    } else if (alertId === 15) {
      text = '이메일을 등록하시면<br>브링프라이스에서 제공하는<br>이벤트나 가격알림 메일을<br>받아볼 수 있습니다.<br>마이페이지에서 등록해주세요.';
    } else if (alertId === 16) {
      text = '가격알림 기능을 사용하시려면<br>마이페이지에서 이메일을 등록해주세요.';
    } else if (alertId === 17) {
      text = '해당 브라우저는 서비스 이용이<br>원활하지 않을 수 있습니다.<br>Chrome/Edge 등의<br>최신 브라우저에서<br>이용해주세요.';
    } else if (alertId === 18) {
      text = '출발지를 입력해주세요.';
    } else if (alertId === 19) {
      text = '로그아웃 하시겠습니까?';
    } else if (alertId === 20) {
      text = '일시적인 오류로 검색 결과를 불러올 수 없습니다. 서비스 사용에 불편함 없도록 빠르게 수정중에 있으니, 잠시 후 다시 시도해주세요.';
    }
    return {
      alertId,
      text,
    };
  },
  methods: {
    submit() {
      if (this.alertId === 19) {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && window.location.hostname !== 'dev.bp.front.bringprice.com') {
          this.$cookies.remove('bpUser', '/', '.bringprice.com');
        } else {
          this.$cookies.remove('bpUser', '/');
        }
        // this.$store.state.isLogin = false;
        this.$store.state.isLogin = false;
        if (this.$route.path.indexOf('/user') === 0) {
          this.$router.replace('/');
        } else {
          history.back();
        }
      }
    },
  },
  mounted() {
    if (typeof ga !== 'undefined') { // eslint-disable-line
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'error',
        eventAction: 'popup',
        eventLabel: this.text,
      });
    }
  },
};
</script>

<style scoped lang="scss">
  .alertWrap{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,.1);
    z-index: 100;
    > div{
      width: 300px;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      left: 50%;
      background-color: #FFF;
      box-shadow: 0 0px 20px 0px rgba(0, 0, 0, 0.1);
      border: 1px solid #f1f1f1;
      border-radius: 4px;
      padding: 80px 20px 68px;
      text-align: center;
      font-size: 18px;
      line-height: 24px;
      overflow: hidden;
      &.confirm{
        padding: 60px 20px 80px;
      }
      > button{
        right: 16px;
        top: 16px;
        width: 40px;
        height: 40px;
        background-position: center center;
        background-repeat: no-repeat;
        border: 0;
        background-color: transparent;
        position: absolute;
        cursor: pointer;
        background-image: url(~assets/img/common/x_black.svg);
      }
      > div:nth-of-type(2){
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 40px;
        > button{
          border-top: 1px solid #e1e1e1;
          width: 50%;
          font-size: 14px;
          height: 40px;
          &:nth-of-type(2){
            border-left: 1px solid #e1e1e1;
            left: 50%;
          }
        }
      }
    }
  }
</style>
