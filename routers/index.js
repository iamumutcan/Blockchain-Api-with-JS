const express=require('express');
const mining=require("./blockchain");
const router=express.Router();

router.use("/blockchain",mining);

module.exports=router;