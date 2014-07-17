import DS from 'ember-data';
import Color from 'subways/utils/color';

export default DS.Transform.extend({

  serialize: function(value) {
    return [
      value.get('red'),
      value.get('green'),
      value.get('blue'),
      value.get('alpha')
    ];
  },

  deserialize: function(value) {
    return Color.create({
      red: value[0],
      green: value[1],
      blue: value[2],
      alpha: value[3]
    });
  }

});