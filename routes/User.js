const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

const User = require('../models/User');
const LoginLog = require('../models/LoginLog');

router.post('/signup', (req, res) => {
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    if (name = "" || email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        })
    } else if (!validateEmail(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email!"
        })

    } else if (password.length != 4) {
        res.json({
            status: "FAILED",
            message: "Password is too short!"
        })
    } else {
        // if the user exists
        User.find({ email }).then(result => {
            if (result.length){
                // a user already exists
                res.json({
                    status: "FAILED",
                    message: "User with the provided email already exists!"
                })
            } else{
                // hash the password
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    // try to create new user
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword
                    });
                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "Signup successful!",
                            data: result
                        })
                    }).catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occured while saving user account!"
                        })
                    })
                }).catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while hashing password!"
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user!"
            })
        })

    }
    
});

router.post('/login', (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  if (email == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Empty credentials supplied!"
    });
  } else if (!validateEmail(email)) {
    res.json({
      status: "FAILED",
      message: "Invalid email!"
    });
  } else {
    // check if user exists
    User.find({ email }).then(data => {
      // check for the length of received data
      if (data.length) {
        // user exists
        const hashedPassword = data[0].password;
        bcrypt.compare(password, hashedPassword).then(result => {
          if (result) {
            // Create a new login log entry
            const newLoginLog = new LoginLog({
              userId: data[0]._id,
              email: data[0].email,
              loginTime: new Date()
            });

            // Save the login log entry to the database
            newLoginLog.save().then(() => {
              res.redirect('/homepage.html');;
              
          
            }).catch(err => {
              res.json({
                status: "FAILED",
                message: "An error occurred while saving login log!"
              });
            });
          } else {
            res.json({
              status: "FAILED",
              message: "Invalid password!"
            });
          }
        }).catch(err => {
          res.json({
            status: "FAILED",
            message: "An error occurred while comparing passwords!"
          });
        });
      } else {
        res.json({
          status: "FAILED",
          message: "Invalid credentials!"
        });
      }
    }).catch(err => {
      console.log(err);
      res.json({
        status: "FAILED",
        message: "An error occurred while checking for an existing user!"
      });
    });
  }
});

module.exports = router;