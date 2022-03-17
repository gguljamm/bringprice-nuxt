<template>
  <transition name="slide-bottom-fade" mode="out-in">
    <div class="optionWrap" v-if="init" :class="flag === 'flight' ? 'flight' : 'hotel'">
      <div class="title">
        {{ flag === 'flight' ? '승객 및 좌석 등급' : '인원 및 객실 수' }}
        <button
          @click="historyBack()"
        ></button>
      </div>
      <div class="content">
        <div v-if="flag === 'hotel'">
          <p>객실</p>
          <div class="passenger">
            <div>
              <div>객실</div>
              <div></div>
              <div>
                <button
                  :class="rooms === 1 ? 'disable' : ''"
                  @click="rooms > 1 ? changeNum('rooms', -1) : ''"
                ></button>
                <span>{{ rooms }}</span>
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
              <div>성인</div>
              <div>만 12세 이상</div>
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
              <div>소아</div>
              <div>만 2 ~ 12세 미만</div>
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
              <div>유아</div>
              <div>만 24개월 미만</div>
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
          <div class="passenger">
            <div v-for="(x, index) in ageChildren" :key="`${index}_${x}`">
              <div>아동 {{ index + 1 }}</div>
              <div></div>
              <div>
                <div>만 {{ x }}세</div>
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
              <div><button
                :class="cabinClass==='Economy'?'active':''"
                @click="changeCabin('Economy')"
              >일반석</button></div>
              <div><button
                :class="cabinClass==='PremiumEconomy'?'active':''"
                @click="changeCabin('PremiumEconomy')"
              >프리미엄 일반석</button></div>
            </div>
            <div>
              <div><button
                :class="cabinClass==='Business'?'active':''"
                @click="changeCabin('Business')"
              >비즈니스석</button></div>
              <div><button
                :class="cabinClass==='First'?'active':''"
                @click="changeCabin('First')"
              >일등석</button></div>
            </div>
          </div>
        </div>
      </div>
      <div class="acceptButton">
        <button
          @click="submit()"
        >적용하기</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    const flag = this.$route.path.indexOf('/flightList') === 0 ? 'flight' : 'hotel';
    let children = parseInt(this.$route.params.children, 10);
    const ageChildren = [];
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
      init: false,
      adults: parseInt(this.$route.params.adults, 10) || 1,
      children,
      infants: parseInt(this.$route.params.infants, 10) || 0,
      rooms: parseInt(this.$route.params.rooms, 10) || 1,
      cabinClass: this.$route.params.cabinClass || 0,
      flag,
      ageChildren,
    };
  },
  methods: {
    historyBack() {
      window.history.back();
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
  beforeDestroy() {
    window.document.body.style.overflowY = '';
    window.document.documentElement.style.overflowY = '';
  },
  mounted() {
    window.document.body.style.overflowY = 'hidden';
    window.document.documentElement.style.overflowY = 'hidden';
    this.$nextTick(() => {
      this.init = true;
    });
  },
};
</script>

<style lang="scss" scoped>
  .optionWrap{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 520px;
    background-color: #FFF;
    box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
    .title{
      height: 54px;
      border-bottom: 1px solid #f8f8f8;
      line-height: 54px;
      padding: 0 16px;
      font-weight: bold;
      font-size: 14px;
      position: relative;
      > button{
        position: absolute;
        right: 16px;
        height: 22px;
        width: 22px;
        top: 16px;
        border: 0;
        background-image: url(~assets/img/common/x_black.svg);
        background-position: center center;
        background-repeat: no-repeat;
      }
    }
    &.hotel .content .passenger > div > div:first-of-type {
      line-height: 28px;
    }
    &.hotel .content .passenger > div > div:nth-of-type(2) {
      display: none;
    }
    .content{
      padding: 16px;
      position: absolute;
      top: 54px;
      bottom: 70px;
      left: 0;
      right: 0;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      > div{
        > p{
          font-size: 14px;
          padding: 8px 0;
          font-weight: bold;
        }
        .passenger{
          margin-bottom: 22px;
          > div{
            position: relative;
            height: 67px;
            padding: 12px 0;
            border-bottom: 1px solid #f8f8f8;
            > div:first-of-type{
              padding-top: 7px;
              font-size: 14px;
              line-height: 17px;
            }
            > div:nth-of-type(2) {
              font-size: 12px;
              margin-top: 1px;
              line-height: 15px;
              color: #9b9b9b;
              .hotel &{
                display: none;
              }
            }
            > div:nth-of-type(3) {
              position: absolute;
              right: 0;
              top: 12px;
              height: 42px;
              width: 168px;
              text-align: center;
              line-height: 42px;
              font-weight: bold;
              > div{
                position: absolute;
                left: 0;
                top: 0;
                pointer-events: none;
                width: 100%;
                height: 100%;
                &:after{
                  content: '';
                  right: 10px;
                  top: 16px;
                  position: absolute;
                  border-top: 5px solid #4a4a4a;
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
              > span.disable{
                color: #ccc;
              }
              > button{
                width: 42px;
                height: 42px;
                top: 0;
                position: absolute;
                border-radius: 4px;
                background-repeat: no-repeat;
                background-position: center center;
                background-color: $cornflower;
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
          margin-top: 16px;
          > div{
            display: flex;
            &:first-of-type{
              margin-bottom: 9px;
            }
            > div{
              flex: auto;
              width: 50%;
              &:first-of-type{
                padding-right: 5px;
              }
              &:nth-of-type(2) {
                padding-left: 5px;
              }
              > button{
                width: 100%;
                height: 53px;
                border-radius: 2px;
                background-color: #f8f8f8;
                font-size: 14px;
                color: #9b9b9b;
                transition: .3s ease;
                &.active{
                  background-color: $cornflower;
                  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
                  color: #FFF;
                  font-weight: bold;
                }
              }
            }
          }
        }
      }
    }
    .acceptButton{
      position: absolute;
      bottom: 0;
      height: 70px;
      width: 100%;
      left: 0;
      box-shadow: 0 -4px 10px 0 rgba(0, 0, 0, 0.1);
      padding: 13px 20px;
      > button{
        background-color: $cornflower;
        color: #FFF;
        width: 100%;
        height: 44px;
      }
    }
  }
</style>
