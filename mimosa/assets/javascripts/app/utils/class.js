function mixin(receiver, supplier) {
  Object.keys(supplier).forEach(function(key) {
    Object.defineProperty(receiver, key,
      Object.getOwnPropertyDescriptor(supplier, key));
  });
}

export default function Class(extend, includes, ctor, prototype) {
  switch(arguments.length) {
    case 1:
      ctor = extend; extend = undefined;
      break;
    case 2:
      if(includes instanceof Function) {
        ctor = includes;
        if(extend instanceof Array) {
          includes = extend; extend = undefined;
        } else {
          includes = undefined;
        }
      } else {
        ctor = extend;
        prototype = includes;
        extend = includes = undefined;
      }
      break;
    case 3:
      if(!(ctor instanceof Function)) {
        prototype = ctor;
        ctor = includes;
        if(extend instanceof Array) {
          includes = extend; extend = undefined;
        } else {
          includes = undefined;
        }
      }
      break;
  }
  if(extend) {
    ctor.prototype = new extend();
    ctor.prototype.constructor = ctor;
  }
  if(includes) {
    includes.forEach(function(include) {
      mixin(ctor.prototype, include)
    });
  }
  if(prototype) {
    mixin(ctor.prototype, prototype);
  }
  return ctor;
}