const express = require('express');
const router = express.Router();
const AlojadosController = require('../controller/alojadosController');

router.get('/alojados', AlojadosController.getAlojados);

module.exports = router;
