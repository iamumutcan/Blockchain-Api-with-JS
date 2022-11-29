const {Blockchain, Transaction}= require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const myKey = ec.keyFromPrivate('06094735c98150d6d52c606f3bfca6094c40937094b07733d5a338ed8c4fbefd');
const myWalletAddress = myKey.getPublic('hex');


const RecycleCoin = new Blockchain();
const tx1 = new Transaction(myWalletAddress, 'address2', 100);
tx1.signTransaction(myKey);
RecycleCoin.addTransaction(tx1);

const tx2 = new Transaction(myWalletAddress, 'address1', 50);
tx2.signTransaction(myKey);
RecycleCoin.addTransaction(tx2);

console.log('\nStarting the miner...');
RecycleCoin.minePendingTransactions(myWalletAddress);
console.log('\nBalance of xavier is', RecycleCoin.getBalanceOfAddress(myWalletAddress));
RecycleCoin.minePendingTransactions(myWalletAddress);
console.log('\nBalance of xavier is', RecycleCoin.getBalanceOfAddress(myWalletAddress));
RecycleCoin.minePendingTransactions(myWalletAddress);
console.log('\nBalance of xavier is', RecycleCoin.getBalanceOfAddress(myWalletAddress));
console.log();
console.log('Blockchain valid?', RecycleCoin.isChainValid() ? 'Yes' : 'No');

console.log(JSON.stringify(RecycleCoin, null, 4));



