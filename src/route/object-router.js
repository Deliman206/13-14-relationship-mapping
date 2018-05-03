'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Object from '../model/object';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();
const objectRouter = new Router();
const object = object;

objectRouter.post(`/api/${object}`, jsonParser, (request, response, next) => {
  logger.log(logger.INFO, `POST: Processing request to /api/${object}`);
  if (!request.body.name) {
    logger.log(logger.INFO, 'POST: Responding with 409 code, no Name query');
    return next(new HttpErrors(409, 'Name is required'));
  }
  return new Object(request.body).save()
    .then((object) => {
      logger.log(logger.INFO, 'POST: Responding with 200 Status Passed to MongoDB');
      return response.json(object);
    })
    .catch(next);
});
objectRouter.get(`/api/${object}/:id`, (request, response, next) => { 
  logger.log(logger.INFO, `GET: Processing request to /api/${object}`);
  if(!request.body.name) {
    logger.log(logger.INFO, 'GET: Responding with 404 code, no Name Query');
    return next(new HttpErrors(409, 'GET: Name is required'));
  }
  return Object.findById(request.params.id)
    .then((object) => {
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(object);
    })
    .catch(next);
});