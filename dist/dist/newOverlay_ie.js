/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./Nav Tool v3.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Nav Tool v3.js":
/*!************************!*\
  !*** ./Nav Tool v3.js ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'core-js/modules/es.array.concat'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'core-js/modules/es.array.filter'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'core-js/modules/es.array.for-each'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'core-js/modules/es.array.index-of'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'core-js/modules/es.array.join'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'core-js/modules/es.array.map'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'core-js/modules/es.array.reduce'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'core-js/modules/es.array.slice'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'core-js/modules/es.regexp.exec'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'core-js/modules/es.string.match'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'core-js/modules/es.string.replace'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'core-js/modules/es.string.split'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'core-js/modules/es.string.trim'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n!(function webpackMissingModule() { var e = new Error(\"Cannot find module 'core-js/modules/web.dom-collections.for-each'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }());\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* eslint semi: [\"error\", \"always\"] */\n// To Generate bookmarklet. ugilify and make bookmark with uglified code\n// https://skalman.github.io/UglifyJS-online/\n// https://caiorss.github.io/bookmarklet-maker/\nvar boldLinesKeyWords = ['WEBMREMOTEWS'];\nvar styleWords = [{\n  style: 'font-weight:bold',\n  words: ['Work Order', 'CasePart-', 'workorderNumber', 'AFC', 'Contact Name', 'Facility ID', 'Contact', 'Account', 'Surgeon', 'When Issue Occurred', 'Length of Extended Surgical Time', 'What Software Task When Issue Occurred', 'EventSummary', 'lengthOfExternalSurgicalTime', 'Next Action/Resolution', 'Description', 'Was Medtronic Imaging Aborted', 'Surgery Aborted', 'Was Navigation Aborted', 'Type of Surgical Procedure', 'Was a Patient Involved', 'Patient Id', 'Patient Gender', 'Patient Age Units', 'Patient Weight', 'Patient Weight Units', 'Patient Date of Birth', 'PEI', 'Contact Name', 'Facility ID', 'Contact', 'Account', 'Surgeon', 'MNAV Comment ID:', 'MNAV Comment Subject:', 'MNAV Comment:', 'MNAV Created By:', 'MNAV Created Date:', 'MNAV Case Part:', 'Date Completed']\n}, {\n  style: 'color:green',\n  words: ['Work Order', 'workorderNumber', 'Date Completed', 'CasePart-', 'AFC']\n}, {\n  style: 'color:blue',\n  words: ['When Issue Occurred', 'Length of Extended Surgical Time', 'What Software Task When Issue Occurred', 'EventSummary', 'lengthOfExternalSurgicalTime', 'Next Action/Resolution', 'Description']\n}, {\n  style: 'color:red',\n  words: ['Was Medtronic Imaging Aborted', 'Surgery Aborted', 'Was Navigation Aborted', 'Type of Surgical Procedure', 'Was a Patient Involved', 'Patient Id', 'Patient Gender', 'Patient Age Units', 'Patient Weight', 'Patient Weight Units', 'Patient Date of Birth', 'PEI', 'MNAV Created Date:']\n}, {\n  style: 'color:purple',\n  words: ['Contact Name', 'Facility ID', 'Contact', 'Account', 'Surgeon']\n}, {\n  style: 'background:yellow',\n  words: []\n}];\nstyleWords.forEach(function (s) {\n  s.words.sort(function (a, b) {\n    return b.length - a.length;\n  });\n});\nvar lines = [];\nvar links = [];\nvar linkIdCounter = 0;\n\nfunction formatText(text) {\n  var lines = text.split('\\n');\n  var links = []; // Remove excess line breaks (empty lines.)\n\n  lines = lines.filter(function (l) {\n    return l.trim().length > 0;\n  });\n  var startLine = 0;\n  lines = lines.map(function (l, lineNo) {\n    // Check to see if we should bold this.\n    boldLinesKeyWords.forEach(function (kw) {\n      if (l.indexOf(kw) >= 0) {\n        // Get the date.\n        var d = l.match(/\\d{4}-\\d{2}-\\d{2}/g);\n        var id;\n\n        if (d) {\n          id = d[0];\n        } else {\n          id = 'Unknown Date';\n        }\n\n        l = '<b id=\"lnk' + linkIdCounter + '\">' + l + '</b>';\n        links.push({\n          id: 'lnk' + linkIdCounter,\n          title: id,\n          level: 1,\n          start: startLine,\n          end: lineNo\n        });\n        linkIdCounter++;\n        startLine = lineNo + 1;\n      }\n    });\n    styleWords.forEach(function (s) {\n      for (var i = 0; i < s.words.length; i++) {\n        l = l.replace(s.words[i], '<span style=\"' + s.style + '\">' + s.words[i] + '</span>');\n      }\n    });\n    return l;\n  }); // Sort the links and re-arrange by date. Re-Order text lines.\n\n  var LinksSorted = links.concat().sort(function (a, b) {\n    if (a.title < b.title) {\n      return -1;\n    }\n\n    if (a.title > b.title) {\n      return 1;\n    }\n\n    return 0;\n  });\n  var SortedLines = LinksSorted.map(function (l) {\n    return lines.slice(l.start, l.end + 1);\n  }).reduce(function (acc, val) {\n    return acc.concat(val);\n  }, []).concat(lines.slice(startLine)); //   var SortedLines = LinksSorted.map(function(l) {return lines.slice(l.start, l.end + 1);}).flat().concat(lines.slice(startLine));\n\n  return {\n    lines: SortedLines,\n    links: LinksSorted\n  };\n}\n\n;\nvar textInfoF = ['Event Description', 'Interface Update Details', 'Interface Details', 'Conversion Related Data', 'General', 'As Reported Event Description'];\ntextInfoF.forEach(function (t) {\n  var txt = top.GUIDE.PE[top.GUIDE.PE.curPrEv].textInfo[t];\n  var tId = t.replace(/\\W/gi, '');\n\n  if (txt) {\n    lines.push('<h2 id=\"' + tId + '\">' + top.GUIDE.PE.curPrEv + ' ' + t + '</h2>');\n    links.push({\n      id: tId,\n      title: t\n    });\n    var ft = formatText(txt);\n    lines = lines.concat(ft.lines);\n    links = links.concat(ft.links);\n  }\n});\nvar content = lines.join('<br/>');\nvar nav = [];\nnav.push('<div style=\"position: fixed;padding: 10px;top: 0;left: 0;height: 100%;width: 150px;background: #004b87;color: white;\">');\nnav.push(top.GUIDE.PE.curPrEv);\nnav.push('<ul>');\nlinks.forEach(function (link) {\n  nav.push('<li>');\n  nav.push('<a style=\"color:white;');\n\n  if (link.level) {\n    nav.push('margin-left:20px;');\n  }\n\n  nav.push('\" href=\"#');\n  nav.push(link.id + '\">');\n  nav.push(link.title);\n  nav.push('</a></li>');\n});\nnav.push('</ul></div>');\nnav.push('<div style=\"position: relative;margin-left: 175px;\">');\nvar q = window.open('../crm_ui_frame/blank.htm');\nsetTimeout(function () {\n  q.document.body.innerHTML = nav.join('') + content + '</div>';\n}, 100);\n\n//# sourceURL=webpack:///./Nav_Tool_v3.js?");

/***/ })

/******/ });