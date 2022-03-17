<template>
  <div class="facilities">
    <div
      @click="noSelect"
      class="type-check">
      <p>상관없음</p>
      <button class="flip">
        <div
          class="switch"
          :class="hotelTypeFlag ? 'on' : ''"
        >
          <span class="slider round"></span>
        </div>
      </button>
    </div>
    <ul class="check-list">
      <li
        v-for="(val, index) in checkList"
        :key="index"
      >
        <div>
          <label :for="'check' + index" class="check">
            <div>
              <div class="check-wrap">
                <input type="checkbox" :id="'check' + index" class="inputCheck" @click="setLocalData(val.code)" v-model="val.type">
                <span class="checked" :style="val.type ? { backgroundColor: '#537aff' } : { backgroundColor: '#fff' }" :class="val.type ? 'active' : ''">
                  <transition name="fade">
                    <div class="checkSvg"  v-if="val.type">
                      <svg viewBox="0 0 52 52" fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-width="3" focusable="false" aria-hidden="true" role="presentation" stroke-linecap="round" stroke-linejoin="round" style="height: 1em; width: 1em; display: block; overflow: visible;"><path d="m19.1 25.2 4.7 6.2 12.1-11.2"></path></svg>
                    </div>
                  </transition>
                </span>
                <span class="title">{{ val.info }}</span>
              </div>
            </div>
          </label>
        </div>
      </li>
    </ul>
    <div class=submitBtn>
      <transition name="fade">
        <span
          v-if="localData.length > 0"
          @click="resetLocalData"
          class="reset">초기화</span>
      </transition>
      <div class="btnWrap">
        <transition name="fade">
          <span
            v-if="hotelsCount"
            class="count">{{ hotelsCount >= 300 ? '300+' : `${hotelsCount}개` }}</span>
        </transition>
        <button
          @click="submit"
          class="submit">적용</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['filterData', 'hotelsCount'],
  data() {
    const localData = [];
    const freeData = [];
    this.filterData.forEach((val) => {
      if (val.indexOf('FREE_') === -1) {
        localData.push(val);
      } else {
        freeData.push(val);
      }
    });
    const checkList = [
      { code: 'INTERNET', info: '인터넷' },
      { code: 'PARKING', info: '주차' },
      { code: 'SPA_SAUNA', info: '스파 사우나' },
      { code: 'POOL', info: '수영장' },
      { code: 'TERRACE', info: '테라스' },
      { code: 'FRONT_DESK_24', info: '24시간 프론트' },
      { code: 'BARBECUE', info: '바베큐' },
      { code: 'LAUNDRY', info: '세탁 시설' },
      { code: 'KITCHEN', info: '주방' },
      { code: 'RESTAURANT', info: '레스토랑' },
      { code: 'ROOM_SERVICE', info: '룸서비스' },
      { code: 'SMOKE', info: '흡연 시설' },
      { code: 'LIBRARY', info: '도서관' },
      { code: 'FITNESSCENTER', info: '피트니스 센터' },
      { code: 'CASINO', info: '카지노' },
    ];
    checkList.forEach((val) => {
      const temp = val;
      temp.type = localData.indexOf(val.code) >= 0;
    });
    return {
      localData,
      checkList,
      freeData,
      hotelTypeFlag: this.filterData.length === 0,
    };
  },
  methods: {
    noSelect() {
      if (!this.hotelTypeFlag) {
        this.resetLocalData();
        this.hotelTypeFlag = true;
      } else {
        this.hotelTypeFlag = false;
      }
    },
    setLocalData(val) {
      if (this.localData.indexOf(val) >= 0) {
        this.localData.splice(this.localData.indexOf(val), 1);
      } else {
        this.localData.push(val);
      }
      if (this.localData.length > 0) {
        this.hotelTypeFlag = false;
      } else {
        this.hotelTypeFlag = true;
      }
      this.getHotelsCount();
    },
    resetLocalData() {
      this.checkList.forEach((val) => {
        const temp = val;
        temp.type = false;
      });
      this.localData = [];
      this.getHotelsCount();
    },
    getHotelsCount() {
      const submit = [...new Set(this.localData.concat(this.freeData))];
      this.$emit('getHotelsCount', { key: 'filter.facilities', val: submit });
    },
    submit() {
      const submit = [...new Set(this.localData.concat(this.freeData))];
      this.$emit('apply-filter', { key: 'filter.facilities', val: submit });
    },
  },
};
</script>

<style lang="scss" scoped>
  .facilities{
    position: relative;
    .check-list{
      max-height: 216px;
      overflow: hidden;
      overflow-y: scroll;
      padding-bottom: 20px;
    }
    .submitBtn{
      margin-top: 0;
    }
  }
</style>
