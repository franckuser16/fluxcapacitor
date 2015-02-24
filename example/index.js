'use strict';

var _ = FluxCapacitor.lodash;

var users = [];

var actions = FluxCapacitor.createActions([
  'createUser',
  'deleteUser',
  'updateUser'
]);

var events = FluxCapacitor.createEvents([
  'notifyUserListUpdated'
]);

var unsubscribe = events.notifyUserListUpdated.listen(function() { console.log(users); });  

var unsubscribe1 = actions.createUser.listen(function(user) {
  users.push(user);
  events.notifyUserListUpdated();
});

var unsubscribe2 = actions.deleteUser.listen(function(user) {
  users = users.filter(function(u) { return user._id !== u._id; });
  events.notifyUserListUpdated();
});

var unsubscribe3 = actions.updateUser.listen(function(user) {
  users = users.map(function(u) { return u._id === user._id ? user : u; });
  events.notifyUserListUpdated();
});

var id = FluxCapacitor.uuid();
actions.createUser({ _id: id, name: 'John Doe', age: 42 });
actions.updateUser({ _id: id, name: 'John Doe', age: 52 });
actions.deleteUser({ _id: id });

unsubscribe();
unsubscribe1();
unsubscribe2();
unsubscribe3();

actions.deleteUser({ _id: id });

var store = FluxCapacitor.createStore(actions, {
  users: [],
  events: FluxCapacitor.createEvents(['notifyUserListUpdated']),
  onCreateUser: function(user) {
    this.users.push(user);
    this.events.notifyUserListUpdated();
  },
  onDeleteUser: function(user) {
    this.users = this.users.filter(function(u) { return user._id !== u._id; });
    this.events.notifyUserListUpdated();
  },
  onUpdateUser: function(user) {
    this.users = this.users.map(function(u) { return u._id === user._id ? user : u; });
    this.events.notifyUserListUpdated();
  }
});

store.events.notifyUserListUpdated.listen(function() { console.log('[STORE] ' + JSON.stringify(store.users)); });  
actions.createUser({ _id: id, name: 'John Doe', age: 42 });
actions.updateUser({ _id: id, name: 'John Doe', age: 52 });
actions.deleteUser({ _id: id });