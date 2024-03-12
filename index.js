const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const fs = require("fs");
const YAML = require('yaml');
const path = require('path');

require('dotenv').config();


const port = 8080;

app.use(express.json());
app.use('/static', express.static('static'));

const file = fs.readFileSync('./openapi.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

var options = {
  swaggerOptions: {
    showExtensions: true
  }
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));


app.get('/', function(req, res) {
  res.redirect('/docs');
});

let pets = [
  { id: 1, name: 'Max', type: 'Dog', status: 'available' },
  { id: 2, name: 'Doggo', type: 'Dog', status: 'available' }
];

app.get('/api/v3/pet/findByStatus', (req, res) => {
  const status = req.query.status || 'available';
  const filteredPets = pets.filter(p => p.status === status);
  res.status(200).json(filteredPets);
});

app.get('/api/v3/user/login', (req, res) => {
  const { username, password } = req.query;
  if (username === 'admin' && password === 'admin') {
    res.status(200).json({ message: "User logged in successfully" });
  } else {
    res.status(400).json({ message: "Invalid username/password supplied" });
  }
});

app.get('/api/v3/store/inventory', (req, res) => {
  const inventory = {
    available: 10,
    pending: 5,
    sold: 3
  };
  res.status(200).json(inventory);
});

app.get('/api/v3/store/admin', (req, res) => {
  const msg = {
    message: 'You are an admin!'
  };
  res.status(200).json(msg);
});


app.listen(port, () => {
  console.log(`Petstore API server listening at http://localhost:${port}`);
  console.log(`Swagger UI Docs: http://localhost:${port}/docs/`);
});

process.on('SIGINT', function() {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  process.exit(1);
});