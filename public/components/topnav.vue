<template>
  <nav class="site-header sticky-top py-1">
    <h2 hidden id="uinfo">{{userInfo._id}}</h2>
    <div class="container d-flex flex-md-row justify-content-between">
      <a class="py-2" href='#'>
        <img src="images/icon.png" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      </a>
      <a class="py-2 d-md-inline-block nav-a-color" href="/">Main</a>
      <a class="py-2 d-md-inline-block nav-a-color" href="#">Article</a>
      <li class="nav-item dropdown">
        <a class="py-2 d-md-inline-block nav-a-color dropdown-toggle" href="#" data-toggle="dropdown" id="expand-game">Game</a>
        <div class="dropdown-menu" aria-labelledby="expand-game" style="margin-left:-4rem!important;">
          <a class="dropdown-item" href="/game?title=flappyBall">Flappy Ball</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
      </div>
      </li>
      <a class="py-2 d-md-inline-block nav-a-color" href="/machine?key=price">Machine</a>
      <a class="py-2 d-md-inline-block nav-a-color" href='#' id="associate-weibo">Weibo</a>
        <img src="images/login.png" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor">
      </a> -->
      <a class="py-2" data-toggle="modal" data-target="#loginModal" id="hover-login">
        <img src="images/login.png" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor">
      </a>
      <a class="py-2" id="logged" style="display:none">
        <img src="images/loged.jpg" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" type="button" id="selfInfoButton" data-toggle="dropdown" aria-expanded="false">
        <div class="dropdown-menu dropdown-self"  aria-labelledby="selfInfoButton">
          <div class="row-2">
            <img src="images/logo3.jpg" class="self-icon" width="60" height="60" viewBox="0 0 60 60">
            <h class="self-name">{{userInfo._username}}</h>
            <div v-if=userInfo.isweibo>
              <button type="button" class="btn btn-quit1 btn-sm" style="font-size:12px;" disabled>已关联微博</button>
            </div>
            <div v-else>
              <button type="button" class="btn btn-quit1 btn-sm" onclick="associateWeibo()">关联微博</button>
            </div>
            <!-- <button type="button" class="btn btn-quit1 btn-sm" onclick="associateWeibo()">关联微博</button> -->
            <button type="button" class="btn btn-quit btn-sm" style="font-size:12px; margin-left:6.5rem!important;">退出</button>
          </div>
          <!-- <div class="row-2">
            <div class="row"><button type="button" class="btn btn-quit1 btn-sm">退出</button></div>
            <div class="row"><button type="button" class="btn btn-quit btn-sm" onclick="associateWeibo()">关联微博</button></div>
          </div> -->
        </div>
      </a>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'topNav',
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
@import "../stylesheets/main.css";
</style>
