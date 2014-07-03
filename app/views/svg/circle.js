import Ember from 'ember';
import Element from 'subways/views/svg/element';

export default Ember.View.extend(Element, {

  tagName: 'circle',

  attributeBindings: ['x:cx', 'y:cy', 'radius:r', 'fill'],

  x: 0,
  y: 0,
  radius: 0,
  fill: null

});