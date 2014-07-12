import Ember from 'ember';
import Document from 'subways/views/svg/document';

var alias = Ember.computed.alias;

export default Ember.View.extend(Document, {

  classNames: ['tiles'],

  tileWidth: alias('parentView.tileWidth'),
  tileHeight: alias('parentView.tileHeight'),

});
