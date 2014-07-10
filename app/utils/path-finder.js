import Ember from 'ember';

var PriorityQueue = Ember.ArrayProxy.extend(Ember.SortableMixin, {
  sortProperties: ['f']
});
var isEmpty = Ember.isEmpty;
var SQRT2 = Math.sqrt(2);

var PathFinderNode = Ember.Object.extend({

  tile: null,

  prev: null,

  end: null,

  explored: false,

  heuristic: null,

  h: function() {
    var tile = this.get('tile');
    var end = this.get('end');
    var diffRow = Math.abs(tile.get('row') - end.get('row'));
    var diffColumn = Math.abs(tile.get('column') - end.get('column'));
    return Math.max(diffColumn, diffRow) + (diffColumn + diffRow) / 10;
  }.property('prev'),

  g: 0,

  f: function() {
    return this.get('g') + this.get('h');
  }.property('g', 'h'),

  direction: function() {
    var prev = this.get('prev');
    return prev ? this.get('tile').directionTo(prev.get('tile')) : null;
  }.property('tile', 'prev.tile'),

  distanceTo: function(node) {
    var diffRow = this.get('tile.row') - node.get('tile.row');
    var diffColumn = this.get('tile.column') - node.get('tile.column');
    return (diffRow === 0 || diffColumn === 0) ? 1 : SQRT2;
  }

});

export default Ember.Object.extend({

  map: null,

  path: null,

  reachable: function() {
    var start = this.get('start');
    if(!start) { return null; }
    return PriorityQueue.create({
      content: [this.nodeFor(start)]
    });
  }.property('start', 'end'),

  finder: function() {
    this.get('map.tiles').forEach(function(tile) { tile.set('opened', false); });
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
    var reachable = this.get('reachable');
    var current, neighbors, neighbor, i, g, diffRow, diffColumn;
    while(!isEmpty(reachable)) {
      current = reachable.shiftObject();
      if(current.get('tile') === end) {
        this.setTiles(this.reconstructPath(current));
        return;
      }
      current.set('explored', true);
      neighbors = current.get('tile.neighbors');
      for(i = 0; i < neighbors.length; i++) {
        neighbor = this.nodeFor(neighbors[i]);
        if(neighbor.get('explored')) { continue; }
        g = current.get('g') + current.distanceTo(neighbor);
        if(!reachable.contains(neighbor) || g < neighbor.get('g')) {
          neighbor.setProperties({
            prev: current,
            g: g,
            'tile.opened': true
          });
          reachable.addObject(neighbor);
        }
      }
    }
  }.observes('start', 'end'),

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
      prev = node.get('prev');
      dir = node.get('direction');
      if(dir !== prevDir) {
        arr.unshift(node.get('tile'));
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
        return PathFinderNode.create({
          tile: tile,
          end: end
        });
      }
    });
  }.property('end')

});