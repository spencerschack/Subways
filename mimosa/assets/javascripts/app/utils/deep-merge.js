export default function deepMerge(/* target, ...objects */) {
  var objects = [].slice.call(arguments), object, oldValue, newValue;
  var target = objects.shift();
  for(var i = 0, len = objects.length; i < len; i++) {
    object = objects[i];
    for(var key in object) {
      newValue = object[key];
      oldValue = target[key];
      if(typeof oldValue === 'object' && typeof newValue === 'object') {
        target[key] = deepMerge(oldValue, newValue);
      } else {
        target[key] = newValue;
      }
    }
  }
  return target;
}