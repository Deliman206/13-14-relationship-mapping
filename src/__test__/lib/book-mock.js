'use strict';

import faker from 'faker';
import Book from '../../model/book-model';
import * as libraryMock from './library-mock';
// import { pCreateLibraryMock, pRemoveLibraryMock } from './library-mock';

const pCreateBookMock = () => {
  const resultMock = {};
  return libraryMock.pCreateLibraryMock()
    .then((createdLibrary) => {
      resultMock.library = createdLibrary;

      return new Book({
        title: faker.lorem.words(3),
        author: faker.name.firstName(),
        published: faker.random.number(),
        library: createdLibrary._id,
      }).save();
    })
    .then((newBook) => {
      resultMock.book = newBook;
      return resultMock;
    });
};

const pRemoveBookMock = () => Promise.all([
  Book.remove({}),
  libraryMock.pRemoveLibraryMock(),
]);

export { pCreateBookMock, pRemoveBookMock };
