<template>
  <div
    v-if="$route.name !== 'event'"
    class="footerWrap">
    <div>
      <div>브링프라이스에서 수백 개의 다른 여행사이트를 한 번에 비교해 여행에 딱 맞는 항공권, 호텔 상품을 찾아보세요.</div>
      <ul>
        <li>
          <div>(주)브링프라이스</div>
          <div
            @click="openUrl(0)"
          >대시보드</div>
        </li>
        <li>
          <div>기타정보</div>
          <div @click="$router.push('/pp')">개인정보 보호정책</div>
          <div @click="$router.push('/tos')">서비스 이용약관</div>
        </li>
      </ul>
      <div>
        <div class="footerBottom">
          대표 : 원용연  사업자 등록번호 : 192-88-00229<br>
          Copyright 2018, (주)브링프라이스, All rights reserved
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    openUrl(index) {
      if (index === 0) {
        window.open('http://dashboard.bringprice.com', '_blank');
      }
    },
  },
};
</script>

<style scoped lang="scss">
  .footerWrap{
    background-color: #FFF;
    width: 100%;
    height: 200px;
    > div{
      max-width: 1110px;
      margin: 0 auto;
      height: 200px;
      padding: 10px 0 0;
      > div:first-of-type{
        font-size: 12px;
        color: #9b9b9b;
        line-height: 18px;
      }
      > ul{
        height: 124px;
        padding-top: 20px;
        > li{
          float: left;
          width: 25%;
          height: 100%;
          > div{
            font-size: 12px;
            margin-bottom: 2px;
            line-height: 18px;
            cursor: pointer;
            &:first-of-type{
              margin-bottom: 8px;
              color: #9b9b9b;
              cursor: default;
              font-weight: bold;
            }
          }
        }
      }
      .footerBottom{
        font-size: 12px;
        color: #9b9b9b;
        border-top: 1px solid #e5e5e5;
        padding-top: 8px;
        line-height: 15px;
      }
    }
  }
</style>
