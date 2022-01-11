const Blockchain = require('../src/blockchain');
const chai = require('chai');

it('Test Case to Bitcoin - createNewBlock method', function () {
    const bitcoin = new Blockchain();
    console.log(bitcoin);
    //Mining a new block
    bitcoin.createNewBlock(1111, '', 'FSD5246FA');
    bitcoin.createNewBlock(1112, 'FSD5246FA', '65GD4S6GF4S6');
    bitcoin.createNewBlock(1113, '65GD4S6GF4S6', 'VASDG45A64G');
    chai.expect(bitcoin.chain.length).to.deep.equal(4);
});

it('Test Case to Bitcoin - createNewTransaction method', function () {
    const response = [
        {
            amount: 100,
            sender: 'ALEXLKFS65F4S6',
            recipient: 'JENN987FDS45F96S',
        },
    ];
    const bitcoin = new Blockchain();
    bitcoin.createNewBlock(1112, 'FSD5246FA', '65GD4S6GF4S6');
    bitcoin.createNewTransaction(100, 'ALEXLKFS65F4S6', 'JENN987FDS45F96S');
    chai.expect(bitcoin.pendingTransactions).to.deep.equal(response);
});

it('Test Case to Bitcoin - createNewTransaction method 2', function () {
    const bitcoin = new Blockchain();
    const response = [
        {
            amount: 100,
            sender: 'ALEXLKFS65F4S6',
            recipient: 'JENN987FDS45F96S',
        },
    ];
    bitcoin.createNewBlock(1112, 'FSD5246FA', '65GD4S6GF4S6');
    bitcoin.createNewTransaction(100, 'ALEXLKFS65F4S6', 'JENN987FDS45F96S');
    bitcoin.createNewBlock(1113, '65GD4S6GF4S6', 'VASDG45A64G');
    chai.expect(bitcoin.chain[2].transactions).to.deep.equal(response);
});

it('Test Case to Bitcoin - createNewTransaction method 3', function () {
    const bitcoin = new Blockchain();
    const response = [
        {
            amount: 100,
            sender: 'ALEXLKFS65F4S6',
            recipient: 'JENN987FDS45F96S',
        },
        {
            amount: 50,
            sender: 'ALEXLKFS65F4S6',
            recipient: 'JENN987FDS45F96S',
        },
        {
            amount: 400,
            sender: 'ALEXLKFS65F4S6',
            recipient: 'JENN987FDS45F96S',
        },
    ];
    bitcoin.createNewBlock(1112, 'FSD5246FA', '65GD4S6GF4S6');
    bitcoin.createNewTransaction(100, 'ALEXLKFS65F4S6', 'JENN987FDS45F96S');
    bitcoin.createNewBlock(1113, '65GD4S6GF4S6', 'VASDG45A64G');
    bitcoin.createNewTransaction(100, 'ALEXLKFS65F4S6', 'JENN987FDS45F96S');
    bitcoin.createNewTransaction(50, 'ALEXLKFS65F4S6', 'JENN987FDS45F96S');
    bitcoin.createNewTransaction(400, 'ALEXLKFS65F4S6', 'JENN987FDS45F96S');
    bitcoin.createNewBlock(1114, 'VASDG45A64G', '5G4A5F6A4F6A4');
    chai.expect(bitcoin.chain[3].transactions).to.deep.equal(response);
});
it('Test Case to Bitcoin - hashBlock method', function () {
    const bitcoin = new Blockchain();
    const previousBlockHash = '98FA7S9FD8A98';
    const currentBlockData = [
        {
            amount: 100,
            sender: 'ALEXLKFS65F4S6',
            recipient: 'JENN987FDS45F96S',
        },
    ];
    const nonce = 111;
    const hash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    chai.expect(hash).not.null;
    chai.expect(hash).to.deep.equal(
        '1a4ad61506e62187d317a01b2bbc3c9db1a569cf747d5c560299ee00a3e82024'
    );
});
it('Test Case to Bitcoin - proofOfWork method', function () {
    const bitcoin = new Blockchain();
    const previousBlockHash = '98FA7S9FD8A98';
    const currentBlockData = [
        {
            amount: 100,
            sender: 'ALEXLKFS65F4S6',
            recipient: 'JENN987FDS45F96S',
        },
    ];
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    //nonce = 13005
    chai.expect(nonce).to.deep.equal(13005);
    const hash = bitcoin.hashBlock(previousBlockHash, currentBlockData, 13005);
    chai.expect(hash).not.null;
    chai.expect(hash).to.deep.equal(
        '000037d24659a43466bfbccf34b6590f9b75a665926f6e69352df2a24c2cc2fd'
    );
});
