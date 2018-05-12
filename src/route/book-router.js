'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Book from '../model/book-model';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const bookRouter = new Router();

bookRouter.post('/api/books', jsonParser, (request, response, next) => {
  if (!request.body.title) {
    logger.log(logger.INFO, 'BOOK-ROUTER: Responding with 400 error code');
    return next(new HttpErrors(400, 'Book Title is required'));
  }

  return new Book(request.body).save()
    .then(book => response.json(book))
    .catch(next);
});

bookRouter.put('/api/books/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return Book.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedBook) => {
      if (!updatedBook) {
        logger.log(logger.INFO, 'BOOK-ROUTER: responding with 404 code -!updatedBook');
        return next(new HttpErrors(404, 'Book not found'));
      }

      logger.log(logger.INFO, 'PUT: responding with 200 status code');
      return response.json(updatedBook);
    })
    .catch(next);
});
bookRouter.get('/api/books/:id', (request, response, next) => {
  return Book.findById(request.params.id)
    .then((book) => {
      if (!book) {
        logger.log(logger.ERROR, 'BOOK ROUTER: responding with 404 status code !category');
        return next(new HttpErrors(404, 'book not found'));
      }
      logger.log(logger.INFO, 'BOOK ROUTER: responding with 200 status code');
      logger.log(logger.INFO, `BOOK ROUTER: ${JSON.stringify(book)}`);
      return response.json(book);
    })
    .catch(next);
});
bookRouter.delete('/api/books/:id', (request, response, next) => {
  return Book.findByIdAndRemove(request.params.id)
    .then((book) => {
      if (!book) {
        logger.log(logger.ERROR, 'BOOK ROUTER: responding with 404 !book');
        return next(new HttpErrors(404, 'book not found'));
      }
      logger.log(logger.INFO, 'BOOK ROUTER: responding with 200 Successful delete');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default bookRouter;
