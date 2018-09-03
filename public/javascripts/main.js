function checkLogin() {
  window.event.returnValue=false;
  var username = $('#username').val();
  var password = $('#password').val();
  if (password == "") {
    alert("Please input password");
  }
  $.post('/post_login',
    {
      username: username,
      password: password
    },
    function(data, status) {
      jQuery.noConflict();
      console.log(data);
      switch (data.code) {
        case 401:
          $('.modal-body').text("Please input correct username");
          $('#myModal').modal('show');
          break;
        case 200:
          window.location.href = "main.html";
          break;
        case 402:
          $('.modal-body').text("Please input correct password");
          $('#myModal').modal('show');
          $('#password').css("color", '#DC143C');
          // console.log("sd");
          break;
        case 403:
          $('.modal-body').text("Please activate your account at first");
          $('#myModal').modal('show');
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

$('.btn-quit1').click(function() {
  var id = $('#uinfo').html();
  id = parseInt(id);
  console.log("ahah");
  $.post('/logout',
    {
      id: id
    },
    function(data, stauts) {
      console.log(status);
      window.event.returnValue = false;
      window.location.reload();
    });
});

function associateWeibo() {
  console.log("hahh");
  window.event.returnValue = false;
  window.location.href = 'https://api.weibo.com/oauth2/authorize?client_id=1606107874&response_type=code&redirect_uri=http://www.rikuki.cn/main.html'
  return 0;
}
