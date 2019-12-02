import fs from 'fs';
import sequelize from 'db/connection';
import { utilModels } from 'sequelize-crud';

const models = {};

const walkSync = (dir, filelist) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    if (fs.statSync(`${dir}/${file}`).isDirectory()) {
      filelist = walkSync(`${dir}/${file}`, filelist);
    } else if (file.length >= 8 && file.slice(-8) === 'model.js') {
      filelist.push(`${dir}/${file}`);
    }
  });
  return filelist;
};

const fileModels = walkSync(__dirname, []);

fileModels.forEach((fileModel) => {
  let model = sequelize.import(fileModel);
  model = utilModels.addNewFeatures(model);
  models[model.name] = model;
});

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) models[modelName].associate(models);
});

export default models;
