<template>
  <div class="starRating">
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
                <input type="checkbox" :id="'check' + index" class="inputCheck" @click="setStar(index + 1)" v-model="val.type">
                <span class="checked" :style="val.type ? { backgroundColor: '#537aff' } : { backgroundColor: '#fff' }" :class="val.type ? 'active' : ''">
                  <transition name="fade">
                    <div class="checkSvg"  v-if="val.type">
                      <svg viewBox="0 0 52 52" fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-width="3" focusable="false" aria-hidden="true" role="presentation" stroke-linecap="round" stroke-linejoin="round" style="height: 1em; width: 1em; display: block; overflow: visible;"><path d="m19.1 25.2 4.7 6.2 12.1-11.2"></path></svg>
                    </div>
                  </transition>
                </span>
                <span class="title">{{ index + 2}}성급</span>
                <span class="info">{{ val.info }}</span>
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
          @click="resetStar"
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
import '~/assets/scss/flip.scss'; // eslint-disable-line

export default {
  props: ['filterData', 'hotelsCount'],
  data() {
    const checkList = [
      {
        info: '기본적인 숙박 시설',
      }, {
        info: '퀄리티가 있는 편안함',
      }, {
        info: '다양한 부가 서비스',
      }, {
        info: '최상의 서비스',
      },
    ];
    const localData = [...this.filterData];
    checkList.forEach((val, index) => {
      const temp = val;
      temp.type = localData.indexOf(index + 2) >= 0;
    });
    return {
      checkList,
      localData,
      hotelTypeFlag: this.filterData.length === 0,
    };
  },
  methods: {
    noSelect() {
      if (!this.hotelTypeFlag) {
        this.resetStar();
        this.hotelTypeFlag = true;
      } else {
        this.hotelTypeFlag = false;
      }
    },
    setStar(val) {
      if (this.localData.indexOf(val + 1) >= 0) {
        this.localData.splice(this.localData.indexOf(val + 1), 1);
      } else {
        this.localData.push(val + 1);
      }
      if (this.localData.length > 0) {
        this.hotelTypeFlag = false;
      } else {
        this.hotelTypeFlag = true;
      }
      this.getHotelsCount();
    },
    resetStar() {
      this.checkList.forEach((val) => {
        const temp = val;
        temp.type = false;
      });
      this.localData = [];
      this.getHotelsCount();
    },
    getHotelsCount() {
      this.$emit('getHotelsCount', { key: 'filter.star', val: this.localData });
    },
    submit() {
      this.$emit('apply-filter', { key: 'filter.star', val: this.localData });
    },
  },
};
</script>
