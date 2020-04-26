const { MongoClient } = require('mongodb');
const q = require('q');

const MongoDBDriver = (function(config){
  let missing = [];
  if(!config.host) missing.push("Hostname");
  if(!config.port) missing.push("Port");
  if(!config.dbname) missing.push("Database Name");
  config.poolsize = config.poolsize || 10;

  if(missing.length > 0) throw MessageUtils.write('errors.database.configuration.driver', "MongoDB", missing);

  const url = `mongodb://${config.host}:${config.port}/`;
  const dbname = config.dbname;
  const clientPool = [];
  let state = 0;

  function createConnection(i){
    let deferred = q.defer();
    const client = new MongoClient(url);
    client.connect((err) => {
      if(err) throw MessageUtils.write('errors.database.connection', "MongoDB", err);

      clientPool[i] = client;
      deferred.resolve();
    });

    return deferred.promise;
  }
  let i;
  let remaining = config.poolsize;
  console.log(MessageUtils.write('database.connecting', "MongoDB"));
  for(i=0; i<config.poolsize; i++){
    createConnection(i)
      .then(() => {
        remaining--;
        state = !remaining;
        if(state){
          console.log(MessageUtils.write('database.connected'));
          process.on('SIGINT', close);
          process.on('SIGTERM', close);
        }
      });
  }

  function createCollection(coll){
    let deferred = q.defer();

    db.createCollection(coll, (err, result) => {
      if(err) throw err;

      deferred.resolve();
    });

    return deferred.promise;
  }

  function doInsert(client, coll, entry){
    let deferred = q.defer();

    client.db(dbname).collection(coll).insertOne(entry, (err, result) => {
      if(err) throw err;

      deferred.resolve();
    });

    return deferred.promise;
  }

  function doRead(client, coll, query, sort, fields){
    let deferred = q.defer();

    sort = sort || {};

    client.db(dbname).collection(coll).find(query, fields).sort(sort).toArray((err, result) => {
      if(err) throw err;

      deferred.resolve(result);
    });

    return deferred.promise;
  }

  function doUpdate(client, coll, query, newValues){
    let deferred = q.defer();

    let update = {$set: newValues};

    client.db(dbname).collection(coll).updateMany(query, update, (err, result) => {
      if(err) throw err;

      deferred.resolve(result.result.nModified);
    });

    return deferred.promise;
  }

  function doDelete(client, coll, query){
    let deferred = q.defer();

    client.db(dbname).collection(coll).deleteMany(query, (err, result) => {
      if(err) throw err;

      deferred.resolve(result.result.n);
    });

    return deferred.promise;
  }

  function doCount(client, coll, query){
    let deferred = q.defer();

    query = queryToQueryObj(query);
    client.db(dbname).collection(coll).countDocuments(query, (err, result) => {
      if(err) throw err;

      deferred.resolve(result);
    });

    return deferred.promise;
  }

  function close(){
    let i;
    for(i=0; i<clientPool.length; i++){
      clientPool[i].close();
    }
    process.exit();
  }

  return {
    config: config,
    execute: function(action){
      let deferred = q.defer();
      const client = clientPool.shift();
      switch(action.action){
        case "CREATE":
          doInsert(client, action.getTable(), action.getValues())
            .then((response) => {
              clientPool.push(client);
              deferred.resolve(response);
            });
          break;
        case "READ":
          doRead(client, action.getTable(), action.getQuery(), action.getSort(), action.getFields())
            .then((response) => {
              clientPool.push(client);
              deferred.resolve(response);
            });
          break;
        case "UPDATE":
          doUpdate(client, action.getTable(), action.getQuery(), action.getValues())
            .then((response) => {
              clientPool.push(client);
              deferred.resolve(response);
            });
          break;
        case "DELETE":
          doDelete(client, action.getTable(), action.getQuery())
            .then((response) => {
              clientPool.push(client);
              deferred.resolve(response);
            });
          break;
        case "COUNT":
          doCount(client, action.getTable(), action.getQuery())
            .then((response) => {
              clientPool.push(client);
              deferred.resolve(response);
            });
          break;
      }

      return deferred.promise;
    }
  };
});

module.exports = MongoDBDriver;
