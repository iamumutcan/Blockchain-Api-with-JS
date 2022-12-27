const express = require("express");
const dotenv=require("dotenv");
const bodyParser = require('body-parser');
const routers=require("./routers");
dotenv.config({
    path:"./config/env/config.env"
});
const app = express();
app.use(express.json());
const PORT = process.env.PORT;

app.use("/api",routers);
app.listen(PORT, () => {
    console.log("server started port:" + PORT+ " : " +process.env.NODE_ENV);
});
