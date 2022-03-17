<template>
  <div class="freeFacilities">
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
    const notFreeData = [];
    this.filterData.forEach((val) => {
      localData.push(val);
    });
    const checkList = [
      { code: 'FREE_INTERNET', info: '무료 인터넷' },
      { code: 'FREE_BREAKFAST', info: '무료 조식' },
      { code: 'FREE_PARKING', info: '무료 주차' },
    ];
    checkList.forEach((val) => {
      const temp = val;
      temp.type = localData.indexOf(val.code) >= 0;
    });
    return {
      localData,
      notFreeData,
      checkList,
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
      this.$emit('getHotelsCount', { key: 'filter.freeFacilities', val: this.localData });
    },
    submit() {
      this.$emit('apply-filter', { key: 'filter.freeFacilities', val: this.localData });
    },
  },
};
</script>

<style scoped>
</style>
