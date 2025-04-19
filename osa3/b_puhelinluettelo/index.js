import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import morgan from "morgan";
import cors from "cors";

const app = express();
const port = 3001

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "db.json");

app.use(express.json());

app.get("/api/persons", (req, res) => {
    res.sendFile(dbPath);
});
app.use(morgan("tiny"));

app.get("/info", (req, res) => {
    fs.readFile(dbPath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading db file:", err);
            res.status(500).send("Internal server error");
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            const count = jsonData.persons.length;
            const currentDate = new Date();

            res.send(`
                <p>Phonebook has info for ${count} people</p>
                <p>${currentDate}</p>
            `);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.status(500).send("Internal server error");
        }
    });

});

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;

    fs.readFile(dbPath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading database:", err);
            res.status(500).send("Internal server error");
            return;
        }

        try {
            const persons = JSON.parse(data).persons;
            const person = persons.find(p => p.id === id);

            if (person) {
                res.json(person);
            } else {
                res.status(404).send({ error: "Person not found" });
            }
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.status(500).send("Internal server error");
        }
    });
});

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;

    fs.readFile(dbPath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading database:", err);
            res.status(500).send("Internal server error");
            return;
        }

        try {
            const dbData = JSON.parse(data);
            const persons = dbData.persons;

            const index = persons.findIndex(person => person.id === id);

            if (index === -1) {
                return res.status(404).send({ error: "Person not found" });
            }

            // Poista henkilö
            persons.splice(index, 1);

            // Tallenna päivitetty tietokanta
            const updatedData = JSON.stringify({ persons }, null, 2);

            fs.writeFile(dbPath, updatedData, "utf8", (writeErr) => {
                if (writeErr) {
                    console.error("Error writing to database:", writeErr);
                    res.status(500).send("Internal server error");
                    return;
                }

                res.status(204).end(); // Ei sisältöä
            });

        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.status(500).send("Internal server error");
        }
    });
});

app.post("/api/persons", (req, res) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({ error: "name and number are required" });
    }

    fs.readFile(dbPath, "utf8", (err, data) => {
        if (err) return res.status(500).send("Internal server error");

        try {
            const dbData = JSON.parse(data);
            const persons = dbData.persons;

            const nameExists = persons.some(person => person.name === name);
            if (nameExists) {
                return res.status(400).json({ error: "name must be unique" });
            }

            const newPerson = {
                id: Math.floor(Math.random() * 10_000_000).toString(),
                name,
                number
            };

            persons.push(newPerson);

            const updatedData = JSON.stringify({ persons }, null, 2);

            fs.writeFile(dbPath, updatedData, "utf8", (writeErr) => {
                if (writeErr) return res.status(500).send("Internal server error");

                res.status(201).json(newPerson);
            });

        } catch (parseError) {
            res.status(500).send("Internal server error");
        }
    });
});


app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;

    fs.readFile(dbPath, "utf8", (err, data) => {
        if (err) return res.status(500).send("Internal server error");

        const dbData = JSON.parse(data);
        const persons = dbData.persons;

        const index = persons.findIndex(person => person.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Person not found" });
        }

        persons.splice(index, 1);

        const updatedData = JSON.stringify({ persons }, null, 2);

        fs.writeFile(dbPath, updatedData, "utf8", (writeErr) => {
            if (writeErr) return res.status(500).send("Internal server error");

            res.status(204).end();
        });
    });
});


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// localhost:3001/api/persons
