<template>
  <div class="carriers">
    <div
      @click="isDisplayAlliance"
      class="type-check">
      <p>얼라이언스로 보기</p>
      <button class="flip">
        <div
          class="switch"
          :class="displayAlliance ? 'on' : ''"
        >
          <span class="slider round"></span>
        </div>
      </button>
    </div>
    <ul
      v-if="!displayAlliance"
      :class="!displayAlliance ? 'default' : ''"
      class="check-list">
      <li
        v-for="(val, index) in alliance"
        :key="index"
        @mouseover="rowHover = true"
        @mouseleave="rowHover = false"
      >
        <div>
          <label :for="'check' + index" class="check">
            <div>
              <div class="check-wrap">
                <input type="checkbox" :id="'check' + index" class="inputCheck" @click="setLocalData(val.code)">
                <span class="checked" :style="filterAirLine.indexOf(val.code) < 0 ? { backgroundColor: '#537aff' } : { backgroundColor: '#fff' }" :class="filterAirLine.indexOf(val.code) < 0 ? 'active' : ''">
                  <transition name="fade">
                    <div class="checkSvg"  v-if="filterAirLine.indexOf(val.code) < 0">
                      <svg viewBox="0 0 52 52" fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-width="3" focusable="false" aria-hidden="true" role="presentation" stroke-linecap="round" stroke-linejoin="round" style="height: 1em; width: 1em; display: block; overflow: visible;"><path d="m19.1 25.2 4.7 6.2 12.1-11.2"></path></svg>
                    </div>
                  </transition>
                </span>
                <span class="title">{{ val.name }}</span>
              </div>
            </div>
          </label>
          <span
            @click="selectCheck(val.code)"
            class="itemInfo">이 항목만</span>
        </div>
      </li>
    </ul>
    <div
      v-else
      class="check-list alliance">
      <div
        v-for="(item, index) in Object.keys(allianceList)"
        :key="index"
        class="allianceList"
      >
        <div class="list-title" v-if="item === 'staralliance'">
          <p>Star Alliance</p>
          <button
            class="flip"
            @click="allAllianceCheck(item, !filterAirLine.some(v => flightGroup[item].indexOf(v) >= 0))"
          >
            <div
              class="switch"
              :class="!filterAirLine.some(v => flightGroup[item].indexOf(v) >= 0) ? 'on' : ''"
            >
              <span class="slider round"></span>
            </div>
          </button>
        </div>
        <div class="list-title" v-else-if="item === 'skyteam'">
          <p>Sky Team</p>
          <button
            class="flip"
            @click="allAllianceCheck(item, !filterAirLine.some(v => flightGroup[item].indexOf(v) >= 0))"
          >
            <div
              class="switch"
              :class="!filterAirLine.some(v => flightGroup[item].indexOf(v) >= 0) ? 'on' : ''"
            >
              <span class="slider round"></span>
            </div>
          </button>
        </div>
        <div class="list-title" v-else-if="item === 'oneworld'">
          <p>One World</p>
          <button
            class="flip"
            @click="allAllianceCheck(item, !filterAirLine.some(v => flightGroup[item].indexOf(v) >= 0))"
          >
            <div
              class="switch"
              :class="!filterAirLine.some(v => flightGroup[item].indexOf(v) >= 0) ? 'on' : ''"
            >
              <span class="slider round"></span>
            </div>
          </button>
        </div>
        <div class="list-title" v-else>
          <p>etc</p>
          <button
            class="flip"
            @click="allAllianceCheck(item, !filterAirLine.some(v => allianceList[item].some(v2 => v2.code === v)))"
          >
            <div
              class="switch"
              :class="!filterAirLine.some(v => allianceList[item].some(v2 => v2.code === v)) ? 'on' : ''"
            >
              <span class="slider round"></span>
            </div>
          </button>
        </div>
        <div
          v-for="(val, index2) in allianceList[item]"
          :key="index2"
        >
          <label :for="'check2' + val.code" class="check">
            <div>
              <div class="check-wrap">
                <input type="checkbox" :id="'check2' + val.code" class="inputCheck" @click="setLocalData(val.code)">
                <span class="checked" :style="filterAirLine.indexOf(val.code) < 0 ? { backgroundColor: '#537aff' } : { backgroundColor: '#fff' }" :class="filterAirLine.indexOf(val.code) < 0 ? 'active' : ''">
                  <transition name="fade">
                    <div class="checkSvg" v-if="filterAirLine.indexOf(val.code) < 0">
                      <svg viewBox="0 0 52 52" fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-width="3" focusable="false" aria-hidden="true" role="presentation" stroke-linecap="round" stroke-linejoin="round" style="height: 1em; width: 1em; display: block; overflow: visible;"><path d="m19.1 25.2 4.7 6.2 12.1-11.2"></path></svg>
                    </div>
                  </transition>
                </span>
                <span class="title">{{ val.name }}</span>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '~/assets/scss/flip.scss'; // eslint-disable-line

export default {
  props: ['filterData'],
  data() {
    const alliance = [];
    const filterAirLine = [];
    alliance.push(...this.filterData.allList);
    filterAirLine.push(...this.filterData.filter);
    /* eslint-disable */
    const staralliance = [1280, 819, 835, 841, 929, 1482, 1464, 1530, 1523, 854, 1710, 941, 1525, 898, 1427, 1044, 1375, 1368, 940, 1707, 2040, 1713, 241, 1384, 1760, 1751, 1755, 1793];
    const skyteam = [1717, 850, 845, 1816, 838, 858, 1949, 937, 1429, 954, 1515, 988, 1121, 1329, 1324, 1889, 1317, 1413, 1718, 1663, 1854, 1414];
    const oneworld = [833, 881, 952, 857, 1218, 1276, 1361, 221, 1376, 1948, 1274, 1416, 1606, 1618, 1658, 1687, 1804];
    /* eslint-enable */
    return {
      alliance,
      filterAirLine,
      flightGroup: {
        staralliance,
        skyteam,
        oneworld,
      },
      rowHover: false,
      displayAlliance: false,
      allianceList: {
        skyteam: [],
        staralliance: [],
        oneworld: [],
        etc: [],
      },
    };
  },
  methods: {
    selectCheck(val) {
      this.filterAirLine = [];
      const allList = this.filterData.allList.map(item => item.code);
      const data = allList.filter(v => v !== val);
      this.filterAirLine.push(...data);
      this.submit();
    },
    allAllianceCheck(key, flag) {
      if (flag) {
        this.filterAirLine.push(...this.allianceList[key].map(v => v.code));
      } else {
        for (let x = 0; x < this.allianceList[key].length; x += 1) {
          const index = this.filterAirLine.indexOf(this.allianceList[key][x].code);
          this.filterAirLine.splice(index, 1);
        }
      }
      this.submit();
    },
    allianceGroup() {
      if (this.allianceList.staralliance.length <= 0 || this.allianceList.skyteam.length <= 0 || this.allianceList.oneworld.length <= 0) {
        for (let x = 0; x < this.alliance.length; x += 1) {
          let isFiltered = true;
          for (let y = 0; y < Object.keys(this.flightGroup).length; y += 1) {
            if (this.flightGroup[Object.keys(this.flightGroup)[y]].indexOf(this.alliance[x].code) >= 0) {
              isFiltered = false;
              this.allianceList[Object.keys(this.flightGroup)[y]].push(this.alliance[x]);
              break;
            }
          }
          if (isFiltered) {
            this.allianceList.etc.push(this.alliance[x]);
          }
        }
      }
    },
    setLocalData(code) {
      const flag = this.filterAirLine.indexOf(code);
      if (flag < 0) {
        this.filterAirLine.push(code);
      } else {
        this.filterAirLine.splice(flag, 1);
      }
      this.submit();
    },
    submit() {
      const submit = {
        airlines: this.filterAirLine,
      };
      // console.log(submit);
      this.$emit('submit-filter', submit, this.filterData.sortState, 'airlines');
    },
    isDisplayAlliance() {
      this.displayAlliance = !this.displayAlliance;
    },
  },
  mounted() {
    this.allianceGroup();
  },
};
</script>

<style lang="scss" scoped>
  .carriers{
    padding-left: 14px;
    max-height: 300px;
    overflow-y: scroll;
    .type-check{
      margin-top: 20px;
      padding-right: 14px;
      p{
        color: #000;
        font-size: 14px;
      }
    }
    .check-list{
      overflow: hidden;
      padding-bottom: 10px;
      margin-top: 0;
      &.default{
        margin-top: 30px;
        li{
          margin-top: 16px;
          padding-right: 14px;
          > div{
            position: relative;
            &:hover .itemInfo{
              cursor: pointer;
              opacity: 1;
            }
            .itemInfo{
              opacity: 0;
              line-height: 20px;
              transition: .3s ease;
              position: absolute;
              right: 0;
              top: 0;
              font-size: 14px;
              color: $dodger-blue;
            }
          }
          &:first-of-type{
            margin-top: 0;
          }
        }
      }
      &.alliance{
        > .allianceList {
          margin-top: 30px;
          .list-title{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-right: 14px;
            p {
              font-weight: bold;
              font-size: 12px;
              color: #000;
              line-height: 15px;
            }
          }
          > div{
            font-size: 14px;
            margin-top: 16px;
          }
          &:first-of-type{
            > p{
              padding-top: 0;
            }
          }
        }
      }
    }
    padding-bottom: 20px;
  }
</style>
