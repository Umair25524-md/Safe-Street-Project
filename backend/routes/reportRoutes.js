const express = require('express');
const router = express.Router();
const {getReport}=require('../controllers/reportController')

router.get('/getReports',getReport);
module.exports = router;
