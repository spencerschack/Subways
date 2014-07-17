import Ember from 'ember';

function findTile(path) {
  return function(column, row) {
    this.set(path, this.get('model').tileAt(column, row));
  };
}

export default Ember.ObjectController.extend({

  clickedTile: null,
  hoveredTile: null,

  actions: {

    clickTile: findTile('clickedTile'),
    hoverTile: findTile('hoveredTile')

  }

});
