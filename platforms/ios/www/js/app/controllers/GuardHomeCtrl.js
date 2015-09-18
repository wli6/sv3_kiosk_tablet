kiosk.controller('GuardHomeCtrl', function($timeout, $scope, $interval) {

  $timeout(function() {
    Animations.buttonsInit();
    $scope.signIn($scope.userInfo);
  });

  $scope.showSignin = function() {
    Animations.signinInit(function(data) {
      $scope.overlayToggle = function() {
        data.toggleOverlay(data.overlay);
        data.inputAnimations();
      };
      $scope.overlayToggle();
    });
  };

  $scope.showSignin();

  $scope.userInfo = {};
  $scope.signIn = function(info) {
    [].slice.call(document.querySelectorAll('.progress-button')).forEach(function(bttn, pos) {
      new UIProgressButton(bttn, {
        callback: function(instance) {
          var progress = 0;
          var choice = login(info) ? 1 : -1;
          var progressInterval = $interval(function() {
            progress = Math.min(progress + Math.random() * 0.25, 1);
            instance.setProgress(progress);
            if (progress === 1) {
              instance.stop(choice);
              $interval.cancel(progressInterval);
              if (choice === 1) {
                location.href = "#/visits";
              } else {
                console.log('Login failed.');
              }
            }
          }, 150);
        }
      });
    });
  };

  function login(info) {
    return info.name == 'guard1@vms.us' && info.password == '1234' ? true : false;
  }

  $scope.$on('$destroy', function() {
    $('body').children().unbind();
  });
});