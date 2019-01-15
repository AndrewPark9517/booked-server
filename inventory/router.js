const express = require('express');
const passport = require('passport');
const router = express.Router();
const bodyParser = require('body-parser');
const { Inventory } = require('./model');

const jwtAuth = passport.authenticate('jwt', {session: false});
router.use(bodyParser.json());

  router.get('/', jwtAuth, (req, res) => {
    Inventory.findOne({'user': req.user._id})
    .then(function(inventory) {
        res.json({
            books: inventory.books
        })
    })
    .catch (function(error) {
        res.status(500).json({message: error.message})
    })
  });

  router.post('/addBook', jwtAuth, (req, res) => {
    Inventory.findOne({'user': req.user._id})
    .then(function(inventory) {

        const isInInventory = inventory.books.find(function(book) {
            return book.title === req.body.title;
        })

        if(isInInventory) {
            return Promise.reject({
                code: 422,
                reason: "SubmissionError",
                message: "Book already in Inventory",
                location: "title"
            })
        }

        inventory.books.push({
            title: req.body.title,
            author: req.body.author,
            stock: req.body.stock,
            price: req.body.price
        })
        inventory.save();

        res.json({books: inventory.books})
    })
    .catch(function(err) {
        if (err.reason === 'SubmissionError') {
            return res.status(err.code).json(err);
          }
          res.status(500).json({code: 500, message: 'Internal server error'});
    })
  })

  router.put('/edit', jwtAuth, (req, res) => {
    Inventory.findOne({'user': req.user._id})
    .then(function(inventory) {
        const bookIndex = inventory.books.findIndex(function(book) {
            return book.title === req.body.title;
        });

        inventory.books[bookIndex].stock = req.body.stock;
        inventory.books[bookIndex].price = req.body.price;
        inventory.save();

        res.json({books: inventory.books})
    })
    .catch(function(error) {
        res.status(500).json({code: 500, message: 'Internal server error'});
    })
  });
  
  router.delete('/delete', jwtAuth, (req, res) => {
      Inventory.findOne({'user': req.user._id})
      .then(function(inventory) {
          console.log(`Deleting ${req.body.title}`);
          const books = inventory.books.filter(function(book) {
              return book.title !== req.body.title;
          })

          inventory.books = books;
          inventory.save();

          res.json({books: inventory.books});
      })
      .catch(function(error) {
        res.status(500).json({code: 500, message: 'Internal server error'});
      })
  })

  module.exports = {router};
  