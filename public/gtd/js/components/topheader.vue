<template>
<section id="header">
  <div class="container">

    <!-- Logo -->
    <h1 id="logo"><a href="main.html" style="line-height:1.5;">{{title}}</a></h1>
    <p>{{subtitle}}</p>

    <!-- Nav -->
      <nav id="nav">
        <ul>
          <li><a class="icon fa-home" href="main.html"><span>主页</span></a></li>
          <li>
            <a href="blog.html" class="icon fa-bar-chart-o"><span>文字</span></a>
            <ul>
              <li><a href="#">回忆录</a></li>
              <li><a href="#">小说</a></li>
              <li>
                <a href="#">记录</a>
                <ul>
                  <li><a href="#">周记</a></li>
                  <li><a href="#">日记</a></li>
                  <li><a href="#">月刊</a></li>
                </ul>
              </li>
              <li><a href="triffle.html">胡言乱语</a></li>
            </ul>
          </li>
          <li v-for="nav in navs"><a class="icon icon-home" href="nav.add"><span>{{nav.text}}</span></a></li>
        </ul>
      </nav>

  </div>
</section>
</template>

<script>
module.exports = {
  data() {
    return {
      title: "虽说世界是旋转的",
      subtitle: "两岸猿声啼不住，轻舟已过万重山",
      navs: [
        {
          text:"设置",
          add: "main.html"
        },
        {
          text:"任务",
          add: "main.html"
        },
        {
          text:"相册",
          add: "main.html"
        }
      ]
    }
  }
}
</script>
