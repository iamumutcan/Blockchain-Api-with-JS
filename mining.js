const { Blockchain } = require('./src/blockchain');
const readline = require('readline');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const RecycleCoin = new Blockchain();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your wallet address to mine: ', function(userPrivateKey) {
  const userKey = ec.keyFromPrivate(userPrivateKey);

// From that we can calculate your public key (which doubles as your wallet address)
 const userWalletAddress = userKey.getPublic('hex');
  RecycleCoin.minePendingTransactions(userPrivateKey);
  rl.close();
});

// You can listen for the close event if needed
rl.on('close', function() {
  console.log('Mining operation completed.');
});
