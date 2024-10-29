import express from 'express';
import DB from './DB.js';
import cors from 'cors';

const app = express();
app.use(cors('*'));
const port = process.env.PORT || 3000;
app.use(express.json());


const generateUniqueID = () => {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}
 

app.get('/', (req, res) => {
  res.json(DB);
});

app.get('/:id', (req, res) => {
    const card = DB.find(p => p.id == req.params.id);
    if (!card) return res.status(404).send('card not found');
    res.status(200).json(card);
});

app.post('/', (req, res) => {
    const card = {
        id: generateUniqueID(),
        text: req.body.text,
        backgroundColor: req.body.backgroundColor
    };
    DB.push(card);
    res.status(201).json(card);
});


app.patch('/:id', (req, res) => {
    const cardIndex = DB.findIndex(p => p.id == req.params.id);
    if (cardIndex === -1) return res.status(404).send('card not found');
    DB[cardIndex]={
        ...DB[cardIndex],
        ...req.body
    }
    res.status(201).json(DB[cardIndex]);
})


app.delete('/:id', (req, res) => {
    const cardIndex = DB.findIndex(p => p.id == req.params.id);
    let deleted =DB[cardIndex];
    if (cardIndex === -1) return res.status(404).send('card not found');
    DB.splice(cardIndex, 1);
    res.status(200).send(deleted);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});