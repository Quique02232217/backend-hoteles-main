const db = require('./db');

async function obtenerInformacionHabitacion() {
    const [rows] = await db.execute(`
        SELECT h.id_habitacion as id, h.descripcion as descripcion_habitacion, a.ref_tipo_acomodacion as tipo_codigo, a.descripcion as tipo_detalle, a.ocupacion_max as ocupacion_max, a.precio_noche, a.capacidad_instalada as capacidad_instalada, a.imagenes, a.activo
        FROM habitaciones h
        join acomodaciones a on a.id_acomodacion = h.id_acomodacion;`);
    return rows;
}

module.exports = {
    obtenerInformacionHabitacion
}