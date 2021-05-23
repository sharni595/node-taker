const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


app.use(express.static('public'));

app.use(express.urlencoded({ extended: true}));

app.use(express.json());

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if(err){
            res.status(500).json(err);
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if(err){
            res.status(500).json(err);
        } else {
            const oldNotes = JSON.parse(data);
            req.body.id = uuidv4();
            const newNotes = [req.body, ...oldNotes];
            fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(newNotes), (err) => {
                if(err) {
                    res.status(500).json(err);
                } else {
                    res.json(newNotes);
                }
            })
        }
    });
});

//read the file
//filter the array

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if(err){
            res.status(500).json(err);
        } else {
            const oldNotes = JSON.parse(data);
            const newNotes = oldNotes.filter((note) => {
                return note.id != id;
            });
            fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(newNotes), (err) => {
                if(err) {
                    res.status(500).json(err);
                } else {
                    res.json(newNotes);
                }
            });
        
            
        }
    });
})

app.listen(PORT, () => {
    console.log('cool');
})