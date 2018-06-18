import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  TABLES = new Mongo.Collection('tables');
  TABLES.remove({});

  const tableEntry = {
  };

  let tID = TABLES.insert(tableEntry);

  FORMS = new Mongo.Collection('forms');
  FORMS.remove({});

  const form = {
    '_rID': tID,
  };

  FORMS.insert(form);
});

Meteor.publish('tables', function pubTables() {
  return TABLES.find({});
});

Meteor.publish('test', function pubTest() {
  let self = this;
  let added = false;
  this.autorun(() => {
    let table = TABLES.findOne({});
    let form = FORMS.findOne({});
    form.tableChangeCount = table.changeCount;

    if(added) self.changed('test', form._id, form);
    else {
      self.added('test', form._id, form);
      // Comment out the next line and it will work
      added = true;
    }

    self.ready();
  });
});
