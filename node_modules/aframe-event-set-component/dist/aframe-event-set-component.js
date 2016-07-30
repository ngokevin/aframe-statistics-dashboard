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
/***/ function(module, exports) {

	var styleParser = AFRAME.utils.styleParser;

	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}

	AFRAME.registerComponent('event-set', {
	  schema: {
	    default: [],
	    parse: function (value) {
	      return value.split(',').map(styleParser.parse);
	    }
	  },

	  init: function () {
	    this.eventListeners = [];
	  },

	  update: function (oldData) {
	    this.eventListeners = [];
	    this.removeEventListeners();
	    this.updateEventListeners();
	    this.addEventListeners();
	  },

	  /**
	   * Called when a component is removed (e.g., via removeAttribute).
	   * Generally undoes all modifications to the entity.
	   */
	  remove: function () {
	    this.removeEventListeners();
	  },

	  /**
	   * Called when entity pauses.
	   * Use to stop or remove any dynamic or background behavior such as events.
	   */
	  pause: function () {
	    this.removeEventListeners();
	  },

	  /**
	   * Called when entity resumes.
	   * Use to continue or add any dynamic or background behavior such as events.
	   */
	  play: function () {
	    this.addEventListeners();
	  },

	  /**
	   * Update source-of-truth event listener registry.
	   * Does not actually attach event listeners yet.
	   */
	  updateEventListeners: function () {
	    var el = this.el;
	    var eventListeners = this.eventListeners;

	    this.data.forEach(addEventListener);

	    function addEventListener (obj) {
	      // Set event listener using `_event`.
	      var event = obj._event;
	      var target = obj._target;
	      eventListeners.push([event, handler]);

	      // Rest of the properties will describe what properties to set.
	      delete obj._event;
	      delete obj._target;

	      function handler () {
	        // Decide the target to `setAttribute` on.
	        var targetEl = target ? el.sceneEl.querySelector(target) : el;

	        // Get properties to set.
	        var setAttributeArgSets = [];
	        Object.keys(obj).forEach(function buildSetAttributeArgs (attr) {
	          if (attr.indexOf('.') === -1) {
	            // Normal attribute or single-property component.
	            setAttributeArgSets.push([attr, obj[attr]]);
	          } else {
	            // Multi-property component with dot syntax.
	            var attrSplit = attr.split('.');
	            setAttributeArgSets.push([attrSplit[0], attrSplit[1], obj[attr]]);
	          }
	        });

	        // Set attributes.
	        setAttributeArgSets.forEach(function doSetAttributes (setAttributeArgs) {
	          targetEl.setAttribute.apply(targetEl, setAttributeArgs);
	        });
	      }
	    }
	  },

	  /**
	   * Attach event listeners.
	   */
	  addEventListeners: function () {
	    var el = this.el;
	    this.eventListeners.forEach(function addEventListener (eventListenerArr) {
	      el.addEventListener(eventListenerArr[0], eventListenerArr[1]);
	    });
	  },

	  removeEventListeners: function () {
	    var el = this.el;
	    this.eventListeners.forEach(function removeEventListener (eventListenerArr) {
	      el.removeEventListener(eventListenerArr[0], eventListenerArr[1]);
	    });
	  }
	});


/***/ }
/******/ ]);