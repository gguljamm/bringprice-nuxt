<template>
  <div>
    <header>
      <div>
        <div class="all-wrap">
          <div class="contents">
            <div class="menu">
              <ul>
                <li
                  @click="openIntro"
                >
                  <button>회사소개</button></li>
                <li
                  v-if="this.$store.state.isLogin"
                  @click="openMyPage"
                >
                  <button>내정보</button>
                </li>
                <li v-else
                    @click="openLoginPop('signIn')"
                ><button>로그인</button></li>
                <li
                  v-if="this.$store.state.isLogin"
                  @click="logout"
                ><button>로그아웃</button></li>
                <li v-else
                    class="menu-signUp">
                  <button
                    @click="openLoginPop('signUp')"
                    class="signUp-btn">특가로 보기</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="bpPop"
      v-if="$route.query.popFlag && ($route.query.popFlag === 'signUp' || $route.query.popFlag === 'signIn')"
      @click="closePop"
    >
      <User
        @click.stop
        :isChangedData="isChangedData"
        :routerFlag="$route.query.popFlag"
      ></User>
    </div>
  </div>
</template>

<script>
import User from './user/pc/userWrapper.vue';

export default {
  components: {
    User,
  },
  data() {
    return {
      isChangedData: {
        active: false,
      },
    };
  },
  methods: {
    logout() {
      this.$router.push({
        query: {
          popFlag: 'alert',
          alertId: 19,
        },
      });
    },
    openMyPage() {
      this.$router.push('/user');
    },
    openLoginPop(flag) {
      this.$router.push({ query: { popFlag: flag } });
    },
    openIntro() {
      window.open('/event');
    },
    closePop() {
      if (this.isChangedData.active) {
        if (window.confirm('작성중인 내용이 사라집니다.')) {
          this.$router.back();
        }
      } else {
        this.$router.back();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .scrollWeb header > div{
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);
  }
  header{
    width: 100%;
    height: 64px;
    border-bottom: 1px solid #f2f2f2;
    > div{
      transition: .3s ease;
      padding: 12px 0;
      background-color: #fff;
      position: fixed;
      z-index: 11;
      width: 100%;
      height: 64px;
      left: 0;
      top: 0;
      .all-wrap{
        .contents{
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding-left: 60px;
          padding-right: 60px;
          .menu ul{
            display: flex;
            align-items: center;
            li{
              font-size: 16px;
              margin-left: 27px;
              &:first-of-type{
                margin-left: 0;
              }
              > button{
                white-space: nowrap;
                height: 36px;
              }
              .signUp-btn{
                width: 91px;
                height: 36px;
                border: 1px solid #ff6c6c;
                border-radius: 2px;
                color: #ff6c6c;
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
  .bpPop{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 12;
    background-color: rgba(255, 255, 255, 0.7);
    overflow: auto;
  }
</style>
