<template>
  <div class="calendarWrapper">
    <div class="calendarHead">
      <div class="title">
        <button @click="historyBack()"></button>
        <transition name="fade">
          <button @click="resetDate()" v-if="deptDate">재설정</button>
        </transition>
      </div>
      <div class="headInfo">
        <div
          class="cityInfo"
        >
          <div v-if="!deptDate" ref="cityInfo">
            <span :class="title.length > 1 ? 'placeNames' : 'placeName'" v-for="(val, index) in title" :key="index">{{val}}</span>
          </div>
        </div>
        <div v-if="!deptDate" class="default">
          얼마동안 머무르실 건가요?
        </div>
        <div v-else class="dates">
          <div>
            <div>{{ serviceFlag === 'flight' ? '출발일' : '체크인' }}</div>
            <div>{{ format.dateFormat(deptDate) }}</div>
          </div>
          <div>
            <div>{{ serviceFlag === 'flight' ? '도착일' : '체크아웃' }}</div>
            <div>{{ retnDate ? format.dateFormat(retnDate) : '' }}</div>
          </div>
        </div>
      </div>
      <div class="dayOfWeek">
        <ul>
          <li v-for="day in week" :key="day">
            {{ day }}
          </li>
        </ul>
      </div>
    </div>
    <div class="calendarContent" ref="calScrollArea"
      :class="{
        done: deptDate && retnDate,
        active: deptDate
      }"
      :style="{
        top: `${cityInfoHeight}px`,
      }"
      @touchend="touchEnd"
      @touchmove="touchMove"
    >
      <div v-for="(list, calIndex) in calInfo" :key="list.month">
        <div class="cwmonth_block" :class="list.month">
          {{ `${list.month.substr(0,4)}년 ${list.month.substr(4,6)}월` }}
        </div>
        <div class="cwmonth_week"
             v-for="(week, index) in list.week"
             :key="`${list.month}_${index}`"
        >
          <a href="javascript:"
             v-for="(day, index) in week"
             :class="chkDate(`${list.month}${format.zeros(day.date)}`, day.date)"
             :key="`${list.month}${index}`"
             @click="day.date !== 0 ? clickDate(`${list.month}${format.zeros(day.date)}`, calIndex, day.price) : ''"
          >
            <div>{{ day.date === 0 ? '&nbsp;' : day.date }}</div>
            <div></div>
            <div
              v-if="!deptDate && !retnDate && deptFlag"
              :class="{
                  lowPrice: list.lowPriceDept >= day.deptPrice,
                  highPrice: list.highPriceDept < day.deptPrice
                }"
            >{{ day.deptPrice ? fixedPrice(day.deptPrice) : '' }}</div>
            <div
              v-else-if="deptDate && !retnDate && !deptFlag"
              :class="{
                  lowPrice: list.lowPriceRetn >= day.retnPrice,
                  highPrice: list.highPriceRetn < day.retnPrice
                }"
            >{{ day.retnPrice ? fixedPrice(day.retnPrice + deptPrice) : '' }}</div>
          </a>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div v-if="deptPrice && retnPrice" class="selectBtn">
        <div>
          <div>예상 왕복항공권 가격</div>
          <div><span>{{ deptPrice && retnPrice ? format.numberFormat(deptPrice + retnPrice) : '' }}</span>원</div>
        </div>
        <div>
          <button
            @click="submit()"
          >항공권 검색</button>
        </div>
      </div>
      <div class="selectBtn"
        v-else-if="deptDate && retnDate"
      >
        <button
          @click="submit()"
        >
          {{ format.getBetweenDay(deptDate, retnDate) }}박
          {{ format.getBetweenDay(deptDate, retnDate) + 1 }}일 검색
        </button>
      </div>
    </transition>
    <transition name="fade">
      <div v-show="touchOn" class="dateNavi">{{ scrollDate }}</div>
    </transition>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
import Api from '~/utils/api'; // eslint-disable-line

export default {
  data() {
    const today = new Date();
    const todayString = `${today.getFullYear()}-${Format.zeros(today.getMonth() + 1)}-${Format.zeros(today.getDate())}`;
    let arrWish = [];
    let startCity = '';
    let serviceFlag = 'flight';
    if (this.$route.params.param === 'flight' && this.$route.params.param2) {
      const temp = this.$route.params.param2.split('&');
      startCity = temp[0];
      temp.splice(0, 1);
      arrWish = temp;
    } else if (this.$route.path.indexOf('/flightList') === 0) {
      startCity = this.$route.params.startCity;
      arrWish = this.$route.params.wishCities.split('&');
    } else if (this.$route.path.indexOf('/hotelList') === 0) {
      startCity = this.$route.params.destination;
      serviceFlag = 'hotel';
    } else if (this.$route.params.param === 'hotel') {
      startCity = this.$route.params.param2;
      serviceFlag = 'hotel';
    }
    return {
      title: [],
      format: Format,
      calInfo: [],
      week: ['일', '월', '화', '수', '목', '금', '토'],
      month: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      deptDate: this.$route.params.startDate || this.$route.params.checkin || '',
      retnDate: this.$route.params.returnDate || this.$route.params.checkout || '',
      deptFlag: true,
      todayStr: parseInt(todayString.replace(/-/gi, ''), 10),
      holiday: ['20180924', '20180925', '20180926',
        '20190204', '20190205', '20190206', '20190912', '20190913', '20190914',
        '20200124', '20200125', '20200415', '20200430', '20200930', '20201001', '20201002',
        '20210211', '20210212', '20210213', '20210519', '20210920', '20210921', '20210922',
        '20220131', '20220201', '20220202', '20220122', '20220909', '20220910',
        '20230121', '20230123', '20230527', '20230928', '20230929', '20230930',
        '20240209', '20240210', '20240410', '20240515', '20240916', '20240917', '20240918',
        '20250128', '20250129', '20250130', '20251006', '20251007'],
      generalHoliday: ['0101', '0301', '0505', '0606', '0815', '1003', '1009', '1225'],
      todayString,
      serviceFlag,
      arrOffsetTop: [],
      touchOn: false,
      scrollDate: '',
      wishCities: arrWish,
      startCity,
      params: this.$route.params,
    };
  },
  computed: {
    cityInfoHeight() {
      // if (this.deptDate) {
      //   return 145;
      // } else if (this.title && this.title.constructor === Array && this.title.length > 0) {
      //   return 143;
      // }
      // return 121;
      return 121;
    },
    deptPrice() {
      if (this.deptDate) {
        const month = `${this.deptDate.substr(0, 4)}${this.deptDate.substr(5, 2)}`;
        const date = parseInt(this.deptDate.substr(8, 2), 10);
        for (let x = 0; x < this.calInfo.length; x += 1) {
          if (this.calInfo[x].month === month) {
            for (let y = 0; y < this.calInfo[x].week.length; y += 1) {
              for (let z = 0; z < this.calInfo[x].week[y].length; z += 1) {
                if (date === this.calInfo[x].week[y][z].date) {
                  return this.calInfo[x].week[y][z].deptPrice;
                }
              }
            }
          }
        }
      }
      return 0;
    },
    retnPrice() {
      if (this.retnDate) {
        const month = `${this.retnDate.substr(0, 4)}${this.retnDate.substr(5, 2)}`;
        const date = parseInt(this.retnDate.substr(8, 2), 10);
        for (let x = 0; x < this.calInfo.length; x += 1) {
          if (this.calInfo[x].month === month) {
            for (let y = 0; y < this.calInfo[x].week.length; y += 1) {
              for (let z = 0; z < this.calInfo[x].week[y].length; z += 1) {
                if (date === this.calInfo[x].week[y][z].date) {
                  return this.calInfo[x].week[y][z].retnPrice;
                }
              }
            }
          }
        }
      }
      return 0;
    },
  },
  methods: {
    getTitleFlightCities() {
      let arrWish = [];
      if (this.$route.params.param === 'flight' && this.$route.params.param2) {
        const temp = this.$route.params.param2.split('&');
        if (temp.indexOf('every') === -1) {
          temp.splice(0, 1);
          arrWish = temp;
          const arrQuery = [];
          const arrResp = [];
          for (let x = 0; x < arrWish.length; x += 1) {
            if (!this.$store.state.flightPlaceInfo[arrWish[x]]) {
              arrQuery.push(`${arrWish[x]}-sky`);
              arrResp[x] = null;
            } else {
              arrResp[x] = this.$store.state.flightPlaceInfo[arrWish[x]].PlaceName;
            }
          }
          Api.arrFindCityName(arrQuery).then((resp) => {
            for (let x = 0; x < resp.length; x += 1) {
              const obj = resp[x].data.Result;
              for (let y = 0; y < arrResp.length; y += 1) {
                if (arrResp[y] === null) {
                  arrResp[y] = obj.PlaceName;
                  break;
                }
              }
              if (!this.$store.state.flightPlaceInfo[obj.PlaceId.split('-')[0]]) {
                this.$store.commit('appendFlightPlaceInfo', obj);
              }
            }
            this.title = arrResp.length > 0 ? arrResp : arrWish;
          });
          this.title = this.params.wishCities;
        } else {
          this.title = ['everywhere'];
        }
      } else if (this.$route.params.param === 'hotel' && this.$route.params.param2) {
        this.title = [JSON.parse(this.$route.params.param2).name];
      }
    },
    touchEnd() {
      this.touchOn = false;
    },
    touchMove() {
      if (this.$refs.calScrollArea) {
        const scrollTop = this.$refs.calScrollArea.scrollTop;
        let x = 0;
        for (; x < this.arrOffsetTop.length; x += 1) {
          if (scrollTop <= this.arrOffsetTop[x]) {
            break;
          }
        }
        this.scrollDate = `${this.calInfo[x].month.substr(0, 4)}년 ${this.calInfo[x].month.substr(4, 2)}월`;
      }
      this.touchOn = true;
    },
    resetDate() {
      this.deptDate = '';
      this.retnDate = '';
      this.deptFlag = true;
      this.resetCalPriceFlag();
      this.calScroll();
    },
    historyBack() {
      history.back();
    },
    chkDate(date, day) {
      const arr = [];
      const numDept = this.deptDate.replace(/-/g, '');
      const numRetn = this.retnDate.replace(/-/g, '');
      if (day === 0) {
        arr.push('disabled');
      } else if (parseInt(date, 10) < this.todayStr || ((this.wishCities.length > 1 || (this.wishCities.length === 1 && this.wishCities[0] === 'every')) && parseInt(date, 10) <= this.todayStr)) {
        arr.push('cwdate_block');
        arr.push('disabled');
      } else {
        arr.push('cwdate_block');
        if (numDept &&
          date === numDept) {
          arr.push('start');
        } else if (numRetn &&
          date === numRetn) {
          arr.push('end');
        } else if (numDept &&
          numRetn &&
          parseInt(numDept, 10) < parseInt(date, 10) &&
          parseInt(numRetn, 10) > parseInt(date, 10)) {
          arr.push('range');
        }
      }
      if (this.generalHoliday.indexOf(date.substr(4, 8)) >= 0 || this.holiday.indexOf(date) >= 0) {
        arr.push('holiday');
      }
      return arr;
    },
    clickDate(date, index) {
      const strDate = `${date.substr(0, 4)}-${date.substr(4, 2)}-${date.substr(6, 2)}`;
      if (parseInt(date, 10) < this.todayStr || ((this.wishCities.length > 1 || (this.wishCities.length === 1 && this.wishCities[0] === 'every')) && parseInt(date, 10) <= this.todayStr)) {
        return;
      }
      if (this.deptFlag) {
        this.resetCalPriceFlag();
        this.deptDate = strDate;
        this.retnDate = '';
        this.deptFlag = false;
        this.getMonthPrice(index, date);
      } else if (parseInt(date, 10) < parseInt(this.deptDate.replace(/-/g, ''), 10)) {
        this.deptDate = strDate;
        this.getMonthPrice(index, date);
      } else if (parseInt(date, 10) !== parseInt(this.deptDate.replace(/-/g, ''), 10)) {
        this.retnDate = strDate;
        this.deptFlag = true;
        this.getMonthPrice(index, date);
      }
    },
    resetCalPriceFlag() {
      for (let x = 0; x < this.calInfo.length; x += 1) {
        this.calInfo[x].retnPriceFlag = false;
        this.calInfo[x].lowPriceRetn = 0;
        this.calInfo[x].highPriceRetn = 0;
        for (let y = 0; y < this.calInfo[x].week.length; y += 1) {
          for (let z = 0; z < this.calInfo[x].week[y].length; z += 1) {
            this.calInfo[x].week[y][z].retnPrice = '';
          }
        }
      }
    },
    submit() {
      if (!this.deptDate || !this.retnDate) {
        this.$router.push({
          query: {
            popFlag: 'alert',
            alertId: 11,
          },
        });
        return;
      }
      let path = '';
      let cookieObj;
      if (this.serviceFlag === 'flight') {
        path = `/flightList/${this.startCity}/${this.deptDate}/${this.retnDate}/`;
        path += this.wishCities.join('&');
        path += '/Economy/1/0/0/list';
        if (this.wishCities.length >= 2 && this.format.getBetweenDay(this.deptDate, this.retnDate) < this.wishCities.length * 2) {
          this.$router.push({
            query: {
              popFlag: 'alert',
              alertId: 0,
            },
          });
          return;
        } else if (this.wishCities.length >= 2 && this.format.getBetweenDay(this.deptDate, this.retnDate) >= 100) {
          this.$router.push({
            query: {
              popFlag: 'alert',
              alertId: 7,
            },
          });
          return;
        }
        if (this.wishCities[0] !== 'every') {
          if (this.$store.state.flightPlaceInfo[this.startCity]) {
            cookieObj = {
              type: 'flight',
              startCity: {
                PlaceId: this.$store.state.flightPlaceInfo[this.startCity].PlaceId,
                PlaceName: this.$store.state.flightPlaceInfo[this.startCity].PlaceName,
              },
              startDate: this.deptDate,
              returnDate: this.retnDate,
              wishCities: [],
            };
            for (let x = 0; x < this.wishCities.length; x += 1) {
              if (!this.$store.state.flightPlaceInfo[this.wishCities[x]]) {
                cookieObj = false;
                break;
              }
              cookieObj.wishCities.push({
                PlaceId: this.$store.state.flightPlaceInfo[this.wishCities[x]].PlaceId,
                PlaceName: this.$store.state.flightPlaceInfo[this.wishCities[x]].PlaceName,
              });
            }
          }
        }
      } else {
        if (this.format.getBetweenDay(this.deptDate, this.retnDate) > 15) {
          this.$router.push({
            query: {
              popFlag: 'alert',
              alertId: 7,
            },
          });
          return;
        }
        this.$store.commit('clearHotel');
        path = `/hotelList/${this.startCity}/${this.deptDate}/${this.retnDate}/2/null/1/list`;
        cookieObj = {
          type: 'hotel',
          destination: this.startCity,
          checkin: this.deptDate,
          checkout: this.retnDate,
        };
      }
      if (cookieObj) {
        const arrHistory = JSON.parse(this.$cookies.get('bpHistory')) || [];
        let isDuplication = false;
        for (let x = 0; x < arrHistory.length; x += 1) {
          if (JSON.stringify(arrHistory[x]) === JSON.stringify(cookieObj)) {
            isDuplication = true;
            break;
          }
        }
        if (!isDuplication) {
          arrHistory.push(cookieObj);
        }
        if (arrHistory.length > 6) {
          arrHistory.shift();
        }
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && window.location.hostname !== 'dev.bp.front.bringprice.com') {
          this.$cookies.set('bpHistory', JSON.stringify(arrHistory), '30d', '/', '.bringprice.com');
        } else {
          this.$cookies.set('bpHistory', JSON.stringify(arrHistory), '30d', '/');
        }
      }
      this.$router.push(path);
    },
    getMonthPrice(index, departureDate) {
      if (this.serviceFlag === 'flight' && this.wishCities.length === 1 && this.wishCities[0] !== 'every') {
        if (this.deptDate && !this.retnDate) {
          if (this.calInfo[index].retnPriceFlag === true || this.calInfo[index].retnPriceFlag === 'pending') {
            return;
          }
          this.calInfo[index].retnPriceFlag = 'pending';
        } else {
          if (this.calInfo[index].deptPriceFlag === true || this.calInfo[index].deptPriceFlag === 'pending') {
            return;
          }
          this.calInfo[index].deptPriceFlag = 'pending';
        }
      }
      const thisCalInfo = this.calInfo[index];
      function updatePrice(resp, flag) {
        if (flag === 'outbound_min_price') {
          thisCalInfo.deptPriceFlag = true;
        } else {
          thisCalInfo.retnPriceFlag = true;
        }
        const arrPrice = [];
        for (let y = 0; y < thisCalInfo.week.length; y += 1) {
          for (let z = 0; z < thisCalInfo.week[y].length; z += 1) {
            const date = thisCalInfo.week[y][z].date;
            if (date >= 1 && resp.data[date] && resp.data[date][flag]) {
              const price = resp.data[date][flag];
              if (flag === 'outbound_min_price') {
                thisCalInfo.week[y][z].deptPrice = price;
              } else {
                thisCalInfo.week[y][z].retnPrice = price;
              }
              arrPrice.push(price);
            }
          }
        }
        arrPrice.sort((a, b) => (a - b));
        let lowIndex = 0;
        let highIndex = 0;
        if (arrPrice.length >= 3) {
          lowIndex = parseInt(arrPrice.length / 3, 10);
          highIndex = parseInt((arrPrice.length / 3) * 2, 10);
        }
        if (flag === 'outbound_min_price') {
          thisCalInfo.lowPriceDept = arrPrice[lowIndex];
          thisCalInfo.highPriceDept = arrPrice[highIndex];
        } else {
          thisCalInfo.lowPriceRetn = arrPrice[lowIndex];
          thisCalInfo.highPriceRetn = arrPrice[highIndex];
        }
      }
      if (this.serviceFlag === 'flight' && this.wishCities.length === 1 && this.wishCities[0] !== 'every') {
        if (this.deptDate && !this.retnDate) {
          const dept = this.deptDate;
          const retn = `${departureDate.substr(0, 4)}-${departureDate.substr(4, 2)}`;
          if (parseInt(this.deptDate.replace(/-/g, '').substr(0, 6), 10) > parseInt(retn.replace(/-/g, ''), 10)) {
            return;
          }
          Api.getMonthPrice(this.startCity, this.wishCities[0], dept, retn).then((resp) => {
            updatePrice(resp, 'inbound_min_price');
          });
        } else {
          Api.getMonthPrice(this.startCity, this.wishCities[0], `${departureDate.substr(0, 4)}-${departureDate.substr(4, 2)}`).then((resp) => {
            updatePrice(resp, 'outbound_min_price');
          });
        }
      }
    },
    fixedPrice(price) {
      return `${(price / 10000).toFixed(1)}만원`;
    },
    calScroll() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        // if (this.deptDate && this.retnDate) {
        //   return;
        // }
        const scrollTop = this.$refs.calScrollArea.offsetHeight + this.$refs.calScrollArea.scrollTop;
        for (let x = 0; x < this.arrOffsetTop.length; x += 1) {
          if (scrollTop > this.arrOffsetTop[11]) {
            this.getMonthPrice(11, this.calInfo[11].month);
            break;
          }
          if (this.arrOffsetTop[x] < scrollTop && this.arrOffsetTop[x + 1] > scrollTop) {
            const index = x;
            this.getMonthPrice(index, this.calInfo[index].month);
            if (index !== 0) {
              this.getMonthPrice(index - 1, this.calInfo[index - 1].month);
            }
            break;
          }
        }
        this.timeout = '';
      }, 100);
    },
  },
  mounted() {
    window.document.body.style.overflowY = 'hidden';
    window.document.documentElement.style.overflowY = 'hidden';
    const today = new Date();
    today.setDate(1);
    for (let x = 1; x <= 12; x += 1) {
      const thisToday = new Date(this.todayString);
      thisToday.setDate(1);
      thisToday.setMonth(today.getMonth() + x);
      thisToday.setDate(0);
      const key = `${thisToday.getFullYear()}${this.format.zeros(thisToday.getMonth() + 1)}`;
      const lastDay = thisToday.getDate();
      const lastDay2 = thisToday.getDay();
      thisToday.setDate(1);
      const firstDay = thisToday.getDay();
      const arrDate = [];
      for (let y = 0; y < firstDay; y += 1) {
        arrDate.push({ date: 0 });
      }
      for (let y = 1; y <= lastDay; y += 1) {
        arrDate.push({ deptPrice: 0, retnPrice: 0, date: y });
      }
      for (let y = lastDay2; y < 6; y += 1) {
        arrDate.push({ date: 0 });
      }
      const arrWeek = [];
      let k = 0;
      for (let y = 0; y < arrDate.length; y += 1) {
        if (!Array.isArray(arrWeek[k])) {
          arrWeek[k] = [];
        }
        arrWeek[k].push(arrDate[y]);
        if (arrWeek[k].length >= 7) {
          k += 1;
        }
      }
      this.calInfo.push({ month: key, week: arrWeek, price: false });
    }
    this.getTitleFlightCities();
    this.$nextTick(() => {
      const month = document.getElementsByClassName('cwmonth_block');
      for (let x = 0; x < month.length; x += 1) {
        this.arrOffsetTop.push(month[x].offsetTop);
      }
      if (this.deptDate) {
        let index = 0;
        for (let x = 0; x < this.calInfo.length; x += 1) {
          if (this.calInfo[x].month === this.deptDate.replace(/-/g, '').substr(0, 6)) {
            index = x;
            break;
          }
        }
        if (this.$refs.calScrollArea) {
          this.$refs.calScrollArea.scrollTop = this.arrOffsetTop[index];
        }
      }
    });
    if (this.serviceFlag === 'flight' && this.wishCities.length === 1) {
      this.getMonthPrice(0, this.calInfo[0].month);
      this.$refs.calScrollArea.addEventListener('scroll', this.calScroll);
    }
  },
  beforeDestroy() {
    window.document.body.style.overflowY = '';
    window.document.documentElement.style.overflowY = '';
    this.$refs.calScrollArea.removeEventListener('scroll', this.calScroll);
  },
};
</script>

<style lang="scss" scoped>
  .calendarHead{
    background-color: #FFF;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 3;
    .title{
      height: 40px;
      text-align: center;
      position: relative;
      width: 100%;
      padding: 0 16px;
      button:first-of-type{
        left: 4px;
        top: 0;
        width: 40px;
        height: 40px;
        background-image: url(~assets/img/common/chevron-left.svg);
        background-size: 21px;
        background-position: center 14px;
        background-repeat: no-repeat;
        border: 0;
        background-color: transparent;
        position: absolute;
        cursor: pointer;
        .bpPop &{
          background-image: url(~assets/img/common/x_black.svg);
        }
      }
      button:nth-of-type(2){
        top: 5px;
        width: 40px;
        right: 16px;
        position: absolute;
        color: $brown-grey;
        height: 40px;
        line-height: 41px;
        font-size: 12px;
        font-weight: bold;
        border: 0;
        background-color: transparent;
      }
    }
    .headInfo{
      padding: 0 20px;
      .cityInfo{
        line-height: 22px;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-top: 10px;
        /*min-height: 32px;*/
        color: #4a4a4a;
        font-size: 16px;
        span.placeName:after {
          content: ',';
        }
        span.placeNames:after {
          content: ' · ';
        }
        span.placeNames:last-of-type:after {
          content: ',';
        }
      }
      .default{
        padding-bottom: 10px;
        color: #4a4a4a;
        line-height: 22px;
        font-weight: normal;
      }
      .dates{
        display: flex;
        padding: 12px 0 6px;
        > div{
          flex: auto;
          width: 50%;
          > div:first-of-type{
            color: #9b9b9b;
            font-size: 12px;
            line-height: 20px;
          }
          > div:nth-of-type(2){
            font-weight: bold;
            color: #4b4b4b;
          }
        }
      }
    }
    .dayOfWeek{
      width: 100%;
      ul {
        list-style: none;
        width: 100%;
        display: flex;
        padding: 0 16px;
        li {
          color: $brown-grey;
          font-size: 12px;
          flex: auto;
          text-align: center;
          line-height: 39px;
        }
      }
    }
  }
  .calendarContent{
    padding-top: 24px;
    background-color: #f8f8f8;
    position: absolute;
    top: 141px;
    bottom: 51px;
    left: 0;
    right: 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    .bpPop &{
      bottom: 0;
    }
    &.active{
      top: 135px;
    }
    &.done{
      bottom: 71px;
    }
    > div{
      padding-bottom: 8px;
    }
    .cwmonth_block{
      color: #4a4a4a;
      font-size: 14px;
      font-weight: normal;
      padding: 16px;
    }
    .cwmonth_week{
      display: flex;
      padding: 0 16px;
      > a{
        -webkit-box-flex: 1 0 auto;
        -webkit-flex: 1 0 auto;
        flex: 1 0 auto;
        height: 42px;
        width: 42px;
        margin: 6px 0;
        position: relative;
        cursor: pointer;
        max-width: inherit;
        text-align: center;
        transition: .5s ease;
        color: #000;
        text-decoration: none;
        > div:first-of-type{
          transition: background-color .5s ease;
          line-height: 42px;
          font-size: 14px;
          font-weight: normal;
        }
        > div:nth-of-type(3) {
          position: absolute;
          bottom: -6px;
          font-size: 11px;
          white-space: nowrap;
          color: #9b9b9b;
          width: 100%;
          z-index: 1;
          text-align: center;
          &.lowPrice{
            color: #02d273;
          }
        }
        &.start > div:nth-of-type(3) {
          display: none;
        }
      }
    }
    .cwmonth_week > a.disabled{
      cursor: default;
      opacity: .3;
    }
    .cwmonth_week > a.cwdate_block{
    }
    .cwmonth_week > a.cwdate_block:first-of-type{
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
    }
    .cwmonth_week > a:first-child > div:first-of-type{
      color: #d0021b;
    }
    .cwmonth_week > a.cwdate_block:last-of-type{
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }
    .cwmonth_week > a:last-of-type > div:first-of-type{
      color: #d0021b;
    }
    .cwmonth_week > a.holiday > div:first-of-type{
      color: #d0021b;
    }
    .cwmonth_week > a.start, .cwmonth_week > a.end{
      background-color: rgba(113, 103, 255, .3);
    }
    .cwmonth_week > a.start:before{
      position: absolute;
      content: '';
      background-color: #FFF;
      left: 0;
      top: 0;
      height: 100%;
      width: 50%;
      z-index: 0;
    }
    .cwmonth_week > a:last-of-type.start:after{
      position: absolute;
      content: '';
      background-color: #FFF;
      right: 0;
      top: 0;
      height: 100%;
      width: 50%;
      z-index: 0;
    }
    .cwmonth_week > a.end:after{
      position: absolute;
      content: '';
      background-color: #FFF;
      right: 0;
      top: 0;
      height: 100%;
      width: 50%;
      z-index: 0;
    }
    .cwmonth_week > a.start > div:nth-of-type(2):after,
    .cwmonth_week > a.end > div:nth-of-type(2):after{
      width: 42px;
      height: 42px;
      background-color: $cornflower;
      border-radius: 2px;
      content: '';
      line-height: 42px;
      position: absolute;
      left: 0;
      top: 0;
      margin-left: 50%;
      transform: translateX(-50%);
      z-index: 1;
    }
    .cwmonth_week > a.range{
      background-color: rgba(113, 103, 255, .3);
    }
    .cwmonth_week > a.range > div:first-child,
    .cwmonth_week > a.start > div:first-child,
    .cwmonth_week > a.end > div:first-child{
      color: #FFF;
      position: relative;
      z-index: 2;
    }
    .cwmonth_week > a.range.holiday > div:first-child{
      color: #d0021b;
    }
  }
  .selectBtn{
    height: 71px;
    box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #FFF;
    padding: 12px 20px;
    z-index: 11;
    > div {
      width: 50%;
      float: left;
      &:first-of-type{
        height: 47px;
        padding-top: 6px;
        padding-right: 12px;
        text-align: right;
        > div:first-of-type{
          font-size: 12px;
          color: #9b9b9b;
          line-height: 15px;
        }
        > div:nth-of-type(2){
          font-size: 14px;
          margin-top: 2px;
          line-height: 21px;
          > span{
            font-size: 18px;
            font-weight: bold;
          }
        }
      }
      &:nth-of-type(2){
        height: 47px;
      }
    }
    button{
      background-color: $cornflower;
      width: 100%;
      height: 47px;
      border-radius: 2px;
      color: #FFF;
      font-weight: bold;
      font-size: 16px;
      line-height: 47px;
      border: 0;
      cursor: pointer;
    }
  }
  .dateNavi{
    position: absolute;
    width: 150px;
    height: 52px;
    line-height: 52px;
    background-color: rgba(235, 235, 235, .9);
    left: 50%;
    margin-left: -75px;
    top: 50%;
    margin-top: -26px;
    text-align: center;
    pointer-events: none;
    z-index: 10;
    font-size: 18px;
    font-weight: bold;
    border-radius: 4px;
  }
</style>
