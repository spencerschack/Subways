export function fmt(/* format, ...properties */) {
  var properties = [].slice.call(arguments);
  var format = properties.shift();
  return computed.property.apply(computed, properties);
  function computed() {
    return format.fmt.apply(format, properties.map(this.get, this));
  }
}
