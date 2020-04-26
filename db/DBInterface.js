const config = require('../config/db.json');

const DBInterface = (function(){
  const Driver = require(`./${config.driver}`);
  const driver = new Driver(config);

  return {
    execute: driver.execute
  };
});

module.exports = new DBInterface();
