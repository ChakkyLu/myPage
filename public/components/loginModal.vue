<template>
 <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-siginin" role="document">
      <div class="modal-content login-modal" style="height:60%;">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalCenterTitle">请登陆账号</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <input id="username" type="email" class="form-control modal-input" placeholder="用户名／邮箱" name="username">
        <input id="password" type="password" class="form-control modal-input my-2" placeholder="密码" name="password">
        <div class="checkbox">
          <label class="ml-4">
            <input type="checkbox" value="remember-me" id="rempwd"> 记住密码
          </label>
        </div>
        <hr>
          <div v-if=userInfo.isweibo>
            <p> 已检测到关联微博 <em> <%= userInfo.weiboToken.name%></em> 请注册一个用户名or邮箱</p>
            <button class="btn btn-signup btn-block" onclick=""> 注册 </button>
          </div>
          <div v-else>
            <button class="btn btn-login btn-block" onclick="checkLogin()"> 登陆 </button>
            <p> 还没有账号? </p>
            <button class="btn btn-signup btn-block" onclick="signup()"> 注册 </button>
            <p> 或者使用微博登录 (由于微应用审核中，该功能日后开启)</p>
            <button class="btn btn-weibo btn-block" onclick="associateWeibo()" disabled> 关联微博 </button>
          </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    name: 'loginModal',
    data: function () {
      return {
        userInfo: {
          _id: 19,
          _username: "hahah",
          isweibo: 0
        }
      }
    }
  }
</script>

<style>
@import "../../css/main.css";
@import "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"
</style>
