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
    newrecord: Object,
    friendlyMSG: "友好信息",
    calendar: [],
    slideItem: 0,
    currentMonth: 10
  },
  mounted: function(){
    for (let i=0; i<31; i++) {
      this.calendar.push(i);
    }
  },
  methods: {
    showCalendar: function(n) {
      let odd = [1,3,5,7,8,10,12];
      let even = [3,6,9,11];
      this.currentMonth = this.currentMonth + n;
      if (this.currentMonth < 1) this.currentMonth = 12;
      if (this.currentMonth > 12) this.currentMonth = 1;
      let days;
      if (this.currentMonth == 2) days = 28;
      else{
          if (odd.indexOf(this.currentMonth)!= -1) days = 31;
          else days = 30;
      }
      this.calendar.splice(0,this.calendar.length);
      for (let i=0; i<days; i++) {
        this.calendar.push(i);
      }
    },
    workMenu: function(n) {
      let menus = document.getElementsByClassName('item-btn');
      this.slideItem = n;
      for (let i = 0; i < menus.length; i++) {
        menus[i].style.width = '70%';
      }
      menus[n].style.width = '90%';
    },
    newRecord: async function(status) {
      var data;
      if (status == 1 && this.newrecord.date) {
        data  = {
          wake: this.newrecord.wake,
          sleep: this.newrecord.sleep,
          duration: this.newrecord.duration,
          step: this.newrecord.step,
          depth: this.newrecord.depth,
          distance: this.newrecord.distance,
          score: this.newrecord.score,
          created: this.newrecord.date
        }
      } else {
        data = {
          wake: this.newrecord.wake,
          sleep: this.newrecord.sleep,
          duration: this.newrecord.duration,
          step: this.newrecord.step,
          depth: this.newrecord.depth,
          distance: this.newrecord.distance,
          score: this.newrecord.score
        }
      }
      for (var attr in data) {
        if (!data[attr]) {
          this.friendlyMSG = "请填写所有必要项";
          return false;
        }
      }
      let url = "/api/gtd/daily/healthInput";
      let res = await sendPost(url, data);
      switch (parseInt(res.code)) {
        case 200:
          this.friendlyMSG = "成功录入信息";
          // window.location.reload();
          break;
        case 203:
          this.friendlyMSG = "该日信息已经录入，暂时不提供修改功能";
          break;
        default:
          this.friendlyMSG = "数据库错误，请检查源代码";
          break;
      }
      return false;
    }
  }
});
