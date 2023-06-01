const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Homepage' });
});

const question = require('./routes/question')
app.use('/question', question)

const upload = require('./routes/upload')
app.use('/upload', upload)

app.get('/images/:id', (req, res) => {
    const { id } = req.params;
    // Read the image file
    const imagePath = `./images/${id}`; // Replace with the actual image file path
    // res.sendFile(imagePath);
    res.sendFile(imagePath, { root: __dirname });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// FOR PRODUCTION
// app.listen(process.env.PORT);


