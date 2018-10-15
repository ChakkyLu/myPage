var daily = new Vue({
  el: '#daily',
  data: {
    healthy: []
  },
  mounted: async function() {
    let url = "http://www.rikuki.cn/api/gtd/daily/getH";
    let res = await sendReq(url);
    this.healthy = res;
    for (let i = 0; i < this.healthy.length; i++) {
      this.healthy[i].clicked = 0;
    }
    this.healthy[0].clicked = 1;

    var data = [
      { label: 'new', value: 60 },
      { label: 'level1', value: 20 },
      { label: 'level2', value: 30 }
    ];
    var colors = [ '#ed786a', '#1E90FF', '#8B658B'];
    var canvas = document.getElementById('pie');

    drawPie(data, colors, canvas);
  },
  methods: {
    plusSlides: function (n) {
      let curSlide = 0;

      for(let i=0; i<this.healthy.length; i++) {
        if (this.healthy[i].clicked) currentSlide = i;
        let curHealth = this.healthy[i];
        curHealth.clicked = 0
        Vue.set(this.healthy, i, curHealth);
      }
      currentSlide += n;
      if (currentSlide > 2 ) currentSlide = 0;
      if (currentSlide < 0 ) currentSlide = 2;
      let curHealth = this.healthy[currentSlide];
      curHealth.clicked = 1;
      Vue.set(this.healthy, currentSlide, curHealth);
    },
    currentSlide: function(n) {
      for(let i=0; i<this.healthy.length; i++) {
        let curHealth = this.healthy[i];
        curHealth.clicked = 0
        Vue.set(this.healthy, i, curHealth);
      }
      let curHealth = this.healthy[n];
      curHealth.clicked = 1;
      Vue.set(this.healthy, n, curHealth);
    }
  }
});

var work = new Vue({
  el: '#work',
  data: {

  },
  methods: {
    workMenu: function(n) {
      let menus = document.getElementsByClassName('item-btn');
      for (let i = 0; i < menus.length; i++) {
        menus[i].style.width = '80%';
      }
      menus[n].style.width = '100%';
    }
  }
});
