import Ember from 'ember';
import Element from 'subways/views/svg/element';

export default Ember.Mixin.create({

  createChildView: function(view, attrs) {
    var proto = view.isView ? view : view.PrototypeMixin;
    Ember.assert('SVG Documents must contain only SVG Elements.', Element.detect(proto) || Ember._Metamorph.detect(proto));
    return this._super(view, attrs);
  }

});