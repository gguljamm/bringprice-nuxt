<template>
  <div class="flightSegList">
    <div class="flightHead">
      <div>
        <div>{{ isRound ? ( index === 0 ? '출국편 항공권' : '귀국편 항공권' ) : `${ index + 1 }번째 구간` }}</div>
        <div>{{ format.dateFormat(leg.departureTime) }} {{ format.getDayOfWeek(leg.departureTime) }} | {{ leg.originStationCode }} - {{ leg.destinationStationCode }}</div>
      </div>
      <div>
        <div>총 {{ format.getDurationString(leg.duration) }}</div>
        <div>{{ leg.seg.length === 1 ? '직항' : ((leg.seg.length-1)+'회 경유') }}</div>
      </div>
    </div>
    <div class="flightList">
      <div
        v-for="(seg, index) in leg.seg"
        :key="index"
      >
        <div class="flightDot"><div></div><div></div><div></div><div></div><div></div></div>
        <div v-if="index !== 0" class="layover">
          <strong>{{ format.getDurationString(format.getDateGapInfo(leg.seg[index - 1].arrival, seg.departure)) }}</strong>,
          {{ seg.originCity }} 경유
        </div>
        <div v-if="seg.carrier" class="carrier">
          <img class="carrierImg" :src="seg.carrierImg">
          <div>{{ seg.carrier }}</div>
          <div>{{ seg.operatingCarrier ? `${seg.operatingCarrier} 공동운항` : ''}}</div>
        </div>
        <div class="departure">
          <div class="flightSign" :class="index === 0 ? 'main' : ''"></div>
          <div>
            <div>{{ seg.originCity }}</div>
            <div><strong>{{ getTime(seg.departure) }}</strong></div>
          </div>
          <div>
            <div>{{ seg.originStation.Name }} ({{ seg.originStation.Code }})</div>
            <div
              :class="format.dateFormat(leg.departureTime) !== format.dateFormat(seg.departure) ? 'highlight' : ''"
            >{{ format.dateFormat(seg.departure) }} {{ format.getDayOfWeek(seg.departure) }}요일</div>
          </div>
        </div>
        <div class="duration" v-if="leg.seg.length > 1">비행시간 {{ format.getDurationString(seg.duration) }}</div>
        <div class="arrival">
          <div class="flightSign" :class="index === leg.seg.length - 1 ? 'main' : ''"></div>
          <div>
            <div>{{ seg.destinationCity }}</div>
            <div>{{ getTime(seg.arrival) }}</div>
          </div>
          <div>
            <div>{{ seg.destinationStation.Name }} ({{ seg.destinationStation.Code }})</div>
            <div
              :class="format.dateFormat(leg.departureTime) !== format.dateFormat(seg.arrival) ? 'highlight' : ''"
            >{{ format.dateFormat(seg.arrival) }} {{ format.getDayOfWeek(seg.arrival) }}요일</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Format from '~/utils/format'; // eslint-disable-line

export default {
  props: ['leg', 'index', 'isRound'],
  data() {
    return {
      format: Format,
    };
  },
  methods: {
    getTime(time, arrivalDate) {
      const arrTime = time.split('T')[1].split(':');
      const hour = parseInt(arrTime[0], 10);
      let diff = '';
      if (arrivalDate && arrivalDate.split('T')[0] !== time.split('T')[0]) {
        diff = ` (+${this.format.getBetweenDay(arrivalDate, time)})`;
      }
      return `${hour < 12 ? '오전' : '오후'} ${hour > 12 ? hour - 12 : hour}:${arrTime[1]}${diff}`;
    },
  },
};
</script>

<style lang="scss" scoped>
  .flightSegList{
    background-color: #FFF;
    border-radius: 2px;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
    .flightHead{
      border-bottom: 1px solid #f8f8f8;
      padding: 10px;
      display: flex;
      > div{
        flex: auto;
        > div:first-of-type{
          line-height: 20px;
          font-size: 14px;
        }
        > div:last-of-type{
          font-size: 12px;
          color: #9b9b9b;
          line-height: 18px;
        }
        &:first-of-type{
          > div:first-of-type{
            font-weight: bold;
          }
        }
        &:nth-of-type(2){
          text-align: right;
          > div:first-of-type{
          }
        }
      }
    }
    .flightList{
      padding: 0 10px;
      .flightDot{
        position: absolute;
        margin-top: 74px;
        margin-left: 8px;
        > div{
          width: 2px;
          height: 2px;
          border-radius: 2px;
          background-color: #e1e1e1;
          margin-bottom: 10px;
        }
      }
      .carrier{
        border-bottom: 1px solid #f8f8f8;
        padding: 4px 0;
        overflow: auto;
        line-height: 32px;
        font-size: 14px;
        > *{
          float: left;
        }
        > .carrierImg{
          height: 32px;
        }
        > div:first-of-type{
          margin-left: 8px;
          color: #000;
        }
        > div:nth-of-type(2){
          float: right;
          font-size: 10px;
          color: #9b9b9b;
        }
      }
      .layover{
        height: 33px;
        border-radius: 2px;
        background-color: #f8f8f8;
        width: 100%;
        line-height: 33px;
        font-size: 12px;
        padding: 0 10px;
        margin-bottom: 10px;
      }
      .departure, .arrival{
        padding-left: 24px;
        padding-bottom: 10px;
        .flightSign{
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 100%;
          margin-top: 6px;
          margin-left: -18px;
          &.main{
            background-color: #9b9b9b;
          }
          &:not(.main){
            border: 1px solid #979797;
          }
        }
        > div:nth-of-type(2){
          font-size: 14px;
          height: 20px;
          line-height: 20px;
          > div:first-of-type{
            float: left;
          }
          > div:nth-of-type(2){
            float: right;
            &.highlight{
              color: #d0021b;
            }
          }
        }
        > div:nth-of-type(3){
          font-size: 12px;
          height: 18px;
          line-height: 18px;
          > div:first-of-type{
            float: left;
          }
          > div:nth-of-type(2){
            float: right;
            &.highlight{
              color: #d0021b;
            }
          }
        }
        &.departure{
          padding-top: 10px;
          padding-bottom: 38px;
        }
      }
      .duration{
        padding-left: 24px;
        color: #9b9b9b;
        font-size: 12px;
        font-weight: bold;
        position: absolute;
        margin-top: -26px;
      }
    }
  }
</style>
