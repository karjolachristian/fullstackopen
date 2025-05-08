require('dotenv').config();
const express = require('express');
var morgan = require('morgan');
const app = express();
const cors = require('cors');
const Person = require('./models/person');
const PORT = process.env.PORT;

app.use(express.static('dist')) ;
app.use(express.json());
app.use(cors());

morgan.token('post', (tokens, req, res) =>{ 
  if (tokens.method(req,res) === 'POST') {
    return JSON.stringify(req.body);
  } 
  })
morgan.token('custom',(tokens, req, res)=> {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['res-time'](req, res), 'ms',
    tokens.post(tokens, req, res),
  ].join(' ');
})
app.use(morgan('custom'));

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error)
}

app.use(errorHandler)

app.get(('/api'), (req, res) => {
  res.send('<h2>PHONEBOOK API</h2>');
})
const getDateTime = () => {
  var currentdate = new Date()
  const day = currentdate.toLocaleDateString('en-US', { weekday: 'long' });
  const month = currentdate.toLocaleDateString('en-US', { month: 'long' });
  const dayOfMonth = currentdate.getDate();
  const year = currentdate.getFullYear();
  const timeOptions = { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    timeZoneName: 'short' 
  };
  const timeWithTimeZone = currentdate.toLocaleTimeString('en-US', timeOptions)    ;               
  return `${day} ${month} ${dayOfMonth} ${year}, ${timeWithTimeZone}`;
}
app.get(('/info'), (req, res, next) => {
  Person.find({}).then(result => {
    const totalPersons = result.length
    const dateTime = getDateTime()
    const msgSend = `<p>Phonebook has info for ${totalPersons} people</p> 
    <p>${dateTime}</p>`
    res.send(msgSend)
  }).catch(error => next(error));
  
});

app.get(('/api/persons'), (req, res, next) => {
  Person.find({}).then(result => {
    res.json(result)
  }).catch(error => next(error))
});

app.get(('/api/persons/:id'), (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  }).catch(error => next(error));
});
app.delete(('/api/persons/:id'), (req, res, next) => {
  Person.findByIdAndDelete(req.params.id).then(() => {
    res.status(204).end();
  }).catch(error => next(error))
});



app.post(('/api/persons'), (req, res, next) => {
  const body = req.body;
  if (!body.name || !body.number) {
    res.statusCode = 400
    res.json({ error: 'The name or number is missing' });
  } 

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  
  person.save().then(savedPerson => {
    res.statusCode = 201
    res.json(savedPerson)
  }).catch(error => next(error));
});

app.put(('/api/persons/:id'), (req, res, next) => {
  const {name, number} = req.body
  Person.findByIdAndUpdate(req.params.id, 
    { name, number}, 
    { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
};
app.use(unknownEndpoint);

app.listen(PORT, () => {
  console.log(`SERVER IS LISTENING ON PORT ${PORT}`)
});

