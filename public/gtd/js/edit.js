var myModal =  {
  template: `<div id="selectSaved" class="modal">
    <div class="modal-content">
      <span class="close" v-on:click="close">&times;</span>
      <div class="modal-header">
        <h3 style="margin-bottom:0; color:#ed786a"> 选择载入草稿 </h3>
      </div>
      <div class="modal-body">
        <ul>
          <li style="list-style:none;" v-for="(item, index) in items">
            <input type="radio" style="-webkit-appearance:radio; display:inline;"
              v-model="selected" name="drone" :value="index" checked/>
            <label for="time">{{item.created}}</label>
            <label for="title">{{item.title}}</label>
          </li>
        </ul>
      </div>
      <div class="modal-footer">
      <button style="margin-left:auto; margin-right:0; cursor:pointer; margin-top:10px" v-on:click="$emit('load-save', selected)">载入</button>
      </div>
    </div>
  </div>`,
  data() {
    return {
      selected: 0
    }
  },
  props: ['items'],
  methods: {
    close: function() {
      let modal = document.getElementsByClassName('modal');
      modal[0].style.display = 'none';
    }
  }
}

var ub = new Vue({
  el: '#update-blog',
  components: {
    'my-modal': myModal
  },
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
    lastEdit: {title: '', content: '', subtitle: ''},
    savedItems: [],
    loadSave: null,
    image: null
  },
  methods: {
    onFileChange(e) {
     var files = e.target.files || e.dataTransfer.files;
     if (!files.length)
       return;
     this.createImage(files[0]);
     var form_data = new FormData();
     form_data.append('file', files[0]);
     let url = "uploadIMG";
     $.ajax({
        url: url,
        cache: false,
        contentType: false,
        processData: false,
        async: false,
        data: form_data,
        type: 'post',
        success: function(data) {
            console.log(data);
        }
      });
   },
    createImage(file) {
     var image = new Image();
     var reader = new FileReader();
     var vm = this;
     reader.onload = (e) => {
        vm.image = e.target.result;
    };
      reader.readAsDataURL(file);
    },
    removeImage: function (e) {
      this.image = '';
    },
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
    showModal: function(name) {
      let modal = document.getElementById(name);
      modal.style.display = 'block';
    },
    load: function(index) {
      // console.log(index);
      this.close();
      this.title = this.savedItems[index].title;
      this.subtitle = this.savedItems[index].subtitle;
      this.content = this.savedItems[index].content;
    },
    readSaved: async function(name) {
      this.showModal(name);
      let url = "http://www.rikuki.cn/api/gtd/getSaved?id=19";
      let res = await sendReq(url);
      this.savedItems = res;
    },
    close: function() {
      let modal = document.getElementsByClassName('modal');
      modal[0].style.display = 'none';
    },
    saveArticle: async function () {
      if (this.title && this.content) {
        let title = this.title;
        let uid = 19;
        let content = this.content;
        let subtitle = this.subtitle ? this.subtitle : "";
        let type = this.type;
        let url;
        if (this.newType && this.type == -1) {
          let url = "http://www.rikuki.cn/api/gtd/addNC?belong=0&name=" + this.newType;
          let res = await sendReq(url);
          type = res.type;
        }
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
