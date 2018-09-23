app.service('mainFun', ['$cookies', '$q', '$http', function($cookies, $q, $http) {
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

  this.waitHttpGet = function (method, url) {
    var deferred = $q.defer();
    $http({
      method: method,
      url: url
    }).then(function success(data, status, headers, config) {
      deferred.resolve(data);
    }, function error(data) {
      deferred.reject(data);
    });
    return deferred.promise;
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

app.controller('searchBanCtrl', function($scope, $http, $location, $window, $state, mainFun) {
  $scope.selected = {id:"0", name:"全部分类"};
  let promise = mainFun.waitHttpGet('GET', 'http://www.rikuki.cn/api/getC');
  promise.then(function(result) {
    $scope.catergory = result.data.info;
    $scope.catergory.push({id:"0", name:"全部分类"});
    console.log($scope.catergory);
  });
  // $scope.catergory = [
  //   {id:"0", name:"全部分类"},
  //   {id:"1", name:"美妆／护肤"},
  //   {id:"8", name:"c2"},
  //   {id:"3", name:"c4"},
  //   {id:"2", name:"c3"},
  //   {id:"4", name:"c5"},
  //   {id:"5", name:"c6"}
  // ];
  $scope.selectCate = function () {
    console.log($scope.selected);
  };
  $scope.searchGoods = function () {
    $state.go('search', {keyword: $scope.searchKey});
  }
});

app.controller('goodsCtrl', function($scope, $http, $state, mainFun) {
  let keyword;
  if ($state.params.keyword) keyword = $state.params.keyword;
  else keyword = "";
  // var promise = await $http.get('http://www.rikuki.cn/api/searchGoods?key='+ keyword);
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
  ];
  var promise = mainFun.waitHttpGet('GET', 'http://www.rikuki.cn/api/searchGoods?key='+ keyword);
  promise.then(function(result) {
    $scope.goods = result.data.info;
    console.log(result);
    console.log($scope.goods);
  })
  // $scope.goods = promise.info;
  // promise.then(function(data) {
  //   return data.info;
  //   $scope.goods = data.info;
  //   console.log($scope.goods);
  //
  // }, function(data) {
  //   console.log("get goods fail");
  // })

  // $http({
  //   method: 'GET',
  //   url: 'http://www.rikuki.cn/api/searchGoods?key='+ keyword
  // });
  // console.log($scope.goods);
});

app.controller('addItemCtrl', function($scope, $window, $location, $http) {
  $scope.items = [];
  console.log($scope.items.length);
  $scope.add = function () {
    $scope.items.push({name:$scope.newitem.name, type:$scope.newitem.type, id: $scope.newitem.id});
    $scope.newitem.name = "";
    $scope.newitem.id = "";
  }
  $scope.updateC = function () {
    console.log($scope.items);
    $http({
      method: 'POST',
      url: "http://www.rikuki.cn/api/updateCategory",
      headers:{'Content-Type':"application/json"},
      data: angular.toJson($scope.items)
    }).then(function success(data, status, headers, config) {
      alert("you have updated the categories successfully");
    }, function error(data) {
      console.log(data);
    });
  }
});
