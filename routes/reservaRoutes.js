const express = require("express");
const router = express.Router();
const reservaController = require("../controller/reservaController");

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Operaciones relacionadas con reservas de alojamiento
 */

/**
 * @swagger
 * /reservas/crear-reservas:
 *   post:
 *     summary: Crea una nueva reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idTitular:
 *                 type: string
 *                 example: "123456789"
 *               nombreTitular:
 *                 type: string
 *                 example: "Juan Pérez"
 *               emailTitular:
 *                 type: string
 *                 example: "juan@example.com"
 *               telefonoTitular:
 *                 type: string
 *                 example: "+573001112233"
 *               totalPago:
 *                 type: number
 *                 example: 1500000
 *               detalles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idAcomodacion:
 *                       type: integer
 *                       example: 1
 *                     fechaDeLlegada:
 *                       type: string
 *                       format: date
 *                       example: "2025-07-20"
 *                     fechaDeSalida:
 *                       type: string
 *                       format: date
 *                       example: "2025-07-23"
 *                     horaEstimadaLlegada:
 *                       type: string
 *                       example: "15:00"
 *                     numeroPersonas:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Reserva creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 numReserva:
 *                   type: string
 *       500:
 *         description: Error interno al crear la reserva
 */

router.post("/crear-reservas", reservaController.crear);

/**
 * @swagger
 * /reservas/obtener-reservas:
 *   get:
 *     summary: Obtiene todas las reservas realizadas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   numReserva:
 *                     type: string
 *                     example: "ABC123"
 *                   titular:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "123456789"
 *                       nombre:
 *                         type: string
 *                         example: "Juan Pérez"
 *                       email:
 *                         type: string
 *                         example: "juan@example.com"
 *                       telefono:
 *                         type: string
 *                         example: "+573001112233"
 *                   detalle:
 *                     type: string
 *                     example: "Reserva acomodación: 1, 2 persona(s), con fecha de entrada 2025-07-20 y fecha de salida 2025-07-23, con hora estimada de llegada 15:00"
 *                   fecha:
 *                     type: string
 *                     format: date
 *                     example: "2025-07-20"
 *                   hora:
 *                     type: string
 *                     example: "15:00:00"
 *                   cuposReservados:
 *                     type: integer
 *                     example: 2
 *                   totalPago:
 *                     type: number
 *                     example: 1500000
 *                   estado:
 *                     type: string
 *                     example: "CONFIRMADA"
 *       500:
 *         description: Error al obtener reservas
 */
router.get("/obtener-reservas", reservaController.listar);
module.exports = router;
