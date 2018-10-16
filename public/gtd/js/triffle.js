var posts = new Vue({
  el: "#posts",
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
      let res = await sendReq("/api/gtd/getFTW?id=19&page="+this.curPage);
      this.twits = res.ctx;
      $("html, body").animate({ scrollTop: 0 });
    },
    showModal: function() {
      let modal = document.getElementById('newTwit');
      modal.style.display = "block";
    },
    close: function(event) {
      let modal = document.getElementsByClassName('modal');
      for (let i = 0; i < modal.length; i++) {
        modal[i].style.display = "none";
      }
    },
    newTwit: function() {
      let content = this.newcontent;
      let url = "http://www.rikuki.cn/api/gtd/newT";
      $.post(url, {
        content: content
      }, function(data, status) {
        data = JSON.parse(data);
        switch(data.code) {
          case 200:
            let modal = document.getElementById('newTwit');
            modal.style.display = "none";
            this.notification = "发表碎碎念成功" ;
            modal = document.getElementById('hint');
            modal.style.display = "block";
            console.log(this.notification);
            setTimeout(function(){
              modal.style.display = "none";
              window.location.reload();
            }, 1000);
            break;
          default:
            this.notification = "发表错误，请重新操作！";
            console.log("err");
            break;
        }
      });
    },
    delTwit: function(id) {
      let url = "http://www.rikuki.cn/api/gtd/delT?tid=" + id;
      $.get(url, function(data, status) {
        data = JSON.parse(data);
        switch(data.code) {
          case 200:
            let modal = document.getElementById('hint');
            this.notification = "删除成功";
            modal.style.display = "block";
            setTimeout(function(){
              modal.style.display = "none";
              window.location.reload();
            }, 1000);
            break;
          default:
            this.notification = "数据库错误！";
            console.log("err");
            break;
        }
      });
    }
  },
  mounted: async function() {
    let res = await sendReq("/api/gtd/getFTW?id=19");
    this.twits = res.ctx;
    let totalPage = res.totalPage;
    for(let i=0; i<Math.min(totalPage,10); i++) {
      this.pages.push(i+1);
      if(i==0) this.pageSelect.push(1);
      else this.pageSelect.push(0);
    }
    this.totalPage = totalPage;
    this.categories = res.category;
  },
  data: {
    twits: [],
    pages: [],
    curPage: 1,
    pageSelect: [],
    newcontent: "",
    totalPage: 0,
    finalCheck: false,
    notification: "",
    categories: [],
    type: 0
  }
});
