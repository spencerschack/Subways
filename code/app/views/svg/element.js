import Ember from 'ember';
import Parent from 'subways/views/svg/parent';

var alias = Ember.computed.alias;

export default Ember.Mixin.create(Parent, {

  svg: alias('parentView.svg'),

  ensureSVGContainer: function() {
    Ember.assert('SVG Elements must be in an SVG Document.', this.get('svg'));
  }.on('parentViewDidChange')

});
