const express=require('express');
const {postwalletBalance,postCreateKeys,postAddpendingTransactions,getAllBlockchain}=require("../controllers/blockchain")
const router=express.Router();
router.post("/",(req,res,next)=>
{  
            res.send("mine page");
});

router.get("/getAllBlockchain/",getAllBlockchain)
router.post("/AddTransactions",postAddpendingTransactions)
router.post("/WalletBalance",postwalletBalance)
router.post("/CreateKeys",postCreateKeys)
module.exports=router;
