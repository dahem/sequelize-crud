import _ from 'lodash';

export function isExtrictedObject(val) {
  if (val === null) return false;
  return _.isObject(val) && !_.isArray(val);
}

export function objHas(obj, key) {
  if (Array.isArray(key)) {
    return !key.map(k => Object.prototype.hasOwnProperty.call(obj, k)).includes(false);
  }
  return Object.prototype.hasOwnProperty.call(obj, key);
}
