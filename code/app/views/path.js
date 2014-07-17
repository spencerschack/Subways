import Ember from 'ember';
import Element from 'subways/views/svg/element';

var alias = Ember.computed.alias;

var PI = Math.PI;
var ANGLE_MAP = {
  NW: 5 / 4 * PI,
  N:  3 / 2 * PI,
  NE: 7 / 4 * PI,
  E:  0,
  SE: 1 / 4 * PI,
  S:  1 / 2 * PI,
  SW: 3 / 4 * PI,
  W:  PI
};
var CURVE_OFFSET = 7;

export default Ember.View.extend(Element, {

  classNames: ['path'],

  templateName: 'path',

  tileWidth: 25,
  tileHeight: 25,

  data: function() {
    var tiles = this.get('content.tiles').toArray();
    var length = tiles.length;
    if(length < 2) { return null; }
    var tile = tiles[0];
    var str = 'M' + this.x(tile) + ' ' + this.y(tile);
    for(var i = 2, next = tiles[1], prev; i <= length; i++) {
      prev = tile;
      tile = next;
      next = tiles[i];
      if(next) {
        str += this.lineTo(tile, prev);
        str += this.circleTo(next, tile);
      } else {
        str += 'L' + this.x(tile) + ' ' + this.y(tile);
      }
    }
    return str;
  }.property('content.tiles.[]', 'tileWidth', 'tileHeight'),

  x: function(tile) {
    return (tile.column + 0.5) * this.get('tileWidth');
  },

  y: function(tile) {
    return (tile.row + 0.5) * this.get('tileHeight');
  },

  shifted: function(to, from) {
    var angle = ANGLE_MAP[this.get('controller.map').direction(to, from)];
    var x = this.x(to) + CURVE_OFFSET * Math.cos(angle);
    var y = this.y(to) + CURVE_OFFSET * Math.sin(angle);
    return { x: x, y: y };
  },

  circleTo: function(to, from) {
    var position = this.shifted(from, to);
    return 'Q' + this.x(from) + ',' + this.y(from) + ' ' +
      position.x + ',' + position.y;
  },

  lineTo: function(to, from) {
    var position = this.shifted(to, from);
    return 'L' + position.x + ' ' + position.y;
  }

});
