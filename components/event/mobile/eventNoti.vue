<template>
  <div id="eventNoti">
    <div class="title">
      <p>이벤트</p>
      <p>알림</p>
    </div>
    <div class="eventList">
      <ul>
        <li
          v-for="(x, index) in reverseList(eventList)"
          :key="index"
        >
          <span>{{ x.title }}</span>
          <p>{{ x.date }}</p>
          <button v-if="!isApp && x.link" @click="openLink(x.link)">다운받기</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    if (process.client) {
      const isApp = window.navigator.userAgent.indexOf('bpIos') >= 0 || window.navigator.userAgent.indexOf('bpAos') >= 0;
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      return {
        eventList: [
          {
            title: '브링프라이스 리뉴얼 오픈!',
            date: '2019-02-11',
          },
          {
            title: '안드로이드 앱 출시',
            date: '2019-02-11',
            isIos: window.navigator.userAgent.indexOf('bpIos') >= 0,
            link: isIos ? '' : 'market://details?id=com.bpAos.bp.bp',
          },
          {
            title: 'IOS 앱 출시',
            date: '2019-03-11',
            link: isIos ? 'itms-apps://itunes.apple.com/kr/app/apple-store/id1454195897' : '',
          },
        ],
        isApp,
      };
    }
    return {
      eventList: [],
    };
  },
  methods: {
    openLink(link) {
      window.open(link);
    },
    reverseList(list) {
      const newList = [];
      for (let x = list.length - 1; x >= 0; x -= 1) {
        if (!list[x].isIos) {
          newList.push(list[x]);
        }
      }
      return newList;
    },
  },
};
</script>

<style lang="scss" scoped>
  #eventNoti{
    width: 100%;
    min-height: 100vh;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 45px;
    padding-bottom: 20px;
    background-color: #fff;
    .title{
      font-size: 20px;
      font-weight: bold;
      line-height: 29px;
    }
    .eventList{
      width: 100%;
      li{
        position: relative;
        width: 100%;
        height: 48px;
        border-bottom: 1px solid #f8f8f8;
        margin-top: 10px;
        &:first-of-type{
          margin-top: 30px;
        }
        span{
          font-size: 14px;
          line-height: 20px;
        }
        p{
          font-size: 12px;
          line-height: 18px;
          color: $brown-grey;
        }
        button{
          border: 1px solid #e1e1e1;
          background-color: #FFF;
          font-size: 12px;
          position: absolute;
          right: 10px;
          top: 3px;
          height: 30px;
          padding: 0 20px;
        }
      }
    }
  }
</style>
