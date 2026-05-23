const express = require('express');
const brandController = require('../controllers/brand.controller');
const { verifyAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', verifyAuth, brandController.getBrands);

module.exports = router;
