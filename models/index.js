const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;

const basename = path.basename(__filename);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach(file => { // 해당 파일의 모델을 불러온 후 init 함
    const model = require(path.join(__dirname, file))
    // (sequelize, Sequelize.DataTypes);
    console.log(file, model.name);
    db[model.name] = model;
    model.initiate(sequelize);
  });

Object.keys(db).forEach(modelName => { // associate 함수가 있는 경우 호출
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
