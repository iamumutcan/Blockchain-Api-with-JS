const {Blockchain, Transaction}= require('./blockchain');
const readline = require('readline');
const RecycleCoin = new Blockchain();
RecycleCoin.pullChain();
const rl = readline.createInterface(process.stdin, process.stdout);
// question metodu ile yaş hesaplama


rl.question('Mining Yapmak için SHA256 adresinizi giriniz : ', function(userShaAdress) {
 
    RecycleCoin.minePendingTransactions(userShaAdress);

    rl.close();
});