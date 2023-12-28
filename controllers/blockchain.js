const SHA256 = require("crypto-js/sha256");
const { parse } = require("dotenv");
const { request } = require("express");
const xml = require('xml');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const {Blockchain, Transaction}= require('../src/blockchain');

const RecycleCoin = new Blockchain();

const postCreateKeys=(req, res, next) => {
  try {
      const key = ec.genKeyPair();
      const publicKey = key.getPublic('hex');
      const privateKey = key.getPrivate('hex');
      var response = {
          status: 200,
          message: 'Success',
          data: {
              publicKey: publicKey,
              privateKey: privateKey,
          }
      };
      res.status(200).json(response);
  }catch (error) {
    const errorResponse = {
        status: 200,
        message: error,
        data: {
            result: 0
        }
    };

    res.status(200).json(errorResponse);
}
  
};

const postwalletBalance = (req, res, next) => {
    var WalletAddress = req.body.walletAddress;
    var balanceAmount = RecycleCoin.getBalanceOfAddress(WalletAddress);
    var response = {
        status: 200,
        message: 'Success',
        data: {amount: balanceAmount}
    };
    console.log(WalletAddress+":"+balanceAmount);

    res.status(200).json(response);
};

const postAddpendingTransactions = (req, res, next) => {
    try {
        const toAddress = req.body.toAddress;
        const fromAddressKey = ec.keyFromPrivate(req.body.fromAddress);
        const fromAddressWalletAddress = fromAddressKey.getPublic('hex');
        let amount = parseFloat(req.body.amount || 0);
        if (req.body.Convert === "yes") {
            amount = amount / 100000000;
    }
        
        const tx = new Transaction(fromAddressWalletAddress, toAddress, amount);
        tx.signTransaction(fromAddressKey);
        var isAdded = RecycleCoin.addTransaction(tx);
        var jsonResponse ={}
        if(isAdded==true){
            jsonResponse= {
                status: 200,
                message: "Success",
                data: {
                    result: 1
                }
            };
        }
        else if(isAdded==false){
             jsonResponse = {
                status: 200,
                message: "insufficient balance",
                data: {
                    result: 0
                }
            };
        }
        else {
             jsonResponse = {
                status: 200,
                message: "Error",
                data: {
                    result: 0
                }
            };
        }
        res.status(200).json(jsonResponse);
       
    } catch (error) {
        const errorResponse = {
            status: 200,
            message: error,
            data: {
                result: 0
            }
        };

        res.status(200).json(errorResponse);
    }
};


const getAllBlockchain=(req,res)=>{ 
    try {
        const RecycleCoin = new Blockchain();
        res.status(200).json(RecycleCoin);
    }catch (error) {
      const errorResponse = {
          status: 500,
          message: "Blockchain data could not be accessed"
      };
      res.status(500).json(errorResponse);
  }

}

module.exports={
    postCreateKeys,postwalletBalance,getAllBlockchain,postAddpendingTransactions
}