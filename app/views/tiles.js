import Ember from 'ember';
import Group from 'subways/views/svg/group';

var alias = Ember.computed.alias;

export default Ember.View.extend(Group, {

  tileWidth: alias('parentView.tileWidth'),
  tileHeight: alias('parentView.tileHeight'),

});
