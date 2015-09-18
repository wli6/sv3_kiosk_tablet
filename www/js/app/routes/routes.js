kiosk.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl: '../html/home.html',
    controller: 'HomeCtrl'
  }).
  when('/check_in', {
    templateUrl: '../html/check_in.html',
    controller: 'CheckInCtrl'
  }).
  when('/tenant_call', {
    templateUrl: '../html/tenant_call.html',
    controller: 'TenantCallCtrl'
  }).
  // potentially in different app for guard/tenant interface
  when('/guard_home', {
    templateUrl: '../html/guard_home.html',
    controller: 'GuardHomeCtrl'
  }).
  when('/visits', {
    templateUrl: '../html/visits.html',
    controller: 'VisitsCtrl'
  }).
  when('/visits/:id', {
    templateUrl: '../html/single_visitor.html',
    controller: 'SingleVisitorCtrl'
  }).
  // screesaver and redirects
  when('/screensaver', {
    templateUrl: '../html/screensaver.html',
    controller: 'ScreensaverCtrl'
  }).
  otherwise({
    redirectTo: '/'
  });
}]);