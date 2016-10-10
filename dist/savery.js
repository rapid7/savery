(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("savery", [], factory);
	else if(typeof exports === 'object')
		exports["savery"] = factory();
	else
		root["savery"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _Savery = __webpack_require__(2);
	
	var _Savery2 = _interopRequireDefault(_Savery);
	
	var _utils = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	// main class
	
	
	// utils
	
	
	/**
	 * return function that will receive data and trigger saveAs
	 *
	 * @param {string} fileName=download
	 * @param {object} options
	 * @param {function} [options.onAbort]
	 * @param {function} [options.onAfterSave]
	 * @param {function} [options.onBeforeSave]
	 * @param {function} [options.onError]
	 * @param {function} [options.onProgress]
	 * @param {function} [options.onWrite]
	 * @param {function} [options.onWriteStart]
	 * @param {string} [options.type]
	 * @returns {function(data: *): void}
	 */
	
	
	// types
	var saveFile = function saveFile() {
	  var fileName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'download.txt';
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var type = options.type;
	
	  var restOfOptions = _objectWithoutProperties(options, ['type']);
	
	  var mimeType = (0, _utils.getMimeType)(type, fileName);
	
	  return function () {
	    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	
	    return new _Savery2.default(data, fileName, _extends({}, restOfOptions, {
	      mimeType: mimeType
	    }));
	  };
	};
	
	exports.default = saveFile;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	// constants {
	
	
	// utils
	
	
	var _constants = __webpack_require__(3);
	
	var _utils = __webpack_require__(4);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// types
	var Savery = function () {
	  function Savery(data, name) {
	    var _this = this;
	
	    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	
	    _classCallCheck(this, Savery);
	
	    this.autoBOM = true;
	    this.data = null;
	    this.error = null;
	    this.filename = '';
	    this.forceLoad = false;
	    this.onAbort = _utils.noop;
	    this.onAfterSave = _utils.passThrough;
	    this.onBeforeSave = _utils.passThrough;
	    this.onEndSave = _utils.noop;
	    this.onError = _utils.noop;
	    this.onStartSave = _utils.noop;
	    this.size = 0;
	    this.status = _constants.STATUSES.PENDING;
	    this.mimeType = _constants.DEFAULT_MIME_TYPE;
	
	    this._onAfterSave = function () {
	      if (_this.status !== _constants.STATUSES.COMPLETE) {
	        return Promise.reject(_this);
	      }
	
	      return _this.onAfterSave(_this);
	    };
	
	    this._onBeforeSave = function () {
	      if (_this.status !== _constants.STATUSES.PENDING) {
	        return Promise.reject(_this);
	      }
	
	      return _this.onBeforeSave(_this.data);
	    };
	
	    this._onEndSave = function (objectUrl) {
	      if (_this.status !== _constants.STATUSES.PROCESSING) {
	        return Promise.reject(_this);
	      }
	
	      (0, _utils.revokeObjectUrl)(objectUrl);
	
	      _this.status = _constants.STATUSES.COMPLETE;
	      _this.onEndSave(_this);
	
	      return objectUrl;
	    };
	
	    this._onError = function (error) {
	      if (_this.status !== _constants.STATUSES.CANCELLED) {
	        _this.status = _constants.STATUSES.ERROR;
	      }
	
	      _this.onError(error);
	
	      return Promise.reject(error);
	    };
	
	    this._onSave = function () {
	      if (_this.status !== _constants.STATUSES.PROCESSING) {
	        return Promise.reject(_this);
	      }
	
	      var blob = (0, _utils.createBlob)(_this.data, _this.mimeType);
	      var file = _this.autoBOM ? (0, _utils.setAutoBom)(blob) : blob;
	      var objectUrl = (0, _utils.createObjectUrl)(file);
	
	      _this.size = blob.size;
	
	      if (_constants.HAS_DOWNLOAD_ATTRIBUTE_SUPPORT) {
	        (0, _utils.saveWithDownloadAttribute)(objectUrl, _this.filename);
	
	        return objectUrl;
	      }
	
	      if (_constants.IS_CHROME_OR_IOS || _this.forceLoad && _constants.IS_SAFARI || _constants.GLOBAL.FileReader) {
	        return (0, _utils.saveWithFileReader)(file);
	      }
	
	      if (_this.forceLoad) {
	        _constants.GLOBAL.location.href = objectUrl;
	      } else {
	        (0, _utils.openPopupOrNavigate)(objectUrl);
	      }
	
	      _this.status = _constants.STATUSES.COMPLETE;
	
	      return objectUrl;
	    };
	
	    this._onStartSave = function () {
	      if (_this.status !== _constants.STATUSES.PENDING) {
	        return Promise.reject(_this);
	      }
	
	      _this.status = _constants.STATUSES.PROCESSING;
	      _this.onStartSave(_this);
	
	      return _this;
	    };
	
	    var mimeType = options.mimeType;
	    var _options$onAbort = options.onAbort;
	    var onAbort = _options$onAbort === undefined ? _utils.noop : _options$onAbort;
	    var _options$onAfterSave = options.onAfterSave;
	    var onAfterSave = _options$onAfterSave === undefined ? _utils.passThrough : _options$onAfterSave;
	    var _options$onBeforeSave = options.onBeforeSave;
	    var onBeforeSave = _options$onBeforeSave === undefined ? _utils.passThrough : _options$onBeforeSave;
	    var _options$onError = options.onError;
	    var onError = _options$onError === undefined ? _utils.noop : _options$onError;
	    var _options$onStartSave = options.onStartSave;
	    var onStartSave = _options$onStartSave === undefined ? _utils.noop : _options$onStartSave;
	    var _options$onEndSave = options.onEndSave;
	    var onEndSave = _options$onEndSave === undefined ? _utils.noop : _options$onEndSave;
	    var _options$shouldAutoBo = options.shouldAutoBom;
	    var shouldAutoBom = _options$shouldAutoBo === undefined ? true : _options$shouldAutoBo;
	
	
	    this.autoBOM = shouldAutoBom;
	    this.data = data;
	    this.error = null;
	    this.filename = name;
	    this.forceLoad = mimeType === _constants.DEFAULT_MIME_TYPE;
	    this.mimeType = mimeType;
	
	    this.onAbort = onAbort;
	    this.onAfterSave = onAfterSave;
	    this.onBeforeSave = onBeforeSave;
	    this.onError = onError;
	    this.onStartSave = onStartSave;
	    this.onEndSave = onEndSave;
	
	    return this;
	  }
	
	  /**
	   * execute the onAfterSave method and return the results
	   *
	   * @returns {*}
	   * @private
	   */
	
	
	  /**
	   * execute the onBeforeSave method and return the results
	   *
	   * @returns {*}
	   * @private
	   */
	
	
	  /**
	   * trigger the end of the save process
	   *
	   * @param {string} objectUrl
	   * @returns {string|Promise}
	   * @private
	   */
	
	
	  /**
	   * trigger the onError method and reject the promise
	   *
	   * @param {Error} error
	   * @returns {Savery|Promise}
	   * @private
	   */
	
	
	  /**
	   * save the file based on browser capabilities
	   *
	   * @returns {string|Promise}
	   * @private
	   */
	
	
	  /**
	   * trigger the beginning of the save process
	   *
	   * @returns {Savery|Promise}
	   * @private
	   */
	
	
	  _createClass(Savery, [{
	    key: 'abort',
	
	
	    /**
	     * abort the save process
	     *
	     * @returns {Savery|Promise}
	     */
	    value: function abort() {
	      if (this.status === _constants.STATUSES.PENDING || this.status === _constants.STATUSES.PROCESSING) {
	        this.status = _constants.STATUSES.CANCELLED;
	        this.error = new Error('Savery for ' + this.filename + ' was aborted.');
	
	        this.onAbort(this);
	
	        return this;
	      }
	
	      this.error = new Error('Savery has already completed for ' + this.filename + '.');
	
	      return Promise.reject(this);
	    }
	
	    /**
	     * execute the saving of the file
	     *
	     * @returns {Promise}
	     */
	
	  }, {
	    key: 'save',
	    value: function save() {
	      return Promise.resolve().then(this._onBeforeSave).then(this._onStartSave).then(this._onSave).then(this._onEndSave).then(this._onAfterSave).catch(this._onError);
	    }
	  }]);
	
	  return Savery;
	}();
	
	exports.default = Savery;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	
	var DEFAULT_MIME_TYPE = 'application/octet-stream';
	
	var MIME_TYPE_REGEXP = /^[a-zA-Z\-]+\/([a-zA-Z0-9.\-+]+)+$/;
	
	var STATUSES = {
	  CANCELLED: 'CANCELLED',
	  COMPLETE: 'COMPLETE',
	  ERROR: 'ERROR',
	  PENDING: 'PENDING',
	  PROCESSING: 'PROCESSING'
	};
	
	var GLOBAL = window || global;
	var DOCUMENT = GLOBAL.document;
	
	var URL = GLOBAL.URL || GLOBAL.webkitURL;
	var LINK = DOCUMENT.createElementNS('http://www.w3.org/1999/xhtml', 'a');
	
	var AUTO_BOM_REGEXP = /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i;
	var CHROME_OR_IOS_REGEXP = /CriOS\/[\d]+/;
	var READER_REPLACE_REGEXP = /^data:[^;]*;/;
	var SAFARI_REGEXP = /constructor/i;
	
	var HAS_DOWNLOAD_ATTRIBUTE_SUPPORT = 'download' in LINK;
	var IS_CHROME_OR_IOS = CHROME_OR_IOS_REGEXP.test(GLOBAL.navigator.userAgent);
	var IS_SAFARI = SAFARI_REGEXP.test(GLOBAL.HTMLElement) || GLOBAL.safari;
	
	var REVOKE_TIMEOUT = 30000;
	
	exports.AUTO_BOM_REGEXP = AUTO_BOM_REGEXP;
	exports.CHROME_OR_IOS_REGEXP = CHROME_OR_IOS_REGEXP;
	exports.DEFAULT_MIME_TYPE = DEFAULT_MIME_TYPE;
	exports.GLOBAL = GLOBAL;
	exports.HAS_DOWNLOAD_ATTRIBUTE_SUPPORT = HAS_DOWNLOAD_ATTRIBUTE_SUPPORT;
	exports.IS_CHROME_OR_IOS = IS_CHROME_OR_IOS;
	exports.IS_SAFARI = IS_SAFARI;
	exports.LINK = LINK;
	exports.MIME_TYPE_REGEXP = MIME_TYPE_REGEXP;
	exports.READER_REPLACE_REGEXP = READER_REPLACE_REGEXP;
	exports.REVOKE_TIMEOUT = REVOKE_TIMEOUT;
	exports.SAFARI_REGEXP = SAFARI_REGEXP;
	exports.STATUSES = STATUSES;
	exports.URL = URL;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.setAutoBom = exports.saveWithFileReader = exports.saveWithDownloadAttribute = exports.triggerClick = exports.revokeObjectUrl = exports.passThrough = exports.openPopupOrNavigate = exports.noop = exports.getMimeType = exports.createObjectUrl = exports.createBlob = undefined;
	
	var _constants = __webpack_require__(3);
	
	// conditional dependencies
	var mime =  false ? require('mime-types') : __webpack_require__(5);
	
	/**
	 * generate a new blob based on the data and MIME type
	 *
	 * @param {*} data
	 * @param {string} mimeType
	 * @returns {Blob}
	 */
	
	
	// constants
	var createBlob = function createBlob(data, mimeType) {
	  return new window.Blob([data], {
	    type: mimeType
	  });
	};
	
	exports.createBlob = createBlob;
	
	/**
	 * create the objectUrl with the window URL object
	 *
	 * @param {Blob} blob
	 * @returns {string}
	 */
	
	var createObjectUrl = function createObjectUrl(blob) {
	  return URL.createObjectURL(blob);
	};
	
	exports.createObjectUrl = createObjectUrl;
	
	/**
	 * get the MIME type of the file
	 *
	 * if the MIME type was explicitly passed, check if it exists in our list, and if not
	 * check to see if it can be used directly (as in someone passed in the full MIME type)
	 *
	 * if no MIME type is passed, intuit the type from the file extension, and if that type
	 * does not exist in our list then fall back to the DEFAULT_MIME_TYPE
	 *
	 * @param {string} passedMimeType
	 * @param {string} fileName
	 * @returns {string}
	 */
	
	var getMimeType = function getMimeType(passedMimeType, fileName) {
	  if (!passedMimeType) {
	    var fileExtension = fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();
	
	    return mime.lookup(fileExtension) || _constants.DEFAULT_MIME_TYPE;
	  }
	
	  var lowerCaseMimeType = passedMimeType.toLowerCase();
	
	  if (_constants.MIME_TYPE_REGEXP.test(lowerCaseMimeType.split(';')[0])) {
	    return lowerCaseMimeType;
	  }
	
	  var searchedMimeType = mime.lookup(lowerCaseMimeType);
	
	  if (searchedMimeType) {
	    return searchedMimeType;
	  }
	
	  return _constants.DEFAULT_MIME_TYPE;
	};
	
	exports.getMimeType = getMimeType;
	
	/**
	 * no-no function
	 *
	 * @returns {null}
	 */
	
	var noop = function noop() {
	  return null;
	};
	
	exports.noop = noop;
	
	/**
	 * either open a popup (if allowed) or navigate to the location
	 *
	 * @param {string} url
	 */
	
	var openPopupOrNavigate = function openPopupOrNavigate(url) {
	  var popup = _constants.GLOBAL.open(url, '_blank');
	
	  if (!popup) {
	    _constants.GLOBAL.location.href = url;
	  }
	};
	
	exports.openPopupOrNavigate = openPopupOrNavigate;
	
	/**
	 * pass-through function
	 *
	 * @param {*} object
	 * @returns {T}
	 */
	
	var passThrough = function passThrough(object) {
	  return object;
	};
	
	exports.passThrough = passThrough;
	
	/**
	 * revoke the existing objectUrl
	 *
	 * @param {Object|string} file
	 */
	
	var revokeObjectUrl = function revokeObjectUrl(file) {
	  setTimeout(function () {
	    if (typeof file === 'string') {
	      URL.revokeObjectURL(file);
	    } else {
	      file.remove();
	    }
	  }, _constants.REVOKE_TIMEOUT);
	};
	
	exports.revokeObjectUrl = revokeObjectUrl;
	
	/**
	 * trigger a click event for the given node
	 *
	 * @param {HTMLAnchorElement} node
	 */
	
	var triggerClick = function triggerClick(node) {
	  var event = new MouseEvent('click');
	
	  node.dispatchEvent(event);
	};
	
	exports.triggerClick = triggerClick;
	
	/**
	 * use the download attribute to trigger save
	 *
	 * @param {string} objectUrl
	 * @param {string} name
	 */
	
	var saveWithDownloadAttribute = function saveWithDownloadAttribute(objectUrl, name) {
	  _constants.LINK.href = objectUrl;
	  _constants.LINK.download = name;
	
	  triggerClick(_constants.LINK);
	};
	
	exports.saveWithDownloadAttribute = saveWithDownloadAttribute;
	
	/**
	 * use the FileReader object (native) to trigger save
	 *
	 * @param {Blob} blob
	 * @returns {Promise}
	 */
	
	var saveWithFileReader = function saveWithFileReader(blob) {
	  if (!blob) {
	    return Promise.reject(new Error('No data provided to FileReader.'));
	  }
	
	  return new Promise(function (resolve) {
	    var reader = new window.FileReader();
	
	    reader.onloadend = function () {
	      var url = _constants.IS_CHROME_OR_IOS ? reader.result : reader.result.replace(_constants.READER_REPLACE_REGEXP, 'data:attachment/file;');
	
	      openPopupOrNavigate(url);
	
	      resolve(url);
	    };
	
	    reader.readAsDataURL(blob);
	  });
	};
	
	exports.saveWithFileReader = saveWithFileReader;
	
	/**
	 * set the BOM for the blob
	 *
	 * @param {Blob} blob
	 * @param {string} blob.type
	 * @returns {Blob}
	 */
	
	var setAutoBom = function setAutoBom(blob) {
	  // prepend BOM for UTF-8 XML and text/* types (including HTML)
	  // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
	  if (_constants.AUTO_BOM_REGEXP.test(blob.type)) {
	    return new window.Blob([String.fromCharCode(0xFEFF), blob], {
	      type: blob.type
	    });
	  }
	
	  return blob;
	};
	
	exports.setAutoBom = setAutoBom;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var MIME_TYPES = {
	  '7z': 'application/x-7z-compressed',
	  bmp: 'image/bmp',
	  conf: 'text/plain',
	  css: 'text/css',
	  csv: 'text/csv',
	  dmg: 'application/x-apple-diskimage',
	  doc: 'application/msword',
	  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	  gif: 'image/gif',
	  gz: 'application/x-gzip',
	  html: 'text/html',
	  jar: 'application/java-archive',
	  jpeg: 'image/jpeg',
	  jpg: 'image/jpeg',
	  js: 'application/javascript',
	  json: 'application/json',
	  log: 'text/plain',
	  map: 'application/json',
	  mov: 'video/quicktime',
	  mp3: 'audio/mp3',
	  mp4: 'video/mp4',
	  oga: 'audio/ogg',
	  ogg: 'audio/ogg',
	  ogv: 'video/ogg',
	  pdf: 'application/pdf',
	  png: 'image/png',
	  ps: 'application/postscript',
	  pps: 'application/vnd.ms-powerpoint',
	  ppt: 'application/vnd.ms-powerpoint',
	  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	  psd: 'image/vnd.adobe.photoshop',
	  qt: 'video/quicktime',
	  rar: 'application/x-rar-compressed',
	  rtf: 'text/rtf',
	  svg: 'image/svg+xml',
	  text: 'text/plain',
	  txt: 'text/plain',
	  tiff: 'image/tiff',
	  war: 'application/java-archive',
	  weba: 'audio/webm',
	  webm: 'video/webm',
	  webp: 'image/webp',
	  xls: 'application/vnd.ms-excel',
	  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	  zip: 'application/zip'
	};
	
	/**
	 * lookup the mapped MIME type based on the extension provided
	 *
	 * @param {string} extension
	 * @returns {string}
	 */
	var lookup = function lookup(extension) {
	  return MIME_TYPES[extension] || '';
	};
	
	exports.default = {
	  lookup: lookup
	};
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=savery.js.map