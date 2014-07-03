import Ember from 'ember';
import Element from 'subways/views/svg/element';

var alias = Ember.computed.alias;

export default Ember.View.extend(Element, {

  tagName: 'path',

  attributeBindings: ['d', 'stroke',
    'strokeWidth:stroke-width', 'strokeLinecap:stroke-linecap'],

  tileWidth: alias('parentView.tileWidth'),
  tileHeight: alias('parentView.tileHeight'),

  stroke: 'blue',
  strokeWidth: '4px',
  strokeLinecap: 'round',

  d: function() {
    var content = this.get('content');
    if(content.get('length') === 0) { return null; }
    var width = this.get('tileWidth');
    var height = this.get('tileHeight');
    return content.reduce(function(d, item, index) {
      d += index == 0 ? 'M' : 'L';
      d += (item.get('column') + 0.5) * width;
      d += ' ';
      d += (item.get('row') + 0.5) * height;
      return d + ' ';
    }, '');
  }.property('content.@each.{row,column}', 'tileWidth', 'tileHeight')

});
