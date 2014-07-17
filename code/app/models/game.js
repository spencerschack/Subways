import DS from 'ember-data';

var attr = DS.attr;
var belongsTo = DS.belongsTo;

export default DS.Model.extend({

  money: attr('number', { defaultValue: 0 }),

  map: belongsTo('map')
  
});
