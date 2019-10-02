import {
  body, sanitizeParam, param, sanitizeBody, sanitizeQuery,
} from 'express-validator';

import { objHas } from '../helpers/object';
import validate from './validateRequest';
import { sanitizeToCreate, sanitizeToUpdate } from './sanitize';

export default function (router, controller, model, options = {}) {
  const { methods, uuid } = options;

  if (!methods || methods.includes('getAll')) {
    router.get('/', async (req, res, next) => {
      try {
        await sanitizeQuery(['limit', 'offset']
          .filter(x => objHas(req.query, x)))
          .toInt().run(req);

        const instances = await controller.getAll(req.query);
        return res.status(200).send(instances);
      } catch (e) {
        return next(e);
      }
    });
  }

  if (uuid !== true && (!methods || methods.includes('getById'))) {
    router.get(
      '/:id(\\d+)/',
      sanitizeParam('id').toInt(),
      validate([[param('id').custom(id => model.verifyPk(id)), 404]]),
      async (req, res, next) => {
        try {
          const { id } = req.params;
          const instance = await controller.getById(id);
          return res.status(200).send(instance);
        } catch (e) {
          return next(e);
        }
      },
    );
  }

  if (uuid === true && (!methods || methods.includes('getById'))) {
    router.get(
      '/:id',
      validate([[param('id').custom(id => model.verifyPk(id)), 404]]),
      async (req, res, next) => {
        try {
          const { id } = req.params;
          const instance = await controller.getById(id);
          return res.status(200).send(instance);
        } catch (e) {
          return next(e);
        }
      },
    );
  }

  if (!methods || methods.includes('create')) {
    router.post(
      '/',
      sanitizeBody().customSanitizer(values => sanitizeToCreate(model, values)),
      validate([body().custom(values => model.validateToCreate(values))]),
      async (req, res, next) => {
        try {
          const instance = await controller.create(req.body);
          return res.status(201).send(instance);
        } catch (e) {
          return next(e);
        }
      },
    );
  }

  if (uuid !== true && (!methods || methods.includes('update'))) {
    router.patch(
      '/:id(\\d+)/',
      sanitizeParam('id').toInt(),
      sanitizeBody().customSanitizer(values => sanitizeToUpdate(model, values)),
      validate([
        [param('id').custom(id => model.verifyPk(id)), 404],
        body().custom((values, { req }) => {
          const { id } = req.params;
          return model.validateToUpdate({ ...values, id });
        }),
      ]),
      async (req, res, next) => {
        try {
          const instance = await controller.update(req.params.id, req.body);
          return res.status(200).send(instance);
        } catch (e) {
          return next(e);
        }
      },
    );
  }

  if (uuid === true && (!methods || methods.includes('update'))) {
    router.patch(
      '/:id',
      sanitizeBody().customSanitizer(values => sanitizeToUpdate(model, values)),
      validate([
        [param('id').custom(id => model.verifyPk(id)), 404],
        body().custom((values, { req }) => {
          const { id } = req.params;
          return model.validateToUpdate({ ...values, id });
        }),
      ]),
      async (req, res, next) => {
        try {
          const instance = await controller.update(req.params.id, req.body);
          return res.status(200).send(instance);
        } catch (e) {
          return next(e);
        }
      },
    );
  }

  if (!methods || methods.includes('remove')) {
    router.delete(
      '/:id',
      sanitizeParam('id').toInt(),
      validate([[param('id').custom(id => model.verifyPk(id)), 404]]),
      async (req, res, next) => {
        try {
          const instance = await controller.remove(req.params.id);
          return res.status(200).send(instance);
        } catch (e) {
          return next(e);
        }
      },
    );
  }
}
