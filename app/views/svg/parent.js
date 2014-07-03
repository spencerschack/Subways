import Element from 'subways/views/svg/element';

export default Ember.Mixin.create({

  createChildView: function(view, attrs) {
    Ember.assert('SVG Documents must contain only SVG Elements.', Element.detect(view.isView ? view : view.PrototypeMixin));
    return this._super.apply(this, arguments);
  }

});