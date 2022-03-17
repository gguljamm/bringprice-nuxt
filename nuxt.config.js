module.exports = {
  /*
  ** Headers of the page
  */
  env: {
    isDev: (process.env.NODE_ENV !== 'production'),
  },
  head: {
    titleTemplate: '%s - 브링프라이스',
    title: '생각났을 때, 브링프라이스',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover' },
      { hid: 'description', name: 'description', content: '브링프라이스는 사용자가 원하는 최적의 항공과 호텔을 추천해줍니다.' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    ],
    link: [
      { rel: 'shortcut icon', type: 'image/x-icon', href: 'https://cdn.bringprice.com/image/2019/ic-bp-on.png' },
    ],
    script: [
      { src: '//developers.kakao.com/sdk/js/kakao.js', defer: true },
      process.env.NODE_TARGET === 'app' ? { src: 'cordova.js' } : {},
    ],
  },
  /*
  ** Customize the progress bar color
  */
  // loading: {
  //   background: '#ff677d',
  //   height: '2px'
  // },
  /*
  ** Build configuration
  */
  buildDir: 'build',
  build: {
    publicPath: '/nuxtfiles/',
    /*
    ** Run ESLint on save
    */
    babel: {
      presets: ['@nuxtjs/babel-preset-app'],
    },
    vendor: [
      'vue-slider-component',
      'babel-polyfill',
      'es6-promise/auto',
      'eventsource-polyfill',
    ],
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
      if (!isClient) {
        config.externals = [
          function (context, request, callback) {
            if (/^vue2-google-maps($|\/)/.test(request)) callback(null, false)
            else callback();
          },
        ];
      }
    },
  },
  modules: [
    '@nuxtjs/style-resources',
  ],
  styleResources: {
    scss: [
      '~/assets/scss/_variable.scss',
    ],
  },
  css: ['~/assets/css/normalize.css', 'node_modules/swiper/dist/css/swiper.css'],
  plugins: [
    { src: '~/plugins/nuxt-swiper-plugin.js', ssr: false },
    { src: '~/plugins/nuxt-googleMap-plugin.js', ssr: false },
    { src: '~/plugins/nuxt-sliderComponent-plugin.js', ssr: false },
    { src: '~/plugins/nuxt-virtualWaterfall-plugin.js', ssr: false },
    { src: '~/plugins/nuxt-cookies-plugin.js', ssr: false },
    { src: '~/plugins/ga.js', ssr: false },
    { src: '~/plugins/nuxt-clipboard2-plugin.js', ssr: false },
  ],
  router: {
    mode: process.env.NODE_TARGET === 'app' ? 'hash' : undefined,
    scrollBehavior(to, from) {
      if (to.name !== from.name) {
        return { x: 0, y: 0 };
      }
      return {};
    },
    extendRoutes(routes, resolve) {
      let parent = routes.find(route => route.path === '/')
      parent.children = [];
      parent.children.push({
        name: 'index-modal',
        path: ':step(date|place)?',
        component: resolve(__dirname, 'components/common/modal.vue'),
        children: [
          {
            name: 'index-modal-modal',
            path: ':param?',
            component: resolve(__dirname, 'components/common/modal.vue'),
            children: [
              {
                name: 'index-modal-modal-modal',
                path: ':param2?',
                component: resolve(__dirname, 'components/common/modal.vue'),
              },
            ],
          },
        ],
      });
      parent = routes.find(route => route.path === '/hotelList')
      parent.path = '/hotelList/:destination/:checkin/:checkout/:adults/:children/:rooms';
      parent.children = [];
      parent.children.push({
        name: 'hotel-list-modal',
        path: ':popFlag?/:popFlag2?/:hotelId?',
        component: resolve(__dirname, 'components/common/modal.vue'),
      });
      parent = routes.find(route => route.path === '/flightList')
      parent.path = '/flightList/:startCity/:startDate/:returnDate/:wishCities/:cabinClass/:adults/:children/:infants';
      parent.children = [{
        name: 'flight-list-step',
        path: ':step(list|select|book|book2)',
        component: resolve(__dirname, 'components/common/modal.vue'),
        children: [{
          name: 'flight-list-step-popFlag',
          path: ':popFlag?',
          component: resolve(__dirname, 'components/common/modal.vue'),
        }],
      }];
      parent = routes.find(route => route.path === '/user')
      parent.path = '/user';
      parent.children = []
      parent.children.push({
        name: 'user-signIn-signUp',
        path: '/user/:sign?/:depth?',
        component: resolve(__dirname, 'components/common/modal.vue'),
      });
      parent = routes.find(route => route.path === '/hotelOuterLink')
      parent.path = '/hotelOuterLink/:url';
    },
  },
}

