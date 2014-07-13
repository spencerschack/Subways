import Class from 'app/utils/class';
import View from 'app/view';

var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export default Class(View, function SVGView() {

}, {

  tagName: 'svg',

  createElement: function() {
    this.element = document.createElementNS(SVG_NAMESPACE, this.tagName);
  }

});