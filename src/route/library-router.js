'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Library from '../model/library';
import logger from '../lib/logger';


const jsonParser = bodyParser.json();

const libraryRouter = new Router();

libraryRouter.post('/api/library', jsonParser, (request, response, next) => {
  if (!request.body.name) {
    logger.log(logger.ERROR, 'LIBRARY-ROUTER: Responding with 400 error code');
    return next(new HttpErrors(400, 'Library Name is required'));
  }

  return new Library(request.body).save()
    .then(library => response.json(library))
    .catch(next);
});

libraryRouter.put('/api/library/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  // if (!request.body.name) {
  //   logger.log(logger.ERROR, 'LIBRARY-ROUTER: Responding with 400 error code');
  //   return next(new HttpErrors(400, 'Library Name is required'));
  // }
  return Library.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedLibrary) => {
      if (!updatedLibrary) {
        logger.log(logger.ERROR, 'LIBRARY ROUTER: responding with 404 status code - !updatedLibrary');
        return next(new HttpErrors(404, 'library not found'));
      }

      logger.log(logger.INFO, 'PUT - responding with 200 status code');
      return response.json(updatedLibrary);
    })
    .catch(next);
});

libraryRouter.get('/api/library/:id', (request, response, next) => {
  return Library.findById(request.params.id)
    .then((library) => {
      if (!library) {
        logger.log(logger.ERROR, 'LIBRARY ROUTER: responding with 404 status code !library');
        return next(new HttpErrors(404, 'library not found'));
      }

      logger.log(logger.INFO, 'LIBRARY ROUTER: responding with 200 status code');
      logger.log(logger.INFO, `LIBRARY ROUTER: ${JSON.stringify(library)}`);
      return response.json(library);
    })
    .catch(next);
});

libraryRouter.delete('/api/library/:id', (request, response, next) => {
  return Library.findByIdAndRemove(request.params.id)
    .then((library) => {
      if (!library) {
        logger.log(logger.ERROR, 'LIBRARY ROUTER: responding with 404 !library');
        return next(new HttpErrors(404, 'library not found'));
      }

      logger.log(logger.INFO, 'LIBRARY ROUTER: responding with 204 status code');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default libraryRouter;
