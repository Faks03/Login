const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();
const Product = require('../models/Product');
const sendEmail = require('../controllers/email');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Define the destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single('image');
// Define the name of the field used to send the file

router.post('/product', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Something went wrong');
    }

    const user = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      image: {
        data: req.file.filename,
        contentType: 'image/png',
      },
    });

    user
      .save()
      .then(() => {
        // Send email when product is uploaded
        const to = process.env.EMAIL;
        const subject = 'New Product';
        const text = 
        `New product added
         title: ${req.body.title}
         description: ${req.body.description}
         price: ${req.body.price}`;

        sendEmail(to, subject, text)
          .then(() => {
            fs.readFile('./public/fade.html', 'utf8', (err, data) => {
              if (err) {
                console.log(err);
                return res.status(500).send('Something went wrong');
              }
              res.send(data);
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(500).json({
              status: 'FAILED',
              message: 'An error occurred',
            });
          });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({
          status: 'FAILED',
          message: 'An error occurred',
        });
      });
  });
});

module.exports = router;
