# PathSegment
Pieces of a path are usually used in terms of a connection between 2 tiles, such
as accessing the slope or determining how lines are laid out side-by-side.

PathSegment
  prevSegment: null,
  nextSegment: null,
  prevTile: null,
  nextTile: null,
  path: null,
  direction: => prevTile.directionTo(nextTile)

Path
  tiles: hasMany('tile')
  pathSegments: function() {
    var tiles = this.get('tiles');
    var length = tiles.length - 1;
    var segments = Array.new(length);
    var prevSegment = null, currentSegment;
    for(var i = 0; i < length; i++) {
      currentSegment = segments[i] = PathSegment.create({
        prevSegment: prevSegment,
        path: this,
        prevTile: tiles[i],
        nextTile: tiles[i + 1]
      });
      if(prevSegment) {
        prevSegment.set('nextSegment', currentSegment);
      }
      prevSegment = currentSegment;
    }
    return segments;
  }.property('tiles.[]')