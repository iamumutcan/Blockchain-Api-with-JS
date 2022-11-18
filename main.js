const SHA256 = require("crypto-js/sha256");

class Block { // block tanımlamaları yapıldı
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.calculateHash();
        this.nonce=0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)+this.nonce).toString();
    }
    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty)!==Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash=this.calculateHash();
        }
        console.log("Block mined:")
    }
}


class Blockchain { 
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty=5;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2017", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) { 
            const currentBlock=this.chain[i];
            const previousBlock=this.chain[i-1];
            if(currentBlock.hash!==currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash!==previousBlock.hash){
                return false;
            }
        }
        return true;

    }
}
let RecycleCoin = new Blockchain();
console.log('Mining Block 1....');
RecycleCoin.addBlock(new Block(1, "10/08/2022", { amount: 4 }));
console.log('Mining Block 2....');
RecycleCoin.addBlock(new Block(2, "10/09/2022", { amount: 9 }));
console.log('Mining Block 3....');
RecycleCoin.addBlock(new Block(3, "10/10/2022", { amount: 40 }));
console.log(JSON.stringify(RecycleCoin, null, 4));
console.log('Is blockchain valid? '+RecycleCoin.isChainValid());
console.log('***************************************');
RecycleCoin.chain[1].data={amount:100};
console.log(JSON.stringify(RecycleCoin, null, 4));
console.log('Is blockchain valid? '+RecycleCoin.isChainValid());
