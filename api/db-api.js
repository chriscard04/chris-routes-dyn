const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

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
      return res.status(404).json({ message: 'Ruta no encontrada' });
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

    res.json(ruta);

  } catch (error) {
    console.error('Error al obtener la ruta:', error);
    res.status(500).json({ error: 'Error al obtener la ruta' });
  }
});



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
