const RepositoryInterface = require('./RepositoryInterface');
const PlaceRepository = require('./PlaceRepository');
const GameModel = require('../model/Game');
const IssueModel = require('../model/Issue');
const repoInterface = new RepositoryInterface('games', GameModel);

const GameRepository = (function(){
  let repo = {};
  repoInterface.implements(repo);

  return repo;
});

const router = repoInterface.router();

router.post('/', (req, res) => {
  const repo = new GameRepository();
  let game = new GameModel();
  game.newRecord(
    req.body.name,
    req.body.description,
    req.body.setting,
    req.body.gm
  );
  repo.insert(game.toDocument())
    .then((response) => {
      res.send(JSON.stringify(response));
    });
});

router.get('/:id/places', (req, res) => {
  const repo = new PlaceRepository();
  repo.findByGameId(req.params.id)
    .then((response) => {
      const json = [];
      let i;
      for(i=0; i<response.length; i++){
        json.push(response[i].toJson());
      }
      res.send(JSON.stringify(json));
    });
});

router.post('/:id/issues', (req, res) => {
  const repo = new GameRepository();
  let issue = new IssueModel();
  issue.newRecord(
    req.body.description,
    req.body.type
  );

  repo.findOneById(req.params.id)
    .then((response) => {
      if(!response){
        res.status(404).end();
      }
      else {
        response.addIssue(issue.toDocument());
        repo.updateOneById(req.params.id, {issues: response.getIssues()})
          .then((updated) => {
            res.send(`${updated} documents updated.`);
          });
      }
    });
});

router.param('issueid', (req, res, next, issueId) => {
  if(!req.hasOwnProperty('params')) req.params = {};
  req.params.issueId = issueId;
  next();
});

router.put('/:id/issues/:issueid', (req, res) => {
  const repo = new GameRepository();
  repo.findOneById(req.params.id)
    .then((response) => {
      if(!response){
        res.status(404).end();
      }
      else {
        let issues = response.getIssues();
        console.log(issues);
        let i;
        for(i=0; i<issues.length; i++){
          if(issues[i].id == req.params.issueId) break;
        }

        if(i < issues.length){
          const issue = new IssueModel(issues[i]);
          if(req.body.hasOwnProperty('description')) issue.setDescription(req.body.description);
          if(req.body.hasOwnProperty('type')) issue.setType(req.body.type);

          issues[i] = issue.toDocument();
          response.setIssues(issues);
          repo.updateOneById(req.params.id, response.toDocument())
            .then((updated) => {
              res.send(`${updated} documents updated.`);
            });
        }
        else {
          res.status(404).end();
        }
      }
    });
});

router.delete('/:id/issues/:issueid', (req, res) => {
  const repo = new GameRepository();
  repo.findOneById(req.params.id)
    .then((response) => {
      if(!response){
        res.status(404).end();
      }
      else {
        let issues = response.getIssues();
        let i;
        for(i=0; i<issues.length; i++){
          if(issues[i].id == req.params.issueId) break;
        }

        if(i < issues.length){
          issues.splice(i, 1);
          response.setIssues(issues);
          repo.updateOneById(req.params.id, response.toDocument())
            .then((updated) => {
              res.end(`${updated} documents updated.`);
            });
        }
        else {
          res.status(404).end();
        }
      }
    });
});

GameRepository.Router = router;

module.exports = GameRepository;
