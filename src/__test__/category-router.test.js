'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Library from '../model/library';
import { startServer, stopServer } from '../lib/server';

const apiUrl = `http://localhost:${process.env.PORT}/api/library`;

const pCreateLibraryMock = () => {
  return new Library({
    name: faker.name.firstName(),
    address: faker.address.streetAddress(),
    founder: faker.name.lastName(),
    year: faker.random.number(),
  }).save();
};

describe('api/library', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Library.remove({}));

  describe('POST api/library', () => {
    test('200', () => {
      const mockLibrary = {
        name: faker.name.firstName(),
        address: faker.address.streetAddress(),
        founder: faker.name.lastName(),
        year: faker.random.number(),
      };
      return superagent.post(apiUrl)
        .send(mockLibrary)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.name).toEqual(mockLibrary.name);
          expect(response.body.title).toEqual(mockLibrary.title);
        });
    });

    test('409 due to duplicate title', () => {
      return pCreateLibraryMock()
        .then((library) => {
          const mockLibrary = {
            name: library.name,
            address: library.address,
            founder: library.founder,
            year: library.year,
          };
          return superagent.post(apiUrl)
            .send(mockLibrary);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });

    test('400 due to lack of title', () => {
      return superagent.post(apiUrl)
        .send({})
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });

    test('400 due to bad json', () => {
      return superagent.post(apiUrl)
        .send('{')
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
  });

  describe('PUT api/library', () => {
    test('200 for succcesful PUT', () => {
      let libraryToUpdate = null;
      return pCreateLibraryMock()
        .then((library) => {
          libraryToUpdate = library;
          return superagent.put(`${apiUrl}/${library._id}`)
            .send({ year: 2018 });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.year).toEqual(2018);
          expect(response.body.address).toEqual(libraryToUpdate.address);
          expect(response.body._id).toEqual(libraryToUpdate._id.toString());
        });
    });
    test('400 for PUT Request is invalid', () => {
      return pCreateLibraryMock()
        .then((library) => {
          return superagent.put(`${apiUrl}/${library._id}`)
            .send({ name: library.name })
            .then(Promise.reject)
            .catch((err) => {
              expect(err.message).toEqual(400);
            });
        });
    });
    test('404 for PUT Id not found', () => {
      return pCreateLibraryMock()
        .then(() => {
          return superagent.put(apiUrl)
            .send({})
            .then(Promise.reject)
            .catch((err) => {
              expect(err.status).toEqual(400);
            });
        });
    });
    test('409 for PUT Unique Key value', () => {});
  });

  describe('GET /api/library', () => {
    test('200', () => {
      let tempLibrary = null;
      return pCreateLibraryMock()
        .then((library) => {
          tempLibrary = library;
          return superagent.get(`${apiUrl}/${library._id}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toEqual(tempLibrary._id.toString());
            });
        });
    });
    test('404 for GET Id not found', () => {});
  });

  describe('DELETE /api/library', () => {
    test('204', () => {
      return pCreateLibraryMock()
        .then((library) => {
          return superagent.delete(`${apiUrl}/${library._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('404 Resource with Id not existing', () => {});
  });
});
