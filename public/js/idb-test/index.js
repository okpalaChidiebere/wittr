import idb from 'idb';

/*You can only create object stores and indexes within the upgrade function */
var dbPromise = idb.open('test-db', 3, function(upgradeDb) { //we change the version of the database because the upgrade function is already called by this library
  /*the oldVersion property tells us the version the browser already knows about. 
  This switch version lets the browser skip the version its know. eg we had version1 
  of our db that had only one store 'keyval'. now we want to add another store 'People'

  We did not use 'break' keyword that switch statemenets usually have becauee we still want the database
  to create the 'keyval' object store if it is not created

  Indexes for a database can only be created as part of a version upgrade
  */
  switch(upgradeDb.oldVersion){ 
    case 0:
      var keyValStore = upgradeDb.createObjectStore('keyval');
      keyValStore.put("world", "hello");
    case 1:
      /* we create the 'People' store and make the name property of the objects that will be created inside this functin to be the key. 
      ideally people's name can't alwasys be unique but this will do for this project :)
      */
      upgradeDb.createObjectStore('People', { keyPath: 'name'});
    case 2: 
      const peopleStore = upgradeDb.transaction.objectStore('People') //we get the people store
      peopleStore.createIndex('animal', 'favoriteAnimal') //we created an index called 'animal' that sorts the object by their favoriteAnimal property
  }
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
  // TODO: in the keyval store, set
  // "favoriteAnimal" to your favourite animal
  // eg "cat" or "dog"
  const tx = db.transaction('keyval', 'readwrite'); //creating a transaction and access to the 'keyval' store
  const keyValStore = tx.objectStore('keyval');
  keyValStore.put('cat', 'favoriteAnimal');
  return tx.complete;
}).then(function() {
  console.log('Added favoriteAnimal:cat to keyval');
});

//Add a list of people to the store
dbPromise.then(function(db) {
  const tx = db.transaction('People', 'readwrite');
  const keyValStore = tx.objectStore('People');

  /*A person is a javaScript object
  NOTE: we did not provide a key here because during the creation of the database,
  we told the database to treat the name property as the key */
  keyValStore.put({
    name: 'chidiebere Okpla',
    age: 23,
    favoriteAnimal: 'cat'
  });

  keyValStore.put({
    name: 'ebuka ike',
    age: 15,
    favoriteAnimal: 'elephant'
  });

  keyValStore.put({
    name: 'ifeanyi okpala',
    age: 25,
    favoriteAnimal: 'cat'
  });

  keyValStore.put({
    name: 'favor agoha',
    age: 25,
    favoriteAnimal: 'Zebras'
  });

  return tx.complete;
}).then(function() {
  console.log('People Added');
});

//read the people in the store
dbPromise.then(function(db) {
  var tx = db.transaction('People');
  var keyValStore = tx.objectStore('People'); //get the object store
  return keyValStore.getAll();
}).then(function(people) {
  //Looking at the log, you get a list of people with names in alphabetical order because 'name' is the key
  console.log('People: ', people);
});

//read from the new indexstore we created
dbPromise.then(function(db) {
  const tx = db.transaction('People');
  const peopleStore = tx.objectStore('People'); //get the object store
  const animalStore = peopleStore.index('animal')

  return animalStore.getAll();
  //return animalStore.getAll('cat'); // will get all the cat perople
}).then(function(people) {
  //Looking at the log, you get a list of people with people just sorted by their favoriteAnimal.
  console.log('animal: ', people);
});