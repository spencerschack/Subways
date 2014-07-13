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
    return Math.random() > 0.2;
  }.property(),

  directionTo: function(tile) {
    var diffRow = tile.get('row') - this.get('row');
    var diffColumn = tile.get('column') - this.get('column');
    diffRow = diffRow === 0 ? 0 : diffRow / Math.abs(diffRow);
    diffColumn = diffColumn === 0 ? 0 : diffColumn / Math.abs(diffColumn);
    return DIRECTION_MAP[diffColumn + 3 * diffRow + 4];
  }
  
});
