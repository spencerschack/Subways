import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {

    createRecord: function() {
      var game = this.store.createRecord('game', {
        map: this.store.createRecord('map')
      });
      this.transitionToRoute('games.show', game);
    }

  }

});
