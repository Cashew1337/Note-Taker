const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid')
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils.js');

notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.get('/:noteId', (req, res) => {
    const noteId = req.params.noteId;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const results = json.filter((note) => note.noteId === noteId);
            return results.length > 0
                ? res.json(results)
                : res.json('No note with requested ID found');
        });
});

notes.post('/', (req, res) => {
    console.log(req.body);

    const { title, text, noteId } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            noteId: uuidv4(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json(`Note added`);
    } else {
        res.errored('Issue adding note');
    }
});

notes.delete('/:noteId', (req, res) => {
    const noteId = req.params.noteId;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const results = json.filter((note) => note.noteId !== noteId);

            writeToFile('./db/db.json', results);

            res.json(`Note ${noteId} has been deleted`);
        });
});

module.exports = notes