const q = require('q');
const RepositoryInterface = require('./RepositoryInterface');
const FaceModel = require('../model/Face');
const Executions = require('../db/Executions');
const repoInterface = new RepositoryInterface('faces', FaceModel);

const FaceRepository = (function(){
  const repo = {};
  repoInterface.implements(repo);

  repo.findByGameId = function(gameId){
    const deferred = q.defer();
    const action = new Executions.ReadAction(
      'faces',
      new Executions.QuerySet()
        .addQuery('game', gameId)
        .getQuery(),
      Executions.SortSet.NONE,
      Executions.FieldSet.ALL
    );

    Executions.execute(action)
      .then((response) => {
        const models = [];
        let i;
        for(i=0; i<response.length; i++){
          models.push(new FaceModel(response[i]));
        }
        deferred.resolve(models);
      })
      .fail(deferred.reject);

    return deferred.promise;
  }

  repo.findByPlaceId = function(placeId){
    const deferred = q.defer();
    const action = new Executions.ReadAction(
      'faces',
      new Executions.QuerySet()
        .addQuery('place', placeId)
        .getQuery(),
      Executions.SortSet.NONE,
      Executions.FieldSet.ALL
    );

    Executions.execute(action)
      .then((response) => {
        const models = [];
        let i;
        for(i=0; i<response.length; i++){
          models.push(new FaceModel(response[i]));
        }
        deferred.resolve(models);
      })
      .fail(deferred.reject);

    return deferred.promise;
  }

  return repo;
});

const router = repoInterface.router();

router.post('/', (req, res) => {
  const repo = new FaceRepository();
  const face = new FaceModel();
  face.newRecord(
    req.body.name,
    req.body.description,
    req.body.aspect,
    req.body.place,
    req.body.game
  );

  repo.insert(face.toDocument())
    .then((response) => {
      res.send(JSON.stringify(response));
    })
    .fail((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

FaceRepository.Router = router;

module.exports = FaceRepository;
