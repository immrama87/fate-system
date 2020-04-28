const Face = (function(entry){
  let id,
      name,
      description,
      aspect,
      place,
      game,
      imageUris = [],
      created;

  if(entry){
    id = entry._id;
    name = entry.name;
    description = entry.description;
    aspect = entry.aspect;
    place = entry.place;
    game = entry.game;
    imageUris = entry.imageUris;
    created = entry.created;
  }
  else {
    created = new Date().getTime();
  }

  function newRecord(_name, _description, _aspect, _place, _game){
    name = _name;
    description = _description;
    aspect = _aspect;
    place = _place;
    game = _game;
  }

  function toDocument(){
    return {
      name: name,
      description: description,
      aspect: aspect,
      place: place,
      game: game,
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
    getAspect: function(){return aspect;},
    setAspect: function(_aspect){aspect = _aspect;},
    getPlace: function(){return place;},
    setPlace: function(_place){place = _place;},
    getGame: function(){return game;},
    setGame: function(_game){game = _game;},
    getImageUris: function(){return imageUris;},
    setImageUris: function(_imageUris){imageUris = _imageUris;},
    getCreated: function(){return created;},
    newRecord: newRecord,
    toDocument: toDocument,
    toJson: function(){
      let doc = toDocument();
      doc.id = id;
      return doc;
    }
  };
});

module.exports = Face;
