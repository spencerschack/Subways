import DS from 'ember-data';

var attr = DS.attr;

export default DS.Model.extend({

  columns: attr('number'),
  rows: attr('number'),

  tileMapIndex: function(column, row) {
    var columns = this.get('columns');
    return row * columns + column;
  },

  tiles: function() {
    var columns = this.get('columns');
    var rows = this.get('rows');
    var arr = new Array(columns * rows);
    for(var row = 0; row < rows; row++) {
      for(var column = 0; column < columns; column++) {
        var index = this.tileMapIndex(column, row);
        arr[index] = this.store.createRecord('tile', {
          map: this,
          row: row,
          column: column
        });
      }
    }
    return arr;
  }.property(),

  tileAt: function(column, row) {
    var columns = this.get('columns');
    var rows = this.get('rows');
    if(column > -1 && column < columns && row > -1 && row < rows) {
      return this.get('tiles')[this.tileMapIndex(column, row)];
    }
  }
  
});
