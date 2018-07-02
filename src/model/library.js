'use strict';

import mongoose from 'mongoose';

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

export default mongoose.model('library', librarySchema);
