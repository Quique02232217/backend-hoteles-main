const pool = require("../models/db");
const {generarCodigoReserva} = require("../utils/utils");


async function crearReservaCompleta(data) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const titular = extraerTitular(data);
    const detalle = data.detalles[0]; // puedes adaptar para varios después
    const numReserva = generarCodigoReserva();
    const totalPago = data.totalPago || 0;

    await insertarTitularSiNoExiste(conn, titular);
    await insertarSolicitud(conn, numReserva, titular.id, detalle, totalPago);
    await insertarDetalle(conn, numReserva, detalle, totalPago);

    await conn.commit();

    return {
      success: true,
      message: "Reserva creada correctamente",
      numReserva
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

function extraerTitular(data){
  return {
    id: data.idTitular,
    nombre: data.nombreTitular,
    email: data.emailTitular,
    telefono: data.telefonoTitular
  };
}

async function insertarTitularSiNoExiste(conn, titular) {
  const [persona] =  await conn.query(
    "SELECT * FROM personas WHERE id_persona = ?",
    [titular.id]
  );
  if (persona.length > 0) return;

  await conn.query(
    `INSERT INTO personas 
      (id_persona, tipo_id, razon_social, nombre1, fecha_nacimiento, ref_genero, nacionalidad)
     VALUES (?, 'C', ?, ?, CURDATE(), 'GENERO_MASCULINO', 1)`,
    [titular.id, titular.nombre, titular.nombre]
  );

  await conn.query(
    `INSERT INTO personas_det (id_persona, direccion, email, telefono)
     VALUES (?, 'Sin dirección', ?, ?)`,
    [titular.id, titular.email, titular.telefono]
  );
}

async function insertarSolicitud(conn, numReserva, idTitular, detalle, totalPago) {
  const { fechaDeLlegada, fechaDeSalida, horaEstimadaLlegada } = detalle;

  await conn.query(
    `INSERT INTO solicitudes_alojamiento 
      (num_solicitud, id_titular, fecha_check_in, fecha_check_out, noches, 
       hora_estimada_llegada, total_pago, monto_pagado, estado, fecha_creacion)
     VALUES (?, ?, ?, ?, DATEDIFF(?, ?), ?, ?, 0, ?, NOW())`,
    [
      numReserva,
      idTitular,
      fechaDeLlegada,
      fechaDeSalida,
      fechaDeSalida,
      fechaDeLlegada,
      horaEstimadaLlegada,
      totalPago,
      'CONFIRMADA'
    ]
  );
}

async function insertarDetalle(conn, numReserva, detalle, totalPago) {
  const {
    idAcomodacion,
    fechaDeLlegada,
    fechaDeSalida,
    horaEstimadaLlegada,
    numeroPersonas
  } = detalle;

  const cupos = parseInt(numeroPersonas) || 0;
  const precioNoche = cupos > 0 ? totalPago / cupos : 0;

  const notas = `Reserva acomodación: ${idAcomodacion}, ${cupos} persona(s), con fecha de entrada ${fechaDeLlegada} y fecha de salida ${fechaDeSalida}, con hora estimada de llegada ${horaEstimadaLlegada}`;

  await conn.query(
    `INSERT INTO solicitudes_alojamiento_det 
      (id_acomodacion, num_solicitud, cantidad_personas, precio_noche_actual, subtotal, notas, fecha_creacion)
     VALUES (?, ?, ?, ?, ?, ?, NOW())`,
    [
      idAcomodacion,
      numReserva,
      cupos,
      precioNoche,
      totalPago,
      notas
    ]
  );
}


async function obtenerReservas() {
  const conn = await pool.getConnection();

  try{
    const [resultados] = await conn.query(`
      SELECT 
        s.num_solicitud AS numReserva,
        p.id_persona AS idTitular,
        p.nombre1 AS nombreTitular,
        pd.email AS emailTitular,
        pd.telefono AS telefonoTitular,
        s.fecha_check_in AS fecha,
        s.fecha_check_out AS fecha_salida,
        s.hora_estimada_llegada AS hora,
        s.total_pago AS totalPago,
        s.estado,
        d.id_acomodacion,
        d.cantidad_personas AS cuposReservados,
        d.notas AS detalle
      FROM solicitudes_alojamiento s
      JOIN personas p ON s.id_titular = p.id_persona
      JOIN personas_det pd ON p.id_persona = pd.id_persona
      JOIN solicitudes_alojamiento_det d ON s.num_solicitud = d.num_solicitud
    `);
    
    return resultados.map(r => ({
      numReserva: r.numReserva,
      titular: {
        id: r.idTitular,
        nombre: r.nombreTitular,
        email: r.emailTitular,
        telefono: r.telefonoTitular
      },
      detalle: r.detalle,
      fecha: r.fecha,
      hora: r.hora,
      cuposReservados: r.cuposReservados,
      totalPago: r.totalPago,
      estado: r.estado
    }));

  } finally {
    conn.release();
  }
  
}


module.exports = { 
  crearReservaCompleta,
  obtenerReservas 
};