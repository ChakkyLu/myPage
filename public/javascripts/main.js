function checkLogin() {
  window.event.returnValue=false;
  jQuery.noConflict();
  var username = $('#username').val();
  var password = $('#password').val();
  if (password == "") {
    alert("Please input password");
  }
  console.log($('#rempwd')[0]['checked']);
  $.post('/post_login',
    {
      username: username,
      password: password,
      rempwd: Number($('#rempwd')[0]['checked'])
    },
    function(data, status) {
      console.log(data);
      switch (data.code) {
        case 401:
          $('#loginnotice-body').text("Please input correct username");
          $('#loginnotice-body').visibility = "visible";
          $('#loginnotice-body').css("color", '#DC143C');
          break;
        case 200:
          window.location.href = "main.html";
          break;
        case 402:
          $('#loginnotice-body').text("Please input correct password");
          $('#loginnotice-body').visibility = "visible";
          $('#loginnotice-body').css("color", '#DC143C');
          break;
        case 403:
          $('#loginnotice-body').text("Please activate your account at first");
          $('#loginnotice-body').visibility = "visible";
          $('#loginnotice-body').css("color", '#DC143C');
          break;
        default:
          break;
      }
    });
  return 0;
}

function searchArticle() {
  window.event.returnValue=false;
  var searchBox = $('#searchBox').val();
  window.location.href = "search.html?keyword=" + searchBox;
  return 0;
}

function signup() {
  window.event.returnValue=false;
  window.location.href = "signup.html";
  return 0;
}

function checkreg() {
  window.event.returnValue=false;
  var reg_email = $('#reg_email').val();
  var reg_pwd = $('#reg_password').val();
  var pwd_test1 = /[0-9]/;
  var pwd_test2 = /[a-z]/i;

  if (reg_email == "" || reg_pwd == "" || $('r#reg_password_again').val() == "") {
    alert("请输入用户名和密码");
    return 0;
  }
  if (reg_email.indexOf('@') == -1) {
    $('#reg_btn_info').text("请输入正确格式的邮箱");
  }
  else if ($('#reg_password_again').val() !== $('#reg_password').val()){
    $('#reg_btn_info').text("两次输入密码必须相同");
  }
  else if (pwd_test1.test(reg_pwd) && pwd_test2.test(reg_pwd)) {
    $.post('/register',
      {
        email: reg_email,
        password: reg_pwd
      },
      function(data, status){
        console.log(status);
        switch (data.code) {
          case 200:
            alert("you successfuly registered");
            window.event.returnValue=false;
            window.location.href = "main.html";
            break;
          case 400:
            alert("you have registered before");
            break;
          default:

          break;
        }
      });
  } else{
    $('#reg_btn_info').text("密码长度必须大于8且包含数字和英文");
  }
  return 0;
}

function logout() {
  var id = $('#uinfo').html();
  id = parseInt(id);
  $.post('/logout',
    {
      id: id
    },
    function(data, stauts) {
      console.log(status);
      window.event.returnValue = false;
      window.location.reload();
    });
}

function associateWeibo() {
  window.event.returnValue = false;
  window.location.href = 'https://api.weibo.com/oauth2/authorize?client_id=1606107874&response_type=code&redirect_uri=http://www.rikuki.cn/passWeibo.html'
  return 0;
}
