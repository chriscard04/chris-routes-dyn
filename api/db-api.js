const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3011;

// Enable CORS
app.use(cors({
  origin: 'http://localhost:4200' // Allow requests from your Angular application
}));

// Configura la conexión a PostgreSQL
const pool = new Pool({
  user: 'chriscard11',
  host: 'localhost',
  database: 'dbdynchris',
  password: '@dm1n',
  port: 5432,
});

// Función para crear las tablas si no existen
const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Ruta (
        id_ruta INTEGER PRIMARY KEY,
        conductor INTEGER,
        fecha_entrega TIMESTAMPTZ,
        notas TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS Orden (
        id_orden INTEGER PRIMARY KEY,
        secuencia INTEGER,
        valor NUMERIC,
        prioritario BOOLEAN,
        ruta_id INTEGER,
        FOREIGN KEY(ruta_id) REFERENCES Ruta(id_ruta)
      )
    `);
    console.log('Tablas creadas o ya existen.');



  } catch (error) {
    console.error('Error al crear las tablas:', error);
  }
};


// Crear las tablas al iniciar la aplicación
createTables();

// Middleware para parsear el cuerpo de las peticiones
app.use(express.json());

// Rutas del API

// Crear una nueva ruta
app.post('/rutas', async (req, res) => {
  const { id_ruta, conductor, fecha_entrega, notas, ordenes } = req.body;

  try {
    // Insert Ruta
    const rutaResult = await pool.query(
      `
        INSERT INTO Ruta (id_ruta, conductor, fecha_entrega, notas)
        VALUES ($1, $2, $3, $4)
        RETURNING id_ruta;
      `,
      [id_ruta, conductor, fecha_entrega, notas]
    );

    const rutaId = rutaResult.rows[0].id_ruta;

    // Insert Orders
    for (const order of ordenes) {
      await pool.query(
        `
          INSERT INTO Orden (id_orden, secuencia, valor, prioritario, ruta_id)
          VALUES ($1, $2, $3, $4, $5);
        `,
        [order.id_orden, order.secuencia, order.valor, order.prioritario, rutaId]
      );
    }

    res.status(201).json({ message: 'Ruta y órdenes creadas correctamente' });

  } catch (error) {
    console.error('Error al crear ruta y órdenes:', error);
    res.status(500).json({ error: 'Error al crear ruta y órdenes' });
  }
});

app.put('/rutas/:id', async (req, res) => {
  const { id } = req.params;
  const { conductor, fecha_entrega, notas, ordenes } = req.body;

  try {
    // Actualizar la ruta principal
    await pool.query(
      `
        UPDATE Ruta
        SET conductor = $1, fecha_entrega = $2, notas = $3
        WHERE id_ruta = $4;
      `,
      [conductor, fecha_entrega, notas, id]
    );

    // Actualizar las órdenes existentes
    for (const order of ordenes) {
      await pool.query(
        `
          UPDATE Orden
          SET secuencia = $1, valor = $2, prioritario = $3
          WHERE id_orden = $4 AND ruta_id = $5;
        `,
        [order.secuencia, order.valor, order.prioritario, order.id_orden, id]
      );
    }

    res.status(200).json({message: 'success', data: { message: 'Ruta y órdenes actualizadas correctamente' }});
  } catch (error) {
    console.error('Error al actualizar ruta y órdenes:', error);
    res.status(200).json({message: 'error', data: { message: 'Hubo un error al actualizar la Ruta y órdenes' }});
  }
});

app.delete('/rutas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si la ruta existe
      const checkRuta = await pool.query('SELECT * FROM Ruta WHERE id_ruta = $1', [id]);

      if (checkRuta.rows.length === 0) {
          res.status(200).json({message: 'error', data: { message: 'No se hicieron cambios. No se encontró la ruta indicada.' }});
      }
      // Iniciar transacción
      // Eliminar las órdenes asociadas
      await pool.query('BEGIN');
      await pool.query('DELETE FROM Orden WHERE ruta_id = $1', [id]);
      // Eliminar la ruta
      await pool.query('DELETE FROM Ruta WHERE id_ruta = $1', [id]);
      await pool.query('COMMIT'); // Confirmar la transacción

      res.status(200).json({message: 'success', data: { message: 'Ruta y órdenes eliminadas correctamente' }});
  } catch (error) {
      await pool.query('ROLLBACK'); // Deshacer la transacción en caso de error
      console.error('Error al eliminar ruta y órdenes:', error);
      res.status(200).json({message: 'error', data: { message: 'No se hicieron cambios. Hubo un error al eliminar la Ruta y órdenes.' }});
  }
});

// Get all rutas with their orders
app.get('/rutas', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        r.id_ruta, r.conductor, r.fecha_entrega, r.notas,
        o.id_orden, o.secuencia, o.valor, o.prioritario
      FROM
        Ruta r
      LEFT JOIN
        Orden o ON r.id_ruta = o.ruta_id;
    `);

    const rutas = result.rows.reduce((acc, row) => {
      const existingRuta = acc.find(ruta => ruta.id_ruta === row.id_ruta);

      if (existingRuta) {
        existingRuta.ordenes.push({
          id_orden: row.id_orden,
          secuencia: row.secuencia,
          valor: parseFloat(row.valor),
          prioritario: row.prioritario,
        });
      } else {
        acc.push({
          id_ruta: row.id_ruta,
          conductor: row.conductor,
          fecha_entrega: row.fecha_entrega,
          notas: row.notas,
          ordenes: row.id_orden ? [{
            id_orden: row.id_orden,
            secuencia: row.secuencia,
            valor: parseFloat(row.valor),
            prioritario: row.prioritario,
          }] : [],
        });
      }

      return acc;
    }, []);

    res.json(rutas);

  } catch (error) {
    console.error('Error al obtener rutas:', error);
    res.status(500).json({ error: 'Error al obtener rutas' });
  }
});

// Get one ruta with its orders
app.get('/rutas/:id_ruta', async (req, res) => {
  const { id_ruta } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        r.id_ruta, r.conductor, r.fecha_entrega, r.notas,
        o.id_orden, o.secuencia, o.valor, o.prioritario
      FROM
        Ruta r
      LEFT JOIN
        Orden o ON r.id_ruta = o.ruta_id
      WHERE
        r.id_ruta = $1;
    `, [id_ruta]);

    if (result.rows.length === 0) {
      return res.status(200).json({
        message: 'error',
        error: { message: 'No se ha encontrado la ruta en el sistema.' }
      });
    }

    const ruta = {
      id_ruta: result.rows[0].id_ruta,
      conductor: result.rows[0].conductor,
      fecha_entrega: result.rows[0].fecha_entrega,
      notas: result.rows[0].notas,
      ordenes: [],
    };

    for (const row of result.rows) {
      ruta.ordenes.push({
        id_orden: row.id_orden,
        secuencia: row.secuencia,
        valor: parseFloat(row.valor),
        prioritario: row.prioritario,
      });
    }

    res.json({ message: 'success', data: ruta }); // Send response

  } catch (error) {
    res.json({ message: 'error', error: error });
  }
});

// External API Call
app.get('/extroute/:id', async (req, res) => {
  const id = req.params.id; // Extract ID from request parameters

  try {
    // External API call with ID parameter
    const externalApiResponse = await axios.get(`http://localhost:3000/routes/${id}`);
    const dataFromExternalApi = externalApiResponse.data;
    res.json({ message: 'success', data: dataFromExternalApi });
  } catch (error) {
    res.json({ message: 'error', error: error });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
