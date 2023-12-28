const {Blockchain, Transaction}= require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Your private key goes here
const myKey = ec.keyFromPrivate('47f12b8ebeed587e856601062d91c453d932ddcbdc694a129614c91ea9ed6733');

// From that we can calculate your public key (which doubles as your wallet address)
const myWalletAddress = myKey.getPublic('hex');

// Create new instance of Blockchain class
const RecycleCoin = new Blockchain();

// Create a transaction & sign it with your key
const tx1 = new Transaction(myWalletAddress, 'umut', 100);
tx1.signTransaction(myKey);
RecycleCoin.addTransaction(tx1);

// Mine block
RecycleCoin.minePendingTransactions(myWalletAddress);

// Create second transaction
const tx2 = new Transaction(myWalletAddress, 'cannn', 5);
tx2.signTransaction(myKey);
RecycleCoin.addTransaction(tx2);
RecycleCoin.addTransaction(tx2);
RecycleCoin.addTransaction(tx2);
RecycleCoin.minePendingTransactions(myWalletAddress);


RecycleCoin.minePendingTransactions(myWalletAddress);
RecycleCoin.addTransaction(tx2);
RecycleCoin.addTransaction(tx1);
RecycleCoin.addTransaction(tx2);
RecycleCoin.addTransaction(tx1);
RecycleCoin.addTransaction(tx2);
RecycleCoin.addTransaction(tx2);
RecycleCoin.addTransaction(tx2);



// Mine block



// Uncomment this line if you want to test tampering with the chain
// RecycleCoin.chain[1].transactions[0].amount = 10;

// Check if the chain is valid
//console.log(JSON.stringify(RecycleCoin,null,4));
console.log('\nBalance of xavier is', RecycleCoin.getBalanceOfAddress("04729aaee497f99ff7ed4da9b7a5c23912da6533783b5cee16839b1e2628bc3413672b407a68c7a15a6fe3ea238b16f26e7a35755e258a0b9fb3d007da7a2e9c94"));
console.log('\nBalance of xavier is', RecycleCoin.getBalanceOfAddress("04c3e79514ed08954ad659d71e636aa32f3602d5cab7768233c92ff54f7f62a1922f267a513e684f750d63407b7e986780063ec6b69eb1240e6246a53bbe3b5828"));

console.log('Blockchain valid?', RecycleCoin.isChainValid() ? 'Yes' : 'No');

