const uuidv4 = require('uuid').v4;

const Issue = (function(entry){
  let id,
      description,
      type;

  if(entry){
    id = entry.id;
    description = entry.description;
    type = entry.type;
  }

  function newRecord(_description, _type){
    id = uuidv4();
    description = _description;
    type = Math.max(Math.min(_type, Issue.TYPES.length - 1), 0);
  }

  return {
    getDescription: function(){return description;},
    setDescription: function(_description){description = _description;},
    getType: function(){return Issue.TYPES[type];},
    setType: function(_type){type = Math.max(Math.min(_type, Issue.TYPES.length - 1), 0);},
    newRecord: newRecord,
    toDocument: function(){
      return {
        id: id,
        description: description,
        type: type
      };
    }
  };
});

Issue.TYPES = [
  "Current",
  "Impending"
]

module.exports = Issue;
