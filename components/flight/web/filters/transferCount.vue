<template>
  <div class="transferCount">
    <div
      @click="reSet"
      class="type-check">
      <p>경유횟수 무관</p>
      <button class="flip">
        <div
          class="switch"
          :class="noSelectFlag ? 'on' : ''"
        >
          <span class="slider round"></span>
        </div>
      </button>
    </div>
    <ul class="check-list">
      <li
        v-for="(val, index) in 3"
        :key="val+index"
      >
        <div>
          <label :for="'check' + index" class="check">
            <div>
              <div class="check-wrap">
                <input type="checkbox" :id="'check' + index" class="inputCheck" @click="setLocalData(index)">
                <span class="checked" :style="localData.indexOf(index) < 0 ? { backgroundColor: '#537aff' } : { backgroundColor: '#fff' }" :class="localData.indexOf(index) < 0 ? 'active' : ''">
                  <transition name="fade">
                    <div class="checkSvg"  v-if="localData.indexOf(index) < 0">
                      <svg viewBox="0 0 52 52" fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-width="3" focusable="false" aria-hidden="true" role="presentation" stroke-linecap="round" stroke-linejoin="round" style="height: 1em; width: 1em; display: block; overflow: visible;"><path d="m19.1 25.2 4.7 6.2 12.1-11.2"></path></svg>
                    </div>
                  </transition>
                </span>
                <span class="title" v-if="index === 0">직항</span>
                <span class="title" v-if="index === 1">1회</span>
                <span class="title" v-if="index === 2">2회 이상</span>
              </div>
            </div>
          </label>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['filterData'],
  data() {
    const localData = [];
    localData.push(...this.filterData.filter);
    return {
      localData,
      noSelectFlag: true,
    };
  },
  methods: {
    reSet() {
      if (this.localData.length > 0) {
        this.localData = [];
        this.submit();
      }
      this.noSelect();
    },
    noSelect() {
      if (this.localData.length > 0) {
        this.noSelectFlag = false;
      } else {
        this.noSelectFlag = !this.noSelectFlag;
      }
    },
    setLocalData(val) {
      if (this.localData.indexOf(val) >= 0) {
        this.localData.splice(this.localData.indexOf(val), 1);
      } else {
        this.localData.push(val);
      }
      if (this.localData.length === 3) {
        this.localData = [];
      }
      this.noSelect();
      this.submit();
    },
    submit() {
      const submit = {
        stops: this.localData,
      };
      this.$emit('submit-filter', submit, this.filterData.sortState, 'stops');
    },
  },
};
</script>

<style lang="scss" scoped>
  .transferCount{
    padding-bottom: 20px;
  }
</style>
