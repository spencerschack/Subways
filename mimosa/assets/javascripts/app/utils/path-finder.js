import Heap from 'vendor/heap/heap';

var COMPARATOR = function(a, b) { return a.f - b.f; }

function PathFinderNode(tile) {
  this.tile = tile;
  this.prev = null;
  this.explored = false;
  this.opened = false;
  this.g = 0;
  this.h = 0;
  this.f = 0;
}

function PathFinder(map) {

  this.map = map;

}

PathFinder.prototype = {

  findPath: function(start, end) {
    var map = this.map;
    var endRow = end.row, endColumn = end.column;
    var reachable = new Heap(COMPARATOR);
    var current, neighbor, neighbors, i, g;
    reachable.push(this.nodeFor(start));
    while(!reachable.empty()) {
      current = reachable.pop();
      if(current.tile === end) {
        return this.reconstructPath(current);
      }
      current.explored = true;
      neighbors = map.neighborsOf(current.tile);
      for(i = 0; i < neighbors.length; i++) {
        neighbor = this.nodeFor(neighbors[i]);
        if(neighbor.explored) { continue; }
        g = current.g + this.distance(current.tile, neighbors[i]);
        if(!neighbor.opened || g < neighbor.g) {
          neighbor.g = g;
          if(!neighbor.h) {
            neighbor.h = this.heuristic(current.tile, end);
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
  },

  heuristic: function(a, b) {
    var dr = Math.abs(a.row - b.row);
    var dc = Math.abs(a.column - b.column);
    return Math.max(dc, dr) + (dc + dr) / 10;
  },

  distance: function(a, b) {
    return this.map.distance(a, b);
  },

  nodeFor: function(tile) {
    return this.nodes[tile] || (this.nodes[tile] = new PathFinderNode(tile));
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
    for(; node; node = prev, prevDir = dir) {
      prev = node.prev;
      dir = prev ? this.map.direction(node.tile, prev.tile) : null;
      if(dir !== prevDir) {
        arr.unshift(node.tile);
      }
    }
    return arr;
  }

};

export default PathFinder;
