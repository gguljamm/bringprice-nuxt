<template>
  <div id="userNoticeWrapper">
    <p class="title">알림</p>
    <p class="sub-title">브링프라이스의 특별 할인, 프로모션, 정책 변경 사항을 받으실 수 있습니다.</p>
    <div class="userNotice">
      <div class="emailInput flex-btw">
        <span class="email-title">이메일 수신</span>
        <div class="flip">
          <label class="switch">
            <input
              type="checkbox"
              @click="$emit('change-subscribed')"
              :checked="subscribedLocal === 1"
            >
            <span class="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['subscribedLocal'],
};
</script>


<style lang="scss" scoped>
  #userNoticeWrapper{
    width: 100%;
    margin-top: 30px;
    .title{
      font-weight: bold;
      font-size: 20px;
      line-height: 29px;
    }
    .sub-title{
      font-size: 14px;
      color: $brown-grey;
    }
    .userNotice{
      margin-top: 10px;
      .emailInput{
        border-bottom: 1px solid #e9e9e9;
        padding-bottom: 10px;
        .email-title{
          font-size: 16px;
        }
        .flip{
          display: flex;
          justify-content: space-between;
          .view-map{
            margin-left: 10px;
          }
        }
        .switch {
          position: relative;
          display: inline-block;
          width: 34px;
          height: 14px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          -webkit-transition: .3s ease;
          transition: .3s ease;
          background-color: #e1e1e1;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: -4px;
          bottom: -4px;
          background-color: #fff;
          -webkit-transition: .3s ease;
          transition: .3s ease;
        }

        input:checked + .slider {
          background-color: $cornflower;
        }

        input:checked + .slider:before {
          -webkit-transform: translateX(100%);
          -ms-transform: translateX(100%);
          transform: translateX(100%);
        }

        /* Rounded sliders */
        .slider.round {
          border-radius: 34px;
        }

        .slider.round:before {
          box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.24), 0 0 1px 0 rgba(0, 0, 0, 0.12);
          border-radius: 50%;
        }
      }
      .flex-btw{
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
