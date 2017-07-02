/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Watch = __webpack_require__(1);

	(function () {
	  "use strict";

	  /**
	  Crown
	  **/

	  var crownActive = false;
	  var setSecondary = false;
	  var crown = document.getElementById('crown');

	  function toggleCrown() {
	    crownActive = !crownActive;
	    if (crownActive) {
	      crown.classList.add('active');
	      primary.stopInterval();
	      primary.toggleSettingTime();
	      secondary.stopInterval();
	      secondary.toggleSettingTime();
	    } else {
	      crown.classList.remove('active');
	      primary.startInterval();
	      primary.toggleSettingTime();
	      primary.updateToManualTime();
	      secondary.startInterval();
	      secondary.toggleSettingTime();
	      secondary.updateToManualTime();

	      if (setSecondary) {
	        secondary.toggleBlackout();
	        setSecondary = !setSecondary;
	      }
	    }
	  }

	  crown.addEventListener('click', function () {
	    toggleCrown();
	  });

	  /**
	  Power Reserve
	  **/

	  var PowerReserve = function () {
	    function PowerReserve(id) {
	      _classCallCheck(this, PowerReserve);

	      this.element = document.getElementById(id);
	      this.interval = null;
	      this.init();
	    }

	    _createClass(PowerReserve, [{
	      key: 'decrementReserve',
	      value: function decrementReserve() {
	        var currentRotate = primary.getCurrentRotateValue(this.element);

	        if (currentRotate <= -90) {
	          this.interval = null;
	          primary.stopInterval();
	          secondary.stopInterval();
	        } else {
	          var newRotate = Number(currentRotate) - 0.25;
	          this.element.style.transform = 'rotate(' + newRotate + 'deg)';
	        }
	      }
	    }, {
	      key: 'incrementReserve',
	      value: function incrementReserve() {
	        var currentRotate = primary.getCurrentRotateValue(this.element);

	        if (currentRotate <= 89.5 && currentRotate >= -90) {
	          var newRotate = Number(currentRotate) + 0.5;
	          this.element.style.transform = 'rotate(' + newRotate + 'deg)';
	        }
	      }
	    }, {
	      key: 'init',
	      value: function init() {
	        var _this = this;

	        this.element.style.transform = 'rotate(90deg)';
	        this.interval = setInterval(function () {
	          _this.decrementReserve();
	        }, 1000);
	      }
	    }]);

	    return PowerReserve;
	  }();

	  var reserve = new PowerReserve('power-reserve-hand');
	  window.addEventListener('keydown', function () {
	    switch (event.keyCode) {
	      case 37:
	        reserve.incrementReserve();
	        break;
	      case 13:
	        toggleCrown();
	        break;
	    }

	    if (crownActive) {
	      switch (event.keyCode) {
	        case 37:
	          reserve.incrementReserve();
	          break;
	        case 38:
	          if (setSecondary) {
	            secondary.rotateHands();
	          } else {
	            primary.rotateHands();
	            secondary.rotateHands();
	          }
	          break;
	        case 39:
	          setSecondary = !setSecondary;
	          secondary.toggleSecondaryTime();
	          secondary.toggleBlackout();
	          break;
	        case 40:
	          if (setSecondary) {
	            secondary.rotateHands('back');
	          } else {
	            primary.rotateHands('back');
	            secondary.rotateHands('back');
	          }
	          break;
	      }
	    }
	  });

	  /**
	  Dials
	  **/
	  var localhands = {
	    hour: document.getElementById('primary-hours-hand'),
	    minute: document.getElementById('primary-minutes-hand')
	  };
	  var homeHands = {
	    hour: document.getElementById('secondary-hours-hand'),
	    second: document.getElementById('secondary-minutes-hand')
	  };

	  var primary = new Watch(localhands, '+3');
	  var secondary = new Watch(homeHands, '-4', 24);

	  var homeTime = document.getElementById('home-field');
	  var localTime = document.getElementById('local-field');

	  homeTime.addEventListener('change', function () {
	    secondary.stopInterval();
	    secondary = new Watch(homeHands, homeTime.value.toString(), 24);
	  });
	  localTime.addEventListener('change', function () {
	    primary.stopInterval();
	    primary = new Watch(localhands, localTime.value.toString(), 12);
	  });
	})();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Watch = function () {
	  function Watch(hands) {
	    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	    var format = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 12;

	    _classCallCheck(this, Watch);

	    try {
	      if (!hands) throw "The Watch class needs an object containing the HTML elements for the hands.";
	    } catch (errorMsg) {
	      console.error(errorMsg);
	      return;
	    }

	    this.rightNow = new Date();
	    this.currentTime = {};
	    this.gmtOffset = offset ? offset.toString() : null;

	    this.hands = hands;
	    this.format = format;

	    this.rotateValues = {
	      hoursRotateVal: this.format === 12 ? 30 : 15,
	      hoursRotateValOffset: this.format === 12 ? 0.5 : 0.25,
	      hourJump: 30,
	      minutesRotateVal: 6
	    };

	    this.interval = null;
	    this.crownActive = false;
	    this.manualTime = false;
	    this.settingTime = false;
	    this.setSecondary = false;

	    this.init();
	  }

	  _createClass(Watch, [{
	    key: 'toggleSettingTime',
	    value: function toggleSettingTime() {
	      this.settingTime = !this.settingTime;
	    }
	  }, {
	    key: 'toggleSecondaryTime',
	    value: function toggleSecondaryTime() {
	      this.setSecondary = !this.setSecondary;
	    }
	  }, {
	    key: 'updateToManualTime',
	    value: function updateToManualTime() {
	      this.manualTime = true;
	    }
	  }, {
	    key: 'toggleBlackout',
	    value: function toggleBlackout() {
	      document.querySelector('.blackout').classList.toggle('active');
	      document.getElementById('Main_Dial').classList.toggle('faded');
	    }
	  }, {
	    key: 'stopInterval',
	    value: function stopInterval() {
	      this.crownActive = true;
	      clearInterval(this.interval);
	      this.interval = null;
	    }
	  }, {
	    key: 'startInterval',
	    value: function startInterval() {
	      var _this = this;

	      this.interval = setInterval(function () {
	        _this.getCurrentTime();
	        _this.rotateHands();
	      }, 1000);
	      this.crownActive = false;
	    }
	  }, {
	    key: 'getCurrentTime',
	    value: function getCurrentTime() {
	      this.rightNow = new Date();
	      if (this.gmtOffset) {
	        /* Shouts to: http://www.techrepublic.com/article/convert-the-local-time-to-another-time-zone-with-this-javascript/6016329/ */
	        var gmt = this.rightNow.getTime() + this.rightNow.getTimezoneOffset() * 60000;
	        this.rightNow = new Date(gmt + 3600000 * this.gmtOffset);
	      }

	      var currentTime = {
	        hours: this.rightNow.getHours(),
	        minutes: this.rightNow.getMinutes(),
	        seconds: this.rightNow.getSeconds()
	      };

	      this.currentTime = currentTime;
	    }
	  }, {
	    key: 'rotateHands',
	    value: function rotateHands() {
	      var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

	      var rotateVal = void 0;

	      if (this.hands.hour) {
	        var hourOffset = this.setSecondary ? this.rotateValues.hourJump : this.rotateValues.hoursRotateValOffset;
	        rotateVal = this.getCurrentRotateValue(this.hands.hour);
	        if (this.settingTime) {
	          if (dir) {
	            rotateVal -= hourOffset;
	          } else {
	            rotateVal += hourOffset;
	          }
	        } else if (this.manualTime) {
	          if (this.currentTime.seconds === 0) {
	            rotateVal = this.getCurrentRotateValue(this.hands.hour) + this.rotateValues.hoursRotateValOffset;
	          }
	        } else {
	          rotateVal = this.currentTime.hours * this.rotateValues.hoursRotateVal + this.currentTime.minutes * this.rotateValues.hoursRotateValOffset;
	        }

	        this.hands.hour.style.transform = 'rotate(' + rotateVal + 'deg)';
	      }

	      if (this.hands.minute) {
	        rotateVal = this.getCurrentRotateValue(this.hands.minute);
	        if (this.settingTime) {
	          if (dir) {
	            rotateVal -= this.rotateValues.minutesRotateVal;
	          } else {
	            rotateVal += this.rotateValues.minutesRotateVal;
	          }
	        } else if (this.manualTime) {
	          if (this.currentTime.seconds === 0) {
	            rotateVal += this.rotateValues.minutesRotateVal;
	          }
	        } else {
	          rotateVal = this.currentTime.minutes * this.rotateValues.minutesRotateVal;
	        }

	        this.hands.minute.style.transform = 'rotate(' + rotateVal + 'deg)';
	      }

	      if (this.hands.second) {
	        rotateVal = this.currentTime.seconds * this.rotateValues.minutesRotateVal;

	        if (rotateVal === 0) {
	          this.hands.second.classList.add('jumping');
	        } else if (rotateVal > 0 && this.hands.second.classList.contains('jumping')) {
	          this.hands.second.classList.remove('jumping');
	        }

	        this.hands.second.style.transform = 'rotate(' + rotateVal + 'deg)';
	      }
	    }
	  }, {
	    key: 'getCurrentRotateValue',
	    value: function getCurrentRotateValue(el) {
	      var val = el.style.transform;
	      var num = val.replace('rotate(', '').replace('deg)', '');
	      return Number(num);
	    }
	  }, {
	    key: 'init',
	    value: function init() {
	      var _this2 = this;

	      setTimeout(function () {
	        _this2.getCurrentTime();
	        _this2.rotateHands();
	      }, 350);

	      this.startInterval();
	    }
	  }]);

	  return Watch;
	}();

	module.exports = Watch;

/***/ })
/******/ ]);