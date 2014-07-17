/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

app.import('vendor/ember-localstorage-adapter/localstorage_adapter.js');
app.import('vendor/benchmark/benchmark.js');
app.import('vendor/heap/lib/heap.js')

module.exports = app.toTree();
