import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';


import './main.html';
TEST = new Mongo.Collection('test');
TABLES = new Mongo.Collection('tables');
Meteor.subscribe('test');
Meteor.subscribe('tables');

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0!
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  }
});

Template.data.helpers({
  tests() {
    return TEST.find({});
  },
  tables() {
    return TABLES.find({});
  }
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
    let t = TABLES.findOne({});
    t.changeCount = t.changeCount + 1 || 1;
    // delete t._id;
    TABLES.update({'_id': t._id}, t);
  }
});

Meteor.startup(() => {
  let conn = Meteor.connection;
  // log sent messages
  let _send = conn._send;
  conn._send = function connSendHook(obj) {
    console.log('send', obj);
    _send.call(this, obj);
  };

  // log received messages
  conn._stream.on('message', function connReceiveHook(message) {
    console.log('receive', JSON.parse(message));
  });
});
