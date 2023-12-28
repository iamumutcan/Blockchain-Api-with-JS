const SHA256 = require("crypto-js/sha256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const fs = require('fs');
const { getFirstMatchingFileData,writeToMultipleFiles } =require('../src/fileOperations');
const chainFileList = [
    "src/host1/blockchaindata.json",
    "src/host2/blockchaindata.json",
    "src/host3/blockchaindata.json",
    "src/host4/blockchaindata.json",
    "src/host5/blockchaindata.json"
  ];
  
  const pendingTransactionsFileList = [
    "src/host1/pendingTransactionsData.json",
    "src/host2/pendingTransactionsData.json",
    "src/host3/pendingTransactionsData.json",
    "src/host4/pendingTransactionsData.json",
    "src/host5/pendingTransactionsData.json"
  ];
  
class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
    }

    /**
     * Hashes all the fields of the transaction and returns it as a string.
     */
    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount + this.timestamp)
                    .toString();
    }

    /**
     * Signs a transaction with the given signingKey (which is an Elliptic keypair
     * object that contains a private key). The signature is then stored inside the
     * transaction object and later stored on the blockchain.
     */
    signTransaction(signingKey){
        // You can only send a transaction from the wallet that is linked to your
        // key. So here we check if the fromAddress matches your publicKey
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign transactions for other wallets!');
        }

        // Calculate the hash of this transaction, sign it with the key
        // and store it inside the transaction obect
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');

        this.signature = sig.toDER('hex');
    }

    /**
     * Checks if the signature is valid (transaction has not been tampered with).
     * It uses the fromAddress as the public key.
     */
    isValid(){

        // If the transaction doesn't have a from address we assume it's a
        // mining reward and that it's valid. You could verify this in a
        // different way (special field for instance)
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("BLOCK MINED: " + this.hash);
    }

    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }
}


class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 48;
        this.commissionFee = 4.0105;
        this.systemWalletAddress="04a4b007d98cc8e8bde1f7bf4c36b98a63f09301fe151e814327595c0663532bb39960521309271608f3cc5d318d699df4cffbf7a04a7b7d434426ed9d61cf4b84";
        try {
            const chainData = getFirstMatchingFileData(chainFileList);
            this.chain = JSON.parse(chainData);
            const pendingTransactionsData = getFirstMatchingFileData(pendingTransactionsFileList);

           this.pendingTransactions = JSON.parse(pendingTransactionsData);
        } catch (err) {
            // If file not found or error occurs, create an empty blockchain
            console.log(err)
            this.chain = [this.createGenesisBlock()];
            this.saveChain(); // Save the created blockchain
        }
    }

    createGenesisBlock() {
        return new Block(Date.parse("2017-01-01"), [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);
        const commissionTx = new Transaction(miningRewardAddress, this.systemWalletAddress, this.commissionFee);
        this.pendingTransactions.push(commissionTx);

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);
        console.log('Block successfully mined!');
        this.chain.push(block);
        this.pendingTransactions = [];
        this.saveChain(); // Save blockchain when mining is done

    }

    addTransaction(transaction){

        // Prevent people from adding a fake mining reward transaction
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from and to address');
        }

        // Verify the transactiion
        if(!transaction.isValid()){
            throw new Error('Cannot add invalid transaction to chain');
        }
        // Add if user has enough coins
        if(this.getBalanceOfAddress(transaction.fromAddress)>transaction.amount){
            this.pendingTransactions.push(transaction);
            this.saveChain(); //Save blockchain when mining is done
            return true;
        }
        else{
            console.log("insufficient balance");
           return false;
        }

      

    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {

        // Check if the Genesis block hasn't been tampered with by comparing
        // the output of createGenesisBlock with the first block on our chain
        const realGenesis = JSON.stringify(this.createGenesisBlock());

        if(realGenesis !== JSON.stringify(this.chain[0])){
            return false;
        }

        // Check the remaining blocks on the chain to see if there hashes and
        // signatures are correct
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
        
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
    saveChain() {
        const data = JSON.stringify(this.chain);
        writeToMultipleFiles(chainFileList, data);
        const pendingTransactionsData = JSON.stringify(this.pendingTransactions);
        writeToMultipleFiles(pendingTransactionsFileList, pendingTransactionsData);

    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;