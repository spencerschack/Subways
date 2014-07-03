import Ember from 'ember';

export default Ember.ObjectController.extend({

  path: function() {
    return Ember.ArrayController.create({
      content: []
    });
  }.property(),

  actions: {

    chosePathStart: function(column, row) {
      var tile = this.get('model').tileAt(column, row);
      if(tile) {
        var path = this.get('path');
        path.clear();
        path.pushObject(tile);
      }
    },

    chosePathEnd: function(column, row) {
      var tile = this.get('model').tileAt(column, row);
      if(tile) {
        var path = this.get('path');
        if(path.get('length') == 2) {
          path.popObject();
        }
        if(path.get('length') == 1) {
          path.pushObject(tile);
        }
      }
    }

  }

});
