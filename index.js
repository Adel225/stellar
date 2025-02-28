import express from "express"
import dotenv from "dotenv"
import connectDB from "./database/connection.js"
import bootstrab from "./src/index.router.js";
import serverless from "serverless-http"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

bootstrab(app,express);
connectDB()

app.listen(PORT , () => {
    console.log(`App is running on port ${PORT} ......`);
})