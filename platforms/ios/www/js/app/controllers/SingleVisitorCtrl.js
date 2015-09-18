kiosk.controller('SingleVisitorCtrl', function($scope, $routeParams, $timeout, $interval) {
  $scope.visitor_id = $routeParams.id;
  $scope.pastVisit = app.getStore('past_visit');

  AppService.fetchVisitor({
    visitor_id: $scope.visitor_id
  }, function(data) {
    console.log(data);
    if (data) {
      $scope.visitor = new Visit(data).attributes;
    } else {
      location.href = '#/visits';
    }
  }, function(data, errorText) {
      bootbox.alert('<h3 class="red">ERROR ' + data.status + ': ' + data.statusText + "</h3>");
  });

  $timeout(function() {
    Animations.buttonsInit();
    Animations.singleOverlayInit({
      overlay_id: 'visitor-overlay'
    }, function(data) {
      $scope.toggleOverlay = function() {
        data.toggleOverlay(data.overlay);
      };
      $scope.toggleOverlay();
    });
    [].slice.call(document.querySelectorAll('.progress-button')).forEach(function(bttn, pos) {
      new UIProgressButton(bttn, {
        callback: function(instance) {
          var progress = 0;
          var progressInterval = $interval(function() {
            var choice = 1;
            progress = Math.min(progress + Math.random() * 0.25, 1);
            instance.setProgress(progress);
            if (progress === 1) {
              instance.stop(choice);
              $interval.cancel(progressInterval);
              if (!$scope.pastVisit && choice === 1) {
                console.log("Granted access to " + $scope.visitor.name);
                app.setStore('selected_visitor', $scope.visitor);
                location.href = "#/check_in";
              } else {
                bootbox.alert($scope.visitor.name + ' has been checked out');
                location.href = "#/visits";
              }
            }
          }, 150);
        }
      });
    });
  });
});