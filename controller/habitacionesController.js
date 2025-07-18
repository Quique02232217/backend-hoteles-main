const habitacionesService = require('../services/habitacionService');

async function getAll(req, res) {
    try{
        const data = await habitacionesService.listarInfoHabitaciones();
        res.json(data);
    }catch(error){
        console.error('Error al obtener habitaciones', error);
        res.status(500).json({message: 'Error interno del servidor'});
    }
}

module.exports = {
    getAll,
}