const crypto = require('crypto');

const User = (function(entry){
  let id,
      username,
      password,
      fn,
      ln,
      created,
      secret;

  if(entry){
    id = entry._id;
    username = entry.username;
    fn = entry.fn;
    ln = entry.ln;
    created = entry.created;
    secret = entry.secret;
  }
  else {
    created = new Date().getTime();
    secret = crypto.randomBytes(256).toString('hex');
  }

  function hashPassword(pass){
    const hash = crypto.createHash('sha256');

    hash.update(pass);
    let last4 = parseInt(created.toString().slice(-4));
    let i = 0;
    while(i++ < last4)
      hash.update(secret);

    return hash.digest('hex');
  }

  function newRecord(_username, _password, _fn, _ln){
    username = _username,
    fn = _fn;
    ln = _ln;

    password = hashPassword(_password);
  }

  return {
    getId: function(){return id;},
    getUsername: function(){return username;},
    getFirstName: function(){return fn;},
    setFirstName: function(_fn){fn = _fn;},
    getLastName: function(){return ln;},
    setLastName: function(_ln){ln = _ln;},
    getCreated: function(){return created;},
    newRecord: newRecord,
    hashPassword: hashPassword,
    toJson: function(){
      return {
        id: id,
        username: username,
        fn: fn,
        ln: ln,
        created: new Date(created).toISOString()
      };
    },
    toDocument: function(){
      return {
        username: username,
        fn: fn,
        ln: ln,
        created: created,
        secret: secret,
        password: password
      };
    }
  };
});

module.exports = User;
