var Vue = require("vue/dist/vue.js");

var topHeader = require('./components/topheader.vue');

const app = new Vue({
  el: "#app",
  components: {
    'top-header': topHeader
  }
});
