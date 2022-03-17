import Vue from 'vue';
import VueCookies from 'vue-cookies';
/* eslint-disable */
if (window.navigator.userAgent.indexOf('bpAos') >= 0 || window.navigator.userAgent.indexOf('bpIos') >= 0) {
  const plugin = {
    install: function() {
      Vue.prototype.$cookies = this;
      Vue.cookies = this;
    },
    get: function(key) {
      const v = window.localStorage.getItem(key);
      let value = v ? decodeURIComponent(v) : null;

      if(value && value.substring(0,1) === "{" && value.substring(value.length-1,value.length) === "}") {
        try {
          value = JSON.parse(value)
        } catch (e) {
          return value;
        }
      }
      return value;
    },
    set: function(key, value) {
      if(value && value.constructor === Object ) {
        value = JSON.stringify(value);
      }
      window.localStorage.setItem(key, value);
      return this;
    },
    remove: function(key) {
      window.localStorage.removeItem(key);
    },
  };
  Vue.use(plugin);
} else {
  Vue.use(VueCookies);
}
