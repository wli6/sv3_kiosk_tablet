window.Animations = {};

window.Animations.overlayInit = function(success) {
  function overlayInit() {
    var container = document.querySelector('div.container'),
      // overlays
      overlay = document.getElementById('overlay-first'),
      overlaySecond = document.getElementById('overlay-second'),
      overlayThird = document.getElementById('overlay-third'),
      // close buttons
      closeBttn = overlay.querySelector('button.overlay-close'),
      closeBttnSecond = overlaySecond.querySelector('button.overlay-close'),
      closeBttnThird = overlayThird.querySelector('button.overlay-close');

    var allDemElementz = [{
      overlay: overlay,
      close: closeBttn,
    }, {
      overlay: overlaySecond,
      close: closeBttnSecond,
    }, {
      overlay: overlayThird,
      close: closeBttnThird,
    }];

    var transEndEventNames = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'msTransition': 'MSTransitionEnd',
        'transition': 'transitionend'
      },
      transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
      support = {
        transitions: Modernizr.csstransitions
      };

    function toggleOverlay(overlay) {
      if (classie.has(overlay, 'open')) {
        classie.remove(overlay, 'open');
        classie.remove(container, 'overlay-open');
        classie.add(overlay, 'close');
        var onEndTransitionFn = function(ev) {
          if (support.transitions) {
            if (ev.propertyName !== 'visibility') return;
            this.removeEventListener(transEndEventName, onEndTransitionFn);
          }
          classie.remove(overlay, 'close');
        };
        if (support.transitions) {
          overlay.addEventListener(transEndEventName, onEndTransitionFn);
        } else {
          onEndTransitionFn();
        }
      } else if (!classie.has(overlay, 'close')) {
        classie.add(overlay, 'open');
        classie.add(container, 'overlay-open');
      }
    }

    var sendData = {};
    sendData.overlay = function() { toggleOverlay(overlay); };
    sendData.overlayTwo = function() { toggleOverlay(overlaySecond); };
    sendData.overlayThree = function() { toggleOverlay(overlayThird); };

    success(sendData);

    _.each(allDemElementz, function(set) {
      set.close.addEventListener('click', function() {
        toggleOverlay(set.overlay);
      });
    });
  }
  overlayInit();
};

window.Animations.buttonsInit = function(success) {
  'use strict';

  var transEndEventNames = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'msTransition': 'MSTransitionEnd',
      'transition': 'transitionend'
    },
    transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
    support = {
      transitions: Modernizr.csstransitions
    };

  function extend(a, b) {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }

  function SVGEl(el) {
    this.el = el;
    // the path elements
    this.paths = [].slice.call(this.el.querySelectorAll('path'));
    // we will save both paths and its lengths in arrays
    this.pathsArr = [];
    this.lengthsArr = [];
    this._init();
  }

  SVGEl.prototype._init = function() {
    var self = this;
    this.paths.forEach(function(path, i) {
      self.pathsArr[i] = path;
      path.style.strokeDasharray = self.lengthsArr[i] = path.getTotalLength();
    });
    // undraw stroke
    this.draw(0);
  };

  // val in [0,1] : 0 - no stroke is visible, 1 - stroke is visible
  SVGEl.prototype.draw = function(val) {
    for (var i = 0, len = this.pathsArr.length; i < len; ++i) {
      this.pathsArr[i].style.strokeDashoffset = this.lengthsArr[i] * (1 - val);
    }
  };

  function UIProgressButton(el, options) {
    this.el = el;
    this.options = extend({}, this.options);
    extend(this.options, options);
    this._init();
  }

  UIProgressButton.prototype.options = {
    // time in ms that the status (success or error will be displayed) - should be at least higher than the transition-duration value defined for the stroke-dashoffset transition of both checkmark and cross strokes
    statusTime: 1500
  };

  UIProgressButton.prototype._init = function() {
    // the button
    this.button = this.el.querySelector('button');
    // progress el
    this.progressEl = new SVGEl(this.el.querySelector('svg.progress-circle'));
    // the success/error elems
    this.successEl = new SVGEl(this.el.querySelector('svg.checkmark'));
    this.errorEl = new SVGEl(this.el.querySelector('svg.cross'));
    // init events
    this._initEvents();
    // enable button
    this._enable();
  };

  UIProgressButton.prototype._initEvents = function() {
    var self = this;
    this.button.addEventListener('click', function() {
      self._submit();
    });
  };

  UIProgressButton.prototype._submit = function() {
    // by adding the loading class the button will transition to a "circle"
    classie.addClass(this.el, 'loading');

    var self = this,
      onEndBtnTransitionFn = function(ev) {
        if (support.transitions) {
          if (ev.propertyName !== 'width') return false;
          this.removeEventListener(transEndEventName, onEndBtnTransitionFn);
        }

        // disable the button - this should have been the first thing to do when clicking the button.
        // however if we do so Firefox does not seem to fire the transitionend event.
        this.setAttribute('disabled', '');

        if (typeof self.options.callback === 'function') {
          self.options.callback(self);
        } else {
          // fill it (time will be the one defined in the CSS transition-duration property)
          self.setProgress(1);
          self.stop();
        }
      };

    if (support.transitions) {
      this.button.addEventListener(transEndEventName, onEndBtnTransitionFn);
    } else {
      onEndBtnTransitionFn();
    }
  };

  // runs after the progress reaches 100%
  UIProgressButton.prototype.stop = function(status) {
    var self = this,
      endLoading = function() {
        // first undraw progress stroke.
        self.progressEl.draw(0);

        if (typeof status === 'number') {
          var statusClass = status >= 0 ? 'success' : 'error',
            statusEl = status >= 0 ? self.successEl : self.errorEl;

          // draw stroke of success (checkmark) or error (cross).
          statusEl.draw(1);
          // add respective class to the element
          classie.addClass(self.el, statusClass);
          // after options.statusTime remove status and undraw the respective stroke. Also enable the button.
          setTimeout(function() {
            classie.remove(self.el, statusClass);
            statusEl.draw(0);
            self._enable();
          }, self.options.statusTime);
        } else {
          self._enable();
        }
        // finally remove class loading.
        classie.removeClass(self.el, 'loading');
      };

    // give it a time (ideally the same like the transition time) so that the last progress increment animation is still visible.
    setTimeout(endLoading, 300);
  };

  UIProgressButton.prototype.setProgress = function(val) {
    this.progressEl.draw(val);
  };

  // enable button
  UIProgressButton.prototype._enable = function() {
    this.button.removeAttribute('disabled');
  };

  // add to global namespace
  window.UIProgressButton = UIProgressButton;
};

window.Animations.singleOverlayInit = function(options, success) {
  var sendData = {};
  sendData.overlay = document.getElementById(options.overlay_id);
  transEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MSTransitionEnd',
    'transition': 'transitionend'
  },
  transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
  support = {
    transitions: Modernizr.csstransitions
  };

  sendData.toggleOverlay = function(overlay) {
    if (classie.has(overlay, 'open')) {
      classie.remove(overlay, 'open');
      classie.add(overlay, 'close');
      var onEndTransitionFn = function(ev) {
        if (support.transitions) {
          if (ev.propertyName !== 'visibility') return;
          this.removeEventListener(transEndEventName, onEndTransitionFn);
        }
        classie.remove(overlay, 'close');
      };
      if (support.transitions) {
        overlay.addEventListener(transEndEventName, onEndTransitionFn);
      } else {
        onEndTransitionFn();
      }
    } else if (!classie.has(overlay, 'close')) {
      classie.add(overlay, 'open');
    }
  };

  sendData.inputAnimations = function() {
    // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
    if (!String.prototype.trim) {
      (function() {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function() {
          return this.replace(rtrim, '');
        };
      })();
    }

    [].slice.call(document.querySelectorAll('input.input__field')).forEach(function(inputEl) {
      // in case the input is already filled..
      if (inputEl.value.trim() !== '') {
        classie.add(inputEl.parentNode, 'input--filled');
      }

      // events:
      inputEl.addEventListener('focus', onInputFocus);
      inputEl.addEventListener('blur', onInputBlur);
    });

    function onInputFocus(ev) {
      classie.add(ev.target.parentNode, 'input--filled');
    }

    function onInputBlur(ev) {
      if (ev.target.value.trim() === '') {
        classie.remove(ev.target.parentNode, 'input--filled');
      }
    }
  };

  success(sendData);
};

window.Animations.signinInit = function(success) {
  var sendData = {};
  sendData.overlay = document.getElementById('signin-overlay');
  transEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MSTransitionEnd',
    'transition': 'transitionend'
  },
  transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
  support = {
    transitions: Modernizr.csstransitions
  };

  sendData.toggleOverlay = function(overlay) {
    if (classie.has(overlay, 'open')) {
      classie.remove(overlay, 'open');
      classie.add(overlay, 'close');
      var onEndTransitionFn = function(ev) {
        if (support.transitions) {
          if (ev.propertyName !== 'visibility') return;
          this.removeEventListener(transEndEventName, onEndTransitionFn);
        }
        classie.remove(overlay, 'close');
      };
      if (support.transitions) {
        overlay.addEventListener(transEndEventName, onEndTransitionFn);
      } else {
        onEndTransitionFn();
      }
    } else if (!classie.has(overlay, 'close')) {
      classie.add(overlay, 'open');
    }
  };

  sendData.inputAnimations = function() {
    // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
    if (!String.prototype.trim) {
      (function() {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function() {
          return this.replace(rtrim, '');
        };
      })();
    }

    [].slice.call(document.querySelectorAll('input.input__field')).forEach(function(inputEl) {
      // in case the input is already filled..
      if (inputEl.value.trim() !== '') {
        classie.add(inputEl.parentNode, 'input--filled');
      }

      // events:
      inputEl.addEventListener('focus', onInputFocus);
      inputEl.addEventListener('blur', onInputBlur);
    });

    function onInputFocus(ev) {
      classie.add(ev.target.parentNode, 'input--filled');
    }

    function onInputBlur(ev) {
      if (ev.target.value.trim() === '') {
        classie.remove(ev.target.parentNode, 'input--filled');
      }
    }
  };

  success(sendData);
};

window.Animations.searchInit = function() {
  var morphSearch = document.getElementById('morphsearch'),
    input = morphSearch.querySelector('input.morphsearch-input'),
    ctrlClose = morphSearch.querySelector('span.morphsearch-close'),
    isOpen = isAnimating = false,
    // show/hide search area
    toggleSearch = function(evt) {
      // return if open and the input gets focused
      if (evt.type.toLowerCase() === 'focus' && isOpen) return false;

      var offsets = morphsearch.getBoundingClientRect();
      if (isOpen) {
        classie.remove(morphSearch, 'open');

        // trick to hide input text once the search overlay closes
        // todo: hardcoded times, should be done after transition ends
        if (input.value !== '') {
          setTimeout(function() {
            classie.add(morphSearch, 'hideInput');
            setTimeout(function() {
              classie.remove(morphSearch, 'hideInput');
              input.value = '';
            }, 300);
          }, 500);
        }

        input.blur();
      } else {
        classie.add(morphSearch, 'open');
      }
      isOpen = !isOpen;
    };

  // events
  input.addEventListener('focus', toggleSearch);
  ctrlClose.addEventListener('click', toggleSearch);
  // esc key closes search overlay
  // keyboard navigation events
  document.addEventListener('keydown', function(ev) {
    var keyCode = ev.keyCode || ev.which;
    if (keyCode === 27 && isOpen) {
      toggleSearch(ev);
    }
  });
};