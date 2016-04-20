#!/usr/bin/env node
'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _start = require('./start');

var _start2 = _interopRequireDefault(_start);

var _sheets = require('./sheets');

var _sheets2 = _interopRequireDefault(_sheets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version('0.0.6').usage('<command>').option('start', 'Generate translations').option('sheets', 'List available sheets').parse(process.argv);

if (_commander2.default.start) {
  (0, _start2.default)();
}

if (_commander2.default.sheets) {
  (0, _sheets2.default)();
}