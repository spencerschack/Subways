import { test, moduleForModel } from 'ember-qunit';

moduleForModel('path', 'Path', {
  // Specify the other units that are required for this test.
  needs: ['model:tile']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(model);
});
