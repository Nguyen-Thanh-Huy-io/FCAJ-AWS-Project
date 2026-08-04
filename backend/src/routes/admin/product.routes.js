const express = require('express');
const productController = require('../../controllers/admin/product.controller');
const { verifyAuth } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/authorization.middleware');
const { USER_ROLES } = require('../../utils/constants');

const router = express.Router();

router.use(verifyAuth);
router.use(authorize(USER_ROLES.ADMIN, USER_ROLES.OWNER));

/**
 * GET /api/admin/products/matrix
 */
router.get('/matrix', productController.getProductMatrix);

module.exports = router;
