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
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* eslint semi: [\"error\", \"always\"] */\r\n\r\n// To Generate bookmarklet. ugilify and make bookmark with uglified code\r\n// https://skalman.github.io/UglifyJS-online/\r\n// https://caiorss.github.io/bookmarklet-maker/\r\n\r\nvar boldLinesKeyWords = ['WEBMREMOTEWS'];\r\nvar styleWords = [{\r\n  style: 'font-weight:bold',\r\n  words: [\r\n    'Work Order',\r\n    'CasePart-',\r\n    'workorderNumber',\r\n    'AFC',\r\n    'Contact Name',\r\n    'Facility ID',\r\n    'Contact',\r\n    'Account',\r\n    'Surgeon',\r\n    'When Issue Occurred',\r\n    'Length of Extended Surgical Time',\r\n    'What Software Task When Issue Occurred',\r\n    'EventSummary',\r\n    'lengthOfExternalSurgicalTime',\r\n    'Next Action/Resolution',\r\n    'Description',\r\n    'Was Medtronic Imaging Aborted',\r\n    'Surgery Aborted',\r\n    'Was Navigation Aborted',\r\n    'Type of Surgical Procedure',\r\n    'Was a Patient Involved',\r\n    'Patient Id',\r\n    'Patient Gender',\r\n    'Patient Age Units',\r\n    'Patient Weight',\r\n    'Patient Weight Units',\r\n    'Patient Date of Birth',\r\n    'PEI',\r\n    'Contact Name',\r\n    'Facility ID',\r\n    'Contact',\r\n    'Account',\r\n    'Surgeon',\r\n    'MNAV Comment ID:',\r\n    'MNAV Comment Subject:',\r\n    'MNAV Comment:',\r\n    'MNAV Created By:',\r\n    'MNAV Created Date:',\r\n    'MNAV Case Part:',\r\n    'Date Completed'\r\n  ]\r\n},\r\n{\r\n  style: 'color:green',\r\n  words: [\r\n    'Work Order',\r\n    'workorderNumber',\r\n    'Date Completed',\r\n    'CasePart-',\r\n    'AFC'\r\n  ]\r\n},\r\n{\r\n  style: 'color:blue',\r\n  words: [\r\n    'When Issue Occurred',\r\n    'Length of Extended Surgical Time',\r\n    'What Software Task When Issue Occurred',\r\n    'EventSummary',\r\n    'lengthOfExternalSurgicalTime',\r\n    'Next Action/Resolution',\r\n    'Description'\r\n  ]\r\n},\r\n{\r\n  style: 'color:red',\r\n  words: ['Was Medtronic Imaging Aborted',\r\n    'Surgery Aborted',\r\n    'Was Navigation Aborted',\r\n    'Type of Surgical Procedure',\r\n    'Was a Patient Involved',\r\n    'Patient Id',\r\n    'Patient Gender',\r\n    'Patient Age Units',\r\n    'Patient Weight',\r\n    'Patient Weight Units',\r\n    'Patient Date of Birth',\r\n    'PEI',\r\n    'MNAV Created Date:'\r\n  ]\r\n},\r\n{\r\n  style: 'color:purple',\r\n  words: [\r\n    'Contact Name',\r\n    'Facility ID',\r\n    'Contact',\r\n    'Account',\r\n    'Surgeon'\r\n  ]\r\n},\r\n{\r\n  style: 'background:yellow',\r\n  words: []\r\n}\r\n];\r\n\r\nstyleWords.forEach(function (s) {\r\n  s.words.sort(function (a, b) {\r\n    return b.length - a.length;\r\n  });\r\n});\r\n\r\nvar lines = [];\r\nvar links = [];\r\nvar linkIdCounter = 0;\r\nfunction formatText (text) {\r\n  var lines = text.split('\\n');\r\n  var links = [];\r\n  // Remove excess line breaks (empty lines.)\r\n  lines = lines.filter(function (l) { return l.trim().length > 0; });\r\n  var startLine = 0;\r\n  lines = lines.map(function (l, lineNo) {\r\n    // Check to see if we should bold this.\r\n    boldLinesKeyWords.forEach(function (kw) {\r\n      if (l.indexOf(kw) >= 0) {\r\n        // Get the date.\r\n        var d = l.match(/\\d{4}-\\d{2}-\\d{2}/g);\r\n        var id;\r\n        if (d) {\r\n          id = d[0];\r\n        } else {\r\n          id = 'Unknown Date';\r\n        }\r\n        l = '<b id=\"lnk' + linkIdCounter + '\">' + l + '</b>';\r\n        links.push({id: 'lnk' + linkIdCounter, title: id, level: 1, start: startLine, end: lineNo});\r\n        linkIdCounter++;\r\n        startLine = lineNo + 1;\r\n      }\r\n    });\r\n\r\n    styleWords.forEach(function (s) {\r\n      for (var i = 0; i < s.words.length; i++) {\r\n        l = l.replace(s.words[i], '<span style=\"' + s.style + '\">' + s.words[i] + '</span>');\r\n      }\r\n    });\r\n    return l;\r\n  });\r\n  // Sort the links and re-arrange by date. Re-Order text lines.\r\n  var LinksSorted = links.concat().sort(function (a, b) {\r\n    if (a.title < b.title) { return -1; }\r\n    if (a.title > b.title) { return 1; }\r\n    return 0;\r\n  });\r\n  var SortedLines = LinksSorted.map(function(l) {return lines.slice(l.start, l.end + 1);}).reduce(function(acc, val){ return acc.concat(val)}, []).concat(lines.slice(startLine));\r\n//   var SortedLines = LinksSorted.map(function(l) {return lines.slice(l.start, l.end + 1);}).flat().concat(lines.slice(startLine));\r\n  return {\r\n    lines: SortedLines,\r\n    links: LinksSorted\r\n  };\r\n};\r\nvar textInfoF = ['Event Description', 'Interface Update Details', 'Interface Details', 'Conversion Related Data', 'General', 'As Reported Event Description'];\r\ntextInfoF.forEach(function (t) {\r\n  var txt = top.GUIDE.PE[top.GUIDE.PE.curPrEv].textInfo[t];\r\n  var tId = t.replace(/\\W/gi, '');\r\n  if (txt) {\r\n    lines.push('<h2 id=\"' + tId + '\">' + top.GUIDE.PE.curPrEv + ' ' + t + '</h2>');\r\n    links.push({id: tId, title: t});\r\n    var ft = formatText(txt);\r\n    lines = lines.concat(ft.lines);\r\n    links = links.concat(ft.links);\r\n  }\r\n});\r\nvar content = lines.join('<br/>');\r\nvar nav = [];\r\nnav.push('<div style=\"position: fixed;padding: 10px;top: 0;left: 0;height: 100%;width: 150px;background: #004b87;color: white;\">');\r\nnav.push(top.GUIDE.PE.curPrEv);\r\nnav.push('<ul>');\r\n\r\nlinks.forEach(function (link) {\r\n  nav.push('<li>');\r\n  nav.push('<a style=\"color:white;');\r\n  if (link.level) {\r\n    nav.push('margin-left:20px;');\r\n  }\r\n  nav.push('\" href=\"#');\r\n  nav.push(link.id + '\">');\r\n  nav.push(link.title);\r\n  nav.push('</a></li>');\r\n});\r\nnav.push('</ul></div>');\r\nnav.push('<div style=\"position: relative;margin-left: 175px;\">');\r\n\r\nvar q = window.open('../crm_ui_frame/blank.htm');\r\n\r\nsetTimeout(function () { q.document.body.innerHTML = nav.join('') + content + '</div>'; }, 100);\n\n//# sourceURL=webpack:///./Nav_Tool_v3.js?");

/***/ })

/******/ });