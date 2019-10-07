import express from 'express';

function generateApiConstants(models) {
  const router = express.Router();

  Object.values(models).forEach((model) => {
    const routeName = model.name.split(/(?=[A-Z])/).join('-').toLowerCase();
    router.get(`/${routeName}`, (req, res, _) => (
      res.status(200).send(model.options.constants || {})
    ));
  });

  return router;
}


export default generateApiConstants;
