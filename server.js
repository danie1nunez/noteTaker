const express = require('express');
const path= require('path');
const ShortUniqueId = require('short-unique-id');
const app= express();
const fs= require('fs');
const { randomUUID } = new ShortUniqueId({ length: 10 });
const PORT= process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/api/notes', (req,res) =>{
    fs.readFile('./db/db.json', (err, data) =>{
        if (err) {
            console.error(err);
            return res.status(404).json({
                message:'notes not found'
            })
        }
        const notes= JSON.parse(data);
        res.status(200).json(notes);
    });
})

app.post('/api/notes', (req,res) =>{
    fs.readFile('./db/db.json', (err,data) => {
            if (err) {
                console.error(err);
                return res.status(404).json({
                    message:'notes not found'
                })
            }
            const notes= JSON.parse(data);
            console.log(req.body);
            const newnote= {
                id: randomUUID(),
                ...req.body
            }
            console.log(newnote);
            notes.push(newnote);
            fs.writeFile('./db/db.json', JSON.stringify(notes), (err) =>{
                if (err) {
                    console.error(err);
                }
                res.status(200).json(notes);
            })

    })
})

app.delete('/api/notes/:id', (req,res) =>{
    fs.readFile('./db/db.json', (err,data) => {
        const notes= JSON.parse(data);
        const  filteredNotes= notes.filter((note)=>
            note.id!= req.params.id
        )
        fs.writeFile('./db/db.json', JSON.stringify(filteredNotes), (err) =>{
            if (err) {
                console.error(err);
            }
            res.status(200).json(notes);
        })
    });
})

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}!`);
})
