'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { pCreateLibraryMock } from '../lib/library-mock';
import { startServer, stopServer } from '../../lib/server';
import { pCreateBookMock, pRemoveBookMock } from '../lib/book-mock';

const apiUrl = `http://localhost:${process.env.PORT}/api/books`;

describe('/api/books', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveBookMock);

  describe('POST /api/books', () => {
    test('200 status in creation', () => {
      return pCreateLibraryMock()
        .then((libraryMock) => {
          const bookToPost = {
            title: faker.lorem.words(3),
            author: faker.name.firstName(),
            published: faker.random.number(),
            library: libraryMock._id,
          };
          return superagent.post(apiUrl)
            .send(bookToPost)
            .then((response) => {
              expect(response.status).toEqual(200);
            });
        });
    });
    test('400 status in creation', () => {
      return pCreateLibraryMock()
        .then(() => {
          return superagent.post(apiUrl)
            .send()
            .then(Promise.reject)
            .catch((error) => {
              expect(error.status).toEqual(400);
            });
        });
    });
    test('409 status in creation', () => {
      return pCreateBookMock()
        .then((bookMock) => {
          const bookToPost = {
            title: bookMock.book.title,
            author: faker.name.firstName(),
            published: faker.random.number(),
            library: bookMock.library._id,
          };
          return superagent.post(apiUrl)
            .send(bookToPost)
            .then(Promise.reject)
            .catch((error) => {
              expect(error.status).toEqual(409);
            });
        });
    });
  });
  describe('PUT /api/books', () => {
    test('200 Status', () => {
      let bookToUpdate = null;
      return pCreateBookMock()
        .then((mock) => {
          bookToUpdate = mock.book;
          return superagent.put(`${apiUrl}/${mock.book._id}`)
            .send({ title: mock.book.title });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual(bookToUpdate.title);
        });
    });
  });
  describe('GET /api/books', () => {
    test('200 Status', () => {
      let tempBook = null;
      return pCreateBookMock()
        .then((book) => {
          tempBook = book;
          return superagent.get(`${apiUrl}/${book.book._id}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              // expect(response.body._id).toEqual(tempBook.book._id);
            });
        });
    });
    test('404 Status', () => {
      return pCreateBookMock()
        .then(() => {
          return superagent.get(`${apiUrl}/1234`)
            .then(Promise.reject)
            .catch((error) => {
              expect(error.status).toEqual(404);
              // expect(response.body._id).toEqual(tempBook.book._id);
            });
        });
    });
  });
  describe('DELETE /api/books', () => {
    test('204', () => {
      return pCreateBookMock()
        .then((book) => {
          return superagent.delete(`${apiUrl}/${book.book._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('404 Resource with Id not existing', () => {
      return pCreateBookMock()
        .then(() => {
          return superagent.delete(`${apiUrl}/1234`);
        })
        .then(Promise.reject)
        .catch((error) => {
          expect(error.status).toEqual(404);
        });
    });
  });
});
