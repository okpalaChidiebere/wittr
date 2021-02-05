import idb from 'idb';

var dbPromise = idb.open('test-db', 4, function(upgradeDb) {
  switch(upgradeDb.oldVersion) {
    case 0:
      var keyValStore = upgradeDb.createObjectStore('keyval');
      keyValStore.put("world", "hello");
    case 1:
      upgradeDb.createObjectStore('people', { keyPath: 'name' });
    case 2:
      var peopleStore = upgradeDb.transaction.objectStore('people');
      peopleStore.createIndex('animal', 'favoriteAnimal');
    case 3:
      var peopleStore = upgradeDb.transaction.objectStore('people');
      peopleStore.createIndex('age', 'age');
  }
  // TODO: create an index on 'people' named 'age', ordered by 'age'
});

// read "hello" in "keyval"
dbPromise.then(function(db) {
  var tx = db.transaction('keyval');
  var keyValStore = tx.objectStore('keyval');
  return keyValStore.get('hello');
}).then(function(val) {
  console.log('The value of "hello" is:', val);
});

// set "foo" to be "bar" in "keyval"
dbPromise.then(function(db) {
  var tx = db.transaction('keyval', 'readwrite');
  var keyValStore = tx.objectStore('keyval');
  keyValStore.put('bar', 'foo');
  return tx.complete;
}).then(function() {
  console.log('Added foo:bar to keyval');
});

dbPromise.then(function(db) {
  var tx = db.transaction('keyval', 'readwrite');
  var keyValStore = tx.objectStore('keyval');
  keyValStore.put('cat', 'favoriteAnimal');
  return tx.complete;
}).then(function() {
  console.log('Added favoriteAnimal:cat to keyval');
});

// add people to "people"
dbPromise.then(function(db) {
  var tx = db.transaction('people', 'readwrite');
  var peopleStore = tx.objectStore('people');

  peopleStore.put({
    name: 'Sam Munoz',
    age: 25,
    favoriteAnimal: 'dog'
  });

  peopleStore.put({
    name: 'Susan Keller',
    age: 34,
    favoriteAnimal: 'cat'
  });

  peopleStore.put({
    name: 'Lillie Wolfe',
    age: 28,
    favoriteAnimal: 'dog'
  });

  peopleStore.put({
    name: 'Marc Stone',
    age: 39,
    favoriteAnimal: 'cat'
  });

  return tx.complete;
}).then(function() {
  console.log('People added');
});

// list all cat people
dbPromise.then(function(db) {
  var tx = db.transaction('people');
  var peopleStore = tx.objectStore('people');
  var animalIndex = peopleStore.index('animal');

  return animalIndex.getAll('cat');
}).then(function(people) {
  console.log('Cat people:', people);
});

// TODO: console.log all people ordered by age
dbPromise.then(function(db) {
  const tx = db.transaction('people'); //create the transaction
  const peopleStore = tx.objectStore('people'); //get the object store
  const ageIndex = peopleStore.index('age'); //get the index

  return ageIndex.getAll();
}).then(function(people) {
  console.log('People by Age:', people);
});


//using cursor in indexed db
dbPromise.then(function(db) {
  const tx = db.transaction('people'); //create the transaction
  const peopleStore = tx.objectStore('people'); //get the object store
  const ageIndex = peopleStore.index('age'); //get the index

  return ageIndex.openCursor()
/*}).then(function(cursor){ //skipping the first two items
  if(!cursor) return

  return cursor.advance(2)*/
}).then(function logPerson(cursor) {
  if(!cursor) return

  /*cursor is useful if you want to modify items as you loop through
  cursor.update(newValue) to change the value
  cursor.delete() to remove the value
  */
  console.log('Cursor at:', cursor.value.name); //we get the first person in the cursor
  //return a promise for the cursor representing the next item or undefined if ther isn't one
  return cursor.continue().then(logPerson) //the .then() set an asychronous loop until we are done
}).then(function(){
  console.log('Done cursing')
});