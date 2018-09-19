var app = angular.module('nav', ['ngCookies']);
app.directive("topNav", function() {
  return {
    restrict: "E",
    templateUrl: "/htm/topNav.htm"
  }
});
app.directive("searchBanner", function() {
  return {
    restrict: "E",
    templateUrl: "/htm/searchBanner.htm"
  }
});
app.directive("leftNav", function() {
  return {
    restrict: "E",
    templateUrl: "/htm/leftNav.htm"
  }
});
