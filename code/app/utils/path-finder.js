import Ember from 'ember';

function PathFinderNode(tile) {
  this.tile = tile;
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
    this.set('path.tiles', []);
    var start = this.get('start');
    var end = this.get('end');
    if(!start || !end || start === end) { return; }
    if(!start.walkable || !end.walkable) { return; }
    var cached = this.get('cached');
    if(cached) {
      this.setTiles(cached);
      return;
    }
    var map = this.get('map');
    var endRow = end.row;
    var endColumn = end.column;
    var reachable = this.get('reachable');
    var current, neighbors, neighbor, i, g;
    while(!reachable.empty()) {
      current = reachable.pop();
      if(current.tile === end) {
        this.setTiles(this.reconstructPath(current));
        return;
      }
      current.explored = true;
      neighbors = map.neighborsOf(current.tile);
      for(i = 0; i < neighbors.length; i++) {
        neighbor = this.nodeFor(neighbors[i]);
        if(neighbor.explored) { continue; }
        g = current.g + map.distance(current.tile, neighbor.tile);
        if(!neighbor.opened || g < neighbor.g) {
          neighbor.g = g;
          if(!neighbor.h) {
            neighbor.h = this.heuristic(neighbor.tile);
          }
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.prev = current;
          if(!neighbor.opened) {
            reachable.push(neighbor);
            neighbor.opened = true;
          } else {
            reachable.updateItem(neighbor);
          }
        }
      }
    }
  }.observes('start', 'end'),

  heuristic: function(tile) {
    var end = this.get('end');
    var dr = Math.abs(tile.row - end.row);
    var dc = Math.abs(tile.column - end.column);
    return Math.max(dc, dr) + (dc + dr) / 10;
  },

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
    var map = this.get('map');
    for(; node; node = prev, prevDir = dir) {
      prev = node.prev;
      dir = prev ? map.direction(node.tile, prev.tile) : null;
      if(dir !== prevDir) {
        arr.unshift(node.tile);
      }
    }
    return arr;
  },

  setTiles: function(arr) {
    this.set('cached', arr);
    this.set('path.tiles', arr);
  },

  cached: function(_, value) {
    var start = this.get('start');
    var end = this.get('end');
    var key = start.row + ',' + start.column + ':' + end.row + ',' + end.column;
    var cache = this.get('cache');
    if(arguments.length === 2) {
      cache[key] = value;
    }
    return cache[key];
  }.property('cache', 'start', 'end'),

  cache: function() {
    return {};
  }.property('map.{rows,columns}'),

  nodeFor: function(tile) {
    return this.get('nodeForMap').get(tile);
  },

  nodeForMap: function() {
    var end = this.get('end');
    return Ember.MapWithDefault.create({
      defaultValue: function(tile) {
        return new PathFinderNode(tile);
      }
    });
  }.property('start', 'end')

});