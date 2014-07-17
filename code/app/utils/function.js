export function incrementProperty(path) {
  return function(value) {
    return this.incrementProperty(path, value);
  };
}

export function decrementProperty(path) {
  return function(value) {
    return this.decrementProperty(path, value);
  };
}
