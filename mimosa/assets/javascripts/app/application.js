import Class from 'app/utils/class';
import View from 'app/view';
import Map from 'app/map';
import options from 'app/options';

export default Class(View, function Application() {

  this.map = new Map(options.map);

  this.container = document.querySelector(options.container);
  this.container.appendChild(this.render());

}, {

  elementId: 'subways',

  childViews: ['map']

});

Class(function State(parent) {

  this.parent = parent;

  parent = this;
  this.states = this.states.reduce(function(states, state) {
    state = new state(parent);
    states[state.name] = state;
    return states;
  }, {});

}, {

  current: null,

  transitionTo: function(state) {
    return this.promise(this.current.exit()).then(function() {
      this.current = this.states[state];
    }.bind(this)).then(function() {
      return this.promise(this.current.enter());
    }.bind(this));
  },

  send: function(action, /* ...args */) {
    var args = Array.prototype.slice.call(args, 1);
    if(this[action]) {
      return this[action].apply(this, args);
    }
    if(this.parent) {
      return this.parent.send.apply(this.parent, arguments);
    }
    throw 'Nothing handled the action "' + action + '"';
  }

});

Class(State, function Game() {

  enter: function() {
    // render path builder
  },

  exit: function() {

  },

  states: [Night, Day]

})

new Game().transitionTo('night');