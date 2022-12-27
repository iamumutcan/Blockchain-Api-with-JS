const SHA256 = require("crypto-js/sha256");
const fs = require('fs');
const blockchainFilePathJson = ('./blockchaindata.json');
const denemeyolu=('./umut.json');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount)
            .toString();
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


}


class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
        this.maxSupply=100000000;
    }
    createSha(xdata){
        return SHA256(xdata).toString();
    }
    pullChain(){
        const pullBlochchain = new Blockchain();
        pullBlochchain.chain=[];
        try {
            var jsonData=fs.readFileSync(blockchainFilePathJson, 'utf-8');
            var blockchainData = JSON.parse(jsonData);
            for (var i = 0; i < blockchainData.chain.length; i++) {
                var block = new Block(blockchainData.chain[i].timestamp, blockchainData.chain[i].transactions, blockchainData.chain[i].previousHash);
                pullBlochchain.chain.push(block);
            }
            this.chain=pullBlochchain.chain;
            for (var i = 0; i < blockchainData.pendingTransactions.length; i++) {
                var transactionNew = new Transaction(blockchainData.pendingTransactions[i].fromAddress, blockchainData.pendingTransactions[i].toAddress,blockchainData.pendingTransactions[i].amount,);
                pullBlochchain.addTransaction(transactionNew);
            }
            this.pendingTransactions=pullBlochchain.pendingTransactions;
            return pullBlochchain;
        } 
        catch (error) {
            console.log(error)
            return ;
        }

    }
    createGenesisBlock() {
        return new Block(Date.parse("2017-01-01"), [], "0");
    }

    getLatestBlockHash() {
        try {
            // blockchain'in uzunluğunu geri dönderir
            var jsonData = fs.readFileSync(blockchainFilePathJson, 'utf-8');
            var blockchainData = JSON.parse(jsonData);
            var lastBlockHash = blockchainData.chain[blockchainData.chain.length - 1].hash
            return lastBlockHash;
        }
        catch (error) {
            console.log(error);
            return;
        }
        // return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);
    
        try {
            var jsonData = fs.readFileSync(blockchainFilePathJson, 'utf-8');
            var blockchainData = JSON.parse(jsonData);
            if(blockchainData.chain.length*100<this.maxSupply){
                let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlockHash());
            block.mineBlock(this.difficulty);
            
            blockchainData.chain.push(block);
            try{
                
                blockchainData.pendingTransactions = [];
                fs.writeFileSync(blockchainFilePathJson, JSON.stringify(blockchainData, null, 4));
              }
              catch (error) {
                console.log(error);
                return;
              }
            }
            else{
                console.log("maksimum arza ulaşıldı")
                return;
            }
            
           
          }
          catch (error) {
            console.log(error);
            return;
          }
          console.log('Block successfully mined!');
        // dosyadaki son block dan sonraya yeni blok eklenecek

      //  this.chain.push(block);
      this.pendingTransactions=[];
     
    }

    addpendingTransactions(xchain,xtx){
      


          try {
            var jsonData = fs.readFileSync(blockchainFilePathJson, 'utf-8');
            var blockchainData = JSON.parse(jsonData);
            blockchainData.pendingTransactions=xchain.pendingTransactions;
            blockchainData.pendingTransactions.push(xtx);
            console.log(blockchainData.pendingTransactions)
            try{
                
                fs.writeFileSync(blockchainFilePathJson, JSON.stringify(blockchainData, null, 4));
              }
              catch (error) {
                console.log(error);
                return;
              }
          
            
           
          }
          catch (error) {
            console.log(error);
            return;
          }
    }

    addTransaction(transaction) {
        // Verify the transactiion
        
        this.pendingTransactions.push(transaction);
    }
    getallbc(){
        var jsonData=fs.readFileSync(blockchainFilePathJson, 'utf-8');
        var blockchainData = JSON.parse(jsonData);
       return JSON.stringify(blockchainData, null, 4);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
    
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        try {
            // blockchain'in uzunluğunu geri dönderir
            var jsonData = fs.readFileSync(blockchainFilePathJson, 'utf-8');
            var blockchainData = JSON.parse(jsonData);
            for (var i = 0; i < blockchainData.chain.length - 1; i++) {
                if(blockchainData.chain[i].hash!==blockchainData.chain[i+1].previousHash)
                {
                    return false;
                }
            }
        }
        catch (error) {
            console.log(error);
            return;
        }

        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;