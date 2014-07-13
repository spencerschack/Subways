import Ember from 'ember';
import Document from 'subways/views/svg/document';

var alias = Ember.computed.alias;

export default Ember.View.extend(Document, {

  classNames: ['tiles'],

  tileWidth: alias('parentView.tileWidth'),
  tileHeight: alias('parentView.tileHeight'),

  // Who would've known rendering 1500 views would be a bottleneck?
  render: function(buffer) {
    var tiles = this.get('controller.model');
    var width = this.get('tileWidth');
    var height = this.get('tileHeight');
    var tile;
    for(var column = 0, columns = tiles.length; column < columns; column++) {
      for(var row = 0, rows = tiles[column].length; row < rows; row++) {
        tile = tiles[column][row];
        buffer.push('<circle r="2" fill="' +
          (tile.walkable ? '#BBB' : '#ECECEC') + '" cx="' +
          ((tile.column + 0.5) * height) + '" cy="' +
          ((tile.row + 0.5) * width) +
        '"></circle>');
      }
    }
  }.bm('render')

});
