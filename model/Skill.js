const Skill = (function(entry){
  let id,
      name,
      overcome,
      advantage,
      attack,
      defend,
      stunts = [],
      game,
      created;

  if(entry){
    id = entry._id;
    name = entry.name;
    overcome = entry.overcome;
    advantage = entry.advantage;
    attack = entry.attack;
    defend = entry.defend;
    stunts = entry.stunts;
    game = entry.game;
    created = entry.created;
  }
  else {
    created = new Date().getTime();
  }

  function newRecord(_name, _overcome, _advantage, _attack, _defend, _game){
    name = _name;
    overcome = _overcome;
    advantage = _advantage;
    attack = _attack;
    defend = _defend;
    game = _game;
  }

  function toDocument(){
    return {
      name: name,
      overcome: overcome,
      advantage: advantage,
      attack: attack,
      defend: defend,
      stunts: stunts,
      game: game,
      created: created
    };
  }

  function toSkillEntry(){
    return {
      id: id,
      name: name
    }
  };

  return {
    getId: function(){return id;},
    getName: function(){return name;},
    setName: function(_name){name = _name;},
    getOvercome: function(){return overcome;},
    setOvercome: function(_overcome){overcome = _overcome;},
    getAdvantage: function(){return advantage;},
    setAdvantage: function(_advantage){advantage = _advantage;},
    getAttack: function(){return attack;},
    setAttack: function(_attack){attack = _attack;},
    getDefend: function(){return defend;},
    setDefend: function(_defend){defend = _defend;},
    getStunts: function(){return stunts;},
    setStunts: function(_stunts){stunts = _stunts;},
    addStunt: function(stunt){stunts.push(stunt);},
    getGame: function(){return game;},
    setGame: function(_game){game = _game;},
    getCreated: function(){return created;},
    newRecord: newRecord,
    toDocument: toDocument,
    toSkillEntry: toSkillEntry,
    toJson: function(){
      const doc = toDocument();
      doc.id = id;
      doc.created = new Date(doc.created).toISOString();
      return doc;
    }
  };
});

module.exports = Skill;
