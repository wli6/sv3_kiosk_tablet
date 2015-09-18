kiosk.controller('ScreensaverCtrl', function($scope, $timeout, $interval){

  console.log('Screensaver running...');
  var intervalID;
  intervalID = $interval(function() {
    cycleImages();
  }, 10200);

  function cycleImages() {
    var active = $('#screensaver .active');
    var next = active.next().length > 0 ? active.next() : $('#screensaver img:first');
    next.css('z-index', 2);
    active.fadeOut(1500, function() {
      active.css('z-index', 1).show().removeClass('active');
      next.css('z-index', 3).addClass('active');
    });
  }

  $scope.goToHome = function() {
    $interval.cancel(intervalID);
    location.href = '#/';
  };

  $scope.$on('$destroy', function() {
    $('body').children().unbind();
  });

});