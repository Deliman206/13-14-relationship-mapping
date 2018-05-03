'use strict';

import mongoose from 'mongoose'

const objectSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model('object', objectSchema);
