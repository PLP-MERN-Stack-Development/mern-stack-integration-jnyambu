const express = require('express');
const router = express.Router();
const categoriesCtrl = require('../controllers/categoriesController');
const auth = require('../middleware/authMiddleware');

router.get('/', categoriesCtrl.getAll);
router.post('/', auth, categoriesCtrl.create);

module.exports = router;
