const {Blockchain, Transaction}= require('./blockchain');

var toAddress='cf3d4084ec42b3bffa073de2aa5edd9f67f7983a3f066e0e8e06397e559ce24d'; // alıcı adresini buraya eşitlenecek
var fromAddress='2fc66b40f1d784c43f7b63b3be0838d0d8f86c08d9b13e62ed34043ee62b8e10'; // gönderici adresini buraya eşitlenecek

// transaction işlem başlangıç
const RecycleCoin = new Blockchain();
//RecycleCoin.addpendingTransactions();

RecycleCoin.pullChain();

RecycleCoin.minePendingTransactions(fromAddress);


RecycleCoin.getBalanceOfAddress(fromAddress);
console.log();
console.log('Blockchain valid?', RecycleCoin.isChainValid() ? 'Yes' : 'No');



