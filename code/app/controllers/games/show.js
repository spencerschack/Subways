import Ember from 'ember';
import PathFinder from 'subways/utils/path-finder';

var alias = Ember.computed.alias;

export default Ember.ObjectController.extend({

  path: alias('pathFinder.path'),

  pathFinder: function() {
    var map = this.get('controllers.map');
    return PathFinder.create({
      map: map,
      start: alias('map.clickTile'),
      end: alias('map.hoverTile'),
      path: this.store.createRecord('path')
    });
  }.property()

});
