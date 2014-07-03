import DS from 'ember-data';

var belongsTo = DS.belongsTo;
var attr = DS.attr;

export default DS.Model.extend({

  map: belongsTo('map'),

  row: attr('number'),
  column: attr('number')
  
});
