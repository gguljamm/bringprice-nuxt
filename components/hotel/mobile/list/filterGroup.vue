<template>
  <div id="filterGroup">
    <div class="top-control">
      <div
        class="contents">
        <div @click="$emit('close')" class="top-control-close"></div>
        <span class="title">{{ filterPop === 'facilities' ? '편의시설' : '숙소유형' }}</span>
        <div
          @click="back"
          class="x-btn top-control-right"
        ></div>
      </div>
    </div>
    <div class="filter-list">
      <ul class="check-list">
        <li
          v-for="(val, index) in checkList"
          :key="index"
        >
          <div>
            <label :for="'filterGroup' + index" class="check">
              <div>
                <div class="check-wrap">
                  <div>
                    <span class="title">{{ val.info }}</span>
                  </div>
                  <div class="box">
                    <input type="checkbox" :id="'filterGroup' + index" class="inputCheck" @click="pushFilter(filterPop === 'facilities' ? 'filter.facilities' : 'filter.categories', val.code)" v-model="val.type">
                    <div class="checked" :style="val.type ? { backgroundColor: '#537aff' } : { backgroundColor: '#fff' }" :class="val.type ? 'active' : ''">
                      <transition name="fade">
                        <div class="checkSvg" v-if="val.type">
                          <svg viewBox="0 0 52 52" fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-width="3" focusable="false" aria-hidden="true" role="presentation" stroke-linecap="round" stroke-linejoin="round"
                               style="height: 1em; width: 1em; display: block; overflow: visible;">
                            <path d="m19.1 25.2 4.7 6.2 12.1-11.2"></path>
                          </svg>
                        </div>
                      </transition>
                    </div>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </li>
      </ul>
    </div>
    <div class="submit-wrap">
      <transition name="fade">
        <div v-if="localData.length > 0" class="submit-info">
          <span class="info">{{filterPop === 'facilities' ? '편의시설' : '숙소유형'}} 필터가 선택 되었습니다.</span>
          <span @click="reset" class="reset">재설정</span>
        </div>
      </transition>
      <button
        @click="submit"
        class="submit-btn">확인</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['filterPop', 'filterData'],
  data() {
    const facilities = [
      { code: 'INTERNET', info: '인터넷' },
      { code: 'BREAKFAST', info: '조식' },
      { code: 'PARKING', info: '주차' },
      { code: 'FRONT_DESK_24', info: '24시간 프론트' },
      { code: 'BARBECUE', info: '바베큐 시설' },
      { code: 'POOL', info: '수영장' },
      { code: 'ELEVATOR', info: '엘리베이터' },
      { code: 'LAUNDRY', info: '세탁 시설' },
      { code: 'KITCHEN', info: '주방' },
      { code: 'RESTAURANT', info: '레스토랑' },
      { code: 'ROOM_SERVICE', info: '룸서비스' },
      { code: 'SMOKE', info: '흡연 시설' },
      { code: 'TERRACE', info: '테라스' },
      { code: 'LIBRARY', info: '도서관' },
      { code: 'FITNESS_CENTER', info: '피트니스 센터' },
      { code: 'SPA_SAUNA', info: '스파 및 사우나' },
      { code: 'CASINO', info: '카지노' },
    ];
    const categories = this.$store.state.hotelListObj.categories.map((val) => {
      const newVal = { info: val.kor, code: val.eng };
      return newVal;
    });
    const checkList = this.filterPop === 'facilities' ? facilities : categories;
    const localData = [...this.filterData];
    checkList.forEach((val) => {
      const temp = val;
      temp.type = localData.indexOf(val.code) >= 0;
    });
    return {
      checkList,
      localData,
    };
  },
  methods: {
    reset() {
      this.checkList.forEach((val) => {
        const temp = val;
        temp.type = false;
      });
      this.localData = [];
    },
    back() {
      this.$emit('back');
    },
    pushFilter(key, value) {
      if (this.localData.indexOf(value) >= 0) {
        this.localData.splice(this.localData.indexOf(value), 1);
      } else {
        this.localData.push(value);
      }
    },
    submit() {
      this.$emit('saveGroupFilter', this.filterPop === 'facilities' ? 'filter.facilities' : 'filter.categories', this.localData);
    },
  },
};
</script>

<style lang="scss" scoped>
  #filterGroup{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 6;
    .top-control-close{
      width: 40px;
      height: 40px;
      background-size: 21px;
      background-position: center center;
      background-repeat: no-repeat;
      background-image: url(~assets/img/common/chevron-left.svg);
      top: 5px;
      left: 2px;
      position: absolute;
    }
    .filter-list{
      position: absolute;
      top: 50px;
      left: 0;
      right: 0;
      bottom: 77px;
      overflow-y: scroll;
      .check-list{
        padding: 0 10px 16px 10px;
      }

      padding-bottom: 30px;
    }
    .submit-wrap{
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 12px 10px;
      background-color: #fff;
      box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
      z-index: 6;
      transition: .3s ease;
      .submit-info{
        transition: .3s ease;
        padding-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 12px;
        .info{
          font-size: 10px;
          color: #000;
        }
        .reset{
          font-size: 10px;
          color: $dodger-blue;
        }
      }
      .submit-btn{
        width: 100%;
        height: 54px;
        background-color: $dodger-blue;
        color: #fff;
        font-weight: bold;
        border-radius: 2px;
        font-size: 16px;
        text-align: center;
        line-height: 54px;
      }
    }
  }
</style>
