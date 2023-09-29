const router = require('express').Router();
const { checkUserPatch } = require('../utils/validation');

const {
  getUser,
  updateUser,
} = require('../controllers/users');

router.get('/me', getUser);

router.patch('/me', checkUserPatch(), updateUser);

module.exports = router;
