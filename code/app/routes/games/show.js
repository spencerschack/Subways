import Ember from 'ember';

export default Ember.Route.extend({

  renderTemplate: function(controller, model) {
    this.render();
    this.render('map', {
      model: model.get('map'),
      into: 'games/show',
      outlet: 'map'
    })
  }

});
