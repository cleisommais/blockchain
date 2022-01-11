const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const nodeAddress = uuid.v1().split('-').join('');
const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// fetch entire blockchain
app.get('/blockchain', (request, response) => {
    response.send(bitcoin);
});

//create a new transaction
app.post('/transaction', (request, response) => {
    const lastBlock = bitcoin.createNewTransaction(
        request.body.amount,
        request.body.sender,
        request.body.recipient
    );
    response.json({
        message: `Transaction will be added in block ${lastBlock}`,
    });
});

//mine a new block
app.get('/mine', (request, response) => {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1,
    };
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(
        previousBlockHash,
        currentBlockData,
        nonce
    );
    //reward for who is mining
    bitcoin.createNewTransaction(12.5, '00', nodeAddress);
    const newBlock = bitcoin.createNewBlock(
        nonce,
        previousBlockHash,
        blockHash
    );
    response.send(newBlock);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
