import fastify from 'fastify';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./db/stats.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the statistics database.');
});

const statsApi = async () => {
  const app = fastify();

  app.get('/', (req, reply) => {
    reply.send('Supernova Stats ~~');
  });

  // GET all projects
  app.get('/projects', (req, res) => {
    db.all('SELECT * FROM projects', (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else {
        res.send(rows);
      }
    });
  });

  // GET all products
  app.get('/packages', (req, res) => {
    db.all('SELECT * FROM packages', (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else {
        res.send(rows);
      }
    });
  });

  // GET all products
  app.get('/components', (req, res) => {
    db.all('SELECT * FROM components', (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else {
        res.send(rows);
      }
    });
  });

  // GET single product by ID
  app.get('/projects/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM projects WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else if (!row) {
        res.status(404).send('Product not found');
      } else {
        res.send(row);
      }
    });
  });

  // GET single product by ID
  app.get('/packages/:projectId/:id', (req, res) => {
    const { projectId, id } = req.params;
    db.get('SELECT * FROM packages WHERE projectId = ? and id = ?', [projectId, id], (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else if (!row) {
        res.status(404).send('Product not found');
      } else {
        res.send(row);
      }
    });
  });

  // POST new product
  app.post('/packages', (req, res) => {
    const { projectId, name, price } = req.body;
    if (!name || !price || !projectId) {
      res.status(400).send('Name and price are required');
    } else {
      const sql = 'INSERT INTO packages(name) VALUES (?, ?, ?)';
      db.run(sql, [projectId, name, price], function (err) {
        if (err) {
          console.error(err.message);
          res.status(500).send('Internal server error');
        } else {
          const id = this.lastID;
          res.status(201).send({ id, projectId, name, price });
        }
      });
    }
  });

  // PUT update product by ID
  app.put('/packages/:id', (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
    if (!name || !price) {
      res.status(400).send('Name and price are required');
    } else {
      const sql = 'UPDATE packages SET name = ?, price = ? WHERE id = ?';
      db.run(sql, [name, price, id], function (err) {
        if (err) {
          console.error(err.message);
          res.status(500).send('Internal server error');
        } else if (this.changes === 0) {
          res.status(404).send('Product not found');
        } else {
          res.status(200).send({ id, name, price });
        }
      });
    }
  });

  // DELETE product by ID
  app.delete('/packages/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM packages WHERE id = ?', [id], function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else if (this.changes === 0) {
        res.status(404).send('Product not found');
      } else {
        res.status(204).send();
      }
    });
  });

  app.listen(4001, () => { console.log('Server listen on port 4001') });

  return app;
};

export const viteNodeApp = statsApi();