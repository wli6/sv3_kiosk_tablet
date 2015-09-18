kiosk.controller('TenantCallCtrl', function($scope, $timeout, $interval) {
  $scope.goBack = function() {
    location.href = '#/';
  };
  $scope.letters = ALPHA_NUMERICAL;
  $scope.numSymbols = NUM_SYMBOLS;
  $scope.optSymbols = OPT_SYMBOLS;
  $scope.queryString = '';
  var callTimeOn;
  if (app.getStore('selected_schedule')) app.removeStore('selected_schedule');

  $timeout(function() {
    Animations.singleOverlayInit({
      overlay_id: 'phone-overlay'
    }, function(data) {
      $scope.overlayToggle = function() {
        data.toggleOverlay(data.overlay);
      };
    });
  });

  $scope.updateQuery = function(val) {
    if (val == 'SPACE') {
      $scope.queryString += ' ';
    } else if (val == 'DELETE') {
      $scope.queryString = $scope.queryString.slice(0, $scope.queryString.length - 1);
    } else {
      $scope.queryString += val;
    }
  };

  $scope.$watch('queryString', function(val) {
    if (val.length > 2) {
      if ($scope.filterTextTimeout) $timeout.cancel($scope.filterTextTimeout);
      $scope.tempFilterText = val;
      $scope.filterTextTimeout = $timeout(function() {
        $scope.filterQuery = $scope.tempFilterText;
        $scope.searchTenants($scope.filterQuery);
      }, 250);
    }
  });

  $scope.searchTenants = function(query) {
    AppService.fetchTenants({
      query: query
    }, function(data) {
      $scope.results = data; //this is obvi a test
      $scope.noResults = $scope.results.length <= 0 ? true : false;
    }, function(data, errorText) {
      bootbox.alert('<h3 class="red">ERROR ' + data.status + ': ' + data.statusText + "</h3>");
    });
  };

  $scope.callTenant = function(tenant) {
    $scope.calling = tenant;
    $scope.callText = 'Calling ' + tenant.phone_number + ' x ' + tenant.phone_extension +  '...';
    $scope.callLength = "00:00:00";
    $scope.timer = 0;
    callTimeOn = $interval(function() {
      $scope.startCallTimer();
    }, 1000);
    $timeout(function() {
      $scope.callText = 'Connected to ' + tenant.company_name;
    }, 5500);
  };

  $scope.startCallTimer = function() {
    var seconds = $scope.timer;
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    seconds = seconds >= 60 ? seconds % 60 : seconds;
    minutes = minutes >= 60 ? minutes % 60 : minutes;
    secondsText = seconds >= 10 ? seconds : ("0" + seconds);
    minutesText = minutes >= 10 ? minutes : ("0" + minutes);
    hoursText = hours >= 10 ? hours : ("0" + hours);
    $scope.callLength = hoursText + ":" + minutesText + ":" + secondsText;
    $scope.timer += 1;
  };

  $scope.sendTwilioOption = function(val) {
    $timeout(function() {
      $scope.chooseRandom(val);
    }, 1200);
  };

  $scope.chooseRandom = function(random) {
    if (random == 5) {
      $scope.callText = "Permission granted. Get ready to take your photo.";
      $timeout(function() {
        $scope.hangup();
        location.href = "#/check_in";
      }, 4500);
    } else {
      $scope.callText = "Permission Denied. Please see a security guard for assistance.";
      $timeout(function() {
        $scope.hangup();
      }, 4500);
    }
  };

  $scope.hangup = function() {
    $scope.callText = 'Hanging up...';
    console.log('Call length: ' + $scope.callLength);
    $interval.cancel(callTimeOn);
    $timeout(function() {
      $scope.overlayToggle();
    }, 1100);
  };

  $scope.$on('$destroy', function() {
    $('body').children().unbind();
  });
});