const express=require('express');
const {postwalletBalance,gallblock,gwalletBalance,getCreateSha256,gaddpendingTransactions,}=require("../controllers/blockchain")
const router=express.Router();
router.post("/",(req,res,next)=>
{  
            res.send("mine page");
});
router.post("/WalletBalance",postwalletBalance)
router.get("/CreateSha256/",getCreateSha256)
router.get("/WalletBalance/",gwalletBalance)
router.get("/addTransactions/",gaddpendingTransactions)
router.get("/getallblockchain/",gallblock)

module.exports=router;
