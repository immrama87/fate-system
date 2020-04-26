const Game = (function(entry){
  let id,
      name,
      description,
      setting,
      issues,
      gm,
      created;

  if(entry){
    id = entry._id;
    name = entry.name;
    description = entry.description;
    setting = entry.setting;
    issues = entry.issues;
    gm = entry.gm;
    created = entry.created;
  }
  else {
    created = new Date().getTime();
  }

  function newRecord(_name, _description, _setting, _gm){
    name = _name;
    description = _description;
    setting = _setting;
    gm = _gm;
  }

  function toDocument(){
    return {
      name: name,
      description: description,
      setting: setting,
      created: created,
      gm: gm,
      issues: issues || []
    };
  }

  return {
    getId: function(){return id;},
    getName: function(){return name;},
    setName: function(_name){name = _name;},
    getDescription: function(){return description;},
    setDescription: function(_description){description = _description;},
    getSetting: function(){return setting;},
    setSetting: function(_setting){setting = _setting;},
    getIssues: function(){return issues;},
    setIssues: function(_issues){issues = _issues;},
    addIssue: function(issue){
      if(!Array.isArray(issues)) issues = [];
      issues.push(issue);
    },
    getGM: function(){return gm;},
    setGM: function(_gm){gm = _gm;},
    getCreated: function(){return created;},
    newRecord: newRecord,
    toJson: function(){
      let doc = toDocument();
      doc.id = id;
      return doc;
    },
    toDocument: toDocument
  };
});

module.exports = Game;
