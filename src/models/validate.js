import _ from 'lodash';
import { isExtrictedObject } from '../helpers/object';
import { capitalize } from '../helpers/string';
import { Op } from 'sequelize';

async function simpleValidate(model, values) {
  try {
    await model.build(values).validate();
    return [];
  } catch (error) {
    return [error];
  }
}

export async function getErrorVerifyPk(model, id) {
  try {
    const instance = await model.findByPk(id, { raw: true, atributes: ['id'] });
    if (instance === null) return new Error('Id no found');
    return null;
  } catch (error) {
    return error;
  }
}

async function getErrors(model, values) {
  if (!isExtrictedObject(values)) {
    const error = await getErrorVerifyPk(model, values);
    return error !== null ? [error] : [];
  }
  const errors = await simpleValidate(model, values);

  errors.push(
    await Promise.all(
      Object.keys(values)
        .filter(field => Array.isArray(values[field]))
        .map(async (field) => {
          const assocModel = model.associations[field].target;
          return Promise.all(values[field].map(assoc => getErrors(assocModel, assoc)));
        }),
    ),
  );

  errors.push(
    await Promise.all(
      Object.keys(values)
        .filter(field => isExtrictedObject(values[field]))
        .map(async (field) => {
          const assocModel = model.associations[field].target;
          return getErrors(assocModel, values[field]);
        }),
    ),
  );

  const { uniqueKeys } = model;
  const uniqueQuery = Object.keys(uniqueKeys).map((key) => {
    const uniqueItem = {};
    uniqueKeys[key].fields.forEach((field) => {
      uniqueItem[field] = values[field];
    });
    return uniqueItem;
  });

  if (uniqueQuery.length === 0) {
    return errors;
  }
  const invalidUniqueCount = await model.count({ where: { [Op.or]: uniqueQuery } });
  if (invalidUniqueCount > 0) {
    errors.push(new Error(`unique ${uniqueQuery.map(x => Object.keys(x).join(',')).join(', ')}`));
  }
  return errors;
}

export async function validate(model, values) {
  const errors = _.flattenDeep(await getErrors(model, values));
  if (errors.length > 0) throw new Error(errors.join(', '));
  return 1;
}

async function getErrorsToUpdate(availableIds, model, values) {
  const errors = [];
  if (!isExtrictedObject(values)) return [];
  if (availableIds !== null) {
    return availableIds.includes(values.id) ? [] : [new Error(`Id not is associate:${values.id}`)];
  }

  try {
    await model.build(values).validate();
  } catch (error) {
    return error.errors.filter(x => x.type === 'Validation error').map(x => x.original);
  }

  const instance = await model.findByPk(values.id);

  errors.push(
    await Promise.all(
      Object.keys(values)
        .filter(field => Array.isArray(values[field]))
        .map(async (field) => {
          const assocModel = model.associations[field].target;
          const subAvailables = await instance[`get${capitalize(field)}`]({
            attributes: ['id'],
            raw: true,
          });
          const ids = subAvailables.map(x => x.id);
          return Promise.all(values[field].map(assoc => getErrorsToUpdate(ids, assocModel, assoc)));
        }),
    ),
  );
  errors.push(
    await Promise.all(
      Object.keys(values)
        .filter(field => isExtrictedObject(values[field]))
        .map(async (field) => {
          const assocModel = model.associations[field].target;
          const subAvailable = await instance[`get${capitalize(field)}`]({
            attributes: ['id'],
            raw: true,
          });
          return getErrorsToUpdate([subAvailable.id], assocModel, values[field]);
        }),
    ),
  );

  return errors;
}

export async function validateToUpdate(model, values) {
  const errors = _.flattenDeep(await getErrorsToUpdate(null, model, values));
  if (errors.length > 0) throw new Error(errors.join(', '));
  return 1;
}
