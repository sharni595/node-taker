const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.static('public'));
//parse incoming string or array data
app.use(express.urlencoded({ extended: true}));
//parse incoming JSON data
app.use(express.json());
// app.use('/api', apiRoutes);
// app.use('/', htmlRoutes);
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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

app.listen(PORT, () => {
    console.log('cool');
})