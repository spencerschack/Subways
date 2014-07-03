import Ember from 'ember';
import Document from 'subways/views/svg/document';
import StyleBindings from 'subways/views/application/style-bindings';

var alias = Ember.computed.alias;

export default Ember.View.extend(Document, StyleBindings, {

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
    if(index < 0 || index > this.get('rows')) { return null; }
    return index;
  },
  columnAt: function(x) {
    var relativeOffset = x - this.$().offset().left;
    var index = Math.floor(relativeOffset / this.get('tileWidth'));
    if(index < 0 || index > this.get('columns')) { return null; }
    return index;
  },

  chosePathStart: function(event) {
    var row = this.rowAt(event.pageY);
    var column = this.columnAt(event.pageX);
    if(column && row) {
      this.get('controller').send('chosePathStart', column, row);
    }
  }.on('click'),
  chosePathEnd: function(event) {
    var row = this.rowAt(event.pageY);
    var column = this.columnAt(event.pageX);
    if(column && row) {
      this.get('controller').send('chosePathEnd', column, row);
    }
  }.on('mouseMove')

});
