import Ember from 'ember';

var SQRT2 = Math.sqrt(2);

function PathFinderNode(tile, end) {
  this.tile = tile;
  this.end = end;
  this.prev = null;
  this.explored = false;
  this.opened = false;
  this.g = 0;
  this.h = 0;
  this.f = 0;
}

export default Ember.Object.extend({

  map: null,

  path: null,

  reachable: function() {
    var start = this.get('start');
    if(!start) { return null; }
    var heap = new Heap(function(a, b) {
      return a.f - b.f;
    });
    heap.push(this.nodeFor(start));
    return heap;
  }.property('start', 'end'),

  finder: function() {
    this.get('path.tiles').clear();
    var start = this.get('start');
    var end = this.get('end');
    if(!start || !end || start === end) { return; }
    if(!start.get('walkable') || !end.get('walkable')) { return; }
    var cached = this.get('cached');
    if(cached) {
      this.setTiles(cached);
      return;
    }
    var endRow = end.get('row');
    var endColumn = end.get('column');
    var reachable = this.get('reachable');
    var current, neighbors, neighbor, i, g, closed, dr, dc, row, column;
    while(!reachable.empty()) {
      current = reachable.pop();
      if(current.tile === end) {
        this.setTiles(this.reconstructPath(current));
        return;
      }
      current.explored = true;
      neighbors = current.tile.get('neighbors');
      for(i = 0; i < neighbors.length; i++) {
        neighbor = this.nodeFor(neighbors[i]);
        row = current.tile.get('row');
        column = current.tile.get('column');
        dr = row - neighbor.tile.get('row');
        dc = column - neighbor.tile.get('column');
        if(neighbor.explored) { continue; }
        g = current.g + ((dr === 0 || dc === 0) ? 1 : SQRT2);
        closed = !neighbor.opened;
        if(closed || g < neighbor.g) {
          neighbor.g = g;
          if(!neighbor.h) {
            dr = Math.abs(row - endRow);
            dc = Math.abs(column - endColumn);
            neighbor.h = Math.max(dc, dr) + (dc + dr) / 10;
          }
          neighbor.h || (neighbor.h = heuristic(neighbor, end));
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.prev = current;
          if(closed) {
            reachable.push(neighbor);
            neighbor.opened = true;
          } else {
            reachable.updateItem(neighbor);
          }
        }
      }
    }
  }.bm('finder').observes('start', 'end'),

  /**
   * Takes the last node in a path, walks up through each prev node creating
   * an array of tiles, omitting tiles that are colinear.
   * 
   * o---o---o                o-------o
   *          \           =>           \
   *           o---o---o                o-------o
   * 
   * @param  {PathFinderNode} node
   * @return {PathFinderNode[]}
   */
  reconstructPath: function(node) {
    var arr = [], prevDir, dir, prev;
    for(; node; node = prev, prevDir = dir) {
      prev = node.prev;
      dir = prev ? node.tile.directionTo(prev.tile) : null;
      if(dir !== prevDir) {
        arr.unshift(node.tile);
      }
    }
    return arr;
  },

  setTiles: function(arr) {
    this.set('cached', arr);
    this.get('path.tiles').addObjects(arr);
  },

  cached: function(_, value) {
    var key = this.get('start') + this.get('end');
    if(arguments.length === 2) {
      return this.get('cache').set(key, value);
    }
    return this.get('cache').get(key);
  }.property('start', 'end'),

  cache: function() {
    return Ember.Map.create();
  }.property('map.{rows,columns}'),

  nodeFor: function(tile) {
    return this.get('nodeForMap').get(tile);
  },

  nodeForMap: function() {
    var end = this.get('end');
    return Ember.MapWithDefault.create({
      defaultValue: function(tile) {
        return new PathFinderNode(tile, end);
      }
    });
  }.property('end')

});