import Ember from 'ember';

export default Ember.Route.extend({

  actions: {

    createRecord: function() {
      this.get('controller').send('createRecord');
    }

  }

});
