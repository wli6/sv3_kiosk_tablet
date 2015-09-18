kiosk.controller('CheckInCtrl', function($scope, $timeout, dymoPrinter) {
  $scope.goBack = function() {
    window.history.back();
  };
  $scope.visit = app.getStore('selected_schedule');

  Webcam(function(data) {
    var info = $scope.visit;
    if (info) info.image = data.image.src;

    $scope.$apply(function() {
      $scope.badgeInfo = info;
      $scope.showBackBtn = true;
    });

    $scope.$on('$destroy', function() {
      data.shutDown();
      $('body').children().unbind();
    });
  });

  $scope.printBadge = function(info) {
    console.log('Printing badge...');
    dymoPrinter.print($scope.visit);
    location.href = "#/";
  };

});