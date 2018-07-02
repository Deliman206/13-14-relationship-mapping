'use strict';

import faker from 'faker';
import Library from '../../model/library';

const pCreateLibraryMock = () => {
  return new Library({
    name: faker.name.firstName(),
    address: faker.address.streetAddress(),
    founder: faker.name.lastName(),
    year: faker.random.number(),
  }).save();
};

const pRemoveLibraryMock = () => Library.remove();

export { pCreateLibraryMock, pRemoveLibraryMock };
