import Ember from 'ember';

export default Ember.Mixin.create({

  styleBindings: [],

  concatenatedProperties: ['styleBindings'],

  attributeBindings: ['style'],

  defineStyle: function() {
    var bindings = this.get('styleBindings');
    var length = bindings.length;
    if(length === 0) return;
    var mapping = new Array(length);
    var dependentKeys = new Array(length);
    var parts;
    for(var i = 0; i < length; i++) {
      parts = bindings[i].split(':');
      dependentKeys[i] = parts[0];
      mapping[i] = [parts[0], (parts[1] || parts[0]).dasherize()];
    }
    var computed = function() {
      var style = '';
      var value, binding;
      for(var i = 0; i < length; i++) {
        binding = mapping[i];
        value = this.get(binding[0]);
        if(value) {
          if(typeof value === 'number') { value += 'px'; }
          style += binding[1] + ':' + value + ';';
        }
      }
      return style;
    };
    computed = computed.property.apply(computed, dependentKeys);
    Ember.mixin(this, { style: computed });
  }.on('init')

});