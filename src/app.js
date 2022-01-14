const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const requestPromise = require('request-promise');
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
    const newTransaction = request.body.newTransaction;
    const lastBlock =
        bitcoin.addTransactionToPendingTransactions(newTransaction);
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

//register a node and broadcast to the network
app.post('/register-broadcast-node', (request, response) => {
    const newNodeURL = request.body.newNodeURL;
    if (bitcoin.networkNodes.indexOf(newNodeURL) === -1) {
        bitcoin.networkNodes.push(newNodeURL);
    }
    const registerNodesPromises = [];
    bitcoin.networkNodes.forEach((url) => {
        const requestOptions = {
            uri: url + '/register-node',
            method: 'POST',
            body: { newNodeURL },
            json: true,
        };
        registerNodesPromises.push(requestPromise(requestOptions));
    });
    Promise.all(registerNodesPromises)
        .then((data) => {
            const requestBulkOptions = {
                uri: newNodeURL + '/register-nodes-bulk',
                method: 'POST',
                body: {
                    allNetworkNodes: [
                        ...bitcoin.networkNodes,
                        bitcoin.currentNodeURL,
                    ],
                },
                json: true,
            };
            return requestPromise(requestBulkOptions);
        })
        .then((data) => {
            response.json({
                message: 'New node registered with network successfully',
            });
        });
});

//register a node to the network
app.post('/register-node', (request, response) => {
    const newNodeURL = request.body.newNodeURL;
    const nodeNotAlreadyPresent =
        bitcoin.networkNodes.indexOf(newNodeURL) === -1;
    const notCurrentNode = bitcoin.currentNodeURL !== newNodeURL;
    if (nodeNotAlreadyPresent && notCurrentNode) {
        bitcoin.networkNodes.push(newNodeURL);
    }
    response.json({
        message: 'New node registered successfully with node',
    });
});

//register multiple nodes at once to the network
app.post('/register-nodes-bulk', (request, response) => {
    const allNetworkNodes = request.body.allNetworkNodes;
    allNetworkNodes.forEach((url) => {
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(url) === -1;
        const notCurrentNode = bitcoin.currentNodeURL !== url;
        if (nodeNotAlreadyPresent && notCurrentNode) {
            bitcoin.networkNodes.push(url);
        }
    });
    response.json({ message: 'Bulk registration successful' });
});

app.post('/transaction/broadcast', (request, response) => {
    const amount = request.body.amount;
    const sender = request.body.sender;
    const recipient = request.body.recipient;
    const newTransaction = bitcoin.createNewTransaction(
        amount,
        sender,
        recipient
    );
    bitcoin.addTransactionToPendingTransactions(newTransaction);
    const registerPromises = [];
    bitcoin.networkNodes.forEach((url) => {
        const requestOptions = {
            uri: url + '/transaction',
            method: 'POST',
            body: { newTransaction },
            json: true,
        };
        registerPromises.push(requestPromise(requestOptions));
    });
    Promise.all(registerPromises).then((data) => {
        response.json({
            message: 'Transaction created and broadcast successfully',
        });
    });
});

const PORT = process.env.PORT || process.argv[2];

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
