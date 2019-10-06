import { validationResult } from 'express-validator';

function findMostCommon(numbers) {
  const counted = numbers.reduce((acc, curr) => {
    if (curr in acc) {
      acc[curr] += 1;
    } else {
      acc[curr] = 1;
    }

    return acc;
  }, {});

  const mode = Object.keys(counted).reduce((a, b) => (counted[a] > counted[b] ? a : b));

  return mode;
}

export default validationsParam => async (req, res, next) => {
  const statusErrors = [];
  const validations = Array.isArray(validationsParam)
    ? validationsParam : [validationsParam];

  await Promise.all(
    validations.map(async (item) => {
      let validation = null;
      let errorStatus = null;
      if (Array.isArray(item)) {
        validation = item[0];
        errorStatus = item[1];
      } else {
        validation = item;
        errorStatus = 422;
      }
      const result = await validation.run(req);
      if (result._errors.length > 0) {
        statusErrors.push(errorStatus);
      }
      return result;
    }),
  );

  const errors = await validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(findMostCommon(statusErrors)).json({ errors: errors.array() });
};
