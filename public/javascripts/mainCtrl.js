app.service('mainFun', ['$cookies', function($cookies) {
  this.verifyLogin = function () {
    var cookies = $cookies.get('userinfo');
    if (cookies) {
      return angular.fromJson(cookies);
    }
    else {
      return false;
    }
  }
  this.changeStatus = function (status) {
    var s = status;
    return !s;
  }
}]);
app.controller('topNavCtrl', function($scope, $http, $window, mainFun, $cookies) {
  $scope.remembered = false;
  if (mainFun.verifyLogin()) {
    $scope.logged = true;
    $scope.user = mainFun.verifyLogin();
  } else {
    $scope.logged = false;
  }
  $scope.checkLogin = function () {
    $http({
      method: "POST",
      url: "/post_login",
      data: {
        "username": $scope.useremail,
        "password": $scope.password,
        "remembered": $scope.remembered
      }
    }).then(function success(response) {
      let expireDate = new Date();
      if ($scope.remembered) expireDate.setDate(expireDate.getDate() + 15);
      else expireDate.setDate(expireDate.getDate() + 1);
      $cookies.put('userinfo', response.data.data, {'expires': expireDate});
      $window.location.reload();
    }, function error(response) {
      console.log(response.data);
    });
  }

  $scope.logout = function () {
    $http({
      method: "POST",
      url: "/logout",
      data: {
        "id": $scope.user.id
      }
    }).then(function success(response) {
      $cookies.remove('userinfo');
      $window.location.reload();
    }).then(function success(response) {
      console.log("error in logout");
    });
  }
});

app.controller('searchBanCtrl', function($scope, $http, $location) {
  $scope.selected = {id:"0", name:"全部分类"};
  $scope.catergory = [
    {id:"0", name:"全部分类"},
    {id:"1", name:"美妆／护肤"},
    {id:"8", name:"c2"},
    {id:"3", name:"c4"},
    {id:"2", name:"c3"},
    {id:"4", name:"c5"},
    {id:"5", name:"c6"}
  ];
  $scope.status = true;
  $scope.selectCate = function () {
    console.log($scope.selected);
    parent.status = false;
  };
  $scope.searchGoods = function () {
    $location.url = "/key="+$scope.searchKey;
    console.log($location.url);
    $http({
      method: 'GET',
      url: 'http://www.rikuki.cn/api/searchGoods?key='+$scope.searchKey
    }).then(function success(response) {
      $scope.goods = response.data.info;
      $scope.backcategories = [
        {text: 'phones', id: '0'},
        {text: 'electric', id: '1'}
      ];
      $scope.districts = [
        {text: 'jiangzhehu', id:'0'},
        {text: 'beijing', id: '1'}
      ];
      $scope.prices = [
        {text: '100-200', id: '0'},
        {text: '200-300', id: '1'}
      ];
      $scope.brands = [
        {text: "apple", id: '0'},
        {text: 'xiaomi', id: '1'}
      ]
      $scope.status = false;
    }, function error(response) {
      console.log(response);
    });
  }
});

app.controller('goodsCtrl', function($scope, $http) {
  $scope.$on('$fromSearch', function(e, data) {
    $scope.goods = data;
    console.log(data);
    console.log(e);
  });
  $scope.backcategories = [
    {text: 'phones', id: '0'},
    {text: 'electric', id: '1'}
  ];
  $scope.districts = [
    {text: 'jiangzhehu', id:'0'},
    {text: 'beijing', id: '1'}
  ];
  $scope.prices = [
    {text: '100-200', id: '0'},
    {text: '200-300', id: '1'}
  ];
  $scope.brands = [
    {text: "apple", id: '0'},
    {text: 'xiaomi', id: '1'}
  ]
});
