const RepositoryInterface = require('./RepositoryInterface');
const FaceModel = require('../model/Face');
const repoInterface = new RepositoryInterface('faces', FaceModel);

const FaceRepository = (function(){
  const repo = {};
  repoInterface.implements(repo);

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
    req.body.place
  );

  repo.insert(face.toDocument())
    .then((response) => {
      res.send(JSON.stringify(response));
    });
});

FaceRepository.Router = router;

module.exports = FaceRepository;
