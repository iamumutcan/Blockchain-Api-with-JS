const SHA256 = require("crypto-js/sha256");
const { parse } = require("dotenv");
const { request } = require("express");
const xml = require('xml');
const {Blockchain, Transaction}= require('../blockchain');

const RecycleCoin = new Blockchain();
RecycleCoin.pullChain();

var toAddress='cf3d4084ec42b3bffa073de2aa5edd9f67f7983a3f066e0e8e06397e559ce24d'; // alıcı adresini buraya eşitlenecek
var fromAddress='2fc66b40f1d784c43f7b63b3be0838d0d8f86c08d9b13e62ed34043ee62b8e10'; // gönderici adresini buraya eşitlenecek




const postwalletBalance=(req,res,next)=>{ 
    // Gelen dosyanın toAddress değerinin cüzdan bakiyesini dönderir
    var getBlockData =(req.body);
    var getBlockDatas=(req)
   console.log(getBlockData);
   var balanceAmount={
    amount : RecycleCoin.getBalanceOfAddress(getBlockData.getWalletBalance)
};
    res.send(JSON.stringify(balanceAmount));
}
const gwalletBalance=(req,res)=>{ 
    // Gelen dosyanın toAddress değerinin cüzdan bakiyesini dönderir
    var shaadresi=req.query.sha

   console.log(RecycleCoin.getBalanceOfAddress(shaadresi))
    var balanceAmount={
        amount : RecycleCoin.getBalanceOfAddress(shaadresi)
    };
    var xml= `<?xml version="1.0" encoding="UTF-8"?> <data>`+ 
    `<sha>`+shaadresi+ `</sha> ` + 
    `<amount>`+RecycleCoin.getBalanceOfAddress(shaadresi)+ `</amount> ` + 
    
    `</data>`;
   res.header('Content-Type', 'application/xml')
   res.status(200).send(xml);

}


const getCreateSha256=(req,res)=>{ 
    // Sha256 adresi oluşturur
    var convertsha=req.query.convertsha;
    console.log("get"+convertsha)
    var xml= `<?xml version="1.0" encoding="UTF-8"?> <data>`+ 
    `<sha>`+SHA256(convertsha).toString()+ `</sha> ` +     
    `</data>`;
   res.header('Content-Type', 'application/xml')
   res.status(200).send(xml);
}
const gaddpendingTransactions=(req,res)=>{ 

    try{
        var fromAddress=req.query.fromAddress;
        var toAddress=req.query.toAddress;
        var amount=parseFloat( req.query.amount);
        try{
            if(req.query.Convert==="yes")
            {
                var amount=amount/100000000;
            }
        }
        catch{
            
        }
       
        var tx1 = new Transaction(fromAddress, toAddress,amount);
        RecycleCoin.addpendingTransactions(RecycleCoin,tx1)
        var xml= `<?xml version="1.0" encoding="UTF-8"?> <data>`+ 
        `<result>`+1+ `</result> ` +         
        `</data>`;
       res.header('Content-Type', 'application/xml')
       res.status(200).send(xml);
    }
    catch{
        var xml= `<?xml version="1.0" encoding="UTF-8"?> <data>`+ 
        `<result>`+0+ `</result> ` +         
        `</data>`;
       res.header('Content-Type', 'application/xml')
       res.status(200).send(xml);
    }
}

const postCreateSha256=(req,res,next)=>{ 
    // Sha256 adresi oluşturur
    var getBlockData =(req.body);
    var getBlockDatas=(req)
   console.log(getBlockData);
   var newSha256={
    sha256 : SHA256(getBlockData.sha).toString()
};
   res.send(JSON.stringify(newSha256));
}

const gallblock=(req,res)=>{ 
    try{
        var xml= `<?xml version="1.0" encoding="UTF-8"?> <data>`+ 
        RecycleCoin.getallbc() +    
        `</data>`;
       res.header('Content-Type', 'application/xml')
       res.status(200).send(xml);
    }
    catch{
        var xml= `<?xml version="1.0" encoding="UTF-8"?> <data>`+ 
        "bulunamadı" +    
        `</data>`;
       res.header('Content-Type', 'application/xml')
       res.status(200).send(xml);
    }    
   

}

module.exports={
    postwalletBalance,postCreateSha256,gwalletBalance,gaddpendingTransactions,getCreateSha256,gallblock
}