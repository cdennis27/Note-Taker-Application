const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');

const {
    readFromFile,
    readAndAppend,
    writeToFile,
  } = require('../helpers/fsUtils');


//Get route   
notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });
//Post route
notes.post('/', (req, res) => {
  console.log(req.body);

  const { text, title, } = req.body;

  if (req.body) {
    const note = {
      text,
      title,
      id: uuidv4(),
    };

    readAndAppend(note, './db/db.json');
    res.json(`Notes added successfully 🚀`);
  } else {
    res.error('Error in adding notes');
  }
});

//Delete route
notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteId);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});


//Export notes module

  module.exports = notes;