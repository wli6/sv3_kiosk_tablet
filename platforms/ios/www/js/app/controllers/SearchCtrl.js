kiosk.controller('SearchCtrl', function($scope, $timeout) {
  $scope.goBack = function() {
    location.href = "#/";
  };
  $scope.letters = ALPHA_NUMERICAL;
  $scope.numSymbols = NUM_SYMBOLS;
  $scope.optSymbols = OPT_SYMBOLS;
  $scope.queryString = '';

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
        $scope.searchVisits($scope.filterQuery);
      }, 250);
    }
  });

  $scope.searchVisits = function(query) {
    AppService.searchVisits({
      query: query
    }, function(data) {
      // this is returning the person you are here to see - so 'Paul Lee at Building Intelligence' is not the person checking in - their info is stored through the initial scan
      $scope.results = _.sample([data, [], data]);//this is obvi a test
      $scope.noResults = $scope.results.length <= 0 ? true : false;
    }, function(data, errorText) {
      bootbox.alert('<h3 class="red">ERROR ' + data.status + ': ' + data.statusText + "</h3>");
    });
  };

  $scope.selectVisit = function(visit) {
    app.setStore('selected_schedule', visit);
    app.setStore('is_guard', false);
    location.href = "#/check_in";
  };

  $scope.tenantCall = function() {
    location.href = "#/tenant_call";
  };

  $scope.$on('$destroy', function() {
    $('body').children().unbind();
  });
});