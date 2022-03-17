<template>
  <div class="calendarWrap">
    <div v-if="type === 'datePop'" class="selectDate">
      <div>
        <div>
          <div class="start"
               @click="deptFlag=true, deptDate = ''"
               :class="deptFlag && !deptDate?'focused':''"
          ><div class="calIcon"></div><button
          >{{ selectDateButton(deptDate) || (serviceFlag === 'flight' ? '출발일' : '체크인') }}</button><div class="arrowIconWrap" :style="deptDate ? { opacity: 1 } : { opacity: 0.5 }"><div
            @click.stop="changeDate('yesterday', 'dept')"
            class="left" :style="deptDate.replace(/-/g, '') === todayStr.toString() ? { opacity: 0.5 } : { opacity: 1 }"></div><div
            @click.stop="changeDate('tomorrow', 'dept')"
            class="right"></div></div></div>
          <div class="end"
               @click="deptFlag=false, retnDate = ''"
               :class="!deptFlag && !retnDate ?'focused':''"
          ><button
          >{{ selectDateButton(retnDate) || (serviceFlag === 'flight' ? '도착일' : '체크아웃') }}</button><div class="arrowIconWrap" :style="retnDate ? { opacity: 1 } : { opacity: 0.5 }"><div
            @click.stop="changeDate('yesterday', 'retn')"
            class="left" :style="retnDate.replace(/-/g, '') === todayStr.toString() ? { opacity: 0.5 } : { opacity: 1 }"></div><div
            @click.stop="changeDate('tomorrow', 'retn')"
            class="right"></div></div></div>
        </div>
      </div>
    </div>
    <div class="popHeader">
      <div v-if="serviceFlag === 'flight'">{{ deptFlag ? '언제 떠나시나요?' : '언제 돌아오시나요?' }}</div>
      <div v-else>{{ deptFlag ? '언제 체크인 하시나요?' : '언제 체크아웃 하시나요?' }}</div>
      <button
        @click="$router.back()"
      ></button>
    </div>
    <div
      v-if="type !== 'datePop'"
      class="searchWrap">
      <div>
        <div class="searchContainer">
          <h3>
            <div>
              <span :class="title.length > 1 ? 'placeNames' : 'placeName'" v-for="(val, index) in title" :key="index">{{val}}</span>
            </div>
          </h3>
          <h3>얼마동안 다녀오시나요?</h3>
          <div class="searchInputBox">
            <div>
              <div>
                <div class="start"
                  :class="deptFlag?'focused':''"
                ><button
                  @click="deptFlag=true"
                >{{ deptDate || (serviceFlag==='flight' ? '출발일' : '체크인') }}</button></div>
                <div class="end"
                  :class="!deptFlag?'focused':''"
                ><button
                  @click="deptFlag=false"
                >{{ retnDate || (serviceFlag==='flight' ? '도착일' : '체크아웃') }}</button></div>
              </div>
              <button
                @click="submit"
              >검색</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="resetBtn" @click="resetDate()" v-if="deptDate && type !== 'datePop'">재설정</button>
    <div v-if="type === 'datePop'" class="slideBtn left" :class="moveCnt <= 6 && moveCnt > 0 ? '' : 'default'" @click="moveCnt <= 6 && moveCnt > 0 ? calMove('left', moveCnt -= 1) : ''"></div>
    <div v-if="type === 'datePop'" class="slideBtn right" :class="moveCnt < 5 && moveCnt >= 0 ? '' : 'default'" @click="moveCnt < 5 && moveCnt >= 0 ? calMove('right', moveCnt += 1) : ''"></div>
    <div class="calContent" ref="calScrollArea">
      <div id="calBody"><div v-for="(list, calIndex) in calInfo" :key="list.month">
          <div class="cwmonth_block" :class="list.month">
            {{ type !== 'datePop' ? `${list.month.substr(0,4)}년 ${list.month.substr(4,6)}월` : `${list.month.substr(4,6) * 1}월` }}
          </div>
          <div
            v-if="type === 'datePop'"
            class="cwmonth_week">
            <div
              v-for="(val, index) in week"
              :key="index"
              class="day_of_week">{{ val }}</div>
          </div>
          <div class="cwmonth_week"
               v-for="(week, index) in list.week"
               :key="`${list.month}_${index}`"
          >
            <a href="javascript:"
               v-for="(day, index) in week"
               :class="chkDate(`${list.month}${format.zeros(day.date)}`, day.date)"
               :key="`${list.month}${index}`"
               :style="deptDate && retnDate && (deptDate === `${list.month.substr(0,4)}-${list.month.substr(4,6)}-${format.zeros(day.date)}`) || (retnDate === `${list.month.substr(0,4)}-${list.month.substr(4,6)}-${format.zeros(day.date)}`) ? { backgroundColor: '#e9eeff' } : {}"
               @click="day.date !== 0 ? clickDate(`${list.month}${format.zeros(day.date)}`, calIndex) : ''"
            >
              <div>
                <div class="date_val">
                  <span>{{ day.date === 0 ? '&nbsp;' : day.date }}</span>
                  <span v-if="deptDate === `${list.month.substr(0,4)}-${list.month.substr(4,6)}-${format.zeros(day.date)}`">{{serviceFlag==='flight' ? '출발일' : '체크인'}}</span>
                  <span v-if="retnDate === `${list.month.substr(0,4)}-${list.month.substr(4,6)}-${format.zeros(day.date)}`">{{serviceFlag==='flight' ? '도착일' : '체크아웃'}}</span>
                </div>
              </div>
              <div></div>
              <div
                v-if="!deptDate && !retnDate && deptFlag"
                :class="{
                  lowPrice: list.lowPriceDept >= day.deptPrice,
                  highPrice: list.highPriceDept < day.deptPrice
                }"
              >{{ day.deptPrice ? `${fixedPrice(day.deptPrice)}만원` : '' }}</div>
              <div
                v-else-if="deptDate && !retnDate && !deptFlag"
                :class="{
                  lowPrice: list.lowPriceRetn >= day.retnPrice,
                  highPrice: list.highPriceRetn < day.retnPrice
                }"
              >{{ day.retnPrice ? `${fixedPrice(day.retnPrice + deptPrice)}만원` : '' }}</div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="calBottomSearch" v-show="serviceFlag === 'flight' && wishCities.length === 1 && wishCities[0] !== 'every' && type !== 'datePop'">
      <div>
        <div>
          <div>최저</div>
          <div>최고</div>
        </div>
        <div v-if="deptPrice && retnPrice"><span>왕복 항공권</span> {{ format.numberFormat(deptPrice + retnPrice) }}원</div>
        <div v-else><span>{{ deptFlag && !retnPrice ? '편도 항공권 가격' : '왕복 항공권 가격' }}</span></div>
      </div>
    </div>
    <div class="calBottom" v-if="type === 'datePop'" :style="type === 'datePop' ? { display: 'block' } : {}" :class="(deptPrice && retnPrice) ? 'price' : ''">
      <div>
        <button class="resetBtn" @click="resetDate()" v-if="deptDate">재설정</button>
        <div>
          <div>
            <div v-if="serviceFlag === 'flight' && wishCities.length === 1 && wishCities[0] !== 'every' && deptPrice && retnPrice">
              <div>
                <p>최저가<span class="price">{{ format.priceFormat(fixedPrice(deptPrice + retnPrice, true)) }}</span>원</p>
                <p>{{ `${format.getBetweenDay(this.deptDate, this.retnDate)}박 ${format.getBetweenDay(this.deptDate, this.retnDate) + 1}일 ` }}왕복 가격</p>
              </div>
            </div>
          </div>
          <button
            @click="submit"
            :class="retnDate ? 'active' : ''"
          >{{ $route.path.indexOf('/hotelList/') === 0 ? '호텔 검색' : '적용' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line
import Api from '~/utils/api'; // eslint-disable-line

export default {
  props: ['type'],
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
      params: this.$route.params,
      format: Format,
      moveVal: 0,
      moveCnt: 0,
      arrMoveVal: [],
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
      scrollDate: '',
      wishCities: arrWish,
      startCity,
      timeout: '',
    };
  },
  computed: {
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
    getTitleFlightCitys() {
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
    calMove(dir, cnt) {
      const calBody = window.document.querySelector('#calBody');
      let moveCnt = cnt;
      moveCnt = moveCnt <= 0 ? 0 : moveCnt;
      if (dir === 'right') {
        this.moveVal = `-${this.arrMoveVal[moveCnt]}`;
      } else if (dir === 'left') {
        this.moveVal = `-${this.arrMoveVal[moveCnt]}`;
      }
      calBody.style.transform = `translateX(${this.moveVal}px)`;
      this.calSlide();
    },
    selectDateButton(date) {
      let returnVal = '';
      if (date) {
        returnVal = `${parseInt(date.split('-')[1], 10)}월 ${parseInt(date.split('-')[2], 10)}일`;
      }
      return returnVal;
    },
    changeDate(type, dir) {
      let thisDate = '';
      let date;
      if (dir === 'dept' && this.deptDate) {
        date = new Date(`${parseInt(this.deptDate.split('-')[0], 10)}-${parseInt(this.deptDate.split('-')[1], 10)}-${parseInt(this.deptDate.split('-')[2], 10)}`);
      } else if (dir === 'retn' && this.retnDate) {
        date = new Date(`${parseInt(this.retnDate.split('-')[0], 10)}-${parseInt(this.retnDate.split('-')[1], 10)}-${parseInt(this.retnDate.split('-')[2], 10)}`);
      } else {
        return;
      }
      let val = new Date(date);
      if (type === 'tomorrow') {
        val = new Date(val.setDate(date.getDate() + 1));
      } else {
        val = new Date(val.setDate(date.getDate() - 1));
      }
      thisDate = `${val.getFullYear()}-${this.format.zeros(val.getMonth() + 1)}-${this.format.zeros(val.getDate())}`;
      if (dir === 'dept' && this.retnDate <= thisDate) {
        this.retnDate = '';
      } else if (dir === 'retn' && this.deptDate >= thisDate) {
        this.deptDate = '';
      }
      const numDept = thisDate.replace(/-/g, '');
      if (parseInt(this.calInfo[this.calInfo.length - 1].month, 10) < parseInt(`${val.getFullYear()}${this.format.zeros(val.getMonth() + 1)}`, 10)) {
        return;
      }
      if (parseInt(numDept, 10) < this.todayStr) {
        return;
      }
      setTimeout(() => {
        if (dir === 'dept') {
          this.deptDate = thisDate;
        } else {
          this.retnDate = thisDate;
        }
      }, 100);
    },
    resetDate() {
      this.resetCalPriceFlag();
      this.calScroll();
      this.deptDate = '';
      this.retnDate = '';
      this.deptFlag = true;
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
        if (this.type !== 'datePop') {
          this.getMonthPrice(index, date);
        } else {
          this.calSlide();
        }
      } else if (parseInt(date, 10) < parseInt(this.deptDate.replace(/-/g, ''), 10)) {
        this.deptDate = strDate;
        if (this.type !== 'datePop') {
          this.getMonthPrice(index, date);
        } else {
          this.calSlide();
        }
      } else if (parseInt(date, 10) !== parseInt(this.deptDate.replace(/-/g, ''), 10)) {
        this.retnDate = strDate;
        this.deptFlag = true;
        if (this.type !== 'datePop') {
          this.getMonthPrice(index, date);
        } else {
          this.calSlide();
        }
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
          if (this.calInfo[index].retnPriceFlag === true && this.calInfo[index].retnPriceFlag === 'pending') {
            return;
          }
          this.calInfo[index].retnPriceFlag = 'pending';
        } else {
          if (this.calInfo[index].deptPriceFlag === true && this.calInfo[index].deptPriceFlag === 'pending') {
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
    fixedPrice(price, total) {
      let returnVal = '';
      if (!total) {
        returnVal = (price / 10000).toFixed(1);
      } else {
        returnVal = price;
      }
      return returnVal;
    },
    calSlide() {
      this.timeout = setTimeout(() => {
        if (this.moveCnt >= 0 && this.moveCnt < 6) {
          this.getMonthPrice(this.moveCnt * 2, this.calInfo[this.moveCnt * 2].month);
          this.getMonthPrice((this.moveCnt * 2) + 1, this.calInfo[(this.moveCnt * 2) + 1].month);
        }
        this.timeout = '';
      }, 100);
    },
    calScroll() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        if (this.deptDate && this.retnDate) {
          return;
        }
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
    this.$nextTick(() => {
      this.getTitleFlightCitys();
      const month = document.getElementsByClassName('cwmonth_block');
      if (this.type === 'datePop') {
        for (let x = 0; x < month.length / 2; x += 1) {
          this.arrMoveVal.push(678 * x);
        }
      } else {
        for (let x = 0; x < month.length; x += 1) {
          this.arrOffsetTop.push(month[x].offsetTop);
        }
      }
      if (this.deptDate) {
        let index = 0;
        for (let x = 0; x < this.calInfo.length; x += 1) {
          if (this.calInfo[x].month === this.deptDate.replace(/-/g, '').substr(0, 6)) {
            index = x;
            break;
          }
        }
        this.moveCnt = Number.isInteger(index / 2) ? (index / 2) : Math.floor(index / 2);
        const dir = this.todayStr < this.retnDate || this.todayStr < this.deptDate ? 'left' : 'right';
        this.calMove(dir, this.moveCnt);
        if (this.$refs.calScrollArea) {
          this.$refs.calScrollArea.scrollTop = this.arrOffsetTop[index];
        }
      }
    });
    if (this.serviceFlag === 'flight' && this.wishCities.length === 1 && !this.type) {
      window.document.body.style.overflowY = 'hidden';
      window.document.documentElement.style.overflowY = 'hidden';
      this.$refs.calScrollArea.addEventListener('scroll', this.calScroll);
    }
    this.getMonthPrice(0, this.calInfo[0].month);
    this.getMonthPrice(1, this.calInfo[1].month);
  },
  beforeDestroy() {
    window.document.body.style.overflowY = '';
    window.document.documentElement.style.overflowY = '';
    this.$refs.calScrollArea.removeEventListener('scroll', this.calScroll);
  },
};
</script>

<style lang="scss" scoped>
  .calendarWrap {
    .slideBtn{
      position: absolute;
      border-radius: 50px;
      width: 42px;
      height: 42px;
      background-color: #fff;
      background-size: 22px;
      background-position: center center;
      cursor: pointer;
      background-repeat: no-repeat;
      background-image: url(~assets/img/common/chevron-left.svg);
      z-index: 5;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
      border: solid 1px #cdcdcd;
      top: 150px;
      transition: .3s ease;
      &.left{
        left: -21px;
      }
      &.right{
        right: -21px;
        transform: rotateY(180deg);
      }
      &.default{
        display: none;
      }
    }
    .searchWrap{
      height: 226px;
      width: 100%;
      background-color: #FFF;
      > div{
        margin: 0 auto;
        background-color: #FFF;
        position: fixed;
        z-index: 10;
        left: 0;
        top: 60px;
        height: 226px;
        width: 100%;
        border-bottom: 1px solid #e9e9e9;
      }
      .bpWebPop &{
        display: none;
      }
    }
    .popHeader{
      position: absolute;
      width: 800px;
      background-color: #FFF;
      display: none;
      top: 0;
      left: 0;
      padding: 50px 166px 20px;
      z-index: 6;
      height: 93px;
      .bpWebPop &{
        display: block;
      }
      > div{
        font-weight: bold;
        font-size: 20px;
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
    }
    .searchContainer{
      padding: 48px 60px 31px;
      background-color: #FFF;
      max-width: 1230px;
      min-width: 800px;
      margin: 0 auto;
      h3{
        font-size: 20px;
        font-weight: bold;
        line-height: 30px;
        > div {
          min-height: 30px;
          span.placeName:after {
            content: ',';
          }
          span.placeNames:after {
            content: ' · ';
          }

          span.placeNames:last-of-type:after {
            content: '';
          }
        }
      }
      h3:nth-child(2) {
        padding-bottom: 10px;
      }
    }
    .searchInputBox {
      > div:first-of-type {
        display: flex;
        height: 76px;
        position: relative;
        > *{
          flex: 0 0 auto;
        }
        > div{
          flex: 884px;
          height: 76px;
          .start, .end{
            width: 40%;
            padding-right: 8px;
            float: left;
            transition: .3s ease;
            > button{
              transition: .3s ease;
              border-radius: 2px;
              width: 100%;
              background-color: #FFF;
              height: 76px;
              border: 1px solid #e9e9e9;
              font-size: 20px;
              color: #9b9b9b;
              text-align: left;
              padding-left: 20px;
            }
            &.focused {
              width: 60%;
              > button{
                color: #4a4a4a;
                box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
              }
            }
          }
        }
        > button {
          width: 226px;
          height: 76px;
          border-radius: 2px;
          background-color: $cornflower;
          font-size: 20px;
          font-weight: bold;
          color: #FFF;
        }
      }
    }
    .calContent{
      background-color: #f8f8f8;
      margin: 0 auto;
      position: absolute;
      top: 286px;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-y: auto;
      overflow-x: hidden;
      .bpWebPop &{
        width: 800px;
        top: 93px;
        left: 0;
        bottom: 0;
        border: 1px solid #f1f1f1;
        > div{
          padding-bottom: 76px;
        }
      }
      > div{
        transition: all .3s ease;
        background-color: #FFF;
        width: 800px;
        margin: 0 auto;
        padding: 40px 166px;
        > div{
          background-color: #fff;
          padding-bottom: 40px;
        }
      }
      .cwmonth_block{
        color: #4a4a4a;
        font-size: 14px;
        font-weight: 400;
        padding: 16px;
      }
      .cwmonth_week{
        display: flex;
        padding: 0 16px;
        > a, .day_of_week{
          -webkit-box-flex: 1 0 42px;
          -webkit-flex: 1 0 42px;
          flex: 1 0 44px;
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
            height: 100%;
            line-height: 42px;
            font-size: 14px;
            font-weight: normal;
            > .date_val {
              display: flex;
              flex-flow: column;
              justify-content: center;
              align-items: center;
            }
          }
          > div:nth-of-type(3) {
            position: absolute;
            bottom: -6px;
            font-size: 12px;
            color: #9b9b9b;
            width: 100%;
            z-index: 1;
            text-align: center;
            &.lowPrice{
              color: #20d578;
            }
            &.highPrice{
              color: #d0021b;
            }
          }
          &.start > div:nth-of-type(3) {
            display: none;
          }
          &.start, &.end {
            > div:first-of-type{
              display: flex;
              align-self: center;
              justify-content: center;
            }
            .date_val {
              line-height: 15px;
              span:nth-child(2) {
                font-size: 8px;
              }
            }
          }
        }
        .day_of_week{
          color: #868686;
          font-size: 12px;
          cursor: default;
          height: 14px;
          line-height: 14px;
          margin: 0;
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
      /*.cwmonth_week > a.start, .cwmonth_week > a.end{*/
        /*background-color: #e9eeff;*/
      /*}*/
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
        border-radius: 50px;
        background-color: $dodger-blue;
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
        background-color: #e9eeff;
      }
      .cwmonth_week > a.range > div:first-child,
      .cwmonth_week > a.start > div:first-child,
      .cwmonth_week > a.end > div:first-child{
        color: #fff;
        position: relative;
        z-index: 2;
      }
      .cwmonth_week > a.range > div:first-child{
        color: #000;
      }
      .cwmonth_week > a.range.holiday > div:first-child{
        color: #d0021b;
      }
    }
    .calBottom{
      height: 55px;
      width: 100%;
      z-index: 5;
      > div{
        width: 100%;
        padding-right: 14px;
        background-color: #FFF;
        height: 100%;
        border-top: 1px solid #e9e9e9;
        padding-top: 10px;
        padding-bottom: 10px;
        > div {
          display: flex;
          float: right;
          > div {
            > div {
              text-align: right;
              padding: 4px 0;
              margin-right: 10px;
              > div:first-of-type {
                line-height: 15px;
                font-size: 12px;
                color: #868686;
                .price{
                  font-size: 16px;
                  color: #000;
                }
                & > p:nth-of-type(2) {
                  font-size: 10px;
                  color: #cdcdcd;
                }
              }
            }
          }

          > button {
            font-size: 12px;
            width: 118px;
            height: 35px;
            border-radius: 4px;
            line-height: 15px;
            background-color: #cdcdcd;
            color: #FFF;
            &.active {
              background-color: $dodger-blue;
            }
          }
        }
      }
    }
    .resetBtn{
      position: absolute;
      font-size: 14px;
      right: 50%;
      margin-right: -400px;
      padding: 0 20px;
      height: 35px;
      z-index: 1;
    }
    .calBottomSearch{
      position: absolute;
      bottom: 0;
      width: 100%;
      left: 0;
      z-index: 5;
      .bpWebPop &{
        display: none;
      }
      > div{
        position: relative;
        width: 740px;
        margin: 0 auto;
        text-align: center;
        background-color: #FFF;
        line-height: 40px;
        height: 40px;
        border-top: 1px solid #e9e9e9;
        font-size: 14px;
        > div:first-of-type{
          display: inline-block;
          font-size: 0;
          > div {
            display: inline-block;
            font-size: 14px;
            &:nth-of-type(1):before{
              content: '';
              width: 10px;
              height: 10px;
              background-color: #4ac7a1;
              border-radius: 5px;
              display: inline-block;
              margin-right: 10px;
            }
            &:nth-of-type(2):before{
              content: '';
              width: 10px;
              height: 10px;
              background-color: #ff5452;
              border-radius: 5px;
              display: inline-block;
              margin-left: 90px;
              margin-right: 10px;
            }
          }
        }
        > div:last-of-type{
          position: absolute;
          right: 0;
          top: 0;
          line-height: 40px;
          font-weight: bold;
          > span{
            color: #9b9b9b;
            font-weight: normal;
          }
        }
      }
    }
  }
</style>
