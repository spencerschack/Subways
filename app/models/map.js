import DS from 'ember-data';

var SQRT2 = Math.sqrt(2);
var DIRECTIONS = [
  ['NW', 'N', 'NE'],
  ['W', null, 'E'],
  ['SW', 'S', 'SE']
];

var attr = DS.attr;

function Tile(column, row) {
  this.row = row;
  this.column = column;
  this.walkable = true;
}

export default DS.Model.extend({

  columns: attr('number'),
  rows: attr('number'),

  // This method use to return an array of DS.Model objects. Calls would take
  // approximately 2 seconds. With native objects, it takes 0.1 milliseconds.
  tiles: function() {
    var columns = this.get('columns');
    var rows = this.get('rows');
    var arr = new Array(columns), sub;
    //var ne, n, nw, w, sw, s, se, e;
    for(var column = 0; column < columns; column++) {
      sub = arr[column] = new Array(rows);
      for(var row = 0; row < rows; row++) {
        sub[row] = new Tile(column, row);
      }
    }
    return arr;
  }.bm('tiles').property(),

  direction: function(a, b) {
    var dr = Math.max(-1, Math.min(1, b.row - a.row));
    var dc = Math.max(-1, Math.min(1, b.column - a.column));
    return DIRECTIONS[dr + 1][dc + 1];
  },

  distance: function(a, b) {
    return (a.row === b.row || a.column === b.column) ? 1 : SQRT2
  },

  neighborsOf: function(tile) {
    var row = tile.row, column = tile.column;
    var neighbors = [];
    if(tile = this.tileAt(row - 1, column - 1)) { neighbors.push(tile); }
    if(tile = this.tileAt(row - 1, column    )) { neighbors.push(tile); }
    if(tile = this.tileAt(row - 1, column + 1)) { neighbors.push(tile); }
    if(tile = this.tileAt(row    , column - 1)) { neighbors.push(tile); }
    if(tile = this.tileAt(row    , column + 1)) { neighbors.push(tile); }
    if(tile = this.tileAt(row + 1, column - 1)) { neighbors.push(tile); }
    if(tile = this.tileAt(row + 1, column    )) { neighbors.push(tile); }
    if(tile = this.tileAt(row + 1, column + 1)) { neighbors.push(tile); }
    return neighbors;
  },

  tileAt: function(column, row) {
    var column = this.get('tiles')[column];
    return column ? column[row] : null;
  }
  
});
