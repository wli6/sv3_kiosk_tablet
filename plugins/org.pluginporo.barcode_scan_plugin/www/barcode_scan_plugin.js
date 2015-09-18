var cordova = require('cordova');
var exec = require('cordova/exec');

var BarcodeScanPlugin = function() {



	this.scan = function (successCallback, errorCallback, types, options, licenseiOs, licenseAndroid) {
		if (errorCallback == null) {
			errorCallback = function () {
			};
		}

		if (typeof errorCallback != "function") {
			console.log("BarcodeScanPlugin.scan failure: failure parameter not a function");
			return;
		}

		if (typeof successCallback != "function") {
			console.log("BarcodeScanPlugin.scan failure: success callback parameter must be a function");
			return;
		}

		exec(successCallback, errorCallback, 'BarcodeScanPlugin', 'scan', [types, options, licenseiOs, licenseAndroid]);
	};


  // this.scan = function(success_cb, error_cb){
  //   exec(success_cb, error_cb, "BarcodeScanPlugin", "scan", []);
  // };

};

module.exports = new BarcodeScanPlugin();