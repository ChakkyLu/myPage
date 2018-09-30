app.service('mainFun', ['$cookies', '$q', '$http', function($cookies, $q, $http) {
  this.changeStatus = function (status) {
    var s = status;
    return !s;
  }

  this.waitHttpGet = function (url) {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: url,
      headers:{'Content-Type':"application/json"}
    }).then(function success(data, status, headers, config) {
      deferred.resolve(data);
    }, function error(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  }
  this.waitHttpPost = function (url, body) {
    var deferred = $q.defer();
    $http({
      method: 'post',
      url: url,
      headers:{'Content-Type':"application/json"},
      data: body
    }).then(function success(data, status, headers, config) {
      deferred.resolve(data);
    }, function error(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  }
}]);

admin.service('mainFun', ['$cookies', '$q', '$http', function($cookies, $q, $http) {
  this.changeStatus = function (status) {
    var s = status;
    return !s;
  }

  this.waitHttpGet = function (url) {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: url,
      headers:{'Content-Type':"application/json"}
    }).then(function success(data, status, headers, config) {
      deferred.resolve(data);
    }, function error(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  }
  this.waitHttpPost = function (url, body) {
    var deferred = $q.defer();
    $http({
      method: 'post',
      url: url,
      headers:{'Content-Type':"application/json"},
      data: body
    }).then(function success(data, status, headers, config) {
      deferred.resolve(data);
    }, function error(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  }
  this.uploadFile = function (file, uploadUrl) {
    var fd = new FormData();
    fd.append('file', file);
    $http.post(uploadUrl, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    })
    .then(function success(data) {
      console.log('success');
    }, function error(data) {
      console.log(data);
    });
  };
}]);

app.controller('topNavCtrl', function($scope, $http, $window, mainFun, $cookies) {
  $scope.remembered = false;
  let promise = mainFun.waitHttpGet('http://www.rikuki.cn/verifyLogin');
  promise.then(function(result) {
    if (result.data.status==200) {
      $scope.logged = true;
      $scope.user = result.data.info;
    }else {
      $scope.logged = false;
    }
  })
  // if (mainFun.verifyLogin()) {
  //   $scope.logged = true;
  //   $scope.user = mainFun.verifyLogin();
  // } else {
  //   $scope.logged = false;
  // }
  $scope.checkLogin = function () {
    console.log({
      "username": $scope.useremail,
      "password": $scope.password,
      "remembered": $scope.remembered
    });
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
      if(response.data.status = 200) {
        // if ($scope.remembered) expireDate.setDate(expireDate.getDate() + 15);
        // else expireDate.setDate(expireDate.getDate() + 1);
        // $cookies.put('userinfo', response.data.data, {'expires': expireDate});
        $window.location.reload();
      }
      else alert(response.data.data);
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
  console.log('searchBan', $state.params.kind);
  if ($state.params.keyword) $scope.searchKey = $state.params.keyword;
  if ($state.params.kind) $scope.selected = $state.params.kind;
  let promise = mainFun.waitHttpGet('http://www.rikuki.cn/api/getC');
  promise.then(function(result) {
    $scope.catergory = result.data.info;
    $scope.catergory.push({id:"0", name:"全部分类"});
  });
  $scope.selectCate = function () {
    console.log($scope.selected);
  };
  $scope.searchGoods = function () {
    $state.go('search', {keyword: $scope.searchKey,kind: $scope.selected.id});
  }
});

app.controller('goodsCtrl', function($scope, $http, $state, mainFun) {
  let keyword, kind;
  if ($state.params.keyword) keyword = $state.params.keyword;
  else keyword = "";
  if ($state.params.kind) kind = $state.params.kind;
  else kind = 0;
  $scope.chosencity = [];
  var getBackCat = mainFun.waitHttpGet("http://www.rikuki.cn/api/getBackC?kind="+kind);
  getBackCat.then(function(result) {
    $scope.backcategories = result.data.info.back;
    $scope.districts = result.data.info.district.slice(0,3);
    $scope.districts2 = result.data.info.district.slice(3,34);
  })
  $scope.prices = [
    {text: '100-200', id: '0'},
    {text: '200-300', id: '1'}
  ];
  $scope.brands = [
    {text: "apple", id: '0'},
    {text: 'xiaomi', id: '1'}
  ];
  var promise = mainFun.waitHttpGet('http://www.rikuki.cn/api/searchGoods?key='+ keyword);
  promise.then(function(result) {
    $scope.goods = result.data.info;
  });

  $scope.addDistrict = function(district) {
    $scope.chosencity.push(district);
  };
});

admin.controller('addItemCtrl', function($scope, $window, $location, $http) {
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
      $scope.items.splice(0,$scope.items.length);
    }, function error(data) {
      console.log(data);
    });
  }
});

admin.controller('topNavCtrl', function($scope, $http, $window, mainFun, $cookies) {
  $scope.remembered = false;
  let promise = mainFun.waitHttpGet('http://www.rikuki.cn/verifyLogin');
  promise.then(function(result) {
    if (result.data.code==200) {
      $scope.logged = true;
      $scope.user = result.data.info;
    }else {
      $scope.logged = false;
    }
  })
  // if (mainFun.verifyLogin()) {
  //   $scope.logged = true;
  //   $scope.user = mainFun.verifyLogin();
  // } else {
  //   $scope.logged = false;
  // }
  $scope.checkLogin = function () {
    console.log({
      "username": $scope.useremail,
      "password": $scope.password,
      "remembered": $scope.remembered
    });
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
      if(response.data.code = 200) {
        // if ($scope.remembered) expireDate.setDate(expireDate.getDate() + 15);
        // else expireDate.setDate(expireDate.getDate() + 1);
        // $cookies.put('userinfo', response.data.data, {'expires': expireDate});
        $window.location.reload();
      }
      else alert(response.data.data);
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

admin.controller('addStoreCtrl', function($scope, $window, $location, $http, mainFun) {
  let promise = mainFun.waitHttpGet('http://www.rikuki.cn/api/getC');
  $scope.storetype = {id: '0', name: "综合"};
  promise.then(function(result) {
    $scope.catergory = result.data.info;
    $scope.catergory.push({id:"0", name:"综合"});
  });
  $scope.addStore = function () {
    let storeInfo = {
      name: $scope.storeName,
      owner: $scope.ownerName,
      type: $scope.storetype.id,
      contact: $scope.phone,
      address: $scope.address
    }
    $http({
      method: 'POST',
      url: "http://www.rikuki.cn/api/updateStore",
      headers:{'Content-Type':"application/json"},
      data: storeInfo
    }).then(function success(data, status, headers, config) {
      alert("you have registered the store successfully");
    }, function error(data) {
      console.log(data);
    });
  }
});
admin.controller('addGoodsCtrl', function($scope, $window, $location, $http, mainFun) {
  // $scope.newitem.name = "";
  // $scope.newitem.price = "";
  // $scope.newitem.intro = "";
  // $scope.imgsrc = "";
  $scope.items = [];
  let cookies = $cookies.get('userinfo');
  let user = angular.fromJson(cookies);
  let id = user.id;
  var imgfile;
  {
    let promise = mainFun.waitHttpGet('http://www.rikuki.cn/api/getC');
    $scope.newitem_type = {id: '0', name: "综合"};
    promise.then(function(result) {
      $scope.catergory = result.data.info;
      $scope.catergory.push({id:"0", name:"综合"});
    });
  }
  {
    let promise = mainFun.waitHttpPost('http://www.rikuki.cn/api/getShopInfo', {userid: id});
    promise.then(function(result) {
      $scope.shopName = result.data.info.name;
      $scope.shopType = result.data.info.type;
    });
  }
  $scope.imageUpload = function(event) {
    let file = event.target.files[0];
    imgfile = file;
    let render = new FileReader();
    render.onload = $scope.imageIsLoaded;
    render.readAsDataURL(file);
  }
  $scope.imageIsLoaded = function(e){
      $scope.$apply(function() {
        $scope.imgsrc = e.target.result;
      });
  }
  $scope.add = function() {
    var uploadUrl = "http://www.rikuki.cn/api/uploadIMG";
    mainFun.uploadFile(imgfile, uploadUrl);
    $scope.items.push({
      name: $scope.newitem.name,
      type: $scope.newitem_type,
      price: $scope.newitem.price,
      intro: $scope.newitem.intro,
      src: $scope.imgsrc
    });
    $scope.newitem.name = "";
    $scope.newitem.price = "";
    $scope.newitem.intro = "";
    $scope.imgsrc = "";
  }
  // $scope.addStore = function () {
  //   let storeInfo = {
  //     name: $scope.storeName,
  //     owner: $scope.ownerName,
  //     type: $scope.storetype.id,
  //     contact: $scope.phone,
  //     address: $scope.address
  //   }
  //   $http({
  //     method: 'POST',
  //     url: "http://www.rikuki.cn/api/updateStore",
  //     headers:{'Content-Type':"application/json"},
  //     data: storeInfo
  //   }).then(function success(data, status, headers, config) {
  //     alert("you have registered the store successfully");
  //   }, function error(data) {
  //     console.log(data);
  //   });
  // }
});
