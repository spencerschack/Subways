import Ember from 'ember';
import { fmt } from 'subways/utils/computed';
import { incrementProperty, decrementProperty } from 'subways/utils/function';

// Attribute Ranges:
// - red, green, blue: [0, 255]
// - hue: [0, 360]
// - saturation, lightness, alpha: [0, 1]

var R_SHORT_HEX = /^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i;
var R_LONG_HEX = /^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i;

function color(key, value) {
  key = '_' + key;
  if(arguments.length === 2) {
    value = Math.round(Math.max(0, Math.min(value, 255)));
    this.set(key, value);
  }
  return this.get(key);
}

function hueToRGB(p, q, t){
  if(t < 0) { t += 1; }
  if(t > 1) { t -= 1; }
  if(t < 1/6) { return p + (q - p) * 6 * t; }
  if(t < 1/2) { return q; }
  if(t < 2/3) { return p + (q - p) * (2/3 - t) * 6; }
  return p;
}

function componentOf(path, index) {
  return function(_, value) {
    if(arguments.length === 2) {
      var prev = this.get(path);
      prev[index] = value;
      this.set(path, prev);
    }
    return this.get(path)[index];
  }.property(path);
}

export default Ember.Object.extend(Ember.Copyable, {

  _red: 0,
  _green: 0,
  _blue: 0,
  _alpha: 1,

  red: color,
  green: color,
  blue: color,

  alpha: function(_, value) {
    if(arguments.length === 2) {
      value = Math.max(0, Math.min(value, 1));
      this.set('_alpha', value);
    }
    return this.get('_alpha');
  }.property(),

  lighten: incrementProperty('lightness'),
  darken: decrementProperty('lightness'),

  saturate: incrementProperty('saturation'),
  desaturate: decrementProperty('saturation'),

  rotate: function(value) {
    return this.set('hue', (this.get('hue') + value).mod(360));
  },

  _hsl: function(_, value) {
    var r, g, b, h, s, l;
    if(arguments.length === 2) {
      h = Math.max(0, Math.min(value[0] / 360, 1));
      s = Math.max(0, Math.min(value[1], 1));
      l = Math.max(0, Math.min(value[2], 1));
      if(s === 0) {
        r = g = b = l;
      } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hueToRGB(p, q, h + 1/3);
        g = hueToRGB(p, q, h);
        b = hueToRGB(p, q, h - 1/3);
      }
      this.setProperties({
        red: r * 255,
        green: g * 255,
        blue: b * 255
      });
    } else {
      r = this.get('red') / 255;
      g = this.get('green') / 255;
      b = this.get('blue') / 255;
    }
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    l = (max + min) / 2;
    if(max === min){
      h = s = 0;
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h * 360, s, l];
  }.property('red', 'green', 'blue'),

  hue:        componentOf('_hsl', 0),
  saturation: componentOf('_hsl', 1),
  lightness:  componentOf('_hsl', 2),

  hex: function(_, value) {
    if(arguments.length === 2) {
      var match, red, green, blue;
      if(match = value.match(R_LONG_HEX)) {
        red   = match[1];
        green = match[2];
        blue  = match[3];
      } else if(match = value.match(R_SHORT_HEX)) {
        red   = match[1] + match[1];
        green = match[2] + match[2];
        blue  = match[3] + match[3];
      } else {
        throw new Ember.Error('Could not parse hex: ' + value);
      }
      this.setProperties({
        red: parseInt(red, 16),
        green: parseInt(green, 16),
        blue: parseInt(blue, 16)
      });
    }
    return ('#' +
      this.get('red').toString(16) +
      this.get('green').toString(16) +
      this.get('blue').toString(16)).toUpperCase();
  }.property('red', 'green', 'blue'),

  rgb: fmt('rgb(%@, %@, %@)', 'red', 'green', 'blue'),
  rgba: fmt('rgba(%@, %@, %@, %@)', 'red', 'green', 'blue', 'alpha'),
  hsl: fmt('hsl(%@, %@%, %@%', 'hue', 'saturation', 'lightness'),
  hsla: fmt('hsla(%@, %@%, %@%, %@)', 'hue', 'saturation', 'lightness', 'alpha'),

  toString: function(format) {
    return this.get(format || 'rgb');
  },

  copy: function() {
    return this.constructor.create(
      this.getProperties('red', 'green', 'blue', 'alpha'));
  }

});