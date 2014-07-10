import Ember from 'ember';

export default Ember.Controller.extend({

  map: function() {
    return this.store.createRecord('map', {
      columns: 50,
      rows: 30
    });
  }.property()

});
