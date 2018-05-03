'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Thing from '../model/object';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http:localhost//${process.env.PORT}/api/object`;
const mockData = () => {
  new Thing({
    name: faker.name.firstName(),
  }).save();
};

describe('Should validate routes for /api/object', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Thing.remove({}));

  describe('Should validate POST Route',() => {
    test('Should Return 409 Code No Name in Body', () => {
      const data = {};
      return superagent.post(apiURL)
        .send(data)
        .then((response) => {
          expect(response.status).toEqual(409);
        });
    });
  });
  describe('Should validate GET Route', () => {});
  describe('Should validate PUT Route', () => {});
  describe('Should validate DELETE Route', () => {});
});
