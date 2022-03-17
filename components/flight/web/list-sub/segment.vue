<template>
  <div class="flightList">
    <div
      v-for="(seg, index) in leg.seg"
      :key="index"
    >
      <div v-if="index !== 0" class="layover">
        <strong>{{ format.getDurationString(format.getDateGapInfo(leg.seg[index - 1].arrival, seg.departure)) }}</strong>,
        {{ seg.originCity.Name }} 경유
        <div :key="hotelCityInfo.status">
          <button
            v-if="format.getDateGapInfo(leg.seg[index - 1].arrival, seg.departure) > 480 && hotelCityInfo[seg.originCity.Code]"
            @click="submitHotel(hotelCityInfo[seg.originCity.Code], leg.seg[index - 1].arrival)"
          >쉴 곳이 필요하다면?</button>
        </div>
      </div>
      <div class="flightInfo">
        <div>
          <div class="flightDot"></div>
          <div class="departure">
            <div class="flightSign" :class="index === 0 ? 'main' : ''"></div>
            <div>
              <span
                v-show="format.dateFormat(leg.departureTime) !== format.dateFormat(seg.departure) && (index > 0 && format.dateFormat(leg.seg[index - 1].arrival) !== format.dateFormat(seg.departure))"
                class="highlight"
              >{{ format.dateFormat(seg.departure) }}</span>
              <span>{{ format.getTime(seg.departure) }}</span>
            </div>
            <div>{{ seg.originStation.Code }} {{ seg.originStation.Name }}{{ seg.originCity.Name !== seg.originStation.Name ? `, ${seg.originCity.Name}` : '' }}</div>
          </div>
          <div class="duration">
            <div>{{ format.getDurationString(seg.duration) }}</div>
            <div class="carrier">
              <img class="carrierImg" :src="seg.carrierImg">
              <div>{{ seg.carrier }}<br>{{ seg.flightCode }}</div>
              <div>{{ seg.operatingCarrier ? `${seg.operatingCarrier} 공동운항` : ''}}</div>
            </div>
          </div>
        </div>
        <div class="arrival">
          <div class="flightSign" :class="index === leg.seg.length - 1 ? 'main' : ''"></div>
          <div>
            <span
              v-show="format.dateFormat(seg.departure) !== format.dateFormat(seg.arrival)"
              class="highlight"
            >{{ format.dateFormat(seg.arrival) }}</span>
            <span>{{ format.getTime(seg.arrival) }}</span>
          </div>
          <div>{{ seg.destinationStation.Code }} {{ seg.destinationStation.Name }}{{ seg.destinationCity.Name !== seg.destinationStation.Name ? `, ${seg.destinationCity.Name}` : '' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['leg', 'hotelCityInfo'],
  data() {
    return {
      format: Format,
    };
  },
  computed: {
    layoverTIme() {
      let totalTime = 0;
      if (this.leg.seg.length > 1) {
        for (let x = 0; x < this.leg.seg.length - 1; x += 1) {
          totalTime += this.format.getDateGapInfo(this.leg.seg[x].arrival, this.leg.seg[x + 1].departure);
        }
      }
      return totalTime;
    },
  },
  methods: {
    submitHotel(place, date) {
      let checkin = date.split('T')[0];
      if (parseInt(date.split('T')[1].split(':')[0], 10) < 6) {
        const today = new Date(checkin);
        today.setDate(today.getDate() - 1);
        checkin = `${today.getFullYear()}-${this.format.zeros(today.getMonth() + 1)}-${this.format.zeros(today.getDate())}`;
      }
      const tomorrow = new Date(checkin);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const checkout = `${tomorrow.getFullYear()}-${this.format.zeros(tomorrow.getMonth() + 1)}-${this.format.zeros(tomorrow.getDate())}`;
      const location = `${window.location.origin}/hotelList/${JSON.stringify(place)}/${checkin}/${checkout}/2/null/1/list`;
      ga('send', { // eslint-disable-line
        hitType: 'event',
        eventCategory: 'flightHotel',
        eventAction: 'layover',
      });
      window.open(location, '_blank');
    },
  },
};
</script>

<style scoped lang="scss">
  .flightList{
    background-color: #FFF;
    padding: 0 20px;
    .layover{
      overflow: hidden;
      white-space: nowrap;
      height: 48px;
      border-radius: 2px;
      background-color: #f8f8f8;
      width: 100%;
      line-height: 48px;
      font-size: 16px;
      border-right: 10px solid #f8f8f8;
      padding: 0 10px 0 20px;
      margin-bottom: 10px;
      position: relative;
      button{
        width: 130px;
        height: 28px;
        border-radius: 2px;
        position: absolute;
        right: 0;
        top: 10px;
        color: $cornflower;
        font-size: 12px;
        border: 1px solid $cornflower;
        background-color: #f8f8f8;
      }
    }
    .flightInfo{
      > div:first-of-type{
        position: relative;
        .flightDot{
          position: absolute;
          left: 20px;
          top: 34px;
          bottom: 4px;
          border-left: 2px dashed #e1e1e1;
        }
      }
      .departure, .arrival{
        padding-left: 55px;
        padding-bottom: 20px;
        display: flex;
        .flightSign{
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 100%;
          margin-top: 2px;
          margin-left: -40px;
          &.main{
            background-color: #e1e1e1;
          }
          &:not(.main){
            border: 1px solid #e1e1e1;
          }
        }
        > div:nth-of-type(2){
          flex: 0 0 40%;
          line-height: 20px;
          padding: 2px 4px 2px 0;
          > span{
            white-space: nowrap;
          }
          .highlight{
            font-weight: bold;
            color: #d0021b;
          }
        }
        > div:nth-of-type(3){
          flex: 0 0 60%;
          line-height: 20px;
          padding: 2px 0;
          .highlight{
            font-weight: bold;
            color: #d0021b;
          }
        }
        &.departure{
          padding-top: 14px;
          > div:nth-of-type(2), > div:nth-of-type(3){
            font-weight: bold;
          }
        }
      }
      .duration{
        display: flex;
        padding-left: 55px;
        color: #9b9b9b;
        font-size: 14px;
        padding-bottom: 24px;
        > div:first-of-type{
          flex: 0 0 40%;
          font-weight: bold;
        }
        .carrier{
          border-bottom: 1px solid #f8f8f8;
          font-size: 16px;
          line-height: 18px;
          flex: 0 0 60%;
          > *{
            float: left;
          }
          > .carrierImg{
            height: 18px;
            width: 18px;
            margin-right: 10px;
          }
          > div:first-of-type{
            color: #9b9b9b;
            font-size: 14px;
            line-height: 20px;
          }
          > div:nth-of-type(2){
            font-size: 14px;
            color: #9b9b9b;
          }
        }
      }
    }
  }
</style>
