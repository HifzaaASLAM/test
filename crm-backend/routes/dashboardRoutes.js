const router = require('express').Router();
const { verifyToken } = require('../middleware/auth');
const { getDashboard } = require('../controllers/dashboardController');

router.get('/', verifyToken, getDashboard);

module.exports = router;