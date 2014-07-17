import { test, moduleForModel } from 'ember-qunit';

moduleForModel('tile', 'Tile', {
  needs: ['model:map']
});

test('it exists', function() {
  var model = this.subject();
  ok(model);
});

test('directions are correct', function() {
  Ember.run(this, function() {
    var store = this.store();
    var model = this.factory();
    var tileI = store.createRecord(model, {
      row: 0,
      column: 1
    });
    var tileII = store.createRecord(model, {
      row: 1,
      column: 1
    });
    var tileIII = store.createRecord(model, {
      row: 1,
      column: 0
    });
    var tileIV = store.createRecord(model, {
      row: 0,
      column: 0
    });
    equal(tileI.directionTo(tileII), 'S');
    equal(tileII.directionTo(tileI), 'N');
    equal(tileII.directionTo(tileIII), 'E');
    equal(tileIII.directionTo(tileII), 'W');
    equal(tileIV.directionTo(tileII), 'SE');
    equal(tileII.directionTo(tileIV), 'NW');
    equal(tileI.directionTo(tileIII), 'SW');
    equal(tileIII.directionTo(tileI), 'NE');
  });
});
