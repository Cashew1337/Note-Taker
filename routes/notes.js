const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid')
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils.js');

notes.get('/', (req, res) => {
    readFromFile('../db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.get('/:id', (req, res) => {
    const id = req.params.id;
    readFromFile('../db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const results = json.filter((note) => note.id === id);
            return results.length > 0
                ? res.json(results)
                : res.json('No note with requested ID found');
        });
});

notes.post('/', (req, res) => {
    console.log(req.body);

    const { title, text, id } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        readAndAppend(newNote, '../db/db.json');
        res.json(`Note added`);
    } else {
        res.errored('Issue adding note');
    }
});

notes.delete('/:id', (req, res) => {
    const id = req.params.noteId;
    readFromFile('../db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const results = json.filter((note) => note.id !== id);

            writeToFile('../db/db.json', results);

            res.json(`Note ${id} has been deleted`);
        });
});

module.exports = notes