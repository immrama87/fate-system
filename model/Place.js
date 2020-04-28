const Place = (function(entry){
  let id,
      name,
      description,
      game,
      issue,
      parent,
      imageUris = [],
      created;

  if(entry){
    id = entry._id;
    name = entry.name;
    description = entry.description;
    game = entry.game;
    issue = entry.issue;
    parent = entry.parent;
    imageUris = entry.imageUris;
    created = entry.created;
  }
  else {
    created = new Date().getTime();
  }

  function newRecord(_name, _description, _game, _issue){
    name = _name;
    description = _description;
    game = _game;
    issue = _issue;
  }

  function toDocument(){
    return {
      name: name,
      description: description,
      game: game,
      issue: issue,
      parent: parent,
      imageUris: imageUris,
      created: created
    };
  }

  return {
    getId: function(){return id;},
    getName: function(){return name;},
    setName: function(_name){name = _name;},
    getDescription: function(){return description;},
    setDescription: function(_description){description = _description;},
    getGame: function(){return game;},
    setGame: function(_game){game = _game;},
    getIssue: function(){return issue;},
    setIssue: function(_issue){issue = _issue;},
    getParent: function(){return parent;},
    setParent: function(_parent){parent = _parent;},
    getImageUris: function(){return imageUris;},
    setImageUris: function(_imageUris){imageUris = _imageUris;},
    getCreated: function(){return created;},
    newRecord: newRecord,
    toDocument: toDocument,
    toJson: function(){
      let doc = toDocument();
      doc.created = new Date(doc.created).toISOString();
      doc.id = id;
      return doc;
    }
  }
});

module.exports = Place;
