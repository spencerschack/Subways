import Ember from 'ember';
import StyleBindings from 'subways/views/application/style-bindings';

var alias = Ember.computed.alias;

function findTile(action) {
  var lastRow, lastColumn;
  return function(event) {
    var row = this.rowAt(event.pageY);
    var column = this.columnAt(event.pageX);
    if(row && column && (row !== lastRow || column !== lastColumn)) {
      lastColumn = column;
      lastRow = row;
      this.get('controller').send(action, column, row);
    }
  };
}

export default Ember.View.extend(StyleBindings, {

  tileWidth: 25,
  tileHeight: 25,

  classNames: ['map'],

  styleBindings: ['marginLeft', 'marginTop', 'width', 'height'],

  columns: alias('controller.columns'),
  rows: alias('controller.rows'),

  width: function() {
    return this.get('columns') * this.get('tileWidth');
  }.property('columns', 'tileWidth'),
  height: function() {
    return this.get('rows') * this.get('tileHeight');
  }.property('rows', 'tileHeight'),

  marginLeft: function() {
    return this.get('width') / -2;
  }.property('width'),
  marginTop: function() {
    return this.get('height') / -2;
  }.property('height'),

  rowAt: function(y) {
    var relativeOffset = y - this.$().offset().top;
    var index = Math.floor(relativeOffset / this.get('tileHeight'));
    return (index >= 0 && index < this.get('rows')) ? index : null;
  },
  columnAt: function(x) {
    var relativeOffset = x - this.$().offset().left;
    var index = Math.floor(relativeOffset / this.get('tileWidth'));
    return (index >= 0 && index < this.get('columns')) ? index : null;
  },

  clickTile: findTile('clickTile'),
  hoverTile: findTile('hoverTile'),

  $app: function() {
    return this.$().parents('.ember-application');
  }.property(),

  setEventCapturers: function(action) {
    this.get('$app')
      [action]('mousemove', this.hoverTile, this)
      [action]('click', this.clickTile, this);
  },

  addEventCapturers: function() {
    this.setEventCapturers('on');
  }.on('didInsertElement'),

  removeEventCapturers: function() {
    this.setEventCapturers('off');
  }.on('willDestroyElement')

});
