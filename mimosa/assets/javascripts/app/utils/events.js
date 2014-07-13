export default {

  _events: null,

  on: function(event, callback, binding) {
    var events = this._events || (this._events = {});
    var events = events[event] || (events[event] = []);
    events.push({ callback: callback, binding: binding });
    return this;
  },

  off: function(event, callback, binding) {
    var events = this._events;
    if(events) {
      if(event) {
        events = events[event];
        if(events) {
          if(callback) {
            var retain = [], event;
            for(var i = 0, len = events.length; i < len; i++) {
              event = events[i];
              if(event.callback !== callback || event.binding !== binding) {
                retain.push(event);
              }
            }
            events[event] = retain.length ? retain : null;
          } else {
            events[event] = null;
          }
        }
      } else {
        this._events = null;
      }
    }
    return this;
  },

  once: function(event, callback, binding) {
    var self = this;
    return this.on(event, function() {
      self.off(event, callback, binding);
      callback.apply(binding, arguments);
    }, binding);
  },

  trigger: function(name) {
    var events = this._events;
    if(events) {
      events = events[name];
      if(events) {
        var args = Array.prototype.slice.call(arguments);
        for(var i = 0, len = events.length; i < len; i++) {
          events[i].callback.apply(events[i].binding, args);
        }
      }
    }
    return this;
  }

};