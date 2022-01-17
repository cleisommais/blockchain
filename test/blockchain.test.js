const Blockchain = require('../src/blockchain');
const blockChain01 = require('./blockchain01.json');
const chai = require('chai');

it('Test Case to Bitcoin - createNewBlock method', function () {
    const bitcoin = new Blockchain();
    //Mining a new block
    bitcoin.createNewBlock(1111, '', 'FSD5246FA');
    bitcoin.createNewBlock(1112, 'FSD5246FA', '65GD4S6GF4S6');
    bitcoin.createNewBlock(1113, '65GD4S6GF4S6', 'VASDG45A64G');
    chai.expect(bitcoin.chain.length).to.deep.equal(4);
});

it('Test Case to Bitcoin - createNewTransaction method', function () {
    const bitcoin = new Blockchain();
    bitcoin.createNewBlock(1112, 'FSD5246FA', '65GD4S6GF4S6');
    bitcoin.createNewTransaction(100, 'ALEXLKFS65F4S6', 'JENN987FDS45F96S');
    chai.expect(bitcoin.chain[1].hash).to.deep.equal('65GD4S6GF4S6');
    chai.expect(bitcoin.chain[1].previousBlockHash).to.deep.equal('FSD5246FA');
    chai.expect(bitcoin.pendingTransactions).to.deep.equal([]);
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
    bitcoin.createNewBlock(1113, '65GD4S6GF4S6', 'VASDG45A64G');
    chai.expect(bitcoin.chain[2].hash).to.deep.equal('VASDG45A64G');
    chai.expect(bitcoin.chain[2].previousBlockHash).to.deep.equal(
        '65GD4S6GF4S6'
    );
    chai.expect(bitcoin.pendingTransactions).to.deep.equal([]);
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

it('Test Case to Bitcoin - isChainValid method must be TRUE', function () {
    const bitcoin = new Blockchain();
    const isChainValid = bitcoin.isChainValid(blockChain01.chain);
    chai.expect(isChainValid).to.deep.equal(true);
});

it('Test Case to Bitcoin - isChainValid method must be FALSE the hash is wrong', function () {
    const bitcoin = new Blockchain();
    blockChain01.chain[2].hash =
        '0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100';
    const isChainValid = bitcoin.isChainValid(blockChain01.chain);
    chai.expect(isChainValid).to.deep.equal(false);
});

it('Test Case to Bitcoin - isChainValid method must be FALSE the previousBlockHash is wrong', function () {
    const bitcoin = new Blockchain();
    blockChain01.chain[2].previousBlockHash =
        '0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100';
    const isChainValid = bitcoin.isChainValid(blockChain01.chain);
    chai.expect(isChainValid).to.deep.equal(false);
});

it('Test Case to Bitcoin - isChainValid method must be FALSE the hash with wrong pattern', function () {
    const bitcoin = new Blockchain();
    blockChain01.chain[2].hash =
        'b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100';
    const isChainValid = bitcoin.isChainValid(blockChain01.chain);
    chai.expect(isChainValid).to.deep.equal(false);
});
