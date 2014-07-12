import Ember from 'ember';
import Circle from 'subways/views/svg/circle';

var alias = Ember.computed.alias;

export default Circle.extend({

  radius: 2,

  height: alias('parentView.tileHeight'),
  width: alias('parentView.tileWidth'),

  x: function() {
    return (this.get('content.column') + 0.5) * this.get('height');
  }.property('content.column'),

  y: function() {
    return (this.get('content.row') + 0.5) * this.get('width');
  }.property('content.row'),

  fill: function() {
    return this.get('content.walkable') ? '#BBB' : '#ECECEC';
  }.property('content.{walkable,opened}')

});
