const q = require('q');
const express = require('express');
const { ObjectId } = require('mongodb');
const Executions = require('../db/Executions');

const RepositoryInterface = (function(table, model){
  function sortsToObj(sorts){
    let sortsObj;
    if(sorts){
      const sortSet = new ExecutionPlan.SortSet();
      for(let field in sorts){
        sortSet.addSort(field, sorts[field]);
      }

      sortsObj = sortSet.getSorts();
    }
    return sortsObj || Executions.SortSet.NONE;
  }

  function findOneById(id, fields){
    let deferred = q.defer();
    let action = new Executions.ReadAction(
      table,
      new Executions.QuerySet()
        .addQuery('_id', ObjectId(id))
        .getQuery(),
      Executions.SortSet.NONE,
      fields
    );
    Executions.execute(action)
      .then((response) => {
        if(response.length == 1){
          var obj = new model(response[0]);
          deferred.resolve(obj);
        }
        else if(response.length > 1){
          deferred.resolve(null, MessageUtils.write('errors.database.response.multipleforone', table));
        }
        else {
          deferred.resolve(null);
        }
      });

    return deferred.promise;
  }

  function find(query, fields){
    query = query || new Executions.QuerySet();
    fields = fields || new Executions.FieldSet();
    let deferred = q.defer();
    let action = new Executions.ReadAction(
      table,
      query.getQuery(),
      Executions.SortSet.NONE,
      fields.getFields()
    );
    Executions.execute(action)
      .then((response) => {
        let models = [];
        let i;
        for(i=0; i<response.length; i++){
          try{
            models.push(new model(response[i]));
          }
          catch(err){
            throw err;
          }
        }
        deferred.resolve(models);
      });

    return deferred.promise;
  }

  function insert(values){
    let action = new Executions.CreateAction(
      table,
      values
    );
    return Executions.execute(action);
  }

  function updateOneById(id, values){
    let action = new Executions.UpdateAction(
      table,
      new Executions.QuerySet()
        .addQuery('_id', ObjectId(id))
        .getQuery(),
      values
    );
    return Executions.execute(action);
  }

  function update(values){
    return new ExecutionPlan.builder()
      .addUpdateAction(
        table,
        new ExecutionPlan.QuerySet().getQuery(),
        values
      )
      .execute();
  }

  function deleteOneById(id){
    let action = new Executions.DeleteAction(
      table,
      new Executions.QuerySet()
        .addQuery('_id', ObjectId(id))
        .getQuery()
    );
    return new Executions.execute(action);
  }

  function deleteMany(){
    return new ExecutionPlan.builder()
      .addDeleteAction(
        table,
        new ExecutionPlan.QuerySet().getQuery()
      )
      .execute();
  }

  return {
    implements: function(obj){
      obj.findOneById = findOneById;
      obj.find = find;
      obj.insert = insert;
      obj.updateOneById = updateOneById;
      obj.update = update;
      obj.deleteOneById = deleteOneById;
      obj.delete = deleteMany;
    },
    router: function(){
      var router = express.Router();

      router.get("/", (req, res) => {
        let query, fields;
        if(req.query && req.query.parsedQuery){
          query = req.query.parsedQuery;
        }
        else {
          query = new Executions.QuerySet();
        }

        if(req.query && req.query.parsedFields){
          fields = req.query.parsedFields;
        }
        else {
          fields = new Executions.FieldSet();
        }

        find(query, fields)
          .then((responses) => {
            let json = [];
            let i;
            for(i=0; i<responses.length; i++){
              json[i] = responses[i].toJson();
            }
            res.send(JSON.stringify(json));
          });
      });

      router.param('id', (req, res, next, id) => {
        if(!req.hasOwnProperty('params')) req.params = {};
        if(id == "me") id = req.session.user;
        req.params.id = id;
        next();
      });

      router.get('/:id', (req, res, next) => {
        findOneById(req.params.id)
          .then((response, err) => {
            if(err){
              res.status(500).send(err);
            }
            else if(response){
              res.send(JSON.stringify(response.toJson()));
            }
            else {
              res.status(404).send();
            }
          });
      });

      router.put('/:id', (req, res) => {
        updateOneById(req.params.id, req.body)
          .then((response, err) => {
            res.send(`${response} documents updated.`);
          });
      });

      router.delete('/:id', (req, res) => {
        deleteOneById(req.params.id)
          .then((response) => {
            res.send(`${response} documents deleted.`);
          });
      });

      return router;
    }
  };
});

module.exports = RepositoryInterface;
