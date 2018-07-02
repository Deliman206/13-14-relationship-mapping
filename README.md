## Project title

Relational Mapping 

  ## Learning Objectives
  * students will be able to work with the MongoDB database management system
  * students will understand the primary concepts of working with a NoSQL database management system
  * students will be able to create custom data models *(schemas)* through the use of mongoose.js
  * students will be able to use mongoose.js helper methods for interacting with their database persistence layer

### Documentation
In the README.md write documention for starting your server and making requests to each endpoint it provides. The documentation should describe how the server would respond to valid and invalid requests.

This project uses MongoDB to work with a single resource, or in mongoose its called a schema, and use full-crud operations on said schema. The server for this project is started using the command 

```
npm run start
```
When information is set to the server via an application like Postman. They server will respond with the corresponding status code depending on whether or not the information from the client was formated correctly for the route. 

## Code Example
The schema for this application is a Library and is modeled for a Library Location: 

```
const librarySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  founder: {
    type: String,
  },
  year: {
    type: Number,
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'books', 
    },
  ],
});
```
This project is not deployed so all references to API_URL refer to
```
http://localhost:PORT
```
Where PORT is a defined number in a .env file located inside the project file tree.

To create a new Library one must hit the POST on API_URL/api/library route and provide at least the required information, which is the name. The response for a POST request is the Library object the user sent to the DB.

```
libraryRouter.post('/api/library', jsonParser, (request, response, next) => {
  if (!request.body.name) {
    logger.log(logger.ERROR, 'LIBRARY-ROUTER: Responding with 400 error code');
    return next(new HttpErrors(400, 'Library Name is required'));
  }

  return new Library(request.body).save()
    .then(library => response.json(library))
    .catch(next);
});
```
To Update a Library one must hit the PUT on API_URL/api/library/:id route and may provide any infromation to update the Library or no information at all and return the Library in scope. 

```
libraryRouter.put('/api/library/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
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
```

To get information about a library one must hit the GET on API_URL/api/library/:id route and will recieve an object with all the information about the library as described by the Mongo Schema.

```
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
```

Lastly a Library can be deleted from the database using the DELETE on API_URL/api/library/:id route and will recieve a 204 status code.

```
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
```

## Installation
To use the program locally a developer would clone/fork this repository, traverse into the folder and run the following commands
```
npm i
touch .env
```

By doing this the developer installs the node modules needed to use this application and creates a .env file to hold the local variables.

In the .env file the developer will need the following
```
NODE_ENV=development
MONGODB_URI=mongodb://localhost/testing
PORT=YOUR_PORT_OF_CHOICE
```

To run the database and then server use the following commands
```
npm run dbon
npm run start
```


## Tests
This application uses JEST for UNIT testing. To check the tests for this application verify that the Database is up and running and that the PORT in the .env file is not the same as the PORT in the src/__test__/lib/test.env.js file.
To use JEST to test the application run the following command

```
npm run test
```

## License

MIT © [Sean Miller]()