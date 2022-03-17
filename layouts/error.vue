<template>
  <div class="container">
    <div>
      <h1 v-if="error.statusCode === 404">404<br>Page not found</h1>
      <h1 v-else>An error occurred</h1>
      <button @click="refresh()">Home page</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'blog', // you can set a custom layout for the error page
  mounted() {
    // if (window.location.href.indexOf('bringprice.com') >= 0) {
    //   setTimeout(() => {
    //     window.location.href = '/';
    //   }, 1000);
    // }
  },
  methods: {
    refresh() {
      window.location.href = 'index.html';
    },
  },
};
</script>

<style lang="scss" scoped>
  .container{
    width: 100%;
    max-width: 1110px;
    margin: 0 auto;
    padding: 300px 0;
    max-height: 100vh;
    text-align: center;
    position: relative;
    > div{
      position: absolute;
      white-space: nowrap;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
