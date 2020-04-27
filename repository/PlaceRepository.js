const q = require('q');
const RepositoryInterface = require('./RepositoryInterface');
const PlaceModel = require('../model/Place');
const Executions = require('../db/Executions');
const repoInterface = new RepositoryInterface('places', PlaceModel);

const PlaceRepository = (function(){
  const repo = {};
  repoInterface.implements(repo);

  repo.findByGameId = function(gameId){
    const deferred = q.defer();
    const action = new Executions.ReadAction(
      'places',
      new Executions.QuerySet()
        .addQuery('game', gameId)
        .getQuery(),
      Executions.SortSet.NONE,
      new Executions.FieldSet().getFields()
    );

    Executions.execute(action)
      .then((response) => {
        let models = [];
        let i;
        for(i=0; i<response.length; i++){
          models.push(new PlaceModel(response[i]));
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
  const repo = new PlaceRepository();
  const place = new PlaceModel();
  place.newRecord(
    req.body.name,
    req.body.description,
    req.body.game
  );
  if(req.body.hasOwnProperty('parent')){
    place.setParent(req.body.parent);
  }

  repo.insert(place.toDocument())
    .then((response) => {
      res.send(JSON.stringify(response));
    })
    .fail((err) => {
      console.error(err);
      res.status(500).send(err);
    })
});

PlaceRepository.Router = router;

module.exports = PlaceRepository;
