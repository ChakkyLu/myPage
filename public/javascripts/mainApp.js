var app = angular.module('nav', ['ngCookies', 'ui.router']);
app.directive("topNav", function() {
  return {
    restrict: "E",
    templateUrl: "/htm/topNav.htm",
    controller: 'topNavCtrl'
  }
});
app.directive("searchBanner", function() {
  return {
    restrict: "E",
    templateUrl: "/htm/searchBanner.htm",
    controller: 'searchBanCtrl'
  }
});

app.directive('addItem', function() {
  return {
    restrict: 'E',
    templateUrl: '/htm/addItem.htm',
    controller: 'addItemCtrl'
  }
});
app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl: '/htm/homeAds.htm'
  })
  .state('search', {
    url: '/search/:keyword/:kind',
    templateUrl: 'htm/leftNav.htm',
    controller: 'goodsCtrl'
  })
});

var admin = angular.module('admin', ['ngCookies', 'ui.router']);
admin.directive("topNav", function() {
  return {
    restrict: "E",
    templateUrl: "/htm/topNav.htm",
    controller: 'topNavCtrl'
  }
});

// admin.directive('addItem', function() {
//   return {
//     restrict: 'E',
//     templateUrl: '/htm/addItem.htm',
//     controller: 'addItemCtrl'
//   }
// });
admin.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/category');
  $stateProvider
  .state('category', {
    url: '/category',
    templateUrl: '/htm/addItem.htm',
    controller: 'addItemCtrl'
  })
  .state('store', {
    url: '/store',
    templateUrl: 'htm/addStore.htm',
    controller: 'addStoreCtrl'
  })
  .state('goods', {
    url: '/goods',
    templateUrl: 'htm/addGoods.htm',
    controller: 'addGoodsCtrl'
  })
});
