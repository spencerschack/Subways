import Ember from 'ember';

export default Ember.Controller.extend({

  map: function() {
    return this.store.createRecord('map', {
      columns: 32,
      rows: 20
    });
  }.property()

});
