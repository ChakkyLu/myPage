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
    url: '/search/:keyword',
    templateUrl: 'htm/leftNav.htm',
    controller: 'goodsCtrl'
  })
})
