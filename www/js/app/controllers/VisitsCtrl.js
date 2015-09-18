kiosk.controller('VisitsCtrl', function($scope, $timeout, $interval) {

  $scope.query = '';
  $timeout(function() {
    Animations.searchInit();
  });

  $scope.showOverlay = function() {
    $scope.overlay = true;
  };

  $scope.closeOverlay = function() {
    $scope.overlay = false;
  };

  $scope.$watch('query', function(val) {
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
      // this is returning the person you are here to see - so 'Paul Lee at Building Intelligence' is not the person checking in - their info is stored through the initial scan
      $scope.tenantResults = data;
    }, function(data, errorText) {
      alert('ERROR ' + data.status + ': ' + data.statusText);
    });
  };

  $scope.selectTenant = function(t) {
    console.log(t);
    // filter by tenant_id here and pass as option
    $scope.tenant = t;
    AppService.searchVisits({
      query: t.id
    }, function(data) {
      // fake filter here
      var tvs = _.compact(_.map(data, function(v) {
        if (v.tenant.id == t.id) return v;
      }));
      // just for now
      $scope.todaysVisits = _.flatten([tvs, tvs, tvs]);
      var pvs = _.compact(_.map(data, function(v) {
        if (v.tenant.id == t.id) return v;
      }));
      $scope.pastVisits = _.flatten([pvs, pvs, pvs]);
      $scope.noToday = $scope.todaysVisits.length === 0 ? true : false;
      $scope.noPast = $scope.todaysVisits.length === 0 ? true : false;
    }, function(data, errorText) {
      alert('ERROR ' + data.status + ': ' + data.statusText);
    });
  };

  $scope.selectVisit = function(v) {
    console.log(v);
    app.setStore('past_visit', false);
    location.href = "#/visits/" + v.id;
  };

  $scope.selectPV = function(pv) {
    app.setStore('past_visit', true);
    location.href = "#/visits/" + pv.id;
  };

  $scope.$on('$destroy', function() {
    $('body').children().unbind();
  });

});