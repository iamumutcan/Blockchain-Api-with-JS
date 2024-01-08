const { Blockchain } = require('./src/blockchain');
const readline = require('readline');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function startMining(userPrivateKey) {
  const userKey = ec.keyFromPrivate(userPrivateKey);
  const RecycleCoin = new Blockchain();

  const userWalletAddress = userKey.getPublic('hex');
  RecycleCoin.minePendingTransactions(userPrivateKey);

  rl.question('Continue mining? (y/n): ', function(answer) {
    if (answer.toLowerCase() === 'y') {
      startMining(userPrivateKey); // Devam et
    } else {
      console.log('Mining operation completed.');
      rl.close();
    }
  });
}

rl.question('Enter your wallet address to mine: ', function(userPrivateKey) {
  startMining(userPrivateKey);
});

// Gerekirse close olayını dinleyebilirsin
rl.on('close', function() {
  console.log('Mining operation completed.');
});
