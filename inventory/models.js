'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const inventorySchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  books: [{
      title: {
        type: String,
        required: true,
        unique: true
      },
      author: {
        type: String,
        required: true,
      },
      stock: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
  }]
});

inventorySchema.pre('find', function(next) {
    this.populate('user');
    next();
 });
 
 inventorySchema.pre('findOne', function(next) {
    this.populate('user');
    next();
 });


const Inventory = mongoose.model('inventories', inventorySchema);

module.exports = {Inventory};
