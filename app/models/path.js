import DS from 'ember-data';

var hasMany = DS.hasMany;

var TILE_COST = 1;

export default DS.Model.extend({

  tiles: hasMany('tile', { inverse: null }),

  cost: function() {
    var tiles = this.get('tiles');
    var prevTile, tile = tiles.objectAt(0), cost = 0, dr, dc;
    for(var i = 1, len = tiles.get('length'); i < len; i++) {
      prevTile = tile;
      tile = tiles.objectAt(i);
      dr = Math.abs(tile.get('row') - prevTile.get('row'));
      dc = Math.abs(tile.get('column') - prevTile.get('column'));
      cost += Math.max(dr, dc);
    }
    return cost * TILE_COST;
  }.property(),
  
});
