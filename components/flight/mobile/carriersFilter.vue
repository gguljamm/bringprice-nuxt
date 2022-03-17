<template>
  <div id="carriers">
    <div class="filterHeader">
      <button @click="$emit('close-pop')"></button>
      <span class="title">항공사</span>
      <button
        @click="$emit('backFilter')"
      ></button>
    </div>
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
      >
        <div>
          <label :for="'check' + val.code" class="check">
            <div>
              <div class="check-wrap">
                <input type="checkbox" :id="'check' + val.code" class="inputCheck" @click="setLocalData(val.code)">
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
    <div class="btnWrap">
      <transition name="fade">
        <div v-if="filterAirLine.length > 0" class="submit-info">
          <span class="info">항공사 필터가 선택 되었습니다.</span>
          <span @click="reset" class="reset">재설정</span>
        </div>
      </transition>
      <button
        @click="submit"
      >확인</button>
    </div>
  </div>
</template>

<script>

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
    return {
      alliance,
      filterAirLine,
      flightGroup: {
        staralliance,
        skyteam,
        oneworld,
      },
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
    reset() {
      this.filterAirLine = [];
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
    },
    submit() {
      const submit = {
        airlines: this.filterAirLine,
      };
      this.$emit('submit-filter', submit.airlines, 'airlines');
    },
    isDisplayAlliance() {
      this.displayAlliance = !this.displayAlliance;
    },
  },
  mounted() {
    window.document.querySelectorAll('.filterWrap')[0].style.overflowY = 'hidden';
    this.allianceGroup();
  },
  beforeDestroy() {
    if (window.document.querySelectorAll('.filterWrap') && window.document.querySelectorAll('.filterWrap')[0]) {
      window.document.querySelectorAll('.filterWrap')[0].style.overflowY = '';
    }
  },
};
</script>

<style scoped lang="scss">
  #carriers{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    top: constant(safe-area-inset-top);
    top: env(safe-area-inset-top);
    background-color: #fff;
    .filterHeader{
      button:first-of-type{
        width: 40px;
        height: 40px;
        background-size: 21px;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url(~assets/img/common/chevron-left.svg);
      }
    }
    .flip {
      .switch{
        .slider.round{
          background-color: #868686;
        }
      }
      .switch.on.disable{
        .slider.round{
          background-color: #868686;
        }
        .slider.round::before{
          background-color: #fff;
        }
      }
      .switch.on{
        .slider.round{
          background-color: #b2bfea;
        }
        .slider.round::before{
          background-color: $dodger-blue;
        }
      }
    }
    .type-check{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding: 0 10px 20px 10px;
      p{
        color: #000;
        font-size: 14px;
      }
    }
    .check-list{
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      position: absolute;
      top: 110px;
      left: 0;
      right: 0;
      bottom: 107px;
      padding: 0 10px;
      li, div {
        &:first-of-type{
          margin-top: 0;
        }
        margin-top: 14px;
        label{
          display: block;
          cursor: pointer;
        }
        .check-wrap {
          display: flex;
          align-items: center;
          .inputCheck {
            display: none;
          }
          .checked {
            transition: .3s ease;
            width: 20px;
            height: 20px;
            border-radius: 2px;
            border: 1.5px solid #cdcdcd;
            background-color: #fff;
            position: relative;
            &.active{
              background-color: $dodger-blue;
              border: 1.5px solid $dodger-blue;
            }
            &.disable{
              border-color: #868686;
              background-color: #868686;
            }
            .checkSvg{
              position: absolute;
              font-size: 32px;
              margin: -8px;
              color: #fff;
            }
          }
          .title{
            font-size: 14px;
            color: #000;
            margin-left: 15px;
          }
          .info{
            font-size: 14px;
            color: #868686;
            margin-left: 15px;
          }
        }
      }
      &.default{
        margin-top: 30px;
        li{
          margin-top: 20px;
          padding-right: 14px;
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
    .btnWrap{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 12px 20px;
      background-color: #fff;
      box-shadow: 0 -2px 10px 0 rgba(0, 0, 0, 0.1);
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
      > button{
        width: 100%;
        height: 54px;
        background-color: $cornflower;
        color: #FFF;
        font-size: 16px;
      }
    }
  }
</style>
