import Ember from 'ember';

var Router = Ember.Router.extend({

  location: SubwaysENV.locationType

});

Router.map(function() {

  this.resource('games', function() {
    this.route('show', { path: ':game_id' });
  });

});

export default Router;
