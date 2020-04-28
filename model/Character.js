const Character = (function(entry){
  const consequenceLevels = ['Mild', 'Mild2', 'Moderate', 'Severe'];
  let id,
      name,
      description,
      concept,
      trouble,
      skills = {
        '+6': [],
        '+5': [],
        '+4': [],
        '+3': [],
        '+2': [],
        '+1': [],
        '+0': []
      },
      extras,
      stunts = [],
      stress = {
        physical: 3,
        mental: 3
      },
      consequences = {
        'Mild': "",
        'Mild2': "",
        'Moderate': "",
        'Severe': ""
      },
      aspects = [],
      milestones = 0,
      user,
      game,
      created,
      imageUris = [];

  if(entry){
    id = entry._id;
    name = entry.name;
    description = entry.description;
    concept = entry.concept;
    trouble = entry.trouble;
    skills = entry.skills;
    extras = entry.extras;
    stunts = entry.stunts;
    stress = entry.stress;
    consequences = entry.consequences;
    aspects = entry.aspects;
    milestones = entry.milestones;
    user = entry.user;
    game = entry.game;
    created = entry.created;
    imageUris = entry.imageUris;
  }
  else {
    created = new Date().getTime();
  }

  function newRecord(_name, _description, _concept, _trouble, _extras, _user, _game){
    name = _name;
    description = _description;
    concept = _concept;
    trouble = _trouble;
    extras = _extras;
    user = _user;
    game = _game;
  }

  function toDocument(){
    return {
      name: name,
      description: description,
      concept: concept,
      trouble: trouble,
      skills: skills,
      extras: extras,
      stunts: stunts,
      stress: stress,
      consequences: consequences,
      aspects: aspects,
      milestones: milestones,
      user: user,
      game: game,
      created: created,
      imageUris: imageUris
    };
  }

  return {
    getId: function(){return id;},
    getName: function(){return name;},
    setName: function(_name){name = _name;},
    getDescription: function(){return description;},
    setDescription: function(_description){description = _description;},
    getConcept: function(){return concept;},
    setConcept: function(_concept){concept = _concept;},
    getTrouble: function(){return trouble;},
    setTrouble: function(_trouble){trouble = _trouble;},
    getSkills: function(){return skills;},
    setSkills: function(_skills){skills = _skills;},
    addSkill: function(skill, level){
      level = Math.max(Math.min(level, 6), 0);
      skills[`+${level}`].push(skill);
    },
    getExtras: function(){return extras;},
    setExtras: function(_extras){extras = _extras;},
    getStunts: function(){return stunts;},
    setStunts: function(_stunts){stunts = _stunts;},
    addStunt: function(stunt){
      stunts.push(stunt);
    },
    getStress: function(){return stress;},
    setStress: function(_stress){stress = _stress;},
    getPhysicalStress: function(){return stress.physical;},
    setPhysicalStress: function(physical){stress.physical = physical;},
    getMentalStress: function(){return stress.mental;},
    setMentalStress: function(mental){stress.mental = mental;},
    getConsequences: function(){return consequences;},
    setConsequences: function(_consequences){consequences = _consequences;},
    setConsequence: function(consequence, level){
      level = Math.max(Math.min(level, 3), 0);
      consequences[consequenceLevels[level]] = consequence;
    },
    getAspects: function(){return aspects;},
    setAspects: function(_aspects){aspects = _aspects;},
    addAspect: function(aspect){
      aspects.push(aspect);
    },
    getMilestones: function(){return milestones;},
    addMilestone: function(){milestones++;},
    getUser: function(){return user;},
    setUser: function(_user){user = _user;},
    getGame: function(){return game;},
    setGame: function(_game){game = _game;},
    getImageUris: function(){return imageUris;},
    setImageUris: function(_imageUris){imageUris = imageUris;},
    getCreated: function(){return created;},
    newRecord: newRecord,
    toDocument: toDocument,
    toJson: function(){
      const doc = toDocument();
      doc.id = id;
      doc.created = new Date(doc.created).toISOString();
      return doc;
    }
  };
});

module.exports = Character;
