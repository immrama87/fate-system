const uuidv4 = require('uuid').v4;

const Stunt = (function(entry){
  let id,
      name,
      description;

  if(entry){
    id = entry.id;
    name = entry.name;
    description = entry.description;
  }

  function newRecord(_name, _description){
    id = uuidv4();
    name = _name;
    description = _description;
  }

  function toDocument(){
    return {
      id: id,
      name: name,
      description: description
    };
  }

  return {
    getId: function(){return id;},
    getName: function(){return name;},
    setName: function(_name){name = _name;},
    getDescription: function(){return description;},
    setDescription: function(_description){description = _description;},
    newRecord: newRecord,
    toDocument: toDocument
  };
});

module.exports = Stunt;
