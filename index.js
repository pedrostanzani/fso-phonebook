const express = require('express');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());

morgan.token('post-data', (req, res) => { return JSON.stringify(req.body); });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data', {
  skip: (req, res) => { return req.method !== 'POST' }
}));


let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
})

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
})

app.post('/api/persons', (req, res) => {
  const body = req.body;

  let id;
  let isDuplicate = true;
  while (isDuplicate) {
    id = Math.ceil(Math.random() * 10e3);
    isDuplicate = persons.some(person => person.id === id);
  }

  // Error handling: missing parameters
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing'
    });
  }

  // Error handling: name already exists
  if (persons.some(person => person.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    });
  }

  const person = {
    id: id,
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person);
  res.json(person);
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
