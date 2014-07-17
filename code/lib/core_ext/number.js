// a % b does not correctly handle negative numbers, this does.
Object.defineProperty(Number.prototype, 'mod', {
  value: function(mod) {
    return (this % mod + mod) % mod;
  }
});