
import Vue from 'vue';
import 'babel-polyfill';
import 'es6-promise/auto';
import * as VueGoogleMaps from 'vue2-google-maps';

require('es6-promise').polyfill();

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyB6o8nbr-hhHtv94YeM6i583FAYNo0E5oI',
    libraries: 'places',
  },
});
