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
    }
    let url = "http://www.rikuki.cn/api/gtd/getC4EB?type=0";
    let types = await sendReq(url);
    this.types = types;
    setInterval(() => {
      if (this.title != this.lastEdit.title || this.subtitle != this.lastEdit.subtitle || this.content != this.lastEdit.content) {
        this.autoSave();
        this.lastEdit.title = this.title;
        this.lastEdit.subtitle = this.subtitle;
        this.lastEdit.content = this.content;
      }
    }, 5*60*1000);
  },
  data : {
    title: '',
    subtitle: '',
    type: 0,
    types: [],
    content: '',
    status: 'new',
    newType: "",
    autoSaveId: null,
    autoSaveTime: '',
    lastEdit: {title: '', content: '', subtitle: ''}

  },
  methods: {
    autoSave: async function(){
      console.log("ahhaha");
      if (this.title || this.content) {
        let title = this.title;
        let uid = 19;
        let content = this.content;
        let subtitle = this.subtitle;
        let url = "http://www.rikuki.cn/api/gtd/ASB";
        let bid = this.autoSaveId ? this.autoSaveId : -1;
        let body = {
          uid: uid,
          bid: bid,
          title: title,
          content: content,
          subtitle: subtitle
        };
        let res = await sendPost(url, body);
        this.autoSaveId = res.info.bid;
        this.autoSaveTime = res.info.time;
      }
    },
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
