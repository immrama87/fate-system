const q = require('q');
const dbInterface = require('./DBInterface');

const ValueSet = (function(){
  const values = {};

  const self = {
    addValue: function(field, value){
      values[field] = value;
      return self;
    },
    getValues: function(){return values;}
  };

  return self;
});

const SortSet = (function(){
  const sorts = {};

  const self = {
    addSort: function(field, sort){
      sort = sort.toLowerCase() == "asc" ? 1 : -1;
      sorts[field] = sort;
      return self;
    },
    getSorts: function(){return sorts;}
  };
});
SortSet.NONE = {};

const QuerySet = (function(){
  const queries = {};

  const self = {
    addQuery: function(field, operator, value){
      if(!value){
        value = operator;
        operator = "=";
      }
      queries[field] = {
        operator: operator,
        value: value
      };
      return self;
    },
    getQuery: function(){
      let query = {};
      for(let field in queries){
        if(!query.hasOwnProperty(field))
          query[field] = {};
        let operator = '$eq';
        switch(queries[field].operator){
          case ">":
            operator = '$gt';
            break;
          case ">=":
            operator = '$gte';
            break;
          case "<":
            operator = '$lt';
            break;
          case "<=":
            operator = '$lte';
            break;
          case "!=":
            operator = '$neq';
            break;
          case "IN":
            operator = '$in';
            break;
          case "NOT IN":
            operator = '$nin';
            break;
        }

        query[field][operator] = queries[field].value;
      }
      return query;
    }
  };
  return self;
});

const FieldSet = (function(){
  const fields = {};

  const self = {
    addField: function(field, include){
      if(include == undefined) include = true;
      fields[field] = include;
      return self;
    },
    getFields: function(){return fields;}
  };
  return self;
});
FieldSet.ALL = {};

const CreateAction = (function(table, values){
  let missing = [];
  if(!table) missing.push("Table");
  if(!values) missing.push("Values");
  if(missing.length > 0) throw MessageUtils.write('errors.database.configuration.action', "CreateAction", missing);

  return {
    action: "CREATE",
    getTable: function(){return table;},
    getValues: function(){return values;}
  };
});

const ReadAction = (function(table, query, sort, fields){
  let missing = [];
  if(!table) missing.push("Table");
  if(!query) missing.push("Query");
  if(missing.length > 0) throw MessageUtils.write('errors.database.configuration.action', "ReadAction", missing);

  sort = sort || {};
  return {
    action: "READ",
    getTable: function(){return table;},
    getQuery: function(){return query;},
    getSort: function(){return sort;},
    getFields: function(){return fields;}
  };
});

const UpdateAction = (function(table, query, values){
  let missing = [];
  if(!table) missing.push("Table");
  if(!query) missing.push("Query");
  if(!values) missing.push("Values");
  if(missing.length > 0) throw MessageUtils.write('errors.database.configuration.action', "UpdateAction", missing);

  return {
    action: "UPDATE",
    getTable: function(){return table;},
    getQuery: function(){return query;},
    getValues: function(){return values;}
  };
});

const DeleteAction = (function(table, query){
  let missing = [];
  if(!table) missing.push("Table");
  if(!query) missing.push("Query");
  if(missing.length > 0) throw MessageUtils.write('errors.database.configuration.action', "DeleteAction", missing);

  return {
    action: "DELETE",
    getTable: function(){return table;},
    getQuery: function(){return query;}
  };
});

const CountAction = (function(table, query){
  let missing = [];
  if(!table) missing.push("Table");
  if(!query) missing.push("Query");
  if(missing.length > 0) throw MessageUtils.write('errors.database.configuration.action', "CountAction", missing);

  return {
    action: "COUNT",
    getTable: function(){return table;},
    getQuery: function(){return query;}
  };
});

module.exports = {
  ValueSet: ValueSet,
  SortSet: SortSet,
  QuerySet: QuerySet,
  FieldSet: FieldSet,
  CreateAction: CreateAction,
  ReadAction: ReadAction,
  UpdateAction: UpdateAction,
  DeleteAction: DeleteAction,
  CountAction: CountAction,
  execute: dbInterface.execute
};
