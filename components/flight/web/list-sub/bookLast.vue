<template>
  <div>
    <ul class="bookList"
      :style="{
        height: isExpend ? `${bookList.list.length * 83}px` : `${bookList.list.length >= 4 ? 332 : bookList.list.length * 83}px`,
      }"
    >
      <li
        v-for="(x, index) in bookList.list"
        :key="`${x[0].deeplink}${requestNum}`"
      >
        <div>
          <div :title="x[0].agentName">{{ x[0].agentName }}</div>
          <div
            :class="x[0].agentType === 'Airline' ? 'airline' : ''"
          >{{ x[0].agentType === 'Airline' ? '항공사' : '여행사' }}</div>
        </div>
        <div>
          <div :class="totalPassenger > 1 ? 'various' : ''">
            <div><strong>{{ format.priceFormat(sumPrice(x)) }}</strong>원</div>
            <div v-if="totalPassenger > 1">총 가격 {{ format.priceFormat(sumPrice(x) * totalPassenger) }}원</div>
          </div>
          <button
            @click="submit(x, index)"
          >사이트로 이동</button>
        </div>
      </li>
    </ul>
    <div
      class="btnMore"
      :class="isExpend ? 'open' : ''"
      v-if="bookList.list.length > 4"
      @click="isExpend = !isExpend"
    >{{ isExpend ? `사이트 ${bookList.list.length - 4}개 숨기기` : '더 비싼 사이트 보기' }}</div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['bookList', 'bookIndex', 'requestNum'],
  data() {
    return {
      format: Format,
      isExpend: false,
    };
  },
  computed: {
    totalPassenger() {
      return parseInt(this.$route.params.adults, 10) + parseInt(this.$route.params.children, 10) + parseInt(this.$route.params.infants, 10);
    },
  },
  methods: {
    sumPrice(items) {
      let sumPrice = 0;
      for (let x = 0; x < items.length; x += 1) {
        sumPrice += items[x].price;
      }
      return sumPrice;
    },
    submit(book, index) {
      this.$emit('submit', book, this.bookIndex, index);
    },
  },
};
</script>

<style lang="scss" scoped>
  .bookList{
    overflow: hidden;
    padding: 0 10px;
    transition: height .3s ease;
    > li{
      position: relative;
      height: 83px;
      border-bottom: 1px solid #e9e9e9;
      padding: 22px 10px 14px;
      display: flex;
      > div:first-of-type{
        flex: 0 0 40%;
        overflow: hidden;
        white-space: nowrap;
        > div:first-of-type{
          font-size: 16px;
          font-weight: bold;
          line-height: 24px;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        > div:nth-of-type(2){
          font-size: 14px;
          font-weight: normal;
          line-height: 20px;
          margin-top: 2px;
          color: #9b9b9b;
          &.airline{
            color: #33c498;
          }
        }
      }
      > div:nth-of-type(2){
        flex: 0 0 60%;
        text-align: right;
        height: 43px;
        line-height: 43px;
        display: flex;
        > div{
          flex: auto;
          margin-right: 10px;
          padding-top: 8px;
          display: inline-block;
          > div:first-of-type{
            line-height: 29px;
            height: 29px;
            font-size: 16px;
            strong{
              font-size: 20px;
            }
          }
          > div:nth-of-type(2){
            color: #9b9b9b;
            font-size: 12px;
            line-height: initial;
          }
          &.various{
            padding-top: 0;
          }
        }
        > button{
          flex: 0 0 50%;
          font-size: 16px;
          height: 43px;
          border-radius: 2px;
          background-color: #7167ff;
          width: 50%;
          max-width: 216px;
          color: #FFF;
          display: inline-block;
        }
      }
    }
  }
  .btnMore{
    height: 42px;
    line-height: 42px;
    padding: 0 20px;
    font-size: 14px;
    color: #9b9b9b;
    cursor: pointer;
    position: relative;
    &:after{
      float: right;
      background-image: url(~assets/img/common/chevron-left.svg);
      width: 18px;
      height: 18px;
      content: '';
      background-size: contain;
      -webkit-transform: rotate(270deg);
      transform: rotate(270deg);
      margin-left: 4px;
      opacity: .3;
      position: absolute;
      top: 12px;
    }
    &.open:after{
      transform: rotate(90deg);
    }
  }
</style>
