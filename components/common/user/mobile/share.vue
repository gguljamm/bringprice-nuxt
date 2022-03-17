<template>
  <transition name="slide-bottom-fade" mode="out-in">
    <div
      v-if="$route.query.share"
      @click.stop
      class="share">
      <ul>
        <li
          v-clipboard:copy="urlPath"
          v-clipboard:success="onCopy"
        >URL 복사하기</li>
        <li
          @click="facebookShare"
        >페이스북으로 공유하기</li>
        <li
          @click="kakaoShare"
        >카카오톡으로 공유하기</li>
        <li
          @click="lineShare"
        >라인으로 공유하기</li>
        <li
          @click="$router.back()"
          class="cancel">취소</li>
      </ul>
    </div>
  </transition>
</template>

<script>
export default {
  props: ['shareFlag', 'hotelDetailData'],
  data() {
    return {
      urlPath: '',
      isApp: window.navigator.userAgent.indexOf('bpAos') >= 0 || window.navigator.userAgent.indexOf('bpIos') >= 0,
    };
  },
  methods: {
    onCopy() {
      this.$router.push({ query: { popFlag: 'alert', alertId: 13 } });
    },
    kakaoShare() {
      if (!this.isApp) {
        /* eslint-disable */
        const isTest = process.env.isDev;
        const url = `${location.pathname}?utm_source=share&utm_medium=kakao`;
        const baseUrl = isTest ? 'http://localhost:3000' : 'https://bringprice.com';
        let description = '';
        if (this.shareFlag === 'hotel') {
          const hotelDes = JSON.parse(this.$route.params.destination);
          description = `#${hotelDes.name || hotelDes.region || hotelDes || hotelDes.country_name} #${this.hotelDetailData.korName} #${this.hotelDetailData.category}`;
          // console.log(hotelDes);
        }
        const hotelImg = this.hotelDetailData && this.hotelDetailData.images ? this.hotelDetailData.images[0] : 'https://cdn.bringprice.com/shareThumbnailImage/default.png';
        // console.log(hotelImg);
        Kakao.Link.sendDefault({
          objectType: 'feed',
          content: {
            title: '브링프라이스',
            description: description,
            imageUrl: hotelImg,
            link: {
              mobileWebUrl: baseUrl + url,
              webUrl: baseUrl + url,
            },
          },
          buttons: [
            {
              title: '웹으로 보기',
              link: {
                mobileWebUrl: baseUrl + url,
                webUrl: baseUrl + url,
              },
            },
          ],
          success: function() {
            ga('send', {hitType : 'event', eventCategory : 'share', eventAction : 'kakaoTalk'});
          },
        })
        /* eslint-enable */
      } else {
        let description = '';
        if (this.shareFlag === 'hotel') {
          const hotelDes = JSON.parse(this.$route.params.destination);
          description = `#${hotelDes.name || hotelDes.region || hotelDes || hotelDes.country_name} #${this.hotelDetailData.korName} #${this.hotelDetailData.category}`;
        }
        const hotelImg = this.hotelDetailData && this.hotelDetailData.images ? this.hotelDetailData.images[0] : 'https://cdn.bringprice.com/shareThumbnailImage/default.png';
        KakaoCordovaSDK.sendLinkFeed({ // eslint-disable-line
          objectType: 'feed',
          content: {
            title: '브링프라이스',
            desc: description,
            imageURL: hotelImg,
            link: {
              mobileWebUrl: `https://bringprice.com${this.$route.path}?utm_source=share&utm_medium=kakao`,
            },
          },
        }, () => {
          ga('send', {hitType : 'event', eventCategory : 'share', eventAction : 'kakaoTalk'}); // eslint-disable-line
        }, () => {});
      }
    },
    facebookShare() {
      /* eslint-disable */
      // console.log(FB);
      if (!this.isApp) {
        const url = window.location.href + '?utm_source=share&utm_medium=facebook';
        FB.ui(
          {
            method: 'share',
            href: url,
          },
          (response) => {
            if (response && !response.error_message) {
              FB.api('/me', { fields: 'name, email' },
                function(response) {
                  ga('send', {hitType : 'event', eventCategory : 'share', eventAction : 'facebook', eventLabel : response.email});
                }
              );
            }
          }
        );
      } else {
        let description = '';
        if (this.shareFlag === 'hotel') {
          const hotelDes = JSON.parse(this.$route.params.destination);
          description = `#${hotelDes.name || hotelDes.region || hotelDes || hotelDes.country_name} #${this.hotelDetailData.korName} #${this.hotelDetailData.category}`;
        }
        const hotelImg = this.hotelDetailData && this.hotelDetailData.images ? this.hotelDetailData.images[0] : 'https://cdn.bringprice.com/shareThumbnailImage/default.png';
        facebookConnectPlugin.showDialog({
          method: 'share',
          href: `https://bringprice.com${this.$route.path}?utm_source=share&utm_medium=facebook`,
          caption: description,
          picture: hotelImg,
        }, () => {
          ga('send', {hitType : 'event', eventCategory : 'share', eventAction : 'facebook'});
        }, (e) => {});
      }
      /* eslint-enable */
    },
    lineShare() {
      const allUrl = `https://bringprice.com${encodeURIComponent(location.pathname)}`;
      window.open(`https://social-plugins.line.me/lineit/share?url=${allUrl}`, '_blank');
      /* eslint-disable */
      ga('send', {hitType : 'event', eventCategory : 'share', eventAction : 'line'});
      /* eslint-enable */
    },
  },
  mounted() {
    this.$nextTick(() => {
      (function (d, s, id) {
        let js = '';
        const fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s);
        js.id = id;
        const appId = '???';
        js.src = `//connect.facebook.net/ko_KR/sdk.js#xfbml=1&version=v2.10&appId=${appId}`;
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    });
  },
};
</script>

<style lang="scss" scoped>
  .share{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    ul li{
      width: 100%;
      height: 45px;
      background-color: #fff;
      text-align: center;
      line-height: 45px;
      font-size: 16px;
      border-bottom: 1px solid #e9e9e9;
      cursor: pointer;
      &:last-child{
        border-bottom: 0;
        color: $brown-grey;
      }
    }
  }
</style>
