
export default (model, LIMIT_IMPORT_DATA = 1000) => async (req, res, next) => {
  try {
    if (req.body.length > LIMIT_IMPORT_DATA) {
      res.status(400).send({ error: 'LIMIT_IMPORT_DATA' });
    }
    const resultImport = await model.importData(req.body, req.query.type);
    return res.status(201).send(resultImport);
  } catch (e) {
    return next(e);
  }
};
