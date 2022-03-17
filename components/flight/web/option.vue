<template>
  <div class="optionWrap" v-if="init" :class="flag === 'flight' ? 'flight' : 'hotel'">
    <div @click.stop>
      <div class="content">
        <div v-if="flag === 'hotel'">
          <p>객실 수</p>
          <div class="passenger">
            <div>
              <div>객실</div>
              <div>
                <button
                  :class="rooms === 1 ? 'disable' : ''"
                  @click="rooms > 1 ? changeNum('rooms', -1) : ''"
                ></button>
                <span :style="rooms !== 0 ? { color: '#000' } : ''">{{ rooms }}</span>
                <button
                  :class="rooms === 8 ? 'disable' : ''"
                  @click="rooms < 8 ? changeNum('rooms', 1) : ''"
                ></button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p>{{ flag === 'flight' ? '탑승객' : '인원' }}</p>
          <div class="passenger">
            <div>
              <div>
                <p>성인</p>
              </div>
              <div>
                <button
                  :class="adults === 1 ? 'disable' : ''"
                  @click="adults > 1 ? changeNum('adults', -1) : ''"
                ></button>
                <span>{{ adults }}</span>
                <button
                  :class="adults === 8 ? 'disable' : ''"
                  @click="adults < 8 ? changeNum('adults', 1) : ''"
                ></button>
              </div>
            </div>
            <div>
              <div>
                <p>아동</p>
                <p>0세 ~ 17세</p>
              </div>
              <div>
                <button
                  :class="children === 0 ? 'disable' : ''"
                  @click="children > 0 ? changeNum('children', -1) : ''"
                ></button>
                <span :class="children === 0 ? 'disable' : ''">{{ children }}</span>
                <button
                  :class="children === 8 ? 'disable' : ''"
                  @click="children < 8 ? changeNum('children', 1) : ''"
                ></button>
              </div>
            </div>
            <div v-if="flag === 'flight'">
              <div>
                <p>유아</p>
                <p>만 24개월 미만</p>
              </div>
              <div>
                <button
                  :class="infants === 0 ? 'disable' : ''"
                  @click="infants > 0 ? changeNum('infants', -1) : ''"
                ></button>
                <span :class="infants === 0 ? 'disable' : ''">{{ infants }}</span>
                <button
                  :class="infants === 8 ? 'disable' : ''"
                  @click="infants < 8 ? changeNum('infants', 1) : ''"
                ></button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="flag === 'hotel' && ageChildren.length > 0">
          <p>아동 나이</p>
          <div
            :class="flag === 'hotel' ? 'hotelPassenger' : ''"
            class="passenger">
            <div v-for="(x, index) in ageChildren" :key="`${index}_${x}`">
              <div>아동 {{ index + 1 }}</div>
              <div>
                <div :class="x === 0 ? 'disable' : ''">만 {{ x }}세</div>
                <select v-model="ageChildren[index]">
                  <option v-for="(y, index2) in 18" :key="index2" :value="y - 1">만 {{ y - 1 }}세</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="flag === 'flight'">
          <p>좌석등급</p>
          <div class="cabin">
            <div>
              <ul class="check-list option">
                <li
                  v-for="(val, index) in cabinList"
                  :key="index"
                  @click="changeCabin(val.code)"
                >
                  <div>
                    <label :for="'check' + index" class="check">
                      <div>
                        <div class="check-wrap">
                          <input type="checkbox" :id="'check' + index" class="inputCheck">
                          <span class="checked" :style="cabinClass === val.code ? { backgroundColor: '#537aff' } : { backgroundColor: '#fff' }" :class="cabinClass === val.code ? 'active' : ''">
                              <transition name="fade">
                                <div class="checkSvg" v-if="cabinClass === val.code">
                                  <svg viewBox="0 0 52 52" fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-width="3" focusable="false" aria-hidden="true" role="presentation" stroke-linecap="round" stroke-linejoin="round"
                                       style="height: 1em; width: 1em; display: block; overflow: visible;"><path d="m19.1 25.2 4.7 6.2 12.1-11.2"></path></svg>
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
            </div>
          </div>
        </div>
      </div>
      <div class=submitBtn :class="flag === 'hotel' ? 'hotelSubmitBtn' : ''">
        <transition name="fade">
              <span
                v-if="isLocalDataChanged"
                @click="reset"
              >초기화</span>
        </transition>
        <div class="btnWrap">
          <button
            @click.stop="submit"
            class="submit">적용
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title'],
  data() {
    const flag = this.$route.path.indexOf('/flightList') === 0 ? 'flight' : 'hotel';
    let children = parseInt(this.$route.params.children, 10);
    const ageChildren = [];
    const cabinList = [];
    if (flag === 'flight') {
      cabinList.push(
        {
          info: '일반석',
          code: 'Economy',
        }, {
          info: '프리미엄 일반석',
          code: 'PremiumEconomy',
        }, {
          info: '비즈니스석',
          code: 'Business',
        }, {
          info: '일등석',
          code: 'First',
        },
      );
    }
    if (flag === 'hotel') {
      if (this.$route.params.children === 'null') {
        children = 0;
      } else {
        children = this.$route.params.children.split('&').length;
        const arr = this.$route.params.children.split('&');
        for (let x = 0; x < children; x += 1) {
          ageChildren.push(parseInt(arr[x], 10));
        }
      }
    }
    return {
      // checkList,
      init: false,
      adults: parseInt(this.$route.params.adults, 10) || 1,
      children,
      infants: parseInt(this.$route.params.infants, 10) || 0,
      rooms: parseInt(this.$route.params.rooms, 10) || 1,
      cabinClass: this.$route.params.cabinClass || 0,
      flag,
      cabinList,
      ageChildren,
    };
  },
  computed: {
    isLocalDataChanged() {
      let returnVal = this.adults !== (parseInt(this.$route.params.adults, 10) || 1) || this.children !== (parseInt(this.$route.params.children, 10) || 0);
      if (this.flag === 'hotel') {
        returnVal = this.rooms !== (parseInt(this.$route.params.rooms, 10) || 1) || returnVal;
      }
      if (this.flag === 'flight') {
        returnVal = this.infants !== (parseInt(this.$route.params.infants, 10) || 0) || returnVal;
        returnVal = this.cabinClass !== (this.$route.params.cabinClass || 0) || returnVal;
      }
      return returnVal;
    },
  },
  methods: {
    reset() {
      this.adults = parseInt(this.$route.params.adults, 10) || 1;
      this.children = parseInt(this.$route.params.children, 10) || 0;
      if (this.flag === 'hotel') {
        this.rooms = parseInt(this.$route.params.rooms, 10) || 1;
        this.ageChildren = [];
      } else {
        this.infants = parseInt(this.$route.params.infants, 10) || 0;
        this.cabinClass = this.$route.params.cabinClass || 0;
      }
    },
    changeNum(flag, num) {
      this[flag] = this[flag] + num;
      if (flag === 'rooms' && this.rooms > this.adults) {
        this.adults = this.rooms;
      } else if (flag === 'adults' && this.rooms > this.adults) {
        this.rooms = this.adults;
      } else if (flag === 'infants' && this.adults < this.infants) {
        this.adults = this.infants;
      } else if (flag === 'adults' && this.adults < this.infants) {
        this.infants = this.adults;
      }
      if (flag === 'children' && this.flag === 'hotel') {
        if (this.children > this.ageChildren.length) {
          this.ageChildren.push(0);
        } else if (this.children < this.ageChildren.length) {
          this.ageChildren.splice(this.ageChildren.length - 1, 1);
        }
      }
    },
    changeCabin(data) {
      this.cabinClass = data;
    },
    submit() {
      const param = this.$route.params;
      let path;
      if (this.flag === 'flight') {
        path = `/flightList/${param.startCity}/${param.startDate}/${param.returnDate}/${param.wishCities}/${this.cabinClass}/${this.adults}/${this.children}/${this.infants}/list`;
      } else {
        this.$store.commit('clearHotel');
        path = `/hotelList/${param.destination}/${param.checkin}/${param.checkout}/${this.adults}/${this.ageChildren.length === 0 ? 'null' : this.ageChildren.join('&')}/${this.rooms}/${this.$route.params.popFlag || 'list'}`;
      }
      this.$router.push(path);
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init = true;
    });
  },
};
</script>

<style lang="scss" scoped>
  .optionWrap{
    width: 100%;
    > div{
      background-color: #FFF;
      width: 100%;
      position: relative;
      height: 100%;
    }
    .content{
      > div{
        color: #000;
        margin-top: 20px;
        &:after{
          content: '';
          display: block;
          height: 1px;
          margin-left: -14px;
          margin-right: -12px;
          background-color: #f2f2f2;
        }
        &:last-child:after{
          display: none;
        }
        > p{
          font-size: 12px;
          font-weight: bold;
        }
        .passenger{
          position: relative;
          margin-bottom: 30px;
          &.hotelPassenger{
            margin-bottom: 20px;
          }
          > div{
            position: relative;
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            > div:first-of-type{
              font-size: 14px;
              line-height: 18px;
              p:nth-child(2) {
                font-size: 12px;
                color: #868686;
              }
            }
            > div:nth-of-type(2), > div:nth-of-type(3) {
              color: #9b9b9b;
              height: 28px;
              width: 95px;
              text-align: center;
              line-height: 28px;
              font-weight: bold;
              display: flex;
              justify-content: space-between;
              position: relative;
              > div{
                position: absolute;
                left: 0;
                top: 0;
                pointer-events: none;
                width: 100%;
                height: 100%;
                font-weight: normal;
                color: #000;
                &.disable{
                  color: #868686;
                }
                &:after{
                  content: '';
                  right: 10px;
                  top: 10px;
                  position: absolute;
                  border-top: 6px solid #4a4a4a;
                  border-left: 4px solid transparent;
                  border-right: 4px solid transparent;
                }
              }
              > select{
                width: 100%;
                height: 100%;
                text-align: center;
                opacity: 0;
              }
              > span{
                font-size: 14px;
                color: #000;
                font-weight: normal;
              }
              > span.disable{
                color: #868686;
              }
              > button{
                width: 28px;
                height: 28px;
                border-radius: 4px;
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 20px 20px;
                background-color: $dodger-blue;
                transition: .3s ease;
                &:first-of-type{
                  left: 0;
                  background-image: url(~assets/img/common/minus.svg);
                }
                &:nth-of-type(2){
                  right: 0;
                  background-image: url(~assets/img/common/plus.svg);
                }
                &.disable{
                  background-color: #e9e9e9;
                }
              }
            }
          }
        }
        .cabin{
          .option{
            margin-top: 16px;
          }
        }
      }
    }
    .submitBtn{
      margin-top: 30px;
      &.hotelSubmitBtn{
        margin-top: 0;
      }
      span{
        float: left;
        line-height: 50px;
        cursor: pointer;
      }
      .btnWrap{
      }
    }
  }
</style>
