<template>
  <div class="outlinkSeg">
    <div>{{ option[0].agentName }}</div>
    <div><strong>{{ option[0].price ? format.numberFormat(parseInt(sumPrice(option), 10)) : '' }}</strong>원</div>
    <div v-if="option.length === 1">
      <button
        @click="submit(0)"
      >사이트 이동</button>
    </div>
    <div v-else class="selfTransfer">
      <div>보호되지 않는 자가환승</div>
      <button
        v-for="(x, index3) in option"
        :key="index3"
        @click="submit(index3)"
      >사이트 이동 {{ index3 + 1 }}</button>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['bookIndex', 'optionIndex', 'option'],
  data() {
    return {
      format: Format,
    };
  },
  methods: {
    sumPrice(items) {
      let sumPrice = 0;
      for (let x = 0; x < items.length; x += 1) {
        sumPrice += items[x].price;
      }
      return sumPrice;
    },
    submit(index3) {
      this.$emit('submit', this.option, this.bookIndex, this.optionIndex, index3);
    },
  },
};
</script>

<style lang="scss" scoped>
  .outlinkSeg{
    > div:first-of-type{
      line-height: 18px;
      font-size: 12px;
      color: #9b9b9b;
      font-weight: bold;
      padding-right: 115px;
    }
    > div:nth-of-type(2){
      font-size: 16px;
      line-height: 24px;
    }
    button{
      width: 105px;
      height: 33px;
      border-radius: 2px;
      background-color: $cornflower;
      color: #FFF;
      font-size: 14px;
      position: absolute;
      right: 10px;
      top: 17px;
    }
    .selfTransfer{
      overflow: auto;
      text-align: right;
      font-size: 14px;
      > button{
        margin-top: 10px;
        position: relative;
        right: 0;
        top: 0;
        margin-left: 10px;
      }
    }
  }
</style>
