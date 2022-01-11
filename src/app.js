const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// fetch entire blockchain
app.get('/blockchain', (request, response) => {
    response.send();
});

//create a new transaction
app.get('/transaction', (request, response) => {
    response.send();
});

//mine a new block
app.get('/mine', (request, response) => {
    response.send();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
