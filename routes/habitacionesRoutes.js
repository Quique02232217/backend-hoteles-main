const express = require('express');
const router = express.Router();
const HabitacionesController = require('../controller/habitacionesController');

/**
 * @swagger
 * /habitaciones:
 *   get:
 *     summary: Obtiene todas las habitaciones con su tipo de acomodación
 *     tags: [Habitaciones]
 *     responses:
 *       200:
 *         description: Lista de habitaciones
 */

router.get('/habitaciones', HabitacionesController.getAll);

module.exports = router;