const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');

/* GET users listing. */
router.get('/get-all', photoController.getAll);

module.exports = router;
