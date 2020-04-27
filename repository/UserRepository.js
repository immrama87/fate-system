const q = require('q');
const { ObjectId } = require('mongodb');
const RepositoryInterface = require('./RepositoryInterface');
const UserModel = require('../model/User');
const Executions = require('../db/Executions');
const repoInterface = new RepositoryInterface('users', UserModel);

const UserRepository = (function(){
  let repo = {};
  repoInterface.implements(repo);

  repo.getOneByUsername = function(username){
    let deferred = q.defer();
    let action = new Executions.ReadAction(
      'users',
      new Executions.QuerySet()
        .addQuery('username', username)
        .getQuery(),
      Executions.SortSet.NONE,
      new Executions.FieldSet()
        .addField('created')
        .addField('secret')
        .addField('password')
        .getFields()
    );

    Executions.execute(action)
      .then((response) => {
        if(response.length == 1){
          deferred.resolve(new UserModel(response[0]));
        }
        else if(response.length > 1){
          deferred.resolve(null, MessageUtils.write('errors.database.response.multipleforone'));
        }
        else {
          deferred.resolve(null);
        }
      })
      .fail(deferred.reject);

    return deferred.promise;
  }

  repo.comparePassword = function(id, password){
    let action = new Executions.CountAction(
      'users',
      new Executions.QuerySet()
        .addQuery('_id', ObjectId(id))
        .addQuery('password', password)
        .getQuery()
    );

    return Executions.execute(action);
  }

  return repo;
});

const router = repoInterface.router();

router.post('/', (req, res) => {
  const repo = new UserRepository();
  let user = new UserModel();
  user.newRecord(
    req.body.username,
    req.body.password,
    req.body.fn,
    req.body.ln
  );
  repo.insert(user.toDocument())
    .then((response) => {
      res.send(JSON.stringify(response));
    })
    .fail((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.post('/login', (req, res) => {
  const repo = new UserRepository();
  repo.getOneByUsername(req.body.username)
    .then((response, err) => {
      if(err){
        res.status(500).end(err);
      }
      else if(response){
        let password = response.hashPassword(req.body.password);
        repo.comparePassword(response.getId(), password)
          .then((comparison) => {
            let status = comparison ? 200 : 401;
            if(status == 200){
              req.session.user = response.getId();
            }
            res.status(status).end();
          })
          .fail((err) => {
            console.error(err);
            res.status(500).send(err);
          });
      }
      else {
        res.status(401).end();
      }
    })
    .fail((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.status(200).end();
});

UserRepository.Router = router;

module.exports = UserRepository;
