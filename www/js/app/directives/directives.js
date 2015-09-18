kiosk.directive('backBtn', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/backBtn.html'
  };
});

kiosk.directive('pivOverlay', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/pivOverlay.html'
  };
});

kiosk.directive('licenseOverlay', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/licenseOverlay.html'
  };
});

kiosk.directive('barcodeOverlay', function() {
  return {
    restrict: 'E',
    templateUrl: 'partials/barcodeOverlay.html'
  };
});

kiosk.directive('screensaverListener', function($window) {
  return function(scope, element, attrs) {
    (function() {
      $('body').bind('idle.idleTimer', function() {
        $window.location.href = '#/screensaver';
      });

      $('body').bind('active.idleTimer', function() {
        $window.location.href = '#/';
      });

      $('body').idleTimer(1800000);
    })();
  };
});
