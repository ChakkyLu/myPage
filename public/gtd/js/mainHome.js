var ct = new Vue({
  el: '#mainHome',
  methods: {
    turnPage: async function(index, event) {
      switch (index) {
        case -1:
          if(this.curPage == this.totalPage) return false;
          this.curPage += 1;
          if (this.totalPage > 10) {
            if (this.curPage < this.totalPage - 9) {
              let start = this.curPage;
              let l = this.pages.length;
              for (let i = 0; i < l; i++) {
                Vue.set(this.pages, i, start++);
              }
            } else {
              let start = this.totalPage - 9;
              let l = this.pages.length;
              for (let i = 0; i < l; i++) {
                Vue.set(this.pages, i, start++);
              }
            }
          }
          break;
        case -2:
        if(this.curPage == 1) return false;
          this.curPage -= 1;
          if (this.totalPage > 10) {
            if (this.curPage > 10) {
              let start = this.curPage - 9;
              let l = this.pages.length;
              for (let i = 0; i < l; i++) {
                Vue.set(this.pages, i, ++start);
              }
            } else {
              let l = this.pages.length;
              for (let i = 0; i < l; i++) {
                Vue.set(this.pages, i, i+1);
              }
            }
          }
          break;
        case -3:
          this.curPage = this.totalPage;
          break;
        default:
          this.curPage = index;
          break;
      }
      let l = this.pageSelect.length;
      for(let i=0; i<l; i++) {
        Vue.set(this.pageSelect, i, 0);
      }
      this.finalCheck = false;
      if (index != -3){
        Vue.set(this.pageSelect, this.pages.indexOf(this.curPage), 1);
      } else {
        this.finalCheck = true;
      }
      this.items = await sendReq("/gtd/getBlog?id=19&page=" +this.curPage);
      $("html, body").animate({ scrollTop: 0 });
      return false;
    },
    readMore: function(bid) {
      window.location.href = "http://www.rikuki.cn/gtd/blogContent.html?bid=" + bid;
      return -1;
    },
    expand: function(index) {
      let l = this.clicked.length;
      let tmp_clicked = this.clicked;
      for (let i=0; i<l; i++) {
        if (i==index) Vue.set(this.clicked, index, 1);
        else Vue.set(this.clicked, i, tmp_clicked[i]);
      }
    },
    shrink: function(index) {
      let l = this.clicked.length;
      let tmp_clicked = this.clicked;
      for (let i=0; i<l; i++) {
        if (i==index) Vue.set(this.clicked, index, 0);
        else Vue.set(this.clicked, i, tmp_clicked[i]);
      }
    }
  },
  mounted: async function () {
    this.items = await sendReq("/gtd/getBlog?id=19&page=1");
    this.twits = await sendReq("/api/gtd/getTW?id=19");
    for(let i=0; i<this.twits.length; i++) {
      this.clicked.push(0);
    }
    let totalPage = await sendReq("http://www.rikuki.cn/api/gtd/getTP?uid=19");
    for(let i=0; i<Math.min(totalPage,10); i++) {
      this.pages.push(i+1);
      if(i==0) this.pageSelect.push(1);
      else this.pageSelect.push(0);
    }
    this.totalPage = totalPage;
  },
  data: {
    items: null,
    twits: null,
    pages: [],
    pageSelect: [],
    curPage: 1,
    clicked: [],
    totalPage: 0,
    finalCheck: false
  }
})
