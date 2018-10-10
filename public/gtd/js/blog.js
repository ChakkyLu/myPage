let sendReq = function sendReq(url) {
  return new Promise((resolve, reject) => {
    $.get(url, function(body) {
      if(typeof(body) == 'string') {
        body = JSON.parse(body);
      }
      if (body.code!=200) reject(body.msg);
      else resolve(body.info);
    });
  });
}

var ub = new Vue({
  el: '#update-blog',
  mounted: async function() {
    let href = window.location.href;
    if (href.indexOf('?') != -1) {
      let bid = href.substring(href.indexOf('?')+5, href.length);
      let blogctx = await sendReq("http://www.rikuki.cn/api/gtd/getBC?bid="+bid);
      this.title = blogctx.title;
      this.subtitle = blogctx.subtitle;
      this.content = blogctx.content;
      this.status = 'modify';
      if(bid.indexOf('#') != -1) {
          this.bid = bid.substring(0,bid.length-1);
      } else {
        this.bid = bid;
      }
    ;
    }
  },
  data : {
    title: '',
    subtitle: '',
    type: '00',
    content: '',
    status: 'new'
  },
  methods: {
    saveArticle: function () {
      if (this.title && this.content) {
        let title = this.title;
        let uid = 19;
        let content = this.content;
        let subtitle = this.subtitle ? this.subtitle : "";
        let type = this.type;
        let url;
        if(this.status=="new") {
          let url = "http://www.rikuki.cn/api/gtd/newBlog";
          $.post(url, {
            uid: uid,
            title: title,
            content: content,
            subtitle: subtitle,
            type: type
          }, function(data, status) {
            data = JSON.parse(data);
            let code = data.code;
            switch(code) {
              case 200:
                alert("文章已经成功保存");
                window.location.href = "http://www.rikuki.cn/gtd/blog.html";
                break;
              case 401:
                alert("保存失败，请重新保存");
                break;
              case 402:
                alert("数据库bug，请检查数据库是否有问题");
                break;
              default:
                break;
            }
          })
        }
        else {
          let url = "http://www.rikuki.cn/api/gtd/updateBlog";
          var bid = this.bid;
          $.post(url, {
            uid: uid,
            bid: this.bid,
            title: title,
            content: content,
            subtitle: subtitle,
            type: type
          }, function(data, status) {
            data = JSON.parse(data);
            let code = data.code;
            switch(code) {
              case 200:
                alert("文章修改成功");
                window.location.href = "http://www.rikuki.cn/gtd/blogContent.html?bid="+ bid;
                break;
              case 401:
                alert("保存失败，请重新保存");
                break;
              case 402:
                alert("数据库bug，请检查数据库是否有问题");
                break;
              default:
                break;
            }
          })
        }
      }
      else {
        alert("标题和内容不能为空");
      }
    }
  }
})

var ct = new Vue({
  el: '#main',
  methods: {
    turnPage: async function(index, event) {
      if( index== -1 || index == -2 ) {
        this.curPage = this.curPage + 1 ? index==-1 : this.curPage - 1;
      } else {
        let l = this.pageSelect.length;
        this.curPage = this.pages[index];
        for(let i=0; i<l; i++) {
          Vue.set(this.pageSelect, i, 0);
        }
        Vue.set(this.pageSelect, index, 1);
      }
      this.items = await sendReq("/gtd/getBlog?id=19&page=" +this.curPage);
      $('body').animate({scrollTop: '0px'}, 0);
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
  },
  data: {
    items: null,
    twits: null,
    pages: [],
    pageSelect: [],
    curPage: 1,
    clicked: []
  }
})

var bctx = new Vue({
  el: "#blogctx",
  data: {
    title: "",
    subtitle: "",
    content: "",
    created: "",
    modified: "",
    id: 0
  },
  methods: {
    edit: function(id) {
      window.location.href="/gtd/editBlog.html?bid="+id;
    },
    deleteB: function(id) {
      alert("写文章不易，你确定要删除文章吗？");
      $.get('http://www.rikuki.cn/api/gtd/deleteBlog?bid='+id, function(data) {
        data = JSON.parse(data);
        switch (data.code) {
          case 200:
            alert("文章已经删除");
            window.location.href="/gtd/blog.html";
            break;
          default:
            console.log("err");
            break;
        }
      })
    }
  },
  mounted: async function () {
    let href = window.location.href;
    let bid = href.substring(href.indexOf('?')+5, href.length);
    let blogctx = await sendReq("http://www.rikuki.cn/api/gtd/getBC?bid="+bid);
    this.title = blogctx.title;
    this.subtitle = blogctx.subtitle;
    this.content = blogctx.content;
    this.created = blogctx.created;
    this.modified = blogctx.modified;
    this.id = blogctx.id;
  }
})

var posts = new Vue({
  el: "#posts",
  methods: {
    turnPage: async function(index, event) {
      if( index== -1 || index == -2 ) {
        this.curPage = this.curPage + 1 ? index==-1 : this.curPage - 1;
      } else {
        let l = this.pageSelect.length;
        this.curPage = this.pages[index];
        for(let i=0; i<l; i++) {
          if (i==index) Vue.set(this.pageSelect, i, 1);
          else Vue.set(this.pageSelect, i, 0);
        }
        let res = await sendReq("/api/gtd/getFTW?id=19&page="+this.curPage);
        this.twits = res.ctx;
        // let totalPage = res.totalPage;
        $('body').animate({scrollTop: '0px'}, 0);
      }
    },
    showModal: function() {
      let modal = document.getElementById('newTwit');
      modal.style.display = "block";
    },
    close: function() {
      let modal = document.getElementById('newTwit');
      modal.style.display = "none";
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
            console.log("ok");
            window.location.reload();
            break;
          default:
            console.log("err");
            break;
        }
      });
    }
  },
  mounted: async function() {
    // let href = window.location.href;
    let res = await sendReq("/api/gtd/getFTW?id=19");
    this.twits = res.ctx;
    let totalPage = res.totalPage;
    for(let i=0; i<Math.min(totalPage,10); i++) {
      this.pages.push(i+1);
      if(i==0) this.pageSelect.push(1);
      else this.pageSelect.push(0);
    }
  },
  data: {
    twits: [],
    pages: [],
    curPage: 1,
    pageSelect: [],
    newcontent: null
  }
});
