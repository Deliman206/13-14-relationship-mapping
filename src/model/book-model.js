'use strict';

import mongoose from 'mongoose';
import HttpErrors from 'http-errors';
import Library from './library';

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  published: {
    type: Number,
  },
  library: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    reference: 'library',
  },
});

// A mongoose hook access to 
// - a done() function
// - the object we are working with ( mongoose calls this 'document')

function bookPreHook(done) { // done is using an (error, data) signature
// the value of 'contextual this' is the document
  return Library.findById(this.library)
    .then((libraryFound) => {
      if (!libraryFound) {
        throw new HttpErrors(404, 'library not found');
      }
      libraryFound.books.push(this._id);
      return libraryFound.save();
    })
    .then(() => done()) // done w/o arguements means success
    .catch(done); // done with results means error
} 
const bookPostHook = (document, done) => {
  return Library.findById(document.library)
    .then((libraryFound) => {
      if (!libraryFound) {
        throw new HttpErrors(500, 'library not found');
      }
      libraryFound.books = libraryFound.books.filter((book) => {
        return book._id.toString() !== document._id.toString();
      });
    })
    .then(() => done())
    .catch(done);
};


bookSchema.pre('save', bookPreHook);
bookSchema.post('remove', bookPostHook);


export default mongoose.model('book', bookSchema);
