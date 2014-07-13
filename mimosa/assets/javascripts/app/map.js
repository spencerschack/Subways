import Class from 'app/utils/class';
import SVGView from 'app/views/svg';
import PathFinder from 'app/utils/path-finder';
import Tile from 'app/tile';

var SQRT2 = Math.sqrt(2);
var DIRECTIONS = [
  ['NW', 'N', 'NE'],
  ['W', null, 'E'],
  ['SW', 'S', 'SE']
];

export default Class(SVGView, function Map(options) {

  this.rows = options.rows;
  this.columns = options.columns;

  this.tileWidth = options.tile.width;
  this.tileHeight = options.tile.height;

  this.tiles = new Array(this.rows);
  for(var row = 0; row < this.rows; row++) {
    this.tiles[row] = new Array(this.columns);
    for(var column = 0; column < this.columns; column++) {
      this.tiles[row][column] = new Tile(column, row);
    }
  }

}, {

  initializePathBuilder: function() {
    this.render('pathBuilder', new PathBuilder());
  },

  destroyPathBuilder: function() {
    this.unrender('pathBuilder');
  },

  events: {
    choosePathEnd: 'mousemove'
  },

  choosePathEnd: function(event) {
    var row = Math.floor(event.pageY / this.tileHeight);
    var column = Math.floor(event.pageX / this.tileWidth);
    row = Math.max(0, Math.min(row, this.rows));
    column = Math.max(0, Math.min(column, this.columns));

  },

  renderChildViews: function() {
    var width = this.tileWidth;
    var height = this.tileHeight;
    var template = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    template.setAttribute('r', '2');
    template.setAttribute('fill', '#CCC');
    for(var row = 0, rows = this.rows; row < rows; row++) {
      for(var column = 0, columns = this.columns; column < columns; column++) {
        var circle = template.cloneNode(false);
        circle.setAttribute('cx', (column + 0.5) * width);
        circle.setAttribute('cy', (row + 0.5) * height);
        this.element.appendChild(circle);
      }
    }
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
    var columns = this.tiles[row];
    return columns ? columns[column] : null;
  },

  distance: function(a, b) {
    return (a.row - b.row === 0 || a.column - b.column === 0) ? 1 : SQRT2;
  },

  direction: function(a, b) {
    return DIRECTIONS[b.row - a.row + 1][b.column - a.column + 1];
  }

});
