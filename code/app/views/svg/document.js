import Ember from 'ember';
import Parent from 'subways/views/svg/parent';

export default Ember.Mixin.create(Parent, {

  tagName: 'svg',

  svg: function() {
    return this;
  }.property()

});