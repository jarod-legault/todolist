const express = require('express');
const router = express.Router();
const { signup, signin, updateUser, requestReset, resetPassword } = require('../handlers/auth');

router.post('/signup', signup);
router.post('/signin', signin);
router.put('/:userId', updateUser);
router.post('/forgot', requestReset);
router.post('/reset/:token', resetPassword);

module.exports = router;