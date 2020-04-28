const RepositoryInterface = require('./RepositoryInterface');
const SkillRepository = require('./SkillRepository');
const CharacterModel = require('../model/Character');
const repoInterface = new RepositoryInterface('characters', CharacterModel);

const CharacterRepository = (function(){
  const repo = {};
  repoInterface.implements(repo);

  return repo;
});

const router = repoInterface.router();

router.post('/', (req, res) => {
  const repo = new CharacterRepository();
  const character = new CharacterModel();
  character.newRecord(
    req.body.name,
    req.body.description,
    req.body.concept,
    req.body.trouble,
    req.body.extras,
    req.body.user
  );

  repo.insert(character.toDocument())
    .then((response) => {
      res.send(JSON.stringify(response));
    })
    .fail((err) => {
      res.status(500).send(err);
    });
});

router.post('/:id/skills', (req, res) => {
  const repo = new CharacterRepository();
  repo.findOneById(req.params.id)
    .then((character) => {
      if(!character){
        res.status(404).end();
      }
      else {
        const skillRepo = new SkillRepository();
        skillRepo.findOneById(req.body.skill)
          .then((skill) => {
            if(!skill){
              res.status(404).end();
            }
            else {
              character.addSkill(skill.toSkillEntry(), req.body.level);
              repo.updateOneById(req.params.id, {skills: character.getSkills()})
                .then((response) => {
                  res.send(`${response} documents updated`);
                })
                .fail((err) => {
                  console.error(err);
                  res.status(500).send(err);
                });
            }
          })
          .fail((err) => {
            console.error(err);
            res.status(500).send(err);
          });
      }
    })
    .fail((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.param('skillId', (req, res, next, skillId) => {
  if(!req.params) req.params = {};
  req.params.skillId = skillId;
  next();
});

router.delete('/:id/skills/:skillId', (req, res) => {
  const repo = new CharacterRepository();
  repo.findOneById(req.params.id)
    .then((character) => {
      if(!character){
        res.status(404).end();
      }
      else {
        const skills = character.getSkills();
        let level, i;
        outer_loop:
        for(level in skills){
          for(i=0; i<skills[level].length; i++){
            if(skills[level][i].id == req.params.skillId) break outer_loop;
          }
        }

        if(i < skills[level].length){
          skills[level].splice(i, 1);
          repo.updateOneById(req.params.id, {skills: skills})
            .then((response) => {
              res.send(`${response} documents updated`);
            })
            .fail((err) => {
              console.error(err);
              res.status(500).send(err);
            });
        }
        else {
          res.status(404).end();
        }
      }
    })
    .fail((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.put('/:id/consequence', (req, res) => {
  const repo = new CharacterRepository();
  repo.findOneById(req.params.id)
    .then((character) => {
      if(!character){
        res.status(404).end();
      }
      else {
        character.setConsequence(req.body.consequence, req.body.level);
        console.log(character.getConsequences());
        repo.updateOneById(req.params.id, {consequences: character.getConsequences()})
          .then((response) => {
            res.send(`${response} documents updated`);
          })
          .fail((err) => {
            console.error(err);
            res.status(500).send(err);
          });
      }
    })
    .fail((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.param('consequenceLevel', (req, res, next, consequenceLevel) => {
  if(!req.params) req.params = {};
  const consequenceLevels = ['Mild', 'Mild2', 'Moderate', 'Severe'];
  req.params.consequenceLevel = consequenceLevels[consequenceLevel];
  next();
});

router.delete('/:id/consequences/:consequenceLevel', (req, res) => {
  const repo = new CharacterRepository();
  repo.findOneById(req.params.id)
    .then((character) => {
      if(!character){
        res.status(404).end();
      }
      else {
        const consequences = character.getConsequences();
        consequences[req.params.consequenceLevel] = "";
        repo.updateOneById(req.params.id, {consequences: consequences})
          .then((response) => {
            res.send(`${response} documents updated`);
          })
          .fail((err) => {
            console.error(err);
            res.status(500).send(err);
          });
      }
    })
    .fail((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

CharacterRepository.Router = router;

module.exports = CharacterRepository;
