const express = require("express");

const morgan = require("morgan");

const cors = require("cors");
// custom token
morgan.token("person", (req, res) => {
  const body = req.body;
  // return `{"name": "${body.name}", "Number": "${body.number}" }`;



  // return JSON.stringify(body.name);
  

  return `{"name": ${JSON.stringify(body.name)}, "Number": ${JSON.stringify(body.number)} }`;

})


const app = express();

app.use(express.static('dist'))
app.use(cors());

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :person"));

app.use(express.json());

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("<h2>Hello world</h2>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.send(
    `Phonebook has info for ${persons.length} people. <br> ${new Date()} `
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  const person = persons.find((person) => person.id === id);

  try {
    if (!person) {
      console.log("person not found");
      return res.status(404).json({ message: "person is not found" });
    }

    console.log(person);
    res.status(200).json(person);
    console.log(person);
  } catch (error) {
    console.log("Error fetching data", error.message);
    res.status(500).json("server internal error");
  }
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number is missing" });
  }

  const person = {
    id: Math.floor(Math.random() * 1000),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);

  console.log(persons);
  res.status(204).json(persons).end();
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

// saintlyoracleproduction