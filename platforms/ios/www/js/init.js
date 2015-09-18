window.app = {
  setStore: function(key, obj) {
    var objType = typeof(obj);
    var storeVal = obj;
    if (objType == 'object') {
      storeVal = JSON.stringify(obj);
    }
    localStorage.setItem(key, storeVal);
  },
  getStore: function(key) {
    var storeVal = localStorage.getItem(key);
    var obj = null;
    try {
      obj = JSON.parse(storeVal);
    } catch (e) {
      obj = storeVal;
    }
    return obj;
  },
  removeStore: function(key) {
    localStorage.removeItem(key);
  },
  clearInfo: function() {
    for (var k in localStorage) {
      if (k != 'app_config' && k != 'remember_signin') {
        this.removeStore(k);
      }
    }
  }
};

window.netIO = require('net');
window.net = {
  setupAjax: function(opts) {
    opts.beforeSend = function(xhr) {
      xhr.setRequestHeader("Authorization", "" + AppConf.api_key);
    };
  },
  get: function(opts) {
    var self = this;
    opts.type = "GET";
    self.setupAjax(opts);
    $.ajax(opts);
  },
  post: function(opts) {
    var self = this;
    opts.type = "POST";
    self.setupAjax(opts);
    $.ajax(opts);
  }
};

window.Webcam = function(success) {
  var v = document.getElementById('v'),
    canvas = document.getElementById('c'),
    context = canvas.getContext('2d'),
    save = document.getElementById('save-pic'),
    timer = document.getElementById('timer'),
    image = document.getElementById('person-placeholder'),
    printBtn = document.getElementById('print-btn');

  var cw = canvas.clientWidth;
  var ch = canvas.clientHeight;
  canvas.width = cw;
  canvas.height = ch;

  timer.style.visibility = 'hidden';
  printBtn.style.visibility = 'hidden';

  var returnData = {};

  navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);
  if (navigator.getUserMedia) {
    navigator.getUserMedia({
        video: true,
        audio: false
      },
      function(stream) {
        var url = window.URL || window.webkitURL;
        v.src = url ? url.createObjectURL(stream) : stream;
        v.play();

        v.addEventListener('play', function() {
          draw(this, context, cw, ch);
          takePicture(canvas);
        }, false);

        returnData.shutDown = function() {
          stream.stop();
        };

        function draw(v, c, w, h) {
          if (v.paused || v.ended) return false;
          var image, data;
          c.drawImage(v, 0, 0, w, h);
          image = c.getImageData(0, 0, w, h);
          data = image.data;
          image.data = data;

          c.putImageData(image, 0, 0);
          setTimeout(draw, 20, v, c, w, h);
        }
      },
      function(error) {
        alert('Something went wrong. (error code ' + error.code + ')');
        return;
      }
    );
  } else {
    alert('Sorry, the browser you are using doesn\'t support getUserMedia');
    return;
  }

  function takePicture(canvas) {
    if (v.paused) {
      v.play();
    } else {
      timer.innerHTML = 'Get Ready';
      timer.style.visibility = 'visible';
      var countdown = 3;
      var countingDown = setInterval(function() {
        timer.innerHTML = countdown;
        countdown -= 1;
        if (countdown == -1) {
          clearInterval(countingDown);
          v.pause();
          timer.innerHTML = '<div id="retake-div"><i class="fa fa-camera" id="timer-icon"></i><br>Retake</div>';
          image.src = canvas.toDataURL('image/png');
          returnData.image = image;
          printBtn.style.visibility = 'visible';

          success(returnData);

          var retakeDiv = document.getElementById('retake-div');
          retakeDiv.addEventListener('click', function() {
            v.play();
            takePicture(canvas);
          });
        }
      }, 1100);
    }
  }
};
