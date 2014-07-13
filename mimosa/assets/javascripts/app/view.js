import Class from 'app/utils/class';

export default Class(function View() {

}, {

  tagName: 'div',

  elementId: null,

  element: null,

  events: {},

  attributes: {
    elementId: 'id'    
  },

  childViews: [],

  render: function() {
    this.createElement();
    this.setElementAttributes();
    this.addElementEventListeners();
    this.renderChildViews();
    return this.element;
  },

  createElement: function() {
    this.element = document.createElement(this.tagName);
  },

  setElementAttributes: function() {
    var element = this.element;
    var attributes = this.attributes;
    var value;
    for(var attribute in attributes) {
      value = this[attribute];
      if(value !== null && value !== undefined && value !== false) {
        if(value === true) { value = attribute; }
        element.setAttribute(attributes[attribute], value);
      }
    }
  },

  addElementEventListeners: function() {
    var element = this.element;
    var events = this.events;
    for(var event in events) {
      element.addEventListener(events[event], this[event].bind(this));
    }
  },

  renderChildViews: function() {
    var childViews = this.childViews;
    for(var i = 0, len = childViews.length; i < len; i++) {
      this.element.appendChild(this[childViews[i]].render());
    }
  }

});