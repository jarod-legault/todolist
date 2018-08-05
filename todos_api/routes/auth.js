const express = require('express');
const router = express.Router();
const { signup, signin, updateUser } = require('../handlers/auth');

router.post('/signup', signup);
router.post('/signin', signin);
router.put('/:userId', updateUser);

module.exports = router;