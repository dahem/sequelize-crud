import { Op } from 'sequelize';
import { objHas } from '../helpers/object';

const DEFAULT_LIMIT = 100;
const DEFAULT_OFFSET = 0;

function makeValueInQuery(type, value) {
  switch (type) {
    case 'like':
      return { [Op.like]: `%${value}%` };

    default:
      return value;
  }
}

function buildQueryFromSearchParam(model, query) {
  const { searchFields } = model.options;
  if (!Array.isArray(searchFields)) return query;

  const searchToQuery = searchFields.map((item) => {
    if (Array.isArray(item)) {
      return { [item[0]]: makeValueInQuery(item[1], query['@search']) };
    }
    return { [item]: query['@search'] };
  });

  delete query['@search'];
  return { [Op.or]: searchToQuery, ...query };
}

function getById(model, id, options) {
  return model.findByPk(id, {
    include: [{ all: true }],
    ...options,
  });
}

async function create(model, body, options) {
  const instance = await model.fullCreate(body);
  if (options.returnFullData) {
    return getById(model, instance.id, options);
  }
  return { id: instance.id, created: true };
}

async function update(model, id, body, options) {
  await model.fullUpdate(id, body);
  if (options.returnFullData) {
    return getById(model, id, options);
  }
  return { id, updated: true };
}

async function remove(model, id, options) {
  const result = await model.destroy({ where: { id }, ...options });

  if (result === 1) return { id, removed: true };

  if (result > 1) throw new Error('Warning deleted more the one');
  throw new Error('warning not deleted any record');
}

async function getAll(model, queryParm, options) {
  let query = { ...queryParm };
  if (objHas(query, '@search')) {
    query = buildQueryFromSearchParam(model, query);
  }
  const params = { where: query, limit: query.limit, offset: query.offset };
  delete params.where.limit;
  delete params.where.offset;
  if (objHas(queryParm, ['limit', 'offset'])) {
    return model.findAndCountAll({ ...params, ...options });
  }

  const { paginationRequired } = model.options;

  if (paginationRequired) {
    params.limit = params.limit || DEFAULT_LIMIT;
    params.offset = params.offset || DEFAULT_OFFSET;
  } else {
    delete params.limit;
    delete params.offset;
  }

  return model.findAll({ ...params, ...options });
}

export default model => ({
  getById: (id, options = {}) => getById(model, id, options),
  getAll: (query, options = {}) => getAll(model, query, options),
  create: (body, options = {}) => create(model, body, options),
  update: (id, body, options = {}) => update(model, id, body, options),
  remove: (id, options = {}) => remove(model, id, options),
});
