import DS from 'ember-data';

var belongsTo = DS.belongsTo;
var attr = DS.attr;

var DIRECTION_MAP = ['NW', 'N', 'NE', 'E', null, 'W', 'SW', 'S', 'SE'];

export default DS.Model.extend({

  opened: false,

  map: belongsTo('map'),

  row: attr('number'),
  column: attr('number'),

  walkable: function() {
    return Math.random() > 0.05;
  }.property(),

  neighbors: function() {
    var row = this.get('row');
    var column = this.get('column');
    var map = this.get('map');
    var i, j, tile, arr = [];
    for(i = -1; i < 2; i++) {
      for(j = -1; j < 2; j++) {
        if(!(i === 0 && j === 0)) {
          tile = map.tileAt(column + i, row + j);
          if(tile && tile.get('walkable')) { arr.push(tile); }
        }
      }
    }
    return arr;
  }.property('map.tiles.[]'),

  directionTo: function(tile) {
    var diffRow = tile.get('row') - this.get('row');
    var diffColumn = tile.get('column') - this.get('column');
    diffRow = diffRow === 0 ? 0 : diffRow / Math.abs(diffRow);
    diffColumn = diffColumn === 0 ? 0 : diffColumn / Math.abs(diffColumn);
    return DIRECTION_MAP[diffColumn + 3 * diffRow + 4];
  }
  
});
