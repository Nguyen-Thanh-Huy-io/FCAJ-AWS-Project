const express = require('express');
const brandController = require('../../controllers/workspace/brand.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.get('/', verifyAuth, brandController.getBrands);

module.exports = router;
