import express from 'express';
import models from 'db/models';
import { crudRouter } from 'sequelize-crud';

const router = express.Router();

router.use('/patients', crudRouter(models.Patient));
router.use('/medical-procedures', crudRouter(models.MedicalProcedure));
router.use('*', (req, res, next) => {
  next(new Error());
});

export default router;
