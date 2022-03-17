<template>
  <section id="bpWrapper" v-if="$store.state.isMobile" class="mobile">
    <Place v-if="!$route.params.step"
      :serviceFlag="serviceFlag"
      :teaserData="teaserData"
      @change-service-flag="changeServiceFlag"
    ></Place>
    <transition name="slide-fade" mode="out-in">
      <flight-place
        v-if="$route.params.step === 'place'"
      ></flight-place>
    </transition>
    <transition name="slide-fade" mode="out-in">
      <Calendar
        v-if="$route.params.step === 'date'"
      ></Calendar>
    </transition>
  </section>
  <section id="bpWrapper" class="pc" v-else>
    <web-home
      :teaserData="teaserData"
    ></web-home>
  </section>
</template>

<script>
import Place from './../components/search/mobile/home.vue';
import Calendar from './../components/search/mobile/calendar.vue';
import FlightPlace from './../components/search/mobile/flightPlace.vue';
import WebHome from './../components/search/web/home.vue';
import Format from '~/utils/format'; // eslint-disable-line

export default {
  components: {
    Place,
    Calendar,
    FlightPlace,
    WebHome,
  },
  data() {
    const imageUrl = 'https://cdn.bringprice.com/image/teaser';
    const date = new Date();
    const min = '2020-08-15T23:59:59';
    const middle = '2020-09-30T23:59:59';
    const max = '2020-10-04T23:59:59';
    let deptDate = '';
    let retnDate = '';
    if (date <= new Date(min)) {
      deptDate = '2020-08-15';
      retnDate = '2020-08-17';
    } else if (date <= new Date(middle) && date <= new Date(max)) {
      deptDate = '2020-09-30';
      retnDate = '2020-10-04';
    } else {
      date.setDate(date.getDate() + 30);
      deptDate = `${date.getFullYear()}-${Format.zeros(date.getMonth() + 1, 2)}-${Format.zeros(date.getDate(), 2)}`;
      date.setDate(date.getDate() + 5);
      retnDate = `${date.getFullYear()}-${Format.zeros(date.getMonth() + 1, 2)}-${Format.zeros(date.getDate(), 2)}`;
    }
    return {
      serviceFlag: '',
      teaserData: [
        {
          type: 'flight',
          title: '항공권 인기 도시',
          description: '최근 가장 인기 있는 항공권 BEST4',
          list: [
            {
              imgUrl: `${imageUrl}/flight/제주.jpg`,
              title: '제주',
              content: '에메랄드빛 바다와 야자수가 그리울 때',
              url: `/flightList/SELA/${deptDate}/${retnDate}/CJU/Economy/1/0/0/list`,
            },
            {
              imgUrl: `${imageUrl}/flight/부산.jpg`,
              title: '부산',
              content: '해리단길, 걸어보셨나요?',
              url: `/flightList/SELA/${deptDate}/${retnDate}/PUS/Economy/1/0/0/list`,
            },
            {
              imgUrl: `${imageUrl}/flight/여수.jpg`,
              title: '여수',
              content: '남도 바닷길 여행의 시작, 여수에서',
              url: `/flightList/SELA/${deptDate}/${retnDate}/RSU/Economy/1/0/0/list`,
            },
            {
              imgUrl: `${imageUrl}/flight/울산.jpg`,
              title: '울산',
              content: '태화강으로 나랑 은하수 보러 가지 않을래?',
              url: `/flightList/SELA/${deptDate}/${retnDate}/USN/Economy/1/0/0/list`,
            },
          ],
        },
        {
          type: 'hotel',
          title: '호텔 인기 도시',
          description: '최근 호텔이 인기 있는 도시 BEST4',
          list: [
            {
              imgUrl: `${imageUrl}/hotel/제주.jpg`,
              title: '제주',
              content: '돌담으로 둘러싸인 고즈넉한 제주의 숙소',
              url: `/hotelList/{"city_name":"","country":"kr","country_name":"대한민국","latitude":33.387451,"longitude":126.537916,"name":"제주도","region":"제주도","type":"region"}/${deptDate}/${retnDate}/2/null/1/list`,
            },
            {
              imgUrl: `${imageUrl}/hotel/부산.jpg`,
              title: '부산',
              content: '해운대, 광안리, 다대포 등 뷰맛집 부산 호텔',
              url: `/hotelList/{"city_name":"부산","country":"kr","country_name":"대한민국","latitude":35.1614218444137,"longitude":129.06236208295,"name":"부산","region":"","type":"city"}/${deptDate}/${retnDate}/2/null/1/list`,
            },
            {
              imgUrl: `${imageUrl}/hotel/여수.jpg`,
              title: '여수',
              content: '낭만도시 여수의 낭만이 넘치는 숙소',
              url: `/hotelList/{"city_name":"여수","country":"kr","country_name":"대한민국","latitude":34.7603988647461,"longitude":127.662231445312,"name":"여수","region":"전라남도","type":"city"}/${deptDate}/${retnDate}/2/null/1/list`,
            },
            {
              imgUrl: `${imageUrl}/hotel/서울.jpg`,
              title: '서울',
              content: '한옥 게스트하우스부터 5성급 호텔까지',
              url: `/hotelList/{"city_name":"서울","country":"kr","country_name":"대한민국","latitude":37.5618924566236,"longitude":126.981161006443,"name":"서울","region":"","type":"city"}/${deptDate}/${retnDate}/2/null/1/list`,
            },
          ],
        },
      ],
    };
  },
  created() {
    if (this.$route.fullPath.indexOf('/') >= 0 && this.$route.fullPath.split('/')[1] !== '' &&
      (this.$route.fullPath.split('/')[1] &&
        this.$route.fullPath.split('/')[1] !== 'place' &&
        this.$route.fullPath.split('/')[1] !== 'date')) {
      this.$router.replace({
        path: '/',
        query: this.$route.query,
        hash: this.$route.hash,
      });
    }
  },
  methods: {
    changeServiceFlag(flag) {
      this.serviceFlag = flag;
    },
    submit(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style lang="scss" scoped>
  #bpWrapper.mobile{
    overflow-x: hidden;
    height: 100%;
  }
  #bpWrapper.pc{
  }
</style>
