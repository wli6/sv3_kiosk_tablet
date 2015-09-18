kiosk.controller('HomeCtrl', function($scope, $routeParams, $timeout, $interval, dlScanner, motoScanner, pivScanner) {

  $scope.visitor = {};
  $scope.visitorExtraInfo = {}; //i.e. photos, expirations dates, etc.

  $timeout(function() {
    Animations.overlayInit(function(data) {
      $scope.PivCardOverlay = data.overlay;
      $scope.DriverLicenseOverlay = data.overlayTwo;
      $scope.BarcodeOverlay = data.overlayThree;
    });
    Animations.buttonsInit();
  }, 5000);

  // DRIVER LICENSE SCANNER
  if (dlScanner.connect()) {
    dlScanner.start();
    dlScanner.removeAllListeners();
    dlScanner.on('scan', function(data) {
      if (data) {
        if (data.doc && data.doc.id) {
          $scope.dlLoading = true;
          return $scope.validateBC ? validateVisitor(data, 'DriverLicense') : parseVisitor(data, 'DriverLicense');
        }
      }
    });
  }

  // PIV SCANNER
  if (pivScanner.connect()) {
    pivScanner.on('card:inserted', function(data) {
      if (data) {
        console.log('card inserted');
        $scope.pivLoading = true;
      }
    });
    pivScanner.on('card:read', function(data) {
      if (data) {
        $scope.pivLoading = true;
        return $scope.validateBC ? validateVisitor(data, 'PivCard') : parseVisitor(data, 'PivCard');
      }
    });
    pivScanner.on('card:removed', function(data) {
      if (data) {
        $scope.pivLoading = false;
        console.log('card removed');
      }
    });
  }

  // MOTO SCANNER
  // if (motoScanner.connect()) {
  //   motoScanner.on('data', function(data) {
  //     if (data) {
  //       $scope.qrLoading = true;
  //       parseVisitor(data, 'Barcode');
  //     }
  //   });
  // }

  function parseVisitor(data, scanType) {
    console.log(scanType);
    console.log(data);
    $scope.scanType = scanType;

    switch (scanType) {
      case 'DriverLicense':
        if (data.images) setImages(data.images);
        $scope.visitor.dob = data.doc.dob;
        $scope.visitor.dln = data.doc.id;
        $scope.visitor.docId = data.doc.id;
        break;
      case 'Barcode':
        $scope.validateBC = true;
        $scope.barcodeValidText = "Please scan your driver's license, passport, or PIV card to validate your ID for this visit.";
        $scope.visitor.barcode = JSON.parse(data).raw;
        $scope.visitor.docId = JSON.parse(data).raw;
        break;
      case 'PivCard':
        $scope.visitor.piv_id = data;
        $scope.visitor.docId = data;
        break;
      default:
        bootbox.alert('<h3 class="red">Could not detect a valid ID. Please see a guard for assistance.</h3>');
    }
    checkSearchValidity();
  }

  function validateVisitor(data, scanType) {
    switch (scanType) {
      case 'DriverLicense':
        if (data.images) setImages(data.images);
        if ($scope.visitor.last_name.toLowerCase() == data.doc.last_name.toLowerCase()) visitorValid();
        break;
      case 'PivCard':
        if (data) {
          $scope.visitor.name = "Piv Card";
          visitorValid();
        }
        break;
      default:
        $scope.barcodeValidText = 'Could not detect a valid ID. Please see a guard for assistance.';
    }
  }

  function setImages(images) {
    $scope.visitorExtraInfo.front_img_b64 = images.license;
    $scope.visitorExtraInfo.face_img_b64 = images.face;
  }

  function checkSearchValidity() {
    if ($scope.visitor.dln || $scope.visitor.passport_id || $scope.visitor.piv_id || $scope.visitor.barcode) {
      $scope.searchSchedules();
    } else {
      bootbox.alert('<h3 class="red">Could not detect a valid ID. Please see a guard for assistance.</h3>');
      $scope.visitor = {};
    }
  }

  function visitorValid() {
    $scope.validateBC = false;
    $scope.barcodeIdValid = true;
    $scope.barcodeValidText = "ID Validated. Please confirm your visit to take a photo for your badge.";
    initiateConfirmButton();
  }

  $scope.searchSchedules = function() {
    AppService.fetchSchedules({
      data: {
        document_id: $scope.visitor.docId,
        document_type: $scope.scanType
      }
    }, function(data) {
      if (data) setSchedule(data);
      $scope.noLoading();
      $scope.noResults = data.length <= 0 ? true : false;

      if ($scope.noResults) {
        bootbox.alert("<h3 class='red'>Could not find any scheduled visits for " + $scope.visitor.name + ". Redirecting to host directory search - please find your host there to get in contact with them.</h3>");
        location.href = "#/tenant_call";
      } else {
        showOverlay();
      }
    }, function(data, errorText) {
      bootbox.alert('<h3 class="red">ERROR ' + data.status + ': ' + data.statusText + "</h3>");
      $scope.noLoading();
    });
  };

  function setSchedule(data) {
    $scope.$apply(function() {
      $scope.allSchedules = data;
      $scope.schedule = _.first($scope.allSchedules);
      $scope.visitor.first_name = $scope.schedule.visitor.first_name;
      $scope.visitor.last_name = $scope.schedule.visitor.last_name;
      $scope.visitor.name = $scope.schedule.visitor.name;
      $scope.oneVisit = data.length == 1 ? true : false;
    });
  }

  function showOverlay(n) {
    var overlayType = $scope.scanType + 'Overlay';
    $scope[overlayType]();
    initiateConfirmButton();
  }

  $scope.nextTenant = function() {
    var index = $scope.allSchedules.indexOf($scope.schedule);
    $scope.schedule = (index < $scope.allSchedules.length - 1) ? $scope.allSchedules[index + 1] : _.last($scope.allSchedules);
  };

  $scope.previousTenant = function() {
    var index = $scope.allSchedules.indexOf($scope.schedule);
    $scope.schedule = (index !== 0) ? $scope.allSchedules[index - 1] : _.first($scope.allSchedules);
  };

  $scope.noLoading = function() {
    $scope.pivLoading = false;
    $scope.dlLoading = false;
    $scope.ppLoading = false;
    $scope.qrLoading = false;
  };

  function initiateConfirmButton() {
    [].slice.call(document.querySelectorAll('.progress-button')).forEach(function(bttn, pos) {
      new UIProgressButton(bttn, {
        callback: function(instance) {
          var progress = 0;
          var progressInterval = $interval(function() {
            progress = Math.min(progress + Math.random() * 0.25, 1);
            instance.setProgress(progress);
            var choice = 1;
            if (progress === 1) {
              instance.stop(choice);
              $interval.cancel(progressInterval);
              if (choice === 1) {
                app.setStore('selected_schedule', $scope.schedule);
                location.href = "#/check_in";
              }
            }
          }, 150);
        }
      });
    });
  }

  $scope.$on('$destroy', function() {
    $('body').children().unbind();
  });

});