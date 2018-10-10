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
