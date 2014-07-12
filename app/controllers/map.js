import Ember from 'ember';
import PathFinder from 'subways/utils/path-finder';

var alias = Ember.computed.alias;

function findTile(path) {
  return function(column, row) {
    this.set(path, this.get('model').tileAt(column, row));
  };
}

export default Ember.ObjectController.extend({

  path: alias('pathFinder.path'),

  costLogger: function() {
    console.log('cost', this.get('path.cost'));
  }.observes('path.cost'),

  pathFinder: function() {
    return PathFinder.create({
      map: this.get('model'),
      path: this.store.createRecord('path')
    });
  }.property(),

  actions: {

    chosePathStart: findTile('pathFinder.start'),
    chosePathEnd: findTile('pathFinder.end')

  }

});
