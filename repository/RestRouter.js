const express = require('express');
const bodyParser = require('body-parser');
const UserRepository = require('./UserRepository');
const GameRepository = require('./GameRepository');
const PlaceRepository = require('./PlaceRepository');
const FaceRepository = require('./FaceRepository');
const SkillRepository = require('./SkillRepository');
const CharacterRepository = require('./CharacterRepository');
const Executions = require('../db/Executions');

const router = express.Router();
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
router.get("*", (req, res, next) => {
  if(req.query){
    if(req.query.hasOwnProperty('query')){
      let queries = new Executions.QuerySet();
      let re = /(?<=^|\sAND\s|AND)(\w+)(!?=|[><]=?|(?:NOT\s)?IN)(.+?)(?=$|\sAND\s|AND)/gm;
      let m;
      while((m = re.exec(req.query.query)) != null){
        let value = m[3];
        if(m[2] == "IN" || m[2] == "NOT IN") value = m[3].split(",");
        if(/^[\d,]+$/.exec(m[3]) != null){
          if(Array.isArray(value)){
            let i;
            for(i=0; i<value.length; i++){
              value[i] = parseInt(value[i]);
            }
          }
          else {
            value = parseInt(value);
          }
        }
        queries.addQuery(m[1], m[2], value);
      }

      req.query.parsedQuery = queries;
    }
    if(req.query.hasOwnProperty('fields')){
      let fields = new Executions.FieldSet();
      let fieldsSplit = req.query.fields.split(",");
      let i;
      for(i=0; i<fieldsSplit.length; i++){
        fields.addField(fieldsSplit[i]);
      }
      req.query.parsedFields = fields;
    }
  }
  next();
});
router.use('/users', UserRepository.Router);
router.use('/games', GameRepository.Router);
router.use('/places', PlaceRepository.Router);
router.use('/faces', FaceRepository.Router);
router.use('/skills', SkillRepository.Router);
router.use('/characters', CharacterRepository.Router);

module.exports = router;
