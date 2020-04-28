const RepositoryInterface = require('./RepositoryInterface');
const SkillModel = require('../model/Skill');
const StuntModel = require('../model/Stunt');
const repoInterface = new RepositoryInterface('skills', SkillModel);

const SkillRepository = (function(){
  const repo = {};
  repoInterface.implements(repo);

  return repo;
});

const router = repoInterface.router();
router.post('/', (req, res) => {
  const repo = new SkillRepository();
  const skill = new SkillModel();
  skill.newRecord(
    req.body.name,
    req.body.overcome,
    req.body.advantage,
    req.body.attack,
    req.body.defend,
    req.body.game
  );

  repo.insert(skill.toDocument())
    .then((response) => {
      res.send(JSON.stringify(response));
    })
    .fail((err) => {
      res.status(500).send(err);
    });
});

router.post('/:id/stunts', (req, res) => {
  const repo = new SkillRepository();
  repo.findOneById(req.params.id)
    .then((skill) => {
      if(!skill){
        res.status(404).end();
      }
      else {
        const stunt = new StuntModel();
        stunt.newRecord(
          req.body.name,
          req.body.description
        );
        skill.addStunt(stunt.toDocument());
        repo.updateOneById(req.params.id, {stunts: skill.getStunts()})
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

router.param('stuntId', (req, res, next, stuntId) => {
  if(!req.params) req.params = {};
  req.params.stuntId = stuntId;
  next();
});

router.put('/:id/stunts/:stuntId', (req, res) => {
  const repo = new SkillRepository();
  repo.findOneById(req.params.id)
    .then((skill) => {
      if(!skill){
        res.status(404).end();
      }
      else {
        const stunts = skill.getStunts();
        let i;
        for(i=0; i<stunts.length; i++){
          if(stunts[i].id == req.params.stuntId) break;
        }

        if(i < stunts.length){
          const stunt = new StuntModel(stunts[i]);
          if(req.body.hasOwnProperty('name')) stunt.setName(req.body.name);
          if(req.body.hasOwnProperty('description')) stunt.setDescription(req.body.description);

          stunts[i] = stunt.toDocument();
          repo.updateOneById(req.params.id, {stunts: stunts})
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

router.delete('/:id/stunts/:stuntId', (req, res) => {
  const repo = new SkillRepository();
  repo.findOneById(req.params.id)
    .then((skill) => {
      if(!skill){
        res.status(404).end();
      }
      else {
        const stunts = skill.getStunts();
        let i;
        for(i=0; i<stunts.length; i++){
          if(stunts[i].id == req.params.stuntId) break;
        }

        if(i < stunts.length){
          stunts.splice(i, 1);
          repo.updateOneById(req.params.id, {stunts: stunts})
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

SkillRepository.Router = router;

module.exports = SkillRepository;
