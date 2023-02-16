const express = require('express');
const authController = require('../controllers/auth');
const { check, body } = require('express-validator/check');
const User = require('../models/user');

const router = express.Router();
router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password', 'Password has to be valid.').isLength({ min: 12 })
      .isAlphanumeric(),
  ],
  authController.postLogin
);
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              'The E-mail exist already, please pick a different one'
            );
          }
        });
      }),
    body(
      'password',
      'Please enter a password with only numbers and text and at least 12 characters.'
    )
      .isLength({ min: 12 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password have be match!');
      }
      return true;
    }),
  ],
  authController.postSignup
);
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
